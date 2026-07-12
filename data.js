// ==========================================
// 信用卡權益資料檔（2026 下半年）
// 更新權益只需要改這個檔案，index.html 不用動。
// 每張卡的 officialUrl 同時是 GitHub Actions 異動監測的目標網址。
// ==========================================
window.CARD_DATA = {
    meta: {
        title: "2026 下半年信用卡權益百科",
        period: "2026/07/01 - 2026/12/31",
        updated: "2026-07-12"
    },
    cards: [
        {
            bank: "國泰世華",
            name: "CUBE 卡",
            tags: ["全聯", "百貨", "日本", "AI", "蝦皮", "旅遊"],
            rate: "3% ~ 3.3%",
            note: "權益自選、指定通路實質無上限。下半年玩數位改為「AI 工具」類，LINE Pay 加碼縮水為領券制 50 點/月。",
            validThrough: "2026-12-31",
            officialUrl: "https://www.cathay-cube.com.tw/cathaybk/personal/product/credit-card/cards/cube-list",
            lastVerified: "2026-07-12",
            warning: {
                title: "💡 2026 下半年重點變動：",
                items: [
                    "Level 2 (3%) 條件改「月度動態調整」：需國泰帳戶自扣或以 CUBE App 繳本行卡費，每月底前 3 個工作日完成設定，次月適用。Level 3 (3.3%) 為財管會員。",
                    "玩數位刪「辦公神器」類，新增 <span class='highlight'>AI 工具</span>類（Gemini、Claude、Perplexity、Notion、Canva 等，ChatGPT 保留）。",
                    "趣旅行移除 Hotels.com、Expedia、AsiaYo、旅天下。",
                    "<span class='highlight'>LINE Pay</span> 平常僅 0.3%！加碼改為 CUBE App 領券制（2026/5/1–10/31），每月上限 50 點。"
                ]
            },
            caps: [
                { label: "指定通路方案", detail: "回饋 % 無點數上限，但每月指定消費金額以「信用額度 + 50 萬」為限，超過剩 0.3%。日常使用視同<span class='highlight'>無上限</span>。" },
                { label: "LINE Pay 領券 (2%)", detail: "每戶每月上限 50 點。👉 <span class='highlight'>刷 NT$ 2,500 封頂</span>（超過剩 0.3%；排除外送、百貨內門市、海外門市）。11 月後加碼尚未公告。" }
            ],
            sections: [
                {
                    title: "權益方案 (Level 2 = 3%，Level 3 = 3.3%)",
                    items: [
                        { label: "玩數位", text: "AI 工具（ChatGPT/Gemini/Claude/Notion/Canva）、蝦皮、momo、PChome、Netflix、Disney+、Spotify、Apple 服務。" },
                        { label: "趣旅行", text: "海外實體、迪士尼/環球影城、國內外交通、20 家航空、Klook、Agoda、Booking.com。" },
                        { label: "樂饗購", text: "全台餐飲、SOGO/新光三越/誠品、Uber Eats/foodpanda、麥當勞、屈臣氏/康是美。" },
                        { label: "集精選", text: "全聯、家樂福、LOPIA、7-11、全家、中油直營、IKEA。" },
                        { label: "慶生月", text: "7/1–9/30 改版：3.5%/10%，新增多家甜點與台中特選餐廳。" }
                    ]
                }
            ]
        },
        {
            bank: "台新銀行",
            name: "Richart 卡（原 @GoGo）",
            tags: ["LINE Pay", "台新Pay", "蝦皮", "momo", "網購", "超商"],
            rate: "3.3% ~ 3.8%",
            note: "@GoGo 已整併更名為 Richart 卡！7+1 大方案 App 自由切換，權益直接延長至 2027/3/31。需 Richart 自扣享 LEVEL 2。",
            validThrough: "2027-03-31",
            officialUrl: "https://www.taishinbank.com.tw/TSB/personal/credit/intro/overview/cg047/card001/",
            lastVerified: "2026-07-12",
            warning: {
                title: "💡 重大變更：",
                items: [
                    "@GoGo 卡已於 2025/9/1 更名整併為「<span class='highlight'>台新 Richart 卡</span>」，舊卡免換卡，於 Richart Life App 切換方案（可每日切換，依消費當下方案計算）。",
                    "需設定 <span class='highlight'>Richart 帳戶自動扣繳</span>才有 LEVEL 2 加碼（未設定僅 0.3%）；新戶核卡 60 天內無條件享 LEVEL 2。",
                    "LINE Pay 直接刷只有 2.3%，需 App <span class='highlight'>領券</span>再 +1.5% 才到 3.8%。"
                ]
            },
            caps: [
                { label: "主方案 (3.3%/3.8%)", detail: "回饋無點數上限，但每期加碼消費金額以「信用額度 + 30 萬」為限。日常使用視同<span class='highlight'>無上限</span>。" },
                { label: "LINE Pay 領券加碼 (+1.5%)", detail: "每月上限 500 點。👉 <span class='highlight'>刷 NT$ 33,333 封頂</span>。" }
            ],
            sections: [
                {
                    title: "7+1 大方案（LEVEL 2）",
                    items: [
                        { label: "Pay著刷 3.8%", text: "台新 Pay/Pay+ 3.8%；LINE Pay 2.3%（領券後最高 3.8%）。" },
                        { label: "數趣刷 3.3%", text: "蝦皮、momo、酷澎、PChome、淘寶、Amazon、博客來、iHerb、SHEIN（已無 Yahoo 購物）。" },
                        { label: "天天刷 3.3%", text: "超商、交通、加油、藥妝。" },
                        { label: "其他方案", text: "大筆刷/好饗刷/玩旅刷 各 3.3%、假日刷（國定假日不限通路）2%、保費 1.3%（免切換）。" },
                        { label: "Chill刷 10%", text: "7/8–9/30 限時：指定餐飲/手搖最高 10%、串流/網購/3C 最高 5%（限獨立店面或官網）。" }
                    ]
                }
            ]
        },
        {
            bank: "星展銀行",
            name: "eco 永續卡",
            tags: ["日本", "歐洲", "海外", "特斯拉", "Gogoro"],
            rate: "1% / 5% / 10%",
            note: "國內外 1% 無上限。海外指定國 5%。下半年綠色消費上限調升（300→500 點/期）。",
            validThrough: "2026-12-31",
            officialUrl: "https://www.dbs.com.tw/personal-zh/cards/dbs_eco/index.html",
            lastVerified: "2026-07-12",
            warning: {
                title: "💡 2026 下半年變動：",
                items: [
                    "綠色消費加碼上限<span class='highlight'>調升為 500 點/期</span>（上半年為 300 點），活動至 2026/12/31。",
                    "海外加碼限「實體卡或 Apple Pay/Samsung Pay 於當地實體商店」消費。",
                    "新戶限定：LINE Pay 最高 10%（7/1–9/30，上限 300 點，需累積滿 NT$3,000）。"
                ]
            },
            caps: [
                { label: "海外指定 (5%)", detail: "加碼 4% 每期上限 600 點。👉 <span class='highlight'>刷 NT$ 15,000 封頂</span>（超過剩 1%）。<i>適用：日/韓/泰/星/美洲/歐洲實體</i>" },
                { label: "綠色消費 (10%)", detail: "加碼 9% 每期上限 500 點。👉 <span class='highlight'>刷 NT$ 5,555 封頂</span>（超過剩 1%）。" }
            ],
            sections: [
                {
                    title: "詳細權益",
                    items: [
                        { label: "一般消費", text: "國內外 1% 現金積點無上限（含保費代扣、超商）。點數效期 18 個月，需登錄 i 客服兌換。" },
                        { label: "綠色 10%", text: "Tesla 充電、Gogoro 電池資費（含 PBGN）、星展支持之社會企業。" },
                        { label: "海外 5%", text: "日本、韓國、泰國、新加坡、美洲、歐洲實體門市感應/刷卡。" }
                    ]
                }
            ]
        },
        {
            bank: "聯邦銀行",
            name: "賴點卡",
            tags: ["LINE Pay", "海外", "萊爾富", "偶數日", "保費"],
            rate: "2% / 3% / 最高11%",
            note: "結構延續上半年：LINE Pay 2%、偶數日指定通路 +5%、海外 3% 無上限。需電子帳單 + 綁 LINE Pay。",
            validThrough: "2026-12-31",
            officialUrl: "https://activity.ubot.com.tw/2026LaiDianCard/index.htm",
            lastVerified: "2026-07-12",
            warning: {
                title: "💡 必要條件：",
                items: [
                    "須申辦<span class='highlight'>電子化帳單</span>且卡片成功<span class='highlight'>綁定 LINE Pay</span>，才享各項加碼。",
                    "各加碼有單筆滿 NT$100 門檻。",
                    "偶數日（每月 2、4、6…日）於指定通路刷 LINE Pay 再 +5%（麥當勞、星巴克、王品、屈臣氏、IKEA、NIKE 等 50+ 家）。"
                ]
            },
            caps: [
                { label: "LINE Pay 一般消費 (2%)", detail: "加碼 1% 每月上限 200 點。👉 <span class='highlight'>刷 NT$ 20,000 封頂</span>（超過剩 1%）。" },
                { label: "偶數日指定通路 (+5%)", detail: "每月上限 150 點。👉 <span class='highlight'>刷 NT$ 3,000 封頂</span>。" },
                { label: "新戶加碼 (+4%)", detail: "核卡次月起 6 個月，每月上限 300 點。👉 <span class='highlight'>每月刷 NT$ 7,500 封頂</span>（新戶偶數日最高 11%）。" },
                { label: "海外消費 (3%)", detail: "<span class='highlight'>無上限</span>（含歐洲實體，出國神卡）。" }
            ],
            sections: [
                {
                    title: "回饋詳情",
                    items: [
                        { label: "國內一般", text: "1% LINE POINTS 無上限。" },
                        { label: "海外", text: "3% 無上限（需電子帳單）。" },
                        { label: "萊爾富", text: "全年 5% 現折（全行卡片適用，含綁 HiPay/Apple Pay；LINE Pay、街口不適用）。" },
                        { label: "期間限定", text: "IP 商店/票券/影城 +5%（7/1–9/30，月上限 200 點）；國內外累積滿 2.5 萬登錄贈 500 元即享券（限量）。" },
                        { label: "保費", text: "新戶一次付清最高 2%（加碼刷卡金每戶上限 NT$1,000）。" }
                    ]
                }
            ]
        },
        {
            bank: "台新銀行",
            name: "Gogoro Rewards",
            tags: ["Gogoro", "GoShare", "7-11", "全家", "高鐵"],
            rate: "4% / 15%",
            note: "⚠️ 下半年電池資費大縮水：10% → 最高 4%（仍無上限）。GoShare 15%。夥伴通路 4%。",
            validThrough: "2026-12-31",
            officialUrl: "https://www.taishinbank.com.tw/TSB/personal/credit/intro/overview/cg042/card001/",
            lastVerified: "2026-07-12",
            warning: {
                title: "⚠️ 2026 下半年權益縮水：",
                items: [
                    "電池資費由上半年最高 10% <span class='highlight'>降為最高 4%</span>（無上限，需 Gogoro 官網/App/Wallet 刷卡或自扣），且取消滿 5,000 加碼機制。",
                    "夥伴通路加碼任務：當期帳單需設定<span class='highlight'>台新帳戶扣繳 + 啟用數位帳單</span>。",
                    "Gogoro 官網部分頁面仍顯示舊文案（15/16%），以台新官網條款為準。"
                ]
            },
            caps: [
                { label: "電池資費 (4%)", detail: "<span class='highlight'>無上限</span>。" },
                { label: "GoShare (15%)", detail: "每月上限 500 點。👉 <span class='highlight'>月騎乘費 NT$ 3,333 封頂</span>。" },
                { label: "夥伴通路 (4%)", detail: "加碼 3.7%：單筆上限 100 點、每月上限 500 點。👉 <span class='highlight'>單筆超過 NT$ 2,700 就不划算</span>，每月約 NT$ 13,500 封頂。" },
                { label: "海外消費 (4%)", detail: "<span class='highlight'>無上限</span>（0.3% + 3.7% 任務加碼）。" }
            ],
            sections: [
                {
                    title: "Gogoro 生態系",
                    items: [
                        { label: "門市消費 4%", text: "基本 2% + 綁 Gogoro Wallet 加碼 2%（限直營門市/官網，加碼每期上限 500 點）。" },
                        { label: "夥伴通路", text: "7-11、全家、高鐵、Uber、Uber Eats、foodpanda、Klook、KKday、北捷、康是美、IKEA、易遊網。另享高鐵商務車廂升等 NT$450。" },
                        { label: "一般消費", text: "最高 1%（0.3% + 0.7%）無上限。" }
                    ]
                }
            ]
        },
        {
            bank: "玉山銀行",
            name: "U Bear 卡",
            tags: ["網購", "行動支付", "Netflix", "ChatGPT", "訂閱"],
            rate: "3% / 10%",
            note: "⚠️ 現行權益僅至 2026/8/31，9 月起尚未公告！新制需「帳單 e 化 + 玉山帳戶自扣」，都沒設定基本回饋 0%。",
            validThrough: "2026-08-31",
            officialUrl: "https://event.esunbank.com.tw/credit/ubear/index.html",
            lastVerified: "2026-07-12",
            warning: {
                title: "⚠️ 改制注意（2026/3/1 起）：",
                items: [
                    "基本回饋 = 帳單 e 化 0.5% + 玉山臺幣帳戶自扣 0.5%，<span class='highlight'>兩者都沒設定 = 0%</span>。",
                    "訂閱 10% 須於原平台直接扣款，<span class='highlight'>Google 代扣不符資格</span>；超過上限後該類消費無任何回饋。",
                    "<span class='highlight'>2026/9/1 之後權益尚未公告</span>，8 月底前留意玉山新公告。"
                ]
            },
            caps: [
                { label: "網購/行動支付 (3%)", detail: "加碼 2% 每期上限 150 元。👉 <span class='highlight'>刷 NT$ 7,500 封頂</span>（上半年為 200 元，已調降）。" },
                { label: "指定訂閱 (10%)", detail: "每期上限 100 元。👉 <span class='highlight'>刷 NT$ 1,000 封頂</span>。" },
                { label: "新戶網購 (+7%)", detail: "核卡次月起 3 個月，每月上限 200 元。👉 <span class='highlight'>每月刷 NT$ 2,857 封頂</span>（合計最高 10%）。" }
            ],
            sections: [
                {
                    title: "權益內容（至 2026/8/31）",
                    items: [
                        { label: "網購/支付 3%", text: "momo、蝦皮、淘寶、線上訂房、LINE Pay、街口、全支付、App 綁卡付款。" },
                        { label: "訂閱 10%", text: "Netflix、ChatGPT、Gemini、Steam、Nintendo、PlayStation（不與其他回饋累計）。" },
                        { label: "排除", text: "保費、超商、小額支付平台不列入網購回饋；特店分期不回饋。" }
                    ]
                }
            ]
        },
        {
            bank: "永豐銀行",
            name: "DAWAY 卡",
            tags: ["LINE Pay", "海外", "新戶"],
            rate: "新戶 8~10% / 舊戶 2~4%",
            note: "下半年新戶加碼放大：綁 LINE Pay 國內最高 8%、海外最高 10%！舊戶（DAWAY GO）國內 2%、海外 4%。",
            validThrough: "2026-12-31",
            officialUrl: "https://bank.sinopac.com/sinopacbt/personal/credit-card/introduction/bankcard/DAWAY.html",
            lastVerified: "2026-07-12",
            warning: {
                title: "💡 2026 下半年加碼放大：",
                items: [
                    "新戶加碼由 +4% 提高為 <span class='highlight'>+6%</span>（上限 500 點/期），限 7/1–12/31 進件核卡；新戶 = 從未持有永豐卡或停卡滿 6 個月。",
                    "DAWAY GO 升級三條件（結帳日當月底前完成）：永豐帳戶自扣 + 電子/行動帳單 + 網銀會員完成投資屬性問卷。",
                    "須於消費前成功<span class='highlight'>綁定 LINE Pay</span> 才有加碼點數。"
                ]
            },
            caps: [
                { label: "新戶加碼 (+6%)", detail: "每期上限 500 點。👉 <span class='highlight'>刷 NT$ 8,333 封頂</span>。" },
                { label: "GO 等級加碼 (+1.5%)", detail: "每期上限 300 點。👉 <span class='highlight'>刷 NT$ 20,000 封頂</span>。" },
                { label: "基礎回饋", detail: "國內 0.5%、國外 2.5%，<span class='highlight'>無上限</span>。" }
            ],
            sections: [
                {
                    title: "回饋組成（LINE POINTS）",
                    items: [
                        { label: "新戶", text: "國內 0.5+1.5+6 = 最高 8%；海外 2.5+1.5+6 = 最高 10%。" },
                        { label: "舊戶 (GO)", text: "國內 2%、海外 4%。" }
                    ]
                }
            ]
        },
        {
            bank: "永豐銀行",
            name: "DAWHO 大戶卡",
            tags: ["無腦刷", "全通路", "海外", "大戶"],
            rate: "3.5% ~ 6%",
            note: "⚠️ 大戶門檻由 10 萬調升為 30 萬（有替代任務）。已取消指定通路制，加碼適用全通路一般消費。",
            validThrough: "2026-12-31",
            officialUrl: "https://dawho.tw/hot/2026h2offer/",
            lastVerified: "2026-07-12",
            warning: {
                title: "⚠️ 2026 下半年重點變動：",
                items: [
                    "「大戶」資產門檻 <span class='highlight'>10 萬 → 30 萬</span>，但新增替代任務擇一即可：當月單筆換匯 NT$5,000+、DAWHO 帳戶為永豐信貸扣款戶、綁證券交割戶且當月台股成交、新網銀會員（享至次月底）。",
                    "已<span class='highlight'>取消七大指定通路制</span>，加碼適用全通路一般消費（無腦刷）。",
                    "加碼任務：DAWHO 帳戶扣繳卡款 + 電子/行動帳單（保費代繳不計）。"
                ]
            },
            caps: [
                { label: "大戶 (30萬資產或任務)", detail: "國內 3.5% / 國外 4.5%，加碼上限 400 元/月。👉 <span class='highlight'>刷 NT$ 16,000 封頂</span>。悠遊卡自動加值 3%（上限 100 元）。" },
                { label: "大戶Plus (100萬 + 理財任務)", detail: "國內 5% / 國外 6%，加碼上限 1,000 元/月。👉 <span class='highlight'>刷 NT$ 25,000 封頂</span>。悠遊卡自動加值 5%（上限 500 元）。" },
                { label: "大大 (無門檻)", detail: "國內 1% / 國外 2%，無加碼。" }
            ],
            sections: [
                {
                    title: "等級門檻",
                    items: [
                        { label: "大戶", text: "當月平均財富 30 萬+，或替代任務擇一（換匯 5,000/信貸扣款/台股成交/新會員）。" },
                        { label: "大戶Plus", text: "當月平均財富 100 萬+，且完成換匯或台股成交任一理財任務。" }
                    ]
                }
            ]
        },
        {
            bank: "永豐銀行",
            name: "幣倍卡",
            tags: ["海外", "Amazon", "日韓", "訂房", "外幣"],
            rate: "最高 6%",
            note: "下半年改單一門檻（原兩級制取消），精選通路加碼上限固定 800 元/期。國外基礎 2% 無上限。",
            validThrough: "2026-12-31",
            officialUrl: "https://bank.sinopac.com/sinopacBT/personal/credit-card/introduction/bankcard/dual-currency-card.html",
            lastVerified: "2026-07-12",
            warning: {
                title: "💡 2026 下半年改制：",
                items: [
                    "等級制簡化為<span class='highlight'>單一門檻</span>，兩項須同時滿足：(1) 永豐臺/外幣帳戶自扣 + 電子/行動帳單；(2) 前月永豐資產月平均 10 萬+，或當月為大戶/大戶Plus 等級。",
                    "取消單期消費門檻（原約 NT$2,000）。",
                    "取消「實體飯店」加碼，住宿需經訂房平台才有 +4%。新卡友行動支付加碼由 5% 降為 2%。"
                ]
            },
            caps: [
                { label: "精選通路 (6%)", detail: "加碼 4% 每期上限 800 元。👉 <span class='highlight'>刷 NT$ 20,000 封頂</span>（海外合計 6%）。" },
                { label: "國外一般消費 (2%)", detail: "<span class='highlight'>無上限</span>（回饋存入外幣帳戶）。" },
                { label: "新卡友行動支付 (+2%)", detail: "Apple Pay/Google Pay，每月上限 200 元。👉 <span class='highlight'>刷 NT$ 10,000 封頂</span>。" }
            ],
            sections: [
                {
                    title: "精選通路 +4%",
                    items: [
                        { label: "海外實體", text: "交易地區非臺灣且非新臺幣，不限國家。" },
                        { label: "指定網購", text: "Amazon、iHerb、Rakuten、Mercari、淘寶、大國藥妝、Sugi、Gmarket、Olive Young、日本三大交通卡儲值。" },
                        { label: "旅遊平台", text: "航空、雄獅/易飛網、Booking.com、Agoda、Hotels.com、Expedia、Trip.com、Airbnb、Klook、KKday、AsiaYo。" },
                        { label: "保費", text: "1.2% 無上限。國內一般消費 1% 無上限。" }
                    ]
                }
            ]
        },
        {
            bank: "中國信託",
            name: "LINE Pay 卡",
            tags: ["LINE Pay", "海外", "蝦皮", "淘寶", "旅遊"],
            rate: "1% / 最高5%",
            note: "全回饋 LINE POINTS。國內外 1% 無上限、海外實體 2.8%。電商/海外 5% 為限量登錄制。",
            validThrough: "2026-12-31",
            officialUrl: "https://www.ctbcbank.com/content/dam/minisite/long/creditcard/LINEPay/notice.html",
            lastVerified: "2026-07-12",
            warning: {
                title: "💡 注意事項：",
                items: [
                    "需<span class='highlight'>綁定台灣 LINE Pay 帳號</span>；活動期間解綁或換手機型號可能喪失回饋資格。",
                    "海外 2.8% 限<span class='highlight'>實體面對面交易</span>（實體卡/Apple Pay/Google Pay），網路交易、條碼支付不適用。",
                    "加碼活動多為<span class='highlight'>每月/每週限量登錄制</span>（脆好購每月 6 日 10:00 開放 8,000 名；脆自遊每週二 3,000 名）。",
                    "「脆自遊」海外 5% 只到 <span class='highlight'>9/30</span>，Q4 是否續辦未公告。點數效期 180 天。"
                ]
            },
            caps: [
                { label: "海外實體 (2.8%)", detail: "1% + 加碼 1.8%，加碼<span class='highlight'>無上限</span>（7/1–12/31）。" },
                { label: "脆自遊海外 (5%)", detail: "再加碼 2.2%，每季上限 450 點。👉 加碼部分<span class='highlight'>刷 NT$ 20,454/季 封頂</span>（限 9/30 前，需登錄）。" },
                { label: "脆好購電商 (5%)", detail: "淘寶/蝦皮/酷澎，加碼 4% 每季上限 100 點。👉 <span class='highlight'>刷 NT$ 2,500/季 封頂</span>（需登錄）。" },
                { label: "國內外一般 (1%)", detail: "<span class='highlight'>無上限</span>。" }
            ],
            sections: [
                {
                    title: "其他通路",
                    items: [
                        { label: "旅遊平台", text: "Klook 4–10%、Hotels.com 最高 16%（優惠碼）、Expedia 8%、Trip.com/Airbnb 5%、KKday 暑期最高 18%（多需指定連結/登錄）。" },
                        { label: "UNIQLO/GU", text: "限 JCB 卡加碼，每季上限 200 點（每月 5,000 名）。" },
                        { label: "一卡通", text: "儲值搭大眾運輸 1% 無上限（高鐵除外）。" }
                    ]
                }
            ]
        },
        {
            bank: "台北富邦",
            name: "J 卡",
            tags: ["日本", "韓國", "泰國", "交通卡", "新戶"],
            rate: "3% / 最高6%",
            note: "日韓 3% 無上限。日韓泰實體加碼最高 6%、日本交通卡儲值 10%（皆至 9/30、需登錄）。無電子帳單/自扣只剩 0.5%。",
            validThrough: "2026-12-31",
            officialUrl: "https://www.fubon.com/banking/Personal/credit_card/all_card/omiyage/omiyage.htm",
            lastVerified: "2026-07-12",
            warning: {
                title: "💡 注意事項：",
                items: [
                    "需申請<span class='highlight'>電子帳單或富邦帳戶自扣</span>，否則回饋降為 0.5%。排除超商、全聯、速食等。",
                    "日韓泰加碼有<span class='highlight'>單筆滿 NT$1,000</span> 門檻（2026 新增，小額消費只有基礎 3%），且需登錄（每月 20 日 16:00 開放 2 萬名）。",
                    "所有加碼活動只到 <span class='highlight'>9/30</span>，Q4 尚未公告。"
                ]
            },
            caps: [
                { label: "日韓泰實體 (最高6%)", detail: "日韓 3%+3%、泰國 1%+5%，加碼每季上限 NT$1,000。👉 日韓<span class='highlight'>刷 NT$ 33,333/季 封頂</span>（限 9/30 前）。" },
                { label: "日本交通卡 (10%)", detail: "Suica/PASMO/ICOCA，限 Apple Pay 綁卡、單筆滿 NT$2,000，加碼每季上限 NT$200。👉 <span class='highlight'>儲值 NT$ 2,857/季 封頂</span>。" },
                { label: "日韓基礎 (3%)", detail: "<span class='highlight'>無上限</span>（全年適用）。" },
                { label: "新戶 LINE Pay (10%)", detail: "核卡 60 天內，上限 NT$500。👉 <span class='highlight'>刷 NT$ 5,556 封頂</span>（需富邦帳戶自扣）。" }
            ],
            sections: [
                {
                    title: "其他權益",
                    items: [
                        { label: "國內一般", text: "1%（J Points 卡回饋 LINE POINTS / J Cash 卡回饋現金）。" },
                        { label: "伴手禮", text: "每季 1 次，領取前一週日韓消費滿 ¥10,000 或泰國 250 泰銖。" },
                        { label: "保費", text: "0.5% 或最高 12 期 0 利率二選一。" }
                    ]
                }
            ]
        },
        {
            bank: "玉山銀行",
            name: "Only 卡",
            tags: ["等級制", "保費", "紅利", "停發"],
            rate: "0.4% ~ 3.2%",
            note: "⚠️ 2026/9/1 起終止發行，之後陸續換發 Unicard。2026 全年權益不變：等級制最高 3.2%，保費計入回饋與等級累積。",
            validThrough: "2026-12-31",
            officialUrl: "https://event.esunbank.com.tw/credit/1070615card_2/index.html",
            lastVerified: "2026-07-12",
            warning: {
                title: "⚠️ 退場中：",
                items: [
                    "已停止申辦，<span class='highlight'>9/1 起終止發行</span>；9/1 起補發及 11 月起到期卡片將換發玉山 Unicard，換卡前照 2026 權益回饋。",
                    "回饋改為<span class='highlight'>玉山 e point</span>（1 點折 NT$1，效期 1 年，單筆最高折 30%）。",
                    "海外交易另收 1.5% 手續費，海外實質回饋需扣減。"
                ]
            },
            caps: [
                { label: "等級加碼", detail: "加碼上限歸戶每月 1,500 點（基礎 0.4% 無上限）。LV5 (3.2%) 👉 <span class='highlight'>刷 NT$ 53,571/月 封頂</span>；LV4 (2.4%) 刷 75,000/月；LV3 (1.6%) 刷 125,000/月。" }
            ],
            sections: [
                {
                    title: "等級門檻（年消費）",
                    items: [
                        { label: "LV2 0.8%", text: "年消費 NT$16,800。" },
                        { label: "LV3 1.6%", text: "年消費 NT$168,000。" },
                        { label: "LV4 2.4%", text: "年消費 NT$388,000。" },
                        { label: "LV5 3.2%", text: "年消費 NT$688,000。" },
                        { label: "特色", text: "保費計入回饋與等級累積；國內外同回饋率。免年費：電子帳單＋自動扣繳。" }
                    ]
                }
            ]
        },
        {
            bank: "滙豐銀行",
            name: "Live+ 現金回饋卡",
            tags: ["餐飲", "百貨", "娛樂", "蝦皮"],
            rate: "3.88% ~ 5.88%",
            note: "餐飲/購物/娛樂 3.88%，完成自扣＋精選國家餐飲最高 5.88%。⚠️ 第三方支付（LINE Pay/Apple Pay）只有 0.88%。權益公告至 9/30。",
            validThrough: "2026-09-30",
            officialUrl: "https://www.hsbc.com.tw/content/dam/hsbc/tw/docs/credit-cards/live-plus/cashback-cash-points-method.pdf",
            lastVerified: "2026-07-12",
            warning: {
                title: "⚠️ 注意事項：",
                items: [
                    "限<span class='highlight'>實體卡/卡號直接結帳</span>：透過 LINE Pay、街口、Apple Pay 等支付僅 0.88%。",
                    "餐飲<span class='highlight'>排除 foodpanda、Uber Eats</span> 外送；<span class='highlight'>歐盟 27 國+英國實體交易不回饋</span>。",
                    "現行權益至 <span class='highlight'>9/30</span>，歷來每季展延，Q4 待公告。點數 1 點=1 元刷卡金，亦可 1 點換 2 哩。"
                ]
            },
            caps: [
                { label: "三大通路 (3.88%)", detail: "餐飲/購物/娛樂加碼 3% 每期上限 888 點。👉 <span class='highlight'>刷 NT$ 29,600 封頂</span>。" },
                { label: "自扣任務 (+1%)", detail: "滙豐帳戶自扣，每期上限 200 點。👉 <span class='highlight'>刷 NT$ 20,000 封頂</span>。" },
                { label: "精選國家餐飲 (+1%)", detail: "日/新/馬/越/菲/印度/斯里蘭卡當地實體餐飲，每期上限 200 點。👉 <span class='highlight'>刷 NT$ 20,000 封頂</span>。" },
                { label: "一般消費 (0.88%)", detail: "<span class='highlight'>無上限</span>。" }
            ],
            sections: [
                {
                    title: "三大通路認定（MCC）",
                    items: [
                        { label: "餐飲", text: "一般餐廳、烘焙、酒吧（排除外送平台）。" },
                        { label: "購物", text: "百貨、禮品、玩具，含蝦皮。" },
                        { label: "娛樂", text: "電影院、遊樂園、娛樂展演。" }
                    ]
                }
            ]
        },
        {
            bank: "華南銀行",
            name: "SnY 卡",
            tags: ["紅利", "數位帳戶"],
            rate: "約 0.6%",
            note: "⚠️ 網購 5%、行動支付 5%、影音回饋均已移除！僅剩一般消費紅利 3 倍（約 0.6%）。網路上流傳的 5% 是過期資訊。",
            validThrough: "2026-09-30",
            officialUrl: "https://www.hncb.com.tw/wps/portal/HNCB/card/introduce/bonus_feedback_card/card_sny",
            lastVerified: "2026-07-12",
            warning: {
                title: "⚠️ 權益已大幅縮水：",
                items: [
                    "網購 5%、行動支付 5%、影音（Netflix/Spotify）回饋已於 2025 年陸續<span class='highlight'>全數移除</span>。",
                    "紅利 3 倍需當期一般消費滿 NT$1,000，且<span class='highlight'>不含網路消費</span>。",
                    "現行活動至 <span class='highlight'>9/30</span>，Q4 未公告。辦卡限持有 SnY 數位帳戶者。"
                ]
            },
            caps: [
                { label: "紅利 3 倍 (約0.6%)", detail: "每期上限 3,000 點。👉 約<span class='highlight'>刷 NT$ 25,000 封頂</span>。" }
            ],
            sections: [
                {
                    title: "數位帳戶（主要價值所在）",
                    items: [
                        { label: "活存優利", text: "2.3%（10 萬內，至 2026/12/31），需當月完成任務四選一（餘額 1 萬+/美金 300+/指定電支月扣 888+）。" },
                        { label: "新戶", text: "開戶無條件享 6 個月 2.5%（10 萬內）。" },
                        { label: "年費", text: "1,200 元，申請電子帳單免次年年費。" }
                    ]
                }
            ]
        },
        {
            bank: "台灣樂天",
            name: "Panda J 卡",
            tags: ["日本", "韓國", "泰國", "LINE Pay", "加油"],
            rate: "1.5% / 4%",
            note: "日韓泰當地實體 4%、指定通路 3%（LINE Pay/街口/航空/加油/旅行社），免登錄。⚠️ 下半年加碼上限砍半。",
            validThrough: "2026-12-31",
            officialUrl: "https://www.card.rakuten.com.tw/corp/ads/04.xhtml",
            lastVerified: "2026-07-12",
            warning: {
                title: "💡 2026 下半年變動：",
                items: [
                    "總回饋 % 不變，但加碼上限<span class='highlight'>由每期 500 元砍半</span>：日韓泰 300 元、指定通路 250 元。",
                    "樂天經典卡/玫瑰金卡的消費回饋已移轉，2026 主力為本卡；玫瑰金卡僅剩日本機場貴賓室與商店折扣。",
                    "免登錄。次年免年費需電子帳單＋年刷 12 次。"
                ]
            },
            caps: [
                { label: "日韓泰實體 (4%)", detail: "1.5% + 加碼 2.5%，每期上限 300 元。👉 <span class='highlight'>刷 NT$ 12,000 封頂</span>。" },
                { label: "指定通路 (3%)", detail: "0.5% + 加碼 2.5%，每期上限 250 元。👉 <span class='highlight'>刷 NT$ 10,000 封頂</span>。" },
                { label: "海外一般 (1.5%)", detail: "<span class='highlight'>無上限</span>（國內一般 0.5% 無上限）。" }
            ],
            sections: [
                {
                    title: "指定通路 3%",
                    items: [
                        { label: "支付", text: "LINE Pay、街口。" },
                        { label: "交通旅遊", text: "華航/長榮/星宇、中油等 7 家加油、雄獅等 12 家旅行社。" },
                        { label: "日本樂天", text: "日本樂天市場滿額贈 1,000 日圓券＋RGX 轉運 2% 無上限（至 12/31）。" }
                    ]
                }
            ]
        }
    ]
};
