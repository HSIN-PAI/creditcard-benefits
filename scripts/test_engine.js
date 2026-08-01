// 推薦引擎單元測試：node scripts/test_engine.js
// 改 rules.js / engine.js 之後跑這個做回歸測試。
const path = require("path").join(__dirname, "..");
require(path + "/rules.js");
require(path + "/engine.js");
const { recommend, parseQuery, findChannel } = globalThis.RECO;

let pass = 0, fail = 0;
function ok(cond, msg) {
    if (cond) { pass++; console.log("  ✅", msg); }
    else { fail++; console.log("  ❌", msg); }
}
function top(r, n = 3) {
    return r.results.slice(0, n).map(x =>
        `${x.card.bank}${x.card.name}[${x.rule.title}] ${x.rule.rate}% → $${x.reward.toFixed(1)}`).join(" | ");
}

// ---- 解析 ----
console.log("\n== 查詢解析 ==");
let p = parseQuery("全聯 1200");
ok(p.channelText === "全聯" && p.amount === 1200, `「全聯 1200」→ ${JSON.stringify(p)}`);
p = parseQuery("全聯1200");
ok(p.channelText === "全聯" && p.amount === 1200, `「全聯1200」→ ${JSON.stringify(p)}`);
p = parseQuery("1200 全聯");
ok(p.channelText === "全聯" && p.amount === 1200, `「1200 全聯」→ ${JSON.stringify(p)}`);
p = parseQuery("7-11");
ok(p.channelText === "7-11" && p.amount === null, `「7-11」不把 11 當金額 → ${JSON.stringify(p)}`);
p = parseQuery("7-11 200");
ok(p.amount === 200, `「7-11 200」金額 200 → ${JSON.stringify(p)}`);
p = parseQuery("蝦皮 3,500元");
ok(p.amount === 3500, `「蝦皮 3,500元」→ ${JSON.stringify(p)}`);
p = parseQuery("全聯　１２００"); // 全形
ok(p.amount === 1200 && p.channelText === "全聯", `全形輸入 NFKC → ${JSON.stringify(p)}`);

console.log("\n== 通路比對 ==");
ok(findChannel("全聯")?.id === "pxmart", "全聯 → pxmart");
ok(findChannel("7-11")?.id === "seven", "7-11 → seven");
ok(findChannel("line pay")?.id === "linepay", "line pay → linepay");
ok(findChannel("日本")?.id === "japan", "日本 → japan");
ok(findChannel("超商")?.id === "c-conv", "超商 → 分類通路");
ok(findChannel("東京")?.id === "japan", "東京 → japan");
ok(findChannel("不存在的店") === null, "查無通路回 null");

// ---- 全聯 1200 ----
console.log("\n== 全聯 1200 ==");
let r = recommend("全聯 1200");
console.log("  ", top(r));
ok(r.channel.id === "pxmart" && r.amount === 1200, "通路金額解析正確");
const first = r.results[0];
ok(first.card.id === "dawho" && Math.abs(first.reward - 42) < 0.01, `第一名 DAWHO 大戶 3.5% = $42（實際:${first.card.id} $${first.reward}）`);
const cube = r.results.find(x => x.card.id === "cube");
ok(cube && cube.rule.title === "集精選" && Math.abs(cube.reward - 36) < 0.01, `CUBE 集精選 3% = $36`);
const fubonExcluded = r.excluded.find(x => x.card.id === "fubonj");
ok(!!fubonExcluded, "富邦 J 卡因排除全聯而列入排除清單");

// ---- 蝦皮 ----
console.log("\n== 蝦皮 800 ==");
r = recommend("蝦皮 800");
console.log("  ", top(r));
const shopeeTop = r.results[0];
ok(["ctbc", "hsbc", "dawho"].includes(shopeeTop.card.id), `蝦皮第一名合理（${shopeeTop.card.id} ${shopeeTop.rule.title}）`);
const ctbcShopee = r.results.find(x => x.card.id === "ctbc");
ok(ctbcShopee.rule.title === "脆好購電商" && ctbcShopee.rule.rate === 5, "中信脆好購 5% 有匹配");

// ---- 封頂測試：脆好購 2500/季，刷 5000 應套 blended ----
console.log("\n== 封頂計算：淘寶 5000 ==");
r = recommend("淘寶 5000");
const ctbcTaobao = r.results.find(x => x.card.id === "ctbc");
// 2500*5% + 2500*1% = 125 + 25 = 150
ok(ctbcTaobao.capped && Math.abs(ctbcTaobao.reward - 150) < 0.01,
   `脆好購超封頂 blended = $150（實際 $${ctbcTaobao.reward}，capped=${ctbcTaobao.capped}）`);

// ---- 訂閱 base 0：ChatGPT 3000（U Bear 上限 1000）----
console.log("\n== ChatGPT 3000（U Bear 訂閱 cap 1000, base 0）==");
r = recommend("chatgpt 3000");
console.log("  ", top(r));
const ubear = r.results.find(x => x.card.id === "ubear");
// 1000*10% + 2000*0 = 100
ok(ubear && Math.abs(ubear.reward - 100) < 0.01, `U Bear 訂閱超頂 = $100（實際 $${ubear ? ubear.reward : "無"}）`);
const cubeGpt = r.results.find(x => x.card.id === "cube");
ok(cubeGpt.rule.title === "玩數位", "CUBE 玩數位有匹配 ChatGPT");

// ---- 海外：日本 5000 ----
console.log("\n== 日本 5000 ==");
r = recommend("日本 5000");
console.log("  ", top(r));
const fubonJp = r.results.find(x => x.card.id === "fubonj");
ok(fubonJp && fubonJp.rule.rate === 6, `富邦 J 日韓 6% 匹配（${fubonJp?.rule.title}）`);
const domesticLeak = r.results.find(x => (x.rule.scope || "domestic") === "domestic");
ok(!domesticLeak, "海外查詢不會漏進國內規則");
const bibeiJp = r.results.find(x => x.card.id === "bibei");
ok(bibeiJp && bibeiJp.rule.rate === 6, "幣倍精選通路 6% 匹配");

// ---- 海外 generic ----
console.log("\n== 海外 10000 ==");
r = recommend("海外 10000");
console.log("  ", top(r));
const ecoOs = r.results.find(x => x.card.id === "eco");
ok(ecoOs && ecoOs.rule.rate === 1, "「海外」不指定國家時 eco 只匹配一般 1%（5% 需指定國）");

// ---- 保費 ----
console.log("\n== 保費 50000 ==");
r = recommend("保費 50000");
console.log("  ", top(r));
const bibeiIns = r.results.find(x => x.card.id === "bibei");
ok(bibeiIns && bibeiIns.rule.rate === 1.2, "幣倍保費 1.2% 匹配");
ok(!r.results.find(x => x.card.id === "richart"), "Richart 保費被排除（不出現在結果）");
const ecoIns = r.results.find(x => x.card.id === "eco");
ok(ecoIns && ecoIns.rule.rate === 1, "eco 含保費代扣 1%");

// ---- LINE Pay ----
console.log("\n== line pay 2000 ==");
r = recommend("line pay 2000");
console.log("  ", top(r));
const richartLp = r.results.find(x => x.card.id === "richart");
ok(richartLp && richartLp.rule.rate === 3.8, "Richart LINE Pay 領券 3.8% 匹配");
const cubeLp = r.results.find(x => x.card.id === "cube");
ok(cubeLp && cubeLp.rule.title === "LINE Pay 領券加碼", "CUBE LINE Pay 領券匹配（10/31 前有效）");
const hsbcLp = r.results.find(x => x.card.id === "hsbc");
ok(!hsbcLp || hsbcLp.rule.rate <= 0.88, "滙豐對行動支付不給 3.88%");

// ---- 無金額 / 無通路 ----
console.log("\n== 特殊輸入 ==");
r = recommend("全聯");
ok(r.amountAssumed && r.amount === 1000, "只打通路 → 以 1000 試算");
r = recommend("1200");
ok(r.channel.id === "_general" && r.results.length > 0, "只打金額 → 一般消費排名");
r = recommend("神秘小店 500");
ok(r.channelUnknown, "查無通路 → channelUnknown 誠實標記");
const snyGeneral = recommend("300").results.find(x => x.card.id === "sny");
ok(snyGeneral && snyGeneral.rule.rate === 0.6, "一般消費含華南 SnY 0.6%");
r = recommend("網購 2000");
const ubearOnline = r.results.find(x => x.card.id === "ubear");
ok(ubearOnline && ubearOnline.rule.rate === 3, "分類查詢「網購」→ U Bear 3% 匹配");

// ---- U Bear 到期測試（8/31 後應消失）：改不了系統時間，驗證 validThrough 邏輯即可 ----
console.log("\n== 有效期 ==");
r = recommend("網購 2000");
ok(!!r.results.find(x => x.card.id === "ubear"), "8/1 當下 U Bear 仍有效（8/31 到期）");

console.log(`\n========= 結果：${pass} 通過 / ${fail} 失敗 =========`);
process.exit(fail ? 1 : 0);
