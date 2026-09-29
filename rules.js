// ==========================================
// 推薦引擎規則檔（2026 下半年）
// 「這筆刷哪張」引擎吃的結構化規則，由 data.js 的權益敘述翻譯而來。
// 更新權益時：先改 data.js（給人讀），再同步這裡（給引擎算）。
//
// 設計原則（v1）：
// 1. 只結構化「常態權益」；領券/登錄做成條件標記（引擎只提醒，不假裝知道你領了沒）
// 2. 限時活動掛 validFrom/validThrough，過期自動失效
// 3. 通路太模糊、無法可靠比對的權益（如「指定餐飲手搖」）不入規則，寧缺勿錯
// ==========================================
(function (global) {
    "use strict";

    // ---------- 使用者設定 ----------
    // 引擎依這些假設計算，數值改這裡即可（頁面上會顯示目前假設）。
    const SETTINGS = {
        cubeLevel: 2,        // 國泰 CUBE：2 = 3%，3(財管會員) = 3.3%
        dawhoTier: "大戶",   // 永豐 DAWHO：大大 / 大戶 / 大戶Plus
        dawayTier: "GO",     // 永豐 DAWAY：GO(舊戶升級) / 一般
        onlyLevel: 2         // 玉山 Only：2~5（年消費等級）
    };

    const CUBE_RATE = SETTINGS.cubeLevel >= 3 ? 3.3 : 3.0;

    // 玉山 Only 等級 → 回饋率；加碼上限歸戶 1,500 點/月（基礎 0.4% 無上限）
    const ONLY_RATES = { 2: 0.8, 3: 1.6, 4: 2.4, 5: 3.2 };
    const ONLY_RATE = ONLY_RATES[SETTINGS.onlyLevel] || 0.8;
    const ONLY_CAP = Math.round(1500 / (ONLY_RATE - 0.4) * 100); // 加碼封頂消費額

    // 永豐 DAWHO 等級參數
    const DAWHO = {
        "大大":     { dom: 1.0, intl: 2.0, cap: null },
        "大戶":     { dom: 3.5, intl: 4.5, cap: 16000 },  // 加碼 400 元/月
        "大戶Plus": { dom: 5.0, intl: 6.0, cap: 25000 }   // 加碼 1,000 元/月
    }[SETTINGS.dawhoTier];

    // ---------- 通路字典 ----------
    // id 唯一；aliases 供輸入比對（不分大小寫、全形自動轉半形）；
    // cats 是分類標籤，規則可用 cats 批量匹配（如「超商」涵蓋 7-11/全家/萊爾富/OK）。
    // cats 本身也可直接查詢（輸入「超商 100」）——見下方「分類型通路」。
    const CHANNELS = [
        // 超市量販
        { id: "pxmart",    name: "全聯",        aliases: ["全聯", "pxmart", "px mart", "全聯福利中心", "pxpay", "px pay"], cats: ["supermarket"] },
        { id: "carrefour", name: "家樂福",      aliases: ["家樂福", "carrefour"], cats: ["supermarket"] },
        { id: "lopia",     name: "LOPIA",       aliases: ["lopia", "樂比亞"], cats: ["supermarket"] },
        { id: "costco",    name: "好市多",      aliases: ["好市多", "costco"], cats: ["supermarket"] },
        // 超商
        { id: "seven",     name: "7-11",        aliases: ["7-11", "711", "7-eleven", "seven", "小七", "統一超商"], cats: ["convenience"] },
        { id: "family",    name: "全家",        aliases: ["全家", "familymart", "family mart"], cats: ["convenience"] },
        { id: "hilife",    name: "萊爾富",      aliases: ["萊爾富", "hilife", "hi-life"], cats: ["convenience"] },
        { id: "okmart",    name: "OK超商",      aliases: ["ok超商", "okmart", "ok mart"], cats: ["convenience"] },
        // 餐飲外送
        { id: "mcd",       name: "麥當勞",      aliases: ["麥當勞", "mcdonald", "mcdonalds"], cats: ["dining", "fastfood"] },
        { id: "starbucks", name: "星巴克",      aliases: ["星巴克", "starbucks"], cats: ["dining"] },
        { id: "wowprime",  name: "王品",        aliases: ["王品", "wowprime"], cats: ["dining"] },
        { id: "haidilao",  name: "海底撈",      aliases: ["海底撈", "haidilao"], cats: ["dining", "hotpot"] },
        { id: "wooma",     name: "屋馬燒肉",    aliases: ["屋馬", "屋馬燒肉"], cats: ["dining"] },
        { id: "cha6",      name: "茶六燒肉",    aliases: ["茶六", "茶六燒肉"], cats: ["dining"] },
        { id: "jhanji",    name: "詹記麻辣鍋",  aliases: ["詹記", "詹記麻辣鍋"], cats: ["dining", "hotpot"] },
        { id: "50lan",     name: "50嵐",        aliases: ["50嵐", "五十嵐", "50藍"], cats: ["handshake"] },
        { id: "dejheng",   name: "得正",        aliases: ["得正", "dejheng"], cats: ["handshake"] },
        { id: "ubereats",  name: "Uber Eats",   aliases: ["ubereats", "uber eats", "優食"], cats: ["delivery"] },
        { id: "foodpanda", name: "foodpanda",   aliases: ["foodpanda", "熊貓外送", "富胖達"], cats: ["delivery"] },
        // 藥妝
        { id: "watsons",   name: "屈臣氏",      aliases: ["屈臣氏", "watsons"], cats: ["drugstore"] },
        { id: "cosmed",    name: "康是美",      aliases: ["康是美", "cosmed"], cats: ["drugstore"] },
        // 百貨零售
        { id: "sogo",      name: "SOGO",        aliases: ["sogo", "遠東sogo"], cats: ["dept"] },
        { id: "skm",       name: "新光三越",    aliases: ["新光三越", "skm"], cats: ["dept"] },
        { id: "eslite",    name: "誠品",        aliases: ["誠品", "eslite"], cats: ["dept"] },
        { id: "ikea",      name: "IKEA",        aliases: ["ikea", "宜家"], cats: ["shopping"] },
        { id: "nike",      name: "NIKE",        aliases: ["nike"], cats: ["shopping"] },
        { id: "poya",      name: "寶雅",        aliases: ["寶雅", "poya"], cats: ["drugstore", "shopping"] },
        { id: "decathlon", name: "迪卡儂",      aliases: ["迪卡儂", "decathlon"], cats: ["shopping"] },
        // 影城 / 售票
        { id: "vieshow",   name: "威秀影城",    aliases: ["威秀", "vieshow", "威秀影城"], cats: ["cinema"] },
        { id: "showtimes", name: "秀泰影城",    aliases: ["秀泰", "showtimes", "秀泰影城"], cats: ["cinema"] },
        { id: "opentix",   name: "OPENTIX",     aliases: ["opentix", "兩廳院售票"], cats: ["ticketing"] },
        { id: "tixcraft",  name: "拓元售票",    aliases: ["拓元", "tixcraft"], cats: ["ticketing"] },
        { id: "kktix",     name: "KKTIX",       aliases: ["kktix"], cats: ["ticketing"] },
        { id: "kham",      name: "寬宏售票",    aliases: ["寬宏", "kham"], cats: ["ticketing"] },
        // 加油
        { id: "cpc",       name: "中油",        aliases: ["中油", "cpc", "中油直營"], cats: ["gas"] },
        // 網購電商
        { id: "shopee",    name: "蝦皮",        aliases: ["蝦皮", "shopee", "蝦皮購物"], cats: ["online"] },
        { id: "momo",      name: "momo",        aliases: ["momo", "momo購物"], cats: ["online"] },
        { id: "pchome",    name: "PChome",      aliases: ["pchome", "pchome24h"], cats: ["online"] },
        { id: "coupang",   name: "酷澎",        aliases: ["酷澎", "coupang"], cats: ["online"] },
        { id: "taobao",    name: "淘寶",        aliases: ["淘寶", "taobao", "天貓"], cats: ["online", "crossborder"] },
        { id: "amazon",    name: "Amazon",      aliases: ["amazon", "亞馬遜"], cats: ["online", "crossborder"] },
        { id: "books",     name: "博客來",      aliases: ["博客來", "books.com"], cats: ["online"] },
        { id: "iherb",     name: "iHerb",       aliases: ["iherb"], cats: ["online", "crossborder"] },
        { id: "shein",     name: "SHEIN",       aliases: ["shein"], cats: ["online", "crossborder"] },
        { id: "rakutenjp", name: "日本樂天",    aliases: ["日本樂天", "樂天市場", "rakuten"], cats: ["online", "crossborder"] },
        { id: "queenshop", name: "Queen Shop", aliases: ["queen shop", "queenshop", "qs官網"], cats: ["online"] },
        // 訂閱 / 串流 / AI
        { id: "netflix",   name: "Netflix",     aliases: ["netflix", "網飛"], cats: ["subscription", "streaming"] },
        { id: "disney",    name: "Disney+",     aliases: ["disney+", "disney plus", "disneyplus"], cats: ["subscription", "streaming"] },
        { id: "spotify",   name: "Spotify",     aliases: ["spotify"], cats: ["subscription", "streaming"] },
        { id: "apple",     name: "Apple 服務",  aliases: ["apple", "app store", "icloud", "apple one", "apple服務"], cats: ["subscription"] },
        { id: "chatgpt",   name: "ChatGPT",     aliases: ["chatgpt", "openai"], cats: ["subscription", "ai"] },
        { id: "claude",    name: "Claude",      aliases: ["claude", "anthropic"], cats: ["subscription", "ai"] },
        { id: "gemini",    name: "Gemini",      aliases: ["gemini"], cats: ["subscription", "ai"] },
        { id: "perplexity",name: "Perplexity",  aliases: ["perplexity"], cats: ["subscription", "ai"] },
        { id: "notion",    name: "Notion",      aliases: ["notion"], cats: ["subscription", "ai"] },
        { id: "canva",     name: "Canva",       aliases: ["canva"], cats: ["subscription", "ai"] },
        { id: "steam",     name: "Steam",       aliases: ["steam"], cats: ["subscription", "gaming"] },
        { id: "nintendo",  name: "Nintendo",    aliases: ["nintendo", "任天堂", "switch"], cats: ["subscription", "gaming"] },
        { id: "psn",       name: "PlayStation", aliases: ["playstation", "psn", "ps store"], cats: ["subscription", "gaming"] },
        // 交通
        { id: "thsr",      name: "高鐵",        aliases: ["高鐵", "thsr", "台灣高鐵"], cats: ["transport"] },
        { id: "tra",       name: "台鐵",        aliases: ["台鐵", "tra", "臺鐵"], cats: ["transport"] },
        { id: "mrt",       name: "北捷",        aliases: ["北捷", "捷運", "台北捷運"], cats: ["transport"] },
        { id: "uber",      name: "Uber",        aliases: ["uber", "優步"], cats: ["transport"] },
        { id: "suica",     name: "日本交通卡",  aliases: ["suica", "西瓜卡", "pasmo", "icoca"], cats: ["jp"] },
        // 旅遊平台 / 航空
        { id: "klook",     name: "Klook",       aliases: ["klook", "客路"], cats: ["travel"] },
        { id: "kkday",     name: "KKday",       aliases: ["kkday"], cats: ["travel"] },
        { id: "agoda",     name: "Agoda",       aliases: ["agoda"], cats: ["travel"] },
        { id: "booking",   name: "Booking.com", aliases: ["booking", "booking.com"], cats: ["travel"] },
        { id: "expedia",   name: "Expedia",     aliases: ["expedia"], cats: ["travel"] },
        { id: "hotelscom", name: "Hotels.com",  aliases: ["hotels.com", "hotels com"], cats: ["travel"] },
        { id: "airbnb",    name: "Airbnb",      aliases: ["airbnb"], cats: ["travel"] },
        { id: "trip",      name: "Trip.com",    aliases: ["trip.com", "攜程"], cats: ["travel"] },
        { id: "liontravel",name: "雄獅旅遊",    aliases: ["雄獅", "liontravel"], cats: ["travel", "travelagency"] },
        { id: "cal",       name: "華航",        aliases: ["華航", "中華航空", "china airlines"], cats: ["airline"] },
        { id: "tigerair",  name: "台灣虎航",    aliases: ["虎航", "台灣虎航", "tigerair"], cats: ["airline"] },
        { id: "eva",       name: "長榮航空",    aliases: ["長榮", "長榮航空", "eva air"], cats: ["airline"] },
        { id: "starlux",   name: "星宇航空",    aliases: ["星宇", "starlux"], cats: ["airline"] },
        // 支付方式（把支付本身當通路查：輸入「line pay 500」）
        { id: "linepay",   name: "LINE Pay",    aliases: ["line pay", "linepay", "賴配"], cats: ["mobilepay"] },
        { id: "jkopay",    name: "街口",        aliases: ["街口", "jkopay", "街口支付"], cats: ["mobilepay"] },
        { id: "taishinpay",name: "台新Pay",     aliases: ["台新pay", "taishin pay", "台新 pay"], cats: ["mobilepay"] },
        { id: "pxpay2",    name: "全支付",      aliases: ["全支付", "pxpay+"], cats: ["mobilepay"] },
        // 綠色 / Gogoro 生態系
        { id: "tesla",     name: "Tesla 充電",  aliases: ["tesla", "特斯拉", "特斯拉充電"], cats: ["green"] },
        { id: "gogoro",    name: "Gogoro 資費", aliases: ["gogoro", "電池資費", "gogoro電池"], cats: ["green"] },
        { id: "goshare",   name: "GoShare",     aliases: ["goshare"], cats: ["green", "transport"] },
        // 保費
        { id: "insurance", name: "保費",        aliases: ["保費", "保險", "保險費"], cats: ["insurance"] },
        // 海外（國家／地區；cats 帶 overseas 讓海外通用規則也匹配）
        { id: "japan",     name: "日本",        aliases: ["日本", "japan", "東京", "大阪", "京都", "沖繩", "北海道", "福岡"], cats: ["overseas", "jp"] },
        { id: "korea",     name: "韓國",        aliases: ["韓國", "korea", "首爾", "釜山"], cats: ["overseas", "kr"] },
        { id: "thailand",  name: "泰國",        aliases: ["泰國", "thailand", "曼谷", "清邁"], cats: ["overseas", "th"] },
        { id: "singapore", name: "新加坡",      aliases: ["新加坡", "singapore"], cats: ["overseas", "sg"] },
        { id: "usa",       name: "美國",        aliases: ["美國", "美洲", "usa", "紐約", "洛杉磯"], cats: ["overseas", "us"] },
        { id: "europe",    name: "歐洲",        aliases: ["歐洲", "europe", "英國", "法國", "德國", "義大利", "西班牙"], cats: ["overseas", "eu"] },
        { id: "overseas",  name: "海外",        aliases: ["海外", "國外", "出國", "海外實體"], cats: ["overseas"] },
        // 分類型通路（直接輸入分類名也能查）
        { id: "c-conv",    name: "超商",        aliases: ["超商", "便利商店"], cats: ["convenience"] },
        { id: "c-super",   name: "超市",        aliases: ["超市", "量販", "量販店"], cats: ["supermarket"] },
        { id: "c-dining",  name: "餐飲",        aliases: ["餐飲", "餐廳", "吃飯", "美食", "聚餐"], cats: ["dining"] },
        { id: "c-shake",   name: "手搖飲",      aliases: ["手搖", "手搖飲", "飲料店"], cats: ["handshake"] },
        { id: "c-delivery",name: "外送",        aliases: ["外送", "外送平台"], cats: ["delivery"] },
        { id: "c-online",  name: "網購",        aliases: ["網購", "電商", "網路購物"], cats: ["online"] },
        { id: "c-drug",    name: "藥妝",        aliases: ["藥妝", "藥妝店"], cats: ["drugstore"] },
        { id: "c-dept",    name: "百貨",        aliases: ["百貨", "百貨公司"], cats: ["dept"] },
        { id: "c-gas",     name: "加油",        aliases: ["加油", "加油站"], cats: ["gas"] },
        { id: "c-transport",name: "交通",       aliases: ["交通", "大眾運輸", "計程車"], cats: ["transport"] },
        { id: "c-travel",  name: "旅遊平台",    aliases: ["旅遊", "旅遊平台", "訂房"], cats: ["travel"] },
        { id: "c-subs",    name: "訂閱",        aliases: ["訂閱", "串流"], cats: ["subscription"] },
        { id: "c-ai",      name: "AI 工具",     aliases: ["ai", "ai工具"], cats: ["ai", "subscription"] },
        { id: "c-mpay",    name: "行動支付",    aliases: ["行動支付", "行支"], cats: ["mobilepay"] }
    ];

    // ---------- 卡片索引 ----------
    // dataName 用來對回 data.js 的卡片（bank + name 完全一致），點結果可開詳細頁。
    const CARDS = [
        { id: "cube",    bank: "國泰世華", name: "CUBE 卡",            unit: "小樹點" },
        { id: "richart", bank: "台新銀行", name: "Richart 卡（原 @GoGo）", unit: "Richart點" },
        { id: "eco",     bank: "星展銀行", name: "eco 永續卡",          unit: "現金積點" },
        { id: "laidian", bank: "聯邦銀行", name: "賴點卡",              unit: "LINE POINTS" },
        { id: "gogoro",  bank: "台新銀行", name: "Gogoro Rewards",     unit: "點數" },
        { id: "ubear",   bank: "玉山銀行", name: "U Bear 卡",           unit: "現金回饋" },
        { id: "daway",   bank: "永豐銀行", name: "DAWAY 卡",            unit: "LINE POINTS" },
        { id: "dawho",   bank: "永豐銀行", name: "DAWHO 大戶卡",        unit: "現金回饋" },
        { id: "bibei",   bank: "永豐銀行", name: "幣倍卡",              unit: "現金/外幣" },
        { id: "ctbc",    bank: "中國信託", name: "LINE Pay 卡",         unit: "LINE POINTS" },
        { id: "fubonj",  bank: "台北富邦", name: "J 卡",                unit: "LINE POINTS/現金" },
        { id: "only",    bank: "玉山銀行", name: "Only 卡",             unit: "e point(效期1年)" },
        { id: "hsbc",    bank: "滙豐銀行", name: "Live+ 現金回饋卡",    unit: "刷卡金" },
        { id: "sny",     bank: "華南銀行", name: "SnY 卡",              unit: "紅利點數" },
        { id: "rakuten", bank: "台灣樂天", name: "Panda J 卡",          unit: "現金回饋" }
    ];

    // ---------- 規則 ----------
    // 欄位說明：
    //   card: 卡片 id｜title: 方案名（顯示用）｜rate: 回饋 %｜base: 超過封頂後的 %（省略=0）
    //   channels / cats: 匹配的通路 id / 分類；general: true = 不限通路（一般消費）
    //   scope: "domestic"(預設) / "overseas" / "any"
    //   cap: { spend: 封頂消費額, period: "月"|"期"|"季", text: 原始上限描述 }（perTx: true = 單筆計）
    //   excludeChannels / excludeCats: 明確排除（命中排除 → 這條規則不適用）
    //   conditions: [{ tag: 短標籤, text: 完整說明 }] —— 領券/登錄/自扣等做成條件標記
    //   validFrom / validThrough: 起訖日，過期自動失效
    const RULES = [

        // ===== 國泰 CUBE（Level 2 = 3%；方案擇一，需在 App 切換）=====
        {
            // 2026/9/30 查證：部落格載集精選已降為 2%（官方主頁反爬無法直驗，保守採低值）
            card: "cube", title: "集精選", rate: 2.0, base: 0.3,
            channels: ["pxmart", "carrefour", "lopia", "seven", "family", "cpc", "ikea"],
            conditions: [
                { tag: "切方案", text: "需在 CUBE App 將權益方案切到「集精選」（隨切隨生效）" },
                { tag: "待確認", text: "2026/9 查證：集精選疑降為 2%（部落格資訊，官方頁反爬無法直驗）；實際以官方公告為準" },
                { tag: "Level 2", text: "需國泰帳戶自扣或 CUBE App 繳本行卡費（月底前 3 個工作日設定，次月適用）" }
            ]
        },
        {
            card: "cube", title: "玩數位", rate: CUBE_RATE, base: 0.3,
            channels: ["chatgpt", "gemini", "claude", "perplexity", "notion", "canva",
                       "shopee", "momo", "pchome", "netflix", "disney", "spotify", "apple"],
            cats: ["ai"],
            conditions: [
                { tag: "切方案", text: "需在 CUBE App 將權益方案切到「玩數位」" },
                { tag: "Level 2", text: "需國泰帳戶自扣或 CUBE App 繳本行卡費" }
            ]
        },
        {
            card: "cube", title: "樂饗購", rate: CUBE_RATE, base: 0.3,
            channels: ["sogo", "skm", "eslite", "mcd", "ubereats", "foodpanda", "watsons", "cosmed"],
            cats: ["dining", "delivery"],
            conditions: [
                { tag: "切方案", text: "需在 CUBE App 將權益方案切到「樂饗購」" },
                { tag: "Level 2", text: "需國泰帳戶自扣或 CUBE App 繳本行卡費" }
            ]
        },
        {
            card: "cube", title: "趣旅行", rate: CUBE_RATE, base: 0.3, scope: "any",
            channels: ["klook", "agoda", "booking", "thsr", "tra", "mrt", "uber", "cal", "eva", "starlux"],
            cats: ["airline", "overseas"],
            conditions: [
                { tag: "切方案", text: "需在 CUBE App 將權益方案切到「趣旅行」（海外實體、國內外交通、20 家航空）" },
                { tag: "Level 2", text: "需國泰帳戶自扣或 CUBE App 繳本行卡費" }
            ]
        },
        {
            card: "cube", title: "LINE Pay 領券加碼", rate: 2.0, base: 0.3,
            channels: ["linepay"],
            cap: { spend: 2941, period: "月", text: "加碼 1.7% 每月上限 50 點（0.3%+1.7%=2%）" },
            validThrough: "2026-10-31",
            conditions: [{ tag: "需領券", text: "需先在 CUBE App 領券；排除外送、百貨內門市、海外門市。11 月後是否續辦未公告（11 月初留意）" }]
        },
        {
            card: "cube", title: "一般消費", rate: 0.3, general: true,
            excludeCats: ["insurance"]
        },

        // ===== 台新 Richart（LEVEL 2 需 Richart 帳戶自扣；方案每日可切）=====
        {
            card: "richart", title: "Pay著刷（台新Pay）", rate: 3.8, base: 0.3,
            channels: ["taishinpay"],
            conditions: [
                { tag: "切方案", text: "需在 Richart Life App 切到「Pay著刷」（可每日切換）" },
                { tag: "需自扣", text: "需設定 Richart 帳戶自動扣繳（LEVEL 2），未設定僅 0.3%" }
            ]
        },
        {
            card: "richart", title: "Pay著刷（LINE Pay 領券）", rate: 3.8, base: 2.3,
            channels: ["linepay"],
            cap: { spend: 33333, period: "月", text: "領券加碼 +1.5% 每月上限 500 點" },
            validThrough: "2026-09-30",  // 只發 7–9 月券，10 月起未公告
            conditions: [
                { tag: "需領券", text: "LINE Pay 直刷 2.3%，需 App 領券再 +1.5% 才到 3.8%（券只發到 9 月，Q4 未公告）" },
                { tag: "切方案", text: "需切到「Pay著刷」方案" },
                { tag: "需自扣", text: "需 Richart 帳戶自扣（LEVEL 2）" }
            ]
        },
        {
            card: "richart", title: "Pay著刷（LINE Pay）", rate: 2.3, base: 0.3,
            channels: ["linepay"],
            validThrough: "2027-12-31",
            conditions: [
                { tag: "切方案", text: "需切到「Pay著刷」方案（領券加碼 3.8% 已於 2026/9/30 截止，Q4 未公告）" },
                { tag: "需自扣", text: "需 Richart 帳戶自扣（LEVEL 2）" }
            ]
        },
        {
            card: "richart", title: "數趣刷", rate: 3.3, base: 0.3,
            channels: ["shopee", "momo", "coupang", "pchome", "taobao", "amazon", "books", "iherb", "shein",
                       "steam", "netflix", "disney", "chatgpt", "claude", "notion", "canva", "perplexity"],
            validThrough: "2027-12-31",
            conditions: [
                { tag: "切方案", text: "需切到「數趣刷」方案（2026/9 查證：通路已擴充遊戲影音、AI 服務、線上課程）" },
                { tag: "需自扣", text: "需 Richart 帳戶自扣（LEVEL 2）" }
            ]
        },
        {
            card: "richart", title: "Chill刷", rate: 10.0, base: 0.3,
            channels: ["haidilao", "wooma", "cha6", "jhanji", "50lan", "dejheng"],
            cats: ["handshake", "hotpot"],
            validThrough: "2027-12-31",
            conditions: [
                { tag: "切方案", text: "需切到「Chill刷」方案（已轉常設：指定火鍋燒肉酒吧＋手搖 10%）" },
                { tag: "需自扣", text: "需 Richart 帳戶自扣（LEVEL 2，否則僅 1.3%）" },
                { tag: "平台除外", text: "經 Uber Eats/蝦皮等平台下單降為 3.3%；經 momo/百貨/大全聯/飯店不加碼" }
            ]
        },
        {
            card: "richart", title: "天天刷", rate: 3.3, base: 0.3,
            cats: ["convenience", "transport", "gas", "drugstore"],
            validThrough: "2027-12-31",
            conditions: [
                { tag: "切方案", text: "需切到「天天刷」方案（超商、交通、加油、藥妝）" },
                { tag: "超商限台新Pay", text: "全家/7-11 需以台新 Pay 綁定支付才有 3.3%；實體卡或 LINE Pay 刷超商 = 0 回饋" },
                { tag: "需自扣", text: "需 Richart 帳戶自扣（LEVEL 2）" }
            ]
        },
        {
            card: "richart", title: "一般消費", rate: 0.3, general: true,
            excludeCats: ["insurance"]
        },

        // ===== 星展 eco 永續卡 =====
        {
            card: "eco", title: "海外指定國", rate: 5.0, base: 1.0, scope: "overseas",
            cats: ["jp", "kr", "th", "sg", "us", "eu"],
            cap: { spend: 15000, period: "期", text: "加碼 4% 每期上限 600 點" },
            conditions: [{ tag: "限實體", text: "限實體卡或 Apple/Samsung Pay 於當地實體商店消費" }]
        },
        {
            card: "eco", title: "綠色消費", rate: 10.0, base: 1.0,
            channels: ["tesla", "gogoro"], cats: ["green"],
            cap: { spend: 5555, period: "期", text: "加碼 9% 每期上限 500 點（下半年由 300 調升）" },
            validThrough: "2026-12-31",
            conditions: [{ tag: "指定通路", text: "Tesla 充電、Gogoro 電池資費（含 PBGN）、星展支持之社會企業" }]
        },
        {
            card: "eco", title: "一般消費", rate: 1.0, general: true, scope: "any",
            conditions: [{ tag: "點數兌換", text: "點數效期 18 個月，需登錄 i 客服兌換（含保費代扣、超商）" }]
        },

        // ===== 聯邦 賴點卡（須電子帳單 + 綁 LINE Pay）=====
        {
            card: "laidian", title: "LINE Pay 一般消費", rate: 2.0, base: 1.0,
            channels: ["linepay"],
            cap: { spend: 20000, period: "月", text: "加碼 1% 每月上限 200 點" },
            conditions: [
                { tag: "單筆滿百", text: "加碼有單筆滿 NT$100 門檻" },
                { tag: "前置設定", text: "須申辦電子帳單且卡片成功綁定 LINE Pay" }
            ]
        },
        {
            card: "laidian", title: "IP商店/售票/影城", rate: 7.0, base: 2.0,
            channels: ["vieshow", "showtimes", "opentix", "tixcraft", "kktix", "kham"],
            cats: ["cinema", "ticketing"],
            cap: { spend: 4000, period: "月", text: "+5% 每月歸戶上限 200 點" },
            validThrough: "2026-12-31",
            conditions: [
                { tag: "需LINE Pay", text: "以 LINE Pay 付款（CHIIKAWA SHOP、OPENTIX、拓元、寬宏、KKTIX、威秀、秀泰等）" },
                { tag: "前置設定", text: "須電子帳單 + 綁定 LINE Pay" }
            ]
        },
        {
            card: "laidian", title: "偶數日指定通路", rate: 7.0, base: 2.0, dynamic: "evenDay",
            channels: ["mcd", "starbucks", "wowprime", "watsons", "ikea", "nike", "poya", "decathlon"],
            cap: { spend: 3000, period: "月", text: "+5% 每月上限 150 點" },
            conditions: [
                { tag: "偶數日", text: "限每月 2、4、6…日，需以 LINE Pay 付款（指定 50+ 家通路）" },
                { tag: "單筆滿百", text: "加碼有單筆滿 NT$100 門檻" },
                { tag: "前置設定", text: "須電子帳單 + 綁定 LINE Pay" }
            ]
        },
        {
            card: "laidian", title: "萊爾富現折", rate: 5.0,
            channels: ["hilife"],
            conditions: [{ tag: "支付限制", text: "全行卡片適用（含 HiPay/Apple Pay 綁卡）；LINE Pay、街口不適用" }]
        },
        {
            card: "laidian", title: "海外消費", rate: 3.0, scope: "overseas", general: true,
            conditions: [{ tag: "前置設定", text: "需電子帳單（含歐洲實體）" }]
        },
        {
            card: "laidian", title: "國內一般", rate: 1.0, general: true,
            excludeCats: ["insurance"],
            conditions: [{ tag: "前置設定", text: "須電子帳單 + 綁定 LINE Pay" }]
        },

        // ===== 台新 Gogoro Rewards（任務：台新帳戶扣繳 + 數位帳單）=====
        {
            card: "gogoro", title: "電池資費", rate: 4.0,
            channels: ["gogoro"],
            conditions: [{ tag: "指定管道", text: "需 Gogoro 官網/App/Wallet 刷卡或自扣（下半年由 10% 縮水為 4%）" }]
        },
        {
            card: "gogoro", title: "GoShare", rate: 15.0, base: 1.0,
            channels: ["goshare"],
            cap: { spend: 3333, period: "月", text: "每月上限 500 點" }
        },
        {
            card: "gogoro", title: "夥伴通路", rate: 4.0, base: 0.3,
            channels: ["seven", "family", "thsr", "uber", "ubereats", "foodpanda",
                       "klook", "kkday", "mrt", "cosmed", "ikea"],
            cap: { spend: 2702, period: "單筆", perTx: true, text: "加碼 3.7% 單筆上限 100 點（另有每月 500 點上限）" },
            conditions: [{ tag: "帳戶任務", text: "當期帳單需設定台新帳戶扣繳 + 啟用數位帳單" }]
        },
        {
            card: "gogoro", title: "海外消費", rate: 4.0, scope: "overseas", general: true,
            conditions: [{ tag: "帳戶任務", text: "0.3% + 3.7% 任務加碼，需台新帳戶扣繳 + 數位帳單" }]
        },
        {
            card: "gogoro", title: "一般消費", rate: 1.0, general: true,
            excludeCats: ["insurance"]
        },

        // ===== 玉山 U Bear（2026/9/1 起新制至 2027/2/28；訂閱 10% 已取消）=====
        {
            card: "ubear", title: "網路消費", rate: 3.0, base: 1.0,
            cats: ["online"],
            // 9/1 新制明文排除：超商、訂閱平台（只剩基本 1%）、行動支付不算網購
            excludeChannels: ["seven", "family", "hilife", "okmart",
                              "netflix", "chatgpt", "gemini", "steam", "nintendo", "psn"],
            excludeCats: ["mobilepay"],
            cap: { spend: 7500, period: "期", text: "加碼 2% 每期上限 150 元" },
            validFrom: "2026-09-01", validThrough: "2027-02-28",
            conditions: [{ tag: "前置設定", text: "需帳單 e 化（加碼條件）；基本回饋：e 化＋自扣兩者都綁 1%、只綁一項 0.5%、都沒綁 0%" }]
        },
        {
            card: "ubear", title: "LINE Pay 專案", rate: 5.0, base: 1.0,
            channels: ["linepay"],
            cap: { spend: 10000, period: "月", text: "每月上限 500 點 e point" },
            validFrom: "2026-09-01", validThrough: "2026-11-30",
            conditions: [{ tag: "單筆滿500", text: "單筆滿 NT$500 才有 5%；限 2026/9/1–11/30" }]
        },
        {
            card: "ubear", title: "一般消費", rate: 1.0, general: true,
            excludeCats: ["insurance"],
            validThrough: "2027-02-28",
            conditions: [{ tag: "前置設定", text: "帳單 e 化＋玉山帳戶自扣兩者都綁 = 1%，只綁一項 = 0.5%，都沒綁 = 0%（訂閱平台已被排除加碼，只有這條）" }]
        },

        // ===== 永豐 DAWAY（GO 舊戶；需綁 LINE Pay）=====
        {
            card: "daway", title: "國內消費（GO）", rate: 2.0, base: 0.5, general: true,
            excludeCats: ["insurance"],
            cap: { spend: 20000, period: "期", text: "GO 加碼 +1.5% 每期上限 300 點" },
            conditions: [
                { tag: "需綁LINE Pay", text: "須於消費前成功綁定 LINE Pay 才有加碼點數" },
                { tag: "GO 三條件", text: "永豐帳戶自扣 + 電子/行動帳單 + 網銀投資屬性問卷（結帳日當月底前完成）" }
            ]
        },
        {
            card: "daway", title: "海外消費（GO）", rate: 4.0, base: 2.5, scope: "overseas", general: true,
            cap: { spend: 20000, period: "期", text: "GO 加碼 +1.5% 每期上限 300 點（與國內共用）" },
            conditions: [
                { tag: "需綁LINE Pay", text: "須於消費前成功綁定 LINE Pay" },
                { tag: "GO 三條件", text: "永豐帳戶自扣 + 電子/行動帳單 + 投資屬性問卷" }
            ]
        },

        // ===== 永豐 DAWHO 大戶卡（全通路，等級依 SETTINGS）=====
        {
            card: "dawho", title: `${SETTINGS.dawhoTier}全通路`, rate: DAWHO.dom, base: 1.0, general: true,
            excludeCats: ["insurance"],
            cap: DAWHO.cap ? { spend: DAWHO.cap, period: "月", text: "加碼上限 400 元/月（大戶Plus 1,000 元）" } : null,
            conditions: [
                { tag: "等級門檻", text: "大戶=當月平均財富 30 萬+，或替代任務擇一（換匯 5,000／信貸扣款／台股成交／新網銀會員）" },
                { tag: "帳戶任務", text: "DAWHO 帳戶扣繳卡款 + 電子/行動帳單（保費代繳不計）" }
            ]
        },
        {
            card: "dawho", title: `${SETTINGS.dawhoTier}海外`, rate: DAWHO.intl, base: 2.0, scope: "overseas", general: true,
            cap: DAWHO.cap ? { spend: DAWHO.cap, period: "月", text: "加碼上限與國內共用" } : null,
            conditions: [
                { tag: "等級門檻", text: "大戶=30 萬資產或替代任務" },
                { tag: "帳戶任務", text: "DAWHO 帳戶扣繳 + 電子/行動帳單" }
            ]
        },

        // ===== 永豐 幣倍卡（單一門檻：自扣+帳單 且 資產 10 萬+）=====
        {
            card: "bibei", title: "精選通路", rate: 6.0, base: 2.0, scope: "any",
            channels: ["amazon", "iherb", "taobao", "rakutenjp",
                       "cal", "eva", "starlux", "liontravel", "booking", "agoda",
                       "hotelscom", "expedia", "trip", "airbnb", "klook", "kkday", "suica"],
            cats: ["overseas", "travel", "airline"],
            cap: { spend: 20000, period: "期", text: "加碼 4% 每期上限 800 元" },
            conditions: [
                { tag: "資格門檻", text: "需永豐帳戶自扣 + 電子帳單，且前月永豐資產月平均 10 萬+（或為大戶等級）" },
                { tag: "訂房限平台", text: "住宿需經訂房平台才有 +4%（實體飯店加碼已取消）" }
            ]
        },
        {
            card: "bibei", title: "保費", rate: 1.2,
            channels: ["insurance"],
            conditions: [{ tag: "無上限", text: "保費 1.2% 無上限" }]
        },
        {
            card: "bibei", title: "國外一般", rate: 2.0, scope: "overseas", general: true,
            conditions: [{ tag: "外幣回饋", text: "回饋存入外幣帳戶" }]
        },
        { card: "bibei", title: "國內一般", rate: 1.0, general: true },

        // ===== 中信 LINE Pay 卡（需綁定台灣 LINE Pay 帳號）=====
        {
            card: "ctbc", title: "海外實體", rate: 2.8, scope: "overseas", general: true,
            conditions: [{ tag: "限實體", text: "限實體面對面交易（實體卡/Apple Pay/Google Pay），網路交易、條碼支付不適用" }],
            validThrough: "2026-12-31"
        },
        {
            card: "ctbc", title: "脆自遊海外加碼", rate: 5.0, base: 2.8, scope: "overseas", general: true,
            cap: { spend: 20454, period: "季", text: "再加碼 2.2% 每季上限 450 點" },
            validThrough: "2026-09-30",
            conditions: [
                { tag: "需登錄", text: "每週二開放 3,000 名登錄，額滿向隅" },
                { tag: "限實體", text: "限海外實體面對面交易；Q4 是否續辦未公告" }
            ]
        },
        {
            card: "ctbc", title: "脆好購電商", rate: 5.0, base: 1.0,
            channels: ["taobao", "shopee", "coupang"],
            cap: { spend: 2500, period: "季", text: "加碼 4% 每季上限 100 點" },
            validThrough: "2026-12-31",
            conditions: [{ tag: "需登錄", text: "每月 6 日 10:00 開放 8,000 名登錄，每季需重新登錄" }]
        },
        {
            card: "ctbc", title: "脆自遊 Trip.com/Airbnb", rate: 5.0, base: 1.0,
            channels: ["trip", "airbnb"],
            cap: { spend: 2500, period: "季", text: "加碼 4%+1% 每季上限 100 點" },
            validThrough: "2026-12-31",
            conditions: [{ tag: "需登錄", text: "每月 6 日 10:00 開放登錄" }]
        },
        {
            card: "ctbc", title: "脆自遊 台灣虎航", rate: 10.0, base: 1.0,
            channels: ["tigerair"],
            cap: { spend: 2222, period: "季", text: "加碼 9%+1% 每季上限 200 點" },
            validThrough: "2026-12-31",
            conditions: [{ tag: "需登錄", text: "每月 6 日 13:00 開放登錄" }]
        },
        {
            card: "ctbc", title: "國內外一般", rate: 1.0, general: true, scope: "any",
            excludeCats: ["insurance"],
            conditions: [{ tag: "需綁定", text: "需綁定台灣 LINE Pay 帳號；點數效期 180 天" }]
        },

        // ===== 富邦 J 卡（需電子帳單或自扣，否則 0.5%）=====
        {
            card: "fubonj", title: "日韓實體加碼", rate: 6.0, base: 3.0, scope: "overseas",
            cats: ["jp", "kr"],
            cap: { spend: 33333, period: "季", text: "加碼 3% 每季上限 NT$1,000" },
            validThrough: "2026-09-30",
            conditions: [
                { tag: "需登錄", text: "每月 20 日 16:00 開放 2 萬名" },
                { tag: "單筆滿千", text: "單筆滿 NT$1,000 才有加碼，小額只有基礎 3%" }
            ]
        },
        {
            card: "fubonj", title: "泰國實體加碼", rate: 6.0, base: 3.0, scope: "overseas",
            cats: ["th"],
            cap: { spend: 33333, period: "季", text: "1%+5%，加碼每季上限與日韓共用" },
            validThrough: "2026-09-30",
            conditions: [
                { tag: "需登錄", text: "每月 20 日 16:00 開放 2 萬名" },
                { tag: "單筆滿千", text: "單筆滿 NT$1,000 才有加碼" }
            ]
        },
        {
            card: "fubonj", title: "日韓泰基礎", rate: 3.0, scope: "overseas",
            cats: ["jp", "kr", "th"],
            validThrough: "2026-12-31",
            conditions: [{ tag: "前置設定", text: "需富邦帳戶自扣或電子帳單（且取消實體帳單），否則僅 0.5%（2026/9 查證：泰國已與日韓同為 3%）" }]
        },
        {
            card: "fubonj", title: "日本交通卡儲值", rate: 10.0, base: 3.0,
            channels: ["suica"],
            cap: { spend: 2857, period: "季", text: "加碼每季上限 NT$200" },
            validThrough: "2026-09-30",
            conditions: [
                { tag: "Apple Pay", text: "限 Apple Pay 綁卡儲值，單筆滿 NT$2,000" },
                { tag: "需登錄", text: "需登錄" }
            ]
        },
        {
            card: "fubonj", title: "國內一般", rate: 1.0, general: true,
            excludeChannels: ["pxmart"],
            excludeCats: ["convenience", "fastfood", "insurance"],
            conditions: [{ tag: "前置設定", text: "需電子帳單或富邦帳戶自扣，否則 0.5%；排除超商、全聯、速食等" }]
        },

        // ===== 玉山 Only 卡（等級制，國內外同回饋率；9/1 起停發換 Unicard）=====
        {
            card: "only", title: `LV${SETTINGS.onlyLevel}（${ONLY_RATE}%）`, rate: ONLY_RATE, base: 0.4,
            general: true, scope: "any",
            cap: { spend: ONLY_CAP, period: "月", text: "加碼上限歸戶每月 1,500 點（基礎 0.4% 無上限）" },
            conditions: [
                { tag: "等級制", text: `依年消費分級：LV2 0.8%（1.68 萬）/ LV3 1.6%（16.8 萬）/ LV4 2.4%（38.8 萬）/ LV5 3.2%（68.8 萬）；保費計入回饋與等級` },
                { tag: "海外手續費", text: "海外交易另收 1.5% 手續費，海外實質回饋需扣減" }
            ]
        },

        // ===== 滙豐 Live+（權益公告至 9/30；限實體卡/卡號直刷）=====
        {
            card: "hsbc", title: "餐飲/購物/娛樂", rate: 3.88, base: 0.88,
            cats: ["dining", "fastfood", "dept", "shopping"],
            channels: ["shopee"],
            excludeCats: ["delivery", "mobilepay"],
            cap: { spend: 29600, period: "期", text: "加碼 3% 每期上限 888 點" },
            validThrough: "2026-12-31",  // 官方公告：辦法不變展延至 12/31
            conditions: [
                { tag: "限直刷", text: "限實體卡/卡號直接結帳；LINE Pay、街口、Apple Pay 等僅 0.88%" },
                { tag: "排除外送", text: "餐飲排除 foodpanda、Uber Eats" },
                { tag: "自扣+1%", text: "完成滙豐帳戶自扣再 +1%（上限 200 點/期，以前兩期帳單計算）" }
            ]
        },
        {
            card: "hsbc", title: "一般消費", rate: 0.88, general: true, scope: "any",
            excludeCats: ["insurance", "eu", "mobilepay"],
            validThrough: "2026-12-31",
            conditions: [{ tag: "排除歐英", text: "歐盟 27 國＋英國實體交易不回饋；第三方支付僅 0.88%" }]
        },

        // ===== 華南 SnY（權益已縮水，僅剩紅利 3 倍；2026/9 查證為全年活動）=====
        {
            card: "sny", title: "紅利 3 倍", rate: 0.6, base: 0, general: true,
            excludeCats: ["online", "insurance"],
            cap: { spend: 25000, period: "期", text: "每期上限 3,000 點" },
            validThrough: "2026-12-31",
            conditions: [{ tag: "門檻", text: "當期一般消費滿 NT$1,000 才有 3 倍；「不含網路消費」為舊條款記載，現行活動頁未明列，保守沿用待人工複核" }]
        },

        // ===== 台灣樂天 Panda J（免登錄）=====
        {
            card: "rakuten", title: "日韓泰實體", rate: 4.0, base: 1.5, scope: "overseas",
            cats: ["jp", "kr", "th"],
            cap: { spend: 12000, period: "期", text: "加碼 2.5% 每期上限 300 元（下半年由 500 砍半）" },
            conditions: [{ tag: "免登錄", text: "當地實體消費適用" }]
        },
        {
            card: "rakuten", title: "指定通路", rate: 3.0, base: 0.5,
            channels: ["linepay", "jkopay", "cal", "eva", "starlux", "cpc", "liontravel"],
            cats: ["travelagency"],
            cap: { spend: 10000, period: "期", text: "加碼 2.5% 每期上限 250 元（下半年由 500 砍半）" },
            conditions: [{ tag: "免登錄", text: "LINE Pay、街口、航空、加油、旅行社" }]
        },
        {
            card: "rakuten", title: "海外一般", rate: 1.5, scope: "overseas", general: true
        },
        {
            card: "rakuten", title: "國內一般", rate: 0.5, general: true,
            excludeCats: ["insurance"]
        }

        // 【刻意不入規則的權益】通路認定太模糊或高度限時，寧缺勿錯：
        // - CUBE 慶生月 3.5%/10%（限時+指定餐廳清單）
        // - Richart Chill刷 10%（「指定餐飲/手搖限獨立店面」無法可靠比對）
        // - Richart 大筆刷/好饗刷/玩旅刷（data.js 未列具體通路）、假日刷（限國定假日）
        // - 賴點 IP 商店/票券/影城 +5%（期間限定、通路模糊）
        // - 中信旅遊平台加碼（Klook 4-10% 等，多需指定連結且變動頻繁）
        // - DAWAY / eco / 富邦J / 賴點 的新戶限定加碼（引擎假設全部是舊戶）
    ];

    const CARD_RULES = {
        meta: {
            updated: "2026-09-30",
            settings: SETTINGS,
            settingsText: `試算假設：CUBE Level ${SETTINGS.cubeLevel}、DAWHO ${SETTINGS.dawhoTier}、DAWAY ${SETTINGS.dawayTier}、Only LV${SETTINGS.onlyLevel}（可在 rules.js 調整）`
        },
        channels: CHANNELS,
        cards: CARDS,
        rules: RULES
    };

    global.CARD_RULES = CARD_RULES;
})(typeof window !== "undefined" ? window : globalThis);
