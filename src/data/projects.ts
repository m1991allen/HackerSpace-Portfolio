/**
 * 作品集資料。
 *
 * 新增一個作品 = 在下方陣列加一個物件，首頁與作品頁會自動更新，
 * 內頁網址為 /work/{slug}。
 *
 * 圖片請放到 public/projects/ 底下，path 從 /projects/... 開始寫。
 */

export type ProjectImage = {
  src: string;
  alt: string;
  /** 圖說，會顯示在圖片下方 */
  caption?: string;
  /** true = 整行滿版；false / 未填 = 兩欄並排 */
  wide?: boolean;
};

export type StoryBlock = {
  /** 小標籤，例如「挑戰」「解法」 */
  label: string;
  title: string;
  /** 每個字串為一段 */
  body: string[];
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  category: string;
  year: string;
  /** 首頁與列表用的一句話簡介 */
  excerpt: string;
  cover: string;
  /** 卡片與內頁 hero 的主色，用於漸層與標籤 */
  accent: string;
  services: string[];
  stack: string[];
  /** 專案成效，內頁會做成數據列 */
  results: { value: string; label: string }[];
  /** 專案故事，依序呈現 */
  story: StoryBlock[];
  /** 客戶回饋 */
  testimonial?: { quote: string; author: string; role: string };
  gallery: ProjectImage[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "jingyan-construction",
    title: "京硯建設",
    subtitle: "品牌官網重塑",
    client: "京硯建設股份有限公司",
    category: "品牌官網",
    year: "2025",
    accent: "#1D5343",
    excerpt:
      "把三十年的建築工藝，翻譯成一個能讓買方在三分鐘內建立信任的官方網站。",
    cover: "/projects/jingyan-cover.svg",
    services: ["品牌策略", "網站設計", "前端開發", "SEO"],
    stack: ["Next.js", "TypeScript", "Sanity CMS", "Vercel"],
    results: [
      { value: "3.4×", label: "賞屋預約表單成長" },
      { value: "-58%", label: "跳出率下降" },
      { value: "1.2s", label: "首頁載入時間" },
    ],
    story: [
      {
        label: "背景",
        title: "三十年的口碑，卡在一個十年沒動的網站",
        body: [
          "京硯建設在中台灣蓋了三十年的房子，靠的是口碑與工地現場的品質。但當買方在看屋前先上網搜尋時，看到的卻是一個十年前做的網站——首頁是一張跑馬燈、建案資訊散落在 PDF 裡、手機打開要一直放大縮小。",
          "第一次會議時，業主說了一句話讓我們記到現在：「我們的房子蓋得比網站好太多了。」問題不在於他們沒有故事，而在於故事沒有被好好說出來。",
        ],
      },
      {
        label: "挑戰",
        title: "買房是一個很長的決策，網站要陪走完全程",
        body: [
          "我們訪談了六位近兩年成交的住戶，發現一件事：沒有人是看完網站就下訂的，但幾乎每個人都在猶豫時回來看過網站兩次以上。第一次看的是「這間建商可不可信」，第二次看的是「這個建案到底適不適合我家」。",
          "這代表網站不能只是一本線上型錄。它必須同時服務兩種完全不同的閱讀狀態——快速建立信任，以及深度比較細節。",
        ],
      },
      {
        label: "解法",
        title: "用「工法」當主角，而不是用「戶型」當主角",
        body: [
          "我們把首頁的主軸從建案列表改成建築工法的敘事：從地基、結構、選材到交屋檢核，每一段都配上實際工地的照片與可查證的數據。信任不是靠形容詞堆出來的，是靠細節。",
          "建案頁則重新設計成可比較的結構：格局、坪數、公設比、周邊機能全部拉齊到同一個表格框架，讓買方能在兩個建案間左右對照。同時把賞屋預約做成隨頁面捲動的常駐按鈕，任何時候想約都不用回到最上面找。",
          "後台改用 Sanity CMS，業主的行銷同仁可以自己上架新建案、更新銷售狀態，不用再每次都發信給廠商。",
        ],
      },
      {
        label: "成果",
        title: "上線三個月，預約賞屋成長 3.4 倍",
        body: [
          "新站上線後三個月，賞屋預約表單的送出數是舊站的 3.4 倍，跳出率從 71% 降到 30%。更關鍵的是現場業務回報：「現在來的客人問的問題不一樣了，他們已經先看過工法那頁。」",
          "網站真正的價值不在於它自己成交了多少，而在於它把每一次面對面的談話，都往前推進了一大步。",
        ],
      },
    ],
    testimonial: {
      quote:
        "以前網站對我們來說是一個必須要有的東西，現在它是業務團隊每天都會用到的工具。",
      author: "陳建志",
      role: "京硯建設 行銷部經理",
    },
    gallery: [
      {
        src: "/projects/jingyan-cover.svg",
        alt: "京硯建設官網首頁設計",
        caption: "首頁以建築工法敘事開場，取代傳統的建案輪播。",
        wide: true,
      },
      {
        src: "/projects/jingyan-01.svg",
        alt: "京硯建設建案介紹頁",
        caption: "建案頁採用統一的比較框架，方便買方橫向對照。",
      },
      {
        src: "/projects/jingyan-02.svg",
        alt: "京硯建設工法說明頁",
        caption: "工法專頁搭配實際工地紀錄與可查證數據。",
      },
      {
        src: "/projects/jingyan-03.svg",
        alt: "京硯建設手機版介面",
        caption: "手機版保留常駐的賞屋預約入口，隨時可以行動。",
        wide: true,
      },
    ],
    featured: true,
  },
  {
    slug: "nu-kitchen",
    title: "Nū Kitchen",
    subtitle: "餐飲品牌形象網站",
    client: "Nū Kitchen 蔬食餐酒館",
    category: "品牌官網",
    year: "2025",
    accent: "#C4571F",
    excerpt:
      "一間蔬食餐酒館的線上門面，把「不吃肉也可以很盡興」這件事說得理直氣壯。",
    cover: "/projects/nu-cover.svg",
    services: ["品牌視覺", "網站設計", "攝影指導", "訂位串接"],
    stack: ["Next.js", "Tailwind CSS", "inline 訂位系統", "Instagram API"],
    results: [
      { value: "+186%", label: "線上訂位量" },
      { value: "2.8k", label: "月均自然流量" },
      { value: "4.9", label: "Google 評分" },
    ],
    story: [
      {
        label: "背景",
        title: "被誤會成「健康餐廳」的餐酒館",
        body: [
          "Nū Kitchen 是一間蔬食餐酒館，主廚做的是紮實的地中海料理，配酒單也認真。但開幕半年，訂位一直上不來，來的客人多半是「陪素食朋友來的」。",
          "我們把他們的 Google 評論全部讀完，發現一個明顯的落差：吃過的人給 4.9 分，形容詞是「驚豔」「不敢相信是蔬食」；但還沒吃過的人，在網路上看到的資訊只有「蔬食」兩個字。品牌被自己的分類綁架了。",
        ],
      },
      {
        label: "挑戰",
        title: "要賣的是體驗，不是食材",
        body: [
          "餐飲網站最常見的失誤是把菜單當成主角——一長串品項、密密麻麻的價格。但客人選餐廳時想知道的其實是：這是一個什麼樣的晚上？我會和誰一起來？氣氛是熱鬧還是安靜？",
          "另一個現實限制是預算。業主無法負擔一次完整的商業攝影，我們必須用有限的素材做出高質感。",
        ],
      },
      {
        label: "解法",
        title: "把首頁做成一個晚上的時間軸",
        body: [
          "我們捨棄了傳統的「關於我們／菜單／訂位」結構，把首頁重新設計成一段從傍晚六點到深夜的敘事：入座的第一杯調酒、上菜的節奏、燈光轉暗後的氣氛。菜單被拆散嵌進這條時間軸裡，每道菜都出現在它該出現的時刻。",
          "攝影的部分，我們沒有另外找攝影師，而是替業主寫了一份拍攝指南——固定的三個機位、統一的色溫、每週固定時段補拍。三個月後素材量足夠支撐整站，成本只有商業攝影的十分之一。",
          "訂位則直接嵌進頁面，不跳轉外部系統。任何一個滑動位置都能直接選日期、選人數，減少中途流失。",
        ],
      },
      {
        label: "成果",
        title: "線上訂位成長 186%，客群結構改變了",
        body: [
          "上線後半年，線上訂位量成長 186%。但業主最在意的其實是另一個數字：主動說「我是被網站吸引來的」的客人裡，有超過六成不是素食者。",
          "品牌終於不是被食材定義，而是被體驗定義。",
        ],
      },
    ],
    testimonial: {
      quote:
        "他們沒有把我們的餐廳拍得更漂亮，而是幫我們找到了正確的說法。這比修圖有用太多。",
      author: "林郁婷",
      role: "Nū Kitchen 共同創辦人",
    },
    gallery: [
      {
        src: "/projects/nu-cover.svg",
        alt: "Nū Kitchen 首頁設計",
        caption: "首頁以「一個晚上」的時間軸展開，菜單嵌在敘事之中。",
        wide: true,
      },
      {
        src: "/projects/nu-01.svg",
        alt: "Nū Kitchen 菜單頁面",
        caption: "菜色以情境分組，而非傳統的分類列表。",
      },
      {
        src: "/projects/nu-02.svg",
        alt: "Nū Kitchen 手機版",
        caption: "手機版是主要流量來源，訂位入口全程可見。",
      },
      {
        src: "/projects/nu-03.svg",
        alt: "Nū Kitchen 訂位介面",
        caption: "完整版面中訂位入口始終可見，不跳轉外部系統。",
        wide: true,
      },
    ],
    featured: true,
  },
  {
    slug: "hengxing-bio",
    title: "恆星生技",
    subtitle: "企業形象與投資人網站",
    client: "恆星生物科技",
    category: "企業形象",
    year: "2024",
    accent: "#1E6F8E",
    excerpt:
      "把艱澀的新藥研發流程，做成連非專業投資人都能讀懂的一頁式敘事。",
    cover: "/projects/hengxing-cover.svg",
    services: ["資訊架構", "資訊設計", "網站設計", "多語系"],
    stack: ["Next.js", "MDX", "i18n", "Cloudflare"],
    results: [
      { value: "+240%", label: "投資人專區停留時間" },
      { value: "3", label: "語系同步上線" },
      { value: "AA", label: "無障礙檢測等級" },
    ],
    story: [
      {
        label: "背景",
        title: "一間準備上興櫃的生技公司，需要被看懂",
        body: [
          "恆星生技準備申請興櫃，需要一個能同時服務三種讀者的網站：專業投資人、潛在合作藥廠，以及媒體記者。這三種人的專業程度天差地遠，但他們會看的是同一個網站。",
          "原本的網站是典型的生技公司做法——大量的專有名詞、看不懂的分子結構圖、以及一份長達 40 頁的 PDF。",
        ],
      },
      {
        label: "挑戰",
        title: "資訊要夠深，但入口必須夠淺",
        body: [
          "我們不能為了讓外行看懂而簡化到失真——專業投資人一眼就會看出破綻，那反而傷害信任。但也不能維持原樣，因為多數第一次接觸的人會直接離開。",
          "還有一個技術挑戰：內容必須同時維護中、英、日三個語系，且法規要求財務資訊更新後所有語系必須同步。",
        ],
      },
      {
        label: "解法",
        title: "分層式敘事：每個段落都有兩層深度",
        body: [
          "我們設計了一套「分層閱讀」的結構。每個研發管線都先用一句白話說明它要解決什麼病、目前走到哪一期；想深入的人可以展開，看到完整的臨床數據、試驗編號與論文引用。同一個頁面，兩種讀法。",
          "研發流程則做成一條可互動的時間軸，把「臨床前 → I 期 → II 期 → III 期」視覺化成明確的進度條，讓不熟悉新藥開發的人也能一眼看出公司走到哪裡。",
          "多語系採用 MDX + i18n 架構，內容與版型分離，行政同仁在同一個介面填三種語言，發布時一次同步，不會出現某一版忘記更新的狀況。",
        ],
      },
      {
        label: "成果",
        title: "投資人專區停留時間成長 240%",
        body: [
          "新站上線後，投資人專區的平均停留時間從 48 秒增加到 2 分 44 秒。法說會後的媒體報導中，有多篇直接引用了網站上的研發管線圖表。",
          "公司發言人給了我們一個很具體的回饋：「以前記者會打電話來問我們的產品是做什麼的，現在他們打來問下一期什麼時候。」",
        ],
      },
    ],
    testimonial: {
      quote:
        "最難的是把專業講得簡單又不失真，他們做到了，而且沒有一個字是我們需要回頭修正的。",
      author: "黃書維",
      role: "恆星生技 投資人關係主管",
    },
    gallery: [
      {
        src: "/projects/hengxing-cover.svg",
        alt: "恆星生技官網首頁",
        caption: "首頁以研發管線進度為主軸，取代空泛的企業標語。",
        wide: true,
      },
      {
        src: "/projects/hengxing-01.svg",
        alt: "恆星生技研發管線頁",
        caption: "分層式敘事：先看懂，再深入。",
      },
      {
        src: "/projects/hengxing-02.svg",
        alt: "恆星生技投資人專區",
        caption: "投資人專區整合財報、法說與重大訊息。",
      },
      {
        src: "/projects/hengxing-03.svg",
        alt: "恆星生技多語系介面",
        caption: "中英日三語系共用同一套版型與發布流程。",
        wide: true,
      },
    ],
    featured: true,
  },
  {
    slug: "weave-store",
    title: "WEAVE",
    subtitle: "選物電商改版",
    client: "WEAVE 生活選物",
    category: "電子商務",
    year: "2024",
    accent: "#8E2A5C",
    excerpt: "重寫購物動線，把「逛很久但不結帳」的老問題，變成 +42% 的轉換率。",
    cover: "/projects/weave-cover.svg",
    services: ["UX 研究", "電商設計", "前端開發", "轉換優化"],
    stack: ["Shopify Hydrogen", "React", "GA4", "Klaviyo"],
    results: [
      { value: "+42%", label: "結帳轉換率" },
      { value: "-31%", label: "購物車放棄率" },
      { value: "+18%", label: "客單價" },
    ],
    story: [
      {
        label: "背景",
        title: "流量不缺，但錢流不進來",
        body: [
          "WEAVE 是一個做得不錯的生活選物品牌，Instagram 有穩定的社群，每個月自然流量也有一定規模。問題出在最後一哩：加入購物車的人很多，真正付款的很少。",
          "業主一開始的假設是「價格太高」。我們花了兩週看數據與側錄使用者操作，發現真正的原因完全不同。",
        ],
      },
      {
        label: "挑戰",
        title: "問題不在價格，在資訊出現的時機",
        body: [
          "側錄了 20 位真實使用者後，我們看到一個重複出現的行為：使用者在結帳頁看到運費後就離開了。運費本身不算貴，但因為它到最後一步才出現，讓人產生「被隱藏了什麼」的感覺。",
          "第二個問題是尺寸與材質資訊藏在商品頁最下方的摺疊區塊裡。使用者在猶豫時找不到答案，就會先關掉頁面「之後再說」——然後就沒有之後了。",
        ],
      },
      {
        label: "解法",
        title: "把所有壞消息提前講完",
        body: [
          "我們做的第一件事，是把運費、預計到貨日與退換貨政策全部搬到商品頁的購買區塊旁邊。看起來像是在勸退，實際上是在建立信任——當使用者知道沒有隱藏成本，決策反而更快。",
          "第二，重新設計商品頁的資訊層級：尺寸表、材質、保養方式從摺疊改為並排的標籤頁，永遠是展開的第一屏可見。同時加入真實的尺寸對照照片，減少「這到底多大」的不確定感。",
          "第三，結帳流程從四步縮短成兩步，並支援不註冊直接結帳。註冊改成在付款完成後才邀請，那時使用者的意願最高。",
        ],
      },
      {
        label: "成果",
        title: "轉換率 +42%，客單價也一起上來了",
        body: [
          "改版後兩個月，結帳轉換率成長 42%，購物車放棄率下降 31%。意外的收穫是客單價成長 18%——當使用者不再擔心運費，反而更願意一次多買幾件湊免運。",
          "這個專案讓我們更確信一件事：電商的轉換問題，八成不是設計不夠漂亮，而是資訊出現在錯的時間。",
        ],
      },
    ],
    testimonial: {
      quote:
        "他們沒有叫我們降價，而是讓我們看懂客人為什麼走。這份研究報告我們到現在還在用。",
      author: "蘇怡安",
      role: "WEAVE 品牌主理人",
    },
    gallery: [
      {
        src: "/projects/weave-cover.svg",
        alt: "WEAVE 電商首頁",
        caption: "首頁改以情境選物為主軸，降低選擇成本。",
        wide: true,
      },
      {
        src: "/projects/weave-01.svg",
        alt: "WEAVE 商品列表頁",
        caption: "列表頁加入尺寸與庫存的即時提示。",
      },
      {
        src: "/projects/weave-02.svg",
        alt: "WEAVE 商品詳情頁",
        caption: "運費與到貨日提前到購買區塊旁，不留意外。",
      },
      {
        src: "/projects/weave-03.svg",
        alt: "WEAVE 手機結帳流程",
        caption: "結帳從四步縮短為兩步，支援免註冊結帳。",
        wide: true,
      },
    ],
    featured: true,
  },
  {
    slug: "senye-camping",
    title: "森野露營",
    subtitle: "營位訂位系統",
    client: "森野山林露營區",
    category: "網頁系統",
    year: "2023",
    accent: "#4A6B32",
    excerpt: "把每週 20 小時的電話與訊息訂位，變成一套自己會運作的系統。",
    cover: "/projects/senye-cover.svg",
    services: ["流程分析", "系統設計", "全端開發", "後台建置"],
    stack: ["Next.js", "PostgreSQL", "Prisma", "綠界金流"],
    results: [
      { value: "20hr", label: "每週節省工時" },
      { value: "-92%", label: "重複訂位錯誤" },
      { value: "76%", label: "線上訂位佔比" },
    ],
    story: [
      {
        label: "背景",
        title: "一本用了八年的紙本訂位簿",
        body: [
          "森野露營區有 42 個營位，訂位方式是打電話或傳 LINE，老闆娘用一本紙本簿子記錄。旺季時她一天要接超過 60 通電話，晚上還要花兩小時把 LINE 訊息整理進簿子。",
          "更麻煩的是重複訂位。一年至少會發生四五次同一個營位賣給兩組人的狀況，只能現場道歉、退費、賠罪。",
        ],
      },
      {
        label: "挑戰",
        title: "系統要能被一個不熟電腦的人用起來",
        body: [
          "技術上這不是困難的專案，真正的挑戰是導入。老闆娘六十多歲，對電腦不熟；如果系統做得太複雜，最後的結果就是「還是用簿子比較快」，專案等於失敗。",
          "另一個限制是營位的規則很細：不同營位可容納的帳數不同、雨棚區與草地區的價格不同、連假有最低入住天數、還有熟客的口頭優惠。這些規則過去都在老闆娘腦子裡。",
        ],
      },
      {
        label: "解法",
        title: "先把腦子裡的規則寫下來，再寫程式",
        body: [
          "我們花了整整三天待在營區，坐在櫃檯旁邊聽她怎麼接電話、怎麼判斷能不能訂。把所有規則一條一條寫成清單，總共 34 條。這份清單後來成為整個系統的規格書。",
          "介面設計刻意做得很像她原本的紙本簿子——一張橫向的月曆，每一列是一個營位，每一格是一天，滿了就變色。她第一次看到就說「這個我看得懂」。",
          "前台則讓客人自己選日期、看即時空位、線上付訂金。系統自動鎖位，從結構上消除重複訂位的可能。後台保留手動開單功能，讓她還是能接電話訂位——不強迫改變習慣，是導入成功的關鍵。",
        ],
      },
      {
        label: "成果",
        title: "上線一年，76% 的訂位不需要人接手",
        body: [
          "系統上線一年後，76% 的訂位是客人自己在線上完成的。重複訂位從一年四五次降到零。老闆娘每週省下大約 20 小時，她說現在晚上終於可以正常吃飯。",
          "去年年底她主動打電話來，說想再加一個「營位設備租借」的功能。對我們來說，那通電話比任何數據都更能證明這個系統成功了。",
        ],
      },
    ],
    testimonial: {
      quote:
        "他們沒有教我用電腦，是把電腦改成我看得懂的樣子。這個差別很大。",
      author: "李美惠",
      role: "森野山林露營區 負責人",
    },
    gallery: [
      {
        src: "/projects/senye-cover.svg",
        alt: "森野露營訂位首頁",
        caption: "前台首頁以即時空位月曆開場，不必再打電話問。",
        wide: true,
      },
      {
        src: "/projects/senye-01.svg",
        alt: "森野露營後台管理介面",
        caption: "後台刻意設計成紙本簿子的樣子，降低學習成本。",
      },
      {
        src: "/projects/senye-02.svg",
        alt: "森野露營手機訂位流程",
        caption: "手機訂位三步完成，含線上付訂金。",
      },
      {
        src: "/projects/senye-03.svg",
        alt: "森野露營營位介紹頁",
        caption: "每個營位有獨立說明，減少現場落差。",
        wide: true,
      },
    ],
  },
  {
    slug: "meridian-advisory",
    title: "Meridian Advisory",
    subtitle: "金融顧問品牌網站",
    client: "Meridian 財富管理顧問",
    category: "企業形象",
    year: "2023",
    accent: "#2C3A63",
    excerpt: "在一個充滿話術的產業裡，用克制的設計證明「我們不打算說服你」。",
    cover: "/projects/meridian-cover.svg",
    services: ["品牌定位", "內容策略", "網站設計", "前端開發"],
    stack: ["Astro", "TypeScript", "Contentful", "Netlify"],
    results: [
      { value: "+95%", label: "諮詢預約成長" },
      { value: "6:12", label: "平均閱讀時間" },
      { value: "100", label: "Lighthouse 效能分數" },
    ],
    story: [
      {
        label: "背景",
        title: "一個所有同業都長得一樣的產業",
        body: [
          "我們把台灣三十間財富管理顧問公司的網站全部看過一遍，結果是驚人的一致：藍色漸層、握手照片、上升的箭頭、以及「您值得信賴的財富夥伴」這類的標語。",
          "Meridian 的創辦人來找我們時說：「我們最大的問題不是沒有特色，是所有人看起來都一樣，客戶根本無從選起。」",
        ],
      },
      {
        label: "挑戰",
        title: "信任無法用視覺堆出來",
        body: [
          "金融服務的購買決策週期非常長，而且高度依賴信任。但信任這件事，恰恰是最無法用設計手法偽造的——越是用力表現「我很專業」，看起來越可疑。",
          "另一個限制是法規。金融相關內容有嚴格的揭露與用詞規範，很多有力的表達方式在合規上不可行。",
        ],
      },
      {
        label: "解法",
        title: "把所有裝飾拿掉，只留下判斷依據",
        body: [
          "我們做了一個違反直覺的決定：整站不使用任何一張情境照片。沒有握手、沒有會議室、沒有微笑的顧問。取而代之的是排版、留白，與大量可驗證的資訊。",
          "首頁最重要的位置放的不是標語，而是收費方式的完整揭露——顧問費怎麼算、有沒有抽佣、利益衝突如何處理。這在這個產業幾乎沒有人願意放在首頁。",
          "內容策略上，我們協助建立了一個觀點專欄，每月兩篇，寫的是真實的市場判斷，包含判斷錯誤時的回顧。用時間累積可信度，而不是用形容詞。",
        ],
      },
      {
        label: "成果",
        title: "諮詢預約成長 95%，而且來的人不一樣",
        body: [
          "上線一年，諮詢預約成長 95%。平均閱讀時間 6 分 12 秒，對一個沒有影片、沒有動畫的網站來說是相當高的數字。",
          "創辦人說最明顯的改變是初次會談的品質：「以前要花半小時解釋我們的收費模式，現在客戶坐下來第一句話是『我看過你們的費用說明，我想談的是……』。」網站幫他們把不適合的客戶擋掉了，這比帶來更多客戶更有價值。",
        ],
      },
    ],
    testimonial: {
      quote:
        "他們建議我們把最敏感的收費資訊放首頁，當下我覺得瘋了。現在那是我們最強的競爭優勢。",
      author: "張哲維",
      role: "Meridian Advisory 創辦人",
    },
    gallery: [
      {
        src: "/projects/meridian-cover.svg",
        alt: "Meridian Advisory 首頁",
        caption: "全站不使用情境照片，以排版與留白建立專業感。",
        wide: true,
      },
      {
        src: "/projects/meridian-01.svg",
        alt: "Meridian 觀點專欄",
        caption: "觀點專欄以長文為主，用時間累積可信度。",
      },
      {
        src: "/projects/meridian-02.svg",
        alt: "Meridian 收費說明頁",
        caption: "收費結構完整揭露，放在首頁最重要的位置。",
      },
      {
        src: "/projects/meridian-03.svg",
        alt: "Meridian 服務介紹頁",
        caption: "服務說明強調流程與界線，而非承諾報酬。",
        wide: true,
      },
    ],
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const featuredProjects = projects.filter((p) => p.featured);

export const categories = Array.from(new Set(projects.map((p) => p.category)));
