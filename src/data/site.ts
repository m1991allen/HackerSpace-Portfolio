/**
 * 站台基本資料。所有聯絡資訊目前皆為「示範用假資料」，
 * 上線前請把這個檔案的內容換成真實資訊即可，不需改動其他頁面。
 */

export const site = {
  name: "明日設計所",
  nameEn: "MINGRI STUDIO",
  tagline: "把品牌的價值，變成看得見的網站。",
  description:
    "明日設計所是一間專注於品牌官網、電商與網頁系統的數位設計工作室。我們從商業目標出發，用設計與技術替品牌做出真正會轉換的網站。",
  url: "https://example.com",
  foundedYear: 2016,
} as const;

/** ⚠️ 以下皆為示範假資料，請自行替換 */
export const contact = {
  lineId: "@mingri-studio",
  lineUrl: "https://line.me/R/ti/p/@mingri-studio",
  email: "hello@mingri.studio",
  phone: "02-2718-0000",
  phoneHref: "tel:+886227180000",
  address: {
    full: "104 台北市中山區南京東路三段 219 號 8 樓",
    short: "台北市中山區南京東路三段 219 號 8 樓",
    zip: "104",
    city: "台北市",
    district: "中山區",
    street: "南京東路三段 219 號 8 樓",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=台北市中山區南京東路三段219號",
  },
  hours: [
    { day: "週一 – 週五", time: "10:00 – 19:00" },
    { day: "週六 – 週日", time: "預約制" },
  ],
} as const;

export const nav = [
  { label: "首頁", href: "/" },
  { label: "作品", href: "/work" },
  { label: "服務", href: "/#services" },
  { label: "關於", href: "/#about" },
  { label: "聯絡", href: "/contact" },
] as const;

export const services = [
  {
    no: "01",
    title: "品牌官網設計",
    desc: "從品牌定位、資訊架構到視覺設計，打造能清楚傳達價值、也讓客戶願意留下來的官方網站。",
    items: ["品牌形象網站", "資訊架構規劃", "UI / 視覺設計", "RWD 響應式"],
  },
  {
    no: "02",
    title: "電商與轉換優化",
    desc: "不只把商品放上去，而是重新設計購買動線，讓每一次瀏覽都更接近下單。",
    items: ["購物流程設計", "Shopify / 自建站", "金物流串接", "轉換率優化"],
  },
  {
    no: "03",
    title: "網頁系統開發",
    desc: "預約、會員、後台管理，把重複的營運工作交給系統，讓團隊專心在真正重要的事。",
    items: ["訂位 / 預約系統", "會員與後台", "API 串接", "效能與 SEO"],
  },
  {
    no: "04",
    title: "維運與成長",
    desc: "網站上線只是開始。我們持續追蹤數據、迭代內容，讓網站隨著品牌一起長大。",
    items: ["數據追蹤導入", "內容更新維護", "A/B 測試", "技術支援"],
  },
] as const;

export const stats = [
  { value: "120+", label: "完成專案" },
  { value: "9", label: "年產業經驗" },
  { value: "40+", label: "長期合作客戶" },
  { value: "98%", label: "專案準時交付" },
] as const;

export const process = [
  {
    step: "01",
    title: "了解與診斷",
    desc: "先聽你說。理解商業模式、客群與目前遇到的問題，找出網站真正該解決的事。",
  },
  {
    step: "02",
    title: "策略與架構",
    desc: "定義網站目標與成功指標，規劃資訊架構、頁面流程與內容框架。",
  },
  {
    step: "03",
    title: "設計與開發",
    desc: "視覺設計與前後端開發同步推進，每週回報進度，隨時能看到實際成果。",
  },
  {
    step: "04",
    title: "上線與優化",
    desc: "測試、上線、導入數據追蹤，並在上線後持續依成效調整。",
  },
] as const;
