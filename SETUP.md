# 後台與聯絡表單設定教學

這份文件帶你一步步把「作品後台」與「聯絡表單收訊息」設定起來。
全部完成大約需要 **20–30 分鐘**，不需要寫任何程式。

---

## 這次新增了什麼

| 功能 | 網址 | 說明 |
| --- | --- | --- |
| 後台登入 | `/admin/login` | 用 Email／密碼登入 |
| 作品管理 | `/admin/projects` | 新增、編輯、刪除作品，可上傳圖片 |
| 聯絡訊息收件匣 | `/admin/messages` | 看訪客送出的需求，標記已讀、回信 |
| 聯絡表單 | `/contact` | 送出後存進收件匣，並（選用）Email 通知你 |

作品資料改存在 **Firebase（Firestore）**，你在後台改完，網站會自動更新，不用重新部署。

> 💡 **在你完成下面設定前，網站仍可正常運作**：作品會顯示 `src/data/projects.ts` 裡的預設資料。設定完成並匯入後，就會改讀你在後台編輯的內容。

---

## 你需要做的事（總覽）

- [ ] 步驟 1：建立 Firebase 專案
- [ ] 步驟 2：開啟 Firestore 資料庫
- [ ] 步驟 3：開啟登入功能，建立你的管理員帳號
- [ ] 步驟 4：開啟 Storage（放圖片）
- [ ] 步驟 5：拿到兩組金鑰，填進 `.env.local`
- [ ] 步驟 6：設定安全性規則（複製貼上即可）
- [ ] 步驟 7：把現有作品匯入 Firebase
- [ ] 步驟 8：啟動、登入後台試用
- [ ] 步驟 9：（選用）設定 Email 通知
- [ ] 步驟 10：部署到 Vercel

---

## 步驟 1：建立 Firebase 專案

1. 到 <https://console.firebase.google.com>，用你的 Google 帳號登入。
2. 點「**建立專案 / Add project**」。
3. 專案名稱隨意（例如 `mingri-studio`），一路「繼續」。
4. Google Analytics 可以關掉（不需要），按「建立專案」。

---

## 步驟 2：開啟 Firestore 資料庫

1. 左側選單 → 「**建構 / Build**」→「**Firestore Database**」。
2. 點「**建立資料庫 / Create database**」。
3. 位置選離台灣近的，例如 `asia-east1`（台灣）或 `asia-northeast1`（東京）。
4. 模式先選「**以正式版模式啟動 / Start in production mode**」（規則我們稍後會設定）。
5. 建立完成。

---

## 步驟 3：開啟登入功能，建立管理員帳號

1. 左側選單 →「**建構 / Build**」→「**Authentication**」。
2. 點「**開始使用 / Get started**」。
3. 在「Sign-in method（登入方式）」裡，選「**電子郵件／密碼 / Email/Password**」，把它**啟用**，儲存。
4. 切到上方「**Users（使用者）**」分頁 →「**新增使用者 / Add user**」。
5. 輸入**你自己的 Email 和一組密碼**（這就是你登入後台要用的帳密），新增。

> 這個帳號就是你的後台管理員。日後想多開幾個管理員，回到這裡新增即可。

---

## 步驟 4：開啟 Storage（放作品圖片）

1. 左側選單 →「**建構 / Build**」→「**Storage**」。
2. 點「**開始使用 / Get started**」，位置用預設，一路確認。
3. 開好後，畫面最上方會看到一個名字，長得像 `gs://你的專案.appspot.com` 或
   `gs://你的專案.firebasestorage.app`。**把 `gs://` 後面那一串記下來**，等一下要用。

---

## 步驟 5：拿到兩組金鑰，填進 `.env.local`

先在專案根目錄把範本複製成正式檔案：

```bash
cp .env.local.example .env.local
```

然後打開 `.env.local`，依下面三小節把值填進去。

### 5-1　前端設定（3 個 `NEXT_PUBLIC_` 值）

1. Firebase 主控台左上角齒輪 →「**專案設定 / Project settings**」。
2. 往下捲到「**你的應用程式 / Your apps**」，點 **`</>`（Web）** 圖示新增一個網頁應用程式，名稱隨意，不用勾 Hosting，註冊。
3. 會出現一段 `const firebaseConfig = { ... }`，把對應的值填進 `.env.local`：

```
NEXT_PUBLIC_FIREBASE_API_KEY=            # 對應 apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=        # 對應 authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=         # 對應 projectId
```

### 5-2　後端金鑰（Service Account）

1. 一樣在「**專案設定**」→ 上方分頁「**服務帳戶 / Service accounts**」。
2. 點「**產生新的私密金鑰 / Generate new private key**」→ 確認，會下載一個 `.json` 檔到你電腦。
3. 把這個 JSON **轉成一行 base64 字串**（Mac 終端機）：

```bash
base64 -i ~/Downloads/你下載的金鑰檔.json | pbcopy
```

   這樣字串已複製到剪貼簿，回到 `.env.local` 貼在：

```
FIREBASE_SERVICE_ACCOUNT_KEY=<貼在這裡>
```

> ⚠️ 這個 JSON 是最高權限金鑰，**絕對不要**上傳到 GitHub。`.env.local` 已被 git 忽略，安全。

### 5-3　Storage 儲存桶

把步驟 4 記下的名字填進去：

```
FIREBASE_STORAGE_BUCKET=你的專案.appspot.com
```

（就是 `gs://` 後面那一串，不含 `gs://`）

---

## 步驟 6：設定安全性規則

專案裡已經幫你準備好兩個規則檔，直接複製貼上即可。

**Firestore 規則**：Firebase 主控台 → Firestore Database → 上方「**規則 / Rules**」分頁 →
把本專案 `firestore.rules` 的內容整段貼上 → 「發布 / Publish」。

**Storage 規則**：Storage → 「**規則 / Rules**」分頁 →
把本專案 `storage.rules` 的內容整段貼上 → 「發布 / Publish」。

> 這兩份規則把前端的直接存取全部關掉。因為所有讀寫都經由網站伺服器（用最高權限的 Admin SDK）完成，這樣最安全。

---

## 步驟 7：把現有作品匯入 Firebase

在專案根目錄執行：

```bash
npm run seed
```

看到 `✅ 完成！已匯入 6 筆作品。` 就成功了。這會把 `src/data/projects.ts` 的
6 筆作品搬進 Firestore，之後就以後台的內容為準。

---

## 步驟 8：啟動、登入後台試用

```bash
npm run dev
```

1. 打開 <http://localhost:3000/admin/login>
2. 用步驟 3 建立的 Email／密碼登入
3. 進到後台後：
   - **作品管理**：試著編輯一筆作品、上傳一張圖、按儲存，再回首頁看是否更新
   - **聯絡訊息**：先到 <http://localhost:3000/contact> 送出一筆測試表單，再回後台看有沒有收到

---

## 步驟 9：（選用）設定 Email 通知

想在有人送出表單時「即時收到一封通知信」，就設定 Resend：

1. 到 <https://resend.com> 註冊（免費，每月 3000 封）。
2. 左側「**API Keys**」→ 建立一組，複製。
3. 填進 `.env.local`：

```
RESEND_API_KEY=re_xxxxxxxx
CONTACT_NOTIFY_EMAIL=你要收通知的信箱@gmail.com
CONTACT_FROM_EMAIL=onboarding@resend.dev
```

> `CONTACT_FROM_EMAIL` 先用 `onboarding@resend.dev` 就能寄。
> 之後想用自己的網域當寄件人（例如 `hello@你的網域`），到 Resend 驗證網域後再改。
>
> 沒設定 Resend 也沒關係——訊息仍然會存進後台收件匣，只是不會多寄一封通知信。

---

## 步驟 10：部署到 Vercel

1. 把程式碼推上 GitHub。
2. 到 <https://vercel.com> 匯入這個 repo。
3. 在 Vercel 專案的「**Settings → Environment Variables**」把 `.env.local` 裡的**每一個變數**都加進去
   （名稱和值照抄；`FIREBASE_SERVICE_ACCOUNT_KEY` 就貼那串 base64）。
4. 部署。之後每次在後台改作品，網站會在幾分鐘內自動更新
   （若想立刻看到，重新整理該頁即可，系統會即時重建）。

> 本機的 `.env.local` **不會**被上傳，所以正式站的環境變數一定要在 Vercel 這邊另外填一次。

---

## 日常怎麼操作

- **新增作品**：後台 →「作品管理」→「+ 新增作品」→ 填完按儲存。
- **改作品**：作品列表點「編輯」。「網址代稱 slug」就是網址 `/work/xxx` 的 `xxx`，只能用小寫英文、數字、連字號。
- **上傳圖片**：每個圖片欄位都可以「上傳圖片」，或直接貼一個現成的圖片網址。建議尺寸 1600×1000。
- **看訊息**：後台 →「聯絡訊息」。未讀會標紅點；可以標記已讀、直接回信、或刪除。

---

## 疑難排解

| 狀況 | 可能原因 / 解法 |
| --- | --- |
| 登入頁顯示「尚未設定 Firebase 前端環境變數」 | `.env.local` 的 3 個 `NEXT_PUBLIC_` 沒填，或改完沒重啟 `npm run dev` |
| 登入時說「登入失敗」 | 帳密錯誤，或步驟 3 沒啟用 Email/Password 登入方式 |
| 後台顯示「尚未完成設定」 | `FIREBASE_SERVICE_ACCOUNT_KEY` 沒填或格式錯 |
| `npm run seed` 失敗 | 多半是 `FIREBASE_SERVICE_ACCOUNT_KEY` 沒填好；確認是「一整行」base64 |
| 圖片上傳失敗 | 確認步驟 4 有開 Storage，且 `FIREBASE_STORAGE_BUCKET` 填對 |
| 上傳的圖片在網站上顯示不出來 | 已在 `next.config.ts` 允許 Firebase 網域；若仍不行，重啟 dev 伺服器 |
| 沒收到通知信 | Resend 未設定屬正常；訊息仍在後台收件匣，可放心 |

有任何一步卡住，把畫面訊息貼給我，我幫你看。
