// ==========================================
// 「這筆刷哪張」推薦引擎（v1）
// 輸入「全聯 1200」→ 解析通路與金額 → 比對 rules.js 規則 →
// 每張卡取最佳適用規則 → 依回饋金額排序。
// 純瀏覽器端計算，無任何後端；也可在 Node 直接載入做單元測試。
// ==========================================
(function (global) {
    "use strict";

    function rulesData() { return global.CARD_RULES; }

    // ---------- 查詢解析 ----------
    // 取「最後一個數字」當金額，其餘文字當通路；支援「全聯1200」「1200 全聯」。
    // 特例：整串本身就是通路名（如「7-11」）時，數字不當金額。
    function parseQuery(text) {
        const t = String(text || "").normalize("NFKC").trim();
        if (!t) return { channelText: "", amount: null };

        // 整串先試通路（處理 7-11 這種含數字的名稱）；此處只接受完全相符，
        // 避免「全聯 1200」整串被模糊比對吃掉
        if (findChannel(t, true)) return { channelText: t, amount: null };

        const nums = [...t.matchAll(/\d[\d,]*(?:\.\d+)?/g)];
        if (!nums.length) return { channelText: t, amount: null };

        const last = nums[nums.length - 1];
        const amount = parseFloat(last[0].replace(/,/g, ""));
        const channelText = (t.slice(0, last.index) + t.slice(last.index + last[0].length))
            .replace(/[元塊$]|nt\$?/gi, "").trim();
        return { channelText, amount: isFinite(amount) && amount > 0 ? amount : null };
    }

    // ---------- 通路比對 ----------
    function norm(s) {
        return String(s).normalize("NFKC").toLowerCase().replace(/[\s\-\.]/g, "");
    }

    // 先找完全相符，再找互相包含（取 alias 最長者，避免「全家」誤中「家樂福」類短字）
    function findChannel(text, exactOnly) {
        const key = norm(text);
        if (!key) return null;
        let best = null, bestLen = 0, bestExact = false;
        for (const ch of rulesData().channels) {
            for (const a of ch.aliases) {
                const ak = norm(a);
                if (!ak) continue;
                const exact = ak === key;
                if (exactOnly && !exact) continue;
                const contains = key.includes(ak) || ak.includes(key);
                if (!exact && !contains) continue;
                // 互相包含時，要求至少 2 個字元避免亂中
                if (!exact && Math.min(ak.length, key.length) < 2) continue;
                if (exact && (!bestExact || ak.length > bestLen)) {
                    best = ch; bestLen = ak.length; bestExact = true;
                } else if (!exact && !bestExact && ak.length > bestLen) {
                    best = ch; bestLen = ak.length;
                }
            }
        }
        return best;
    }

    // ---------- 規則適用判斷 ----------
    // 回傳 true / false / "excluded"（明確被排除，供結果頁誠實顯示）
    function ruleApplies(rule, ch, today) {
        const scope = rule.scope || "domestic";
        const isOverseas = ch.cats.includes("overseas");
        if (isOverseas && scope === "domestic") return false;
        if (!isOverseas && scope === "overseas") return false;

        if (rule.validFrom && today < rule.validFrom) return false;
        if (rule.validThrough && today > rule.validThrough) return false;

        // 偶數日動態規則：非偶數日直接不適用（回落到其他規則）
        if (rule.dynamic === "evenDay" && new Date().getDate() % 2 !== 0) return false;

        if (rule.excludeChannels && rule.excludeChannels.includes(ch.id)) return "excluded";
        if (rule.excludeCats && rule.excludeCats.some(c => ch.cats.includes(c))) return "excluded";

        if (rule.general) return true;
        if (rule.channels && rule.channels.includes(ch.id)) return true;
        if (rule.cats && rule.cats.some(c => ch.cats.includes(c))) return true;
        return false;
    }

    // ---------- 回饋計算 ----------
    // 封頂內：金額 × rate；超過封頂：封頂額 × rate + 超出 × base
    function computeReward(rule, amount) {
        const cap = rule.cap;
        if (cap && cap.spend && amount > cap.spend) {
            const base = rule.base || 0;
            const reward = cap.spend * rule.rate / 100 + (amount - cap.spend) * base / 100;
            return { reward, capped: true, headroom: 0 };
        }
        return {
            reward: amount * rule.rate / 100,
            capped: false,
            headroom: cap && cap.spend ? cap.spend - amount : null
        };
    }

    // ---------- 主流程 ----------
    function recommend(queryText) {
        const data = rulesData();
        if (!data) return { error: "規則資料未載入" };

        const { channelText, amount: parsedAmount } = parseQuery(queryText);
        const amount = parsedAmount || 1000; // 沒給金額時以 1,000 試算
        const amountAssumed = !parsedAmount;

        let channel = channelText ? findChannel(channelText) : null;
        let channelUnknown = false;
        if (channelText && !channel) {
            // 打了通路但字典查無 → 誠實告知，以一般消費計
            channelUnknown = true;
        }
        if (!channel) {
            channel = { id: "_general", name: channelText || "一般消費", cats: [] };
        }

        const today = new Date().toISOString().slice(0, 10);
        const cardMap = Object.fromEntries(data.cards.map(c => [c.id, c]));
        const results = [];
        const excluded = [];

        for (const card of data.cards) {
            const cardRules = data.rules.filter(r => r.card === card.id);
            let best = null;
            let wasExcluded = null;
            for (const rule of cardRules) {
                const ok = ruleApplies(rule, channel, today);
                if (ok === "excluded") { wasExcluded = rule; continue; }
                if (!ok) continue;
                const calc = computeReward(rule, amount);
                if (!best || calc.reward > best.reward ||
                    (calc.reward === best.reward && (rule.conditions || []).length < (best.rule.conditions || []).length)) {
                    best = { card, rule, ...calc };
                }
            }
            if (best) {
                best.effRate = best.reward / amount * 100;
                results.push(best);
            } else if (wasExcluded) {
                excluded.push({ card, rule: wasExcluded });
            }
        }

        results.sort((a, b) =>
            b.reward - a.reward ||
            b.rule.rate - a.rule.rate ||
            (a.rule.conditions || []).length - (b.rule.conditions || []).length);

        return {
            channel, amount, amountAssumed, channelUnknown,
            results, excluded,
            settingsText: data.meta.settingsText
        };
    }

    global.RECO = { recommend, parseQuery, findChannel };
})(typeof window !== "undefined" ? window : globalThis);
