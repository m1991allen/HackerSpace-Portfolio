# 明日設計所 — 形象暨作品集網站

以 Next.js 16（App Router）+ TypeScript + Tailwind CSS v4 建置的接案工作室形象網站。
公開頁面採 ISR（靜態＋自動更新），作品內容與聯絡訊息透過 Firebase 後台管理。

> 🛠 **想啟用後台（編輯作品）與聯絡表單收訊息？** 請看 **[SETUP.md](./SETUP.md)** 的一步步教學。
> 在完成設定前，網站仍可正常運作，作品會顯示 `src/data/projects.ts` 的預設資料。

## 快速開始

```bash
npm run dev     # 開發模式 → http://localhost:3000
npm run build   # 產生正式版
npm run start   # 以正式版啟動
npm run lint    # 程式碼檢查
```

> 需要 Node.js 20 以上（建議 22 LTS）。

## 頁面結構

| 網址 | 內容 |
| --- | --- |
| `/` | 首頁：Hero、數據、精選作品、服務項目、關於與合作流程、CTA |
| `/work` | 作品列表，含分類篩選 |
| `/work/[slug]` | 專案內頁：主視覺、專案資訊、成效數據、專案故事＋圖片、客戶回饋、下一個作品 |
| `/contact` | 聯絡管道（LINE／Email／電話）、需求表單、公司地址與營業時間 |

## 要改內容，只需要動這兩個檔案

### `src/data/site.ts` — 公司資料與聯絡資訊

**⚠️ 目前的 LINE ID、Email、電話、地址全部是示範用假資料，上線前務必替換。**

```ts
export const contact = {
  lineId: "@mingri-studio",              // ← 換成你的 LINE 官方帳號 ID
  lineUrl: "https://line.me/R/ti/p/...", // ← 換成加好友連結
  email: "hello@mingri.studio",
  phone: "02-2718-0000",
  phoneHref: "tel:+886227180000",        // ← 記得同步改
  address: { ... },                      // ← 公司地址
  hours: [ ... ],                        // ← 營業時間
};
```

同一個檔案還可以改：工作室名稱、標語、導覽選單、服務項目、數據、合作流程。
改完之後全站（含頁尾）會自動同步，不需要動任何頁面。

### `src/data/projects.ts` — 作品集

新增一個作品 = 在 `projects` 陣列加一個物件，首頁、作品列表與內頁網址 `/work/{slug}` 都會自動產生。

```ts
{
  slug: "your-project",       // 網址用，只能英數與連字號
  title: "專案名稱",
  subtitle: "副標",
  client: "客戶名稱",
  category: "品牌官網",        // 分類篩選會自動收錄新分類
  year: "2025",
  accent: "#1D5343",          // 專案主色，用於標籤、數據與內頁光暈
  excerpt: "一句話簡介",
  cover: "/projects/xxx.jpg", // 封面圖
  services: [...], stack: [...],
  results: [{ value: "3.4×", label: "表單成長" }],   // 內頁成效數據（建議 3 個）
  story: [{ label: "背景", title: "...", body: ["段落一", "段落二"] }],
  testimonial: { quote: "...", author: "...", role: "..." },  // 選填
  gallery: [{ src: "...", alt: "...", caption: "...", wide: true }],
  featured: true,             // 是否出現在首頁精選（建議維持 4 個）
}
```

**故事與圖片的搭配方式：** 內頁會在 `story` 的每一段之後，依序穿插一張 `gallery` 的圖。
`gallery[0]` 預設就是封面，會被用作頂部主視覺、不會重複出現在故事之間。
所以若有 4 段故事，建議準備 1 張封面 + 3～4 張內頁圖。

## 替換作品圖片

`public/projects/` 目前放的是 24 張 **SVG 示意圖**（抽象的網頁 mockup），
用來在還沒有真實截圖時撐起版面。

換成真實截圖時：

1. 把圖片（`.jpg` / `.png` / `.webp`）放進 `public/projects/`
2. 在 `src/data/projects.ts` 把 `cover` 與 `gallery[].src` 改成新檔名
3. 建議尺寸：**1600×1000（16:10）**，與示意圖一致，換上去不會跑版

首頁大卡為 16:10、列表卡為 4:3，都會自動裁切置中，不需要另外準備多種尺寸。

## 後台與聯絡表單

作品現在可以在 `/admin` 後台直接編輯（新增／修改／刪除、上傳圖片），
聯絡表單送出後會存進後台收件匣 `/admin/messages`，並可選擇性 Email 通知。
完整設定步驟見 **[SETUP.md](./SETUP.md)**。

- 資料層：`src/lib/`（`firebase-admin.ts`、`projects.ts`、`messages.ts`、`auth.ts`）
- 後台頁面：`src/app/admin/`
- API：`src/app/api/`（`contact`、`auth/session`、`admin/upload`）
- 一次性匯入既有作品：`npm run seed`

> `src/data/projects.ts` 仍保留，作為預設資料與匯入來源；設定 Firebase 前網站會顯示它。

`/contact` 的地圖仍是佔位用的向量示意圖，可改成 Google Maps 的 iframe 嵌入地圖。

## 設計系統

顏色與字體都定義在 `src/app/globals.css` 的 `@theme` 區塊，改一處全站生效：

- `--color-paper` 暖白底、`--color-ink` 墨黑字、`--color-accent` 磚橘重點色
- 標題使用 Noto Serif TC（`.display`），內文使用 Noto Sans TC
- `.shell` 為統一的容器寬度、`.eyebrow` 為小標籤、`.link-underline` 為底線動畫連結
- `<Reveal>` 元件負責捲動進場動畫，並支援「減少動態效果」的系統設定

## 部署

推到 GitHub 後接上 Vercel 即可，不需要任何環境變數。
或直接執行 `npm run build && npm run start` 自行架站。
