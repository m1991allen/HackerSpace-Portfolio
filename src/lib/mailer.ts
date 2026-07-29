import { site } from "@/data/site";

/**
 * 寄信（伺服器端）。
 *
 * 用你自己的 Gmail 帳號透過 SMTP 寄出，不需要註冊第三方寄信服務。
 * 設定方式見 .env.local.example 的「Email 通知」段落。
 *
 * 收件人可以填多個（用逗號分隔），之後要改成從 Firestore 讀取
 * 通知名單，只要改 getRecipients() 一個函式即可。
 */

export type ContactNotification = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  type?: string;
  budget?: string;
  message: string;
};

/** 有沒有設定好寄信所需的帳密 */
export function isMailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

/** 通知信要寄給誰。未設定時退回寄給自己，至少不會漏信 */
export function getRecipients(): string[] {
  const raw = process.env.CONTACT_NOTIFY_EMAIL ?? process.env.GMAIL_USER ?? "";
  return raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 建立 Gmail SMTP 連線。動態載入 nodemailer，沒用到寄信的頁面就不會載入 */
async function createTransport() {
  const { createTransport } = await import("nodemailer");
  return createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      // Google 帳戶 → 兩步驟驗證 → 應用程式密碼（16 碼）
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

/**
 * 寄出聯絡表單通知信。
 * 回傳是否真的寄出（未設定帳密時回傳 false，呼叫端自行決定要不要在意）。
 */
export async function sendContactNotification(
  data: ContactNotification,
): Promise<boolean> {
  if (!isMailConfigured()) return false;

  const to = getRecipients();
  if (to.length === 0) return false;

  const transport = await createTransport();
  await transport.sendMail({
    // Gmail SMTP 只允許用自己的帳號當寄件地址，這裡只能改顯示名稱
    from: `${site.name} 網站 <${process.env.GMAIL_USER}>`,
    to,
    // 直接按回覆就是回給填表單的人
    replyTo: data.email,
    subject: `【網站來訊】${data.name}`,
    html: renderContactHtml(data),
  });
  return true;
}

/** 通知信內容 */
function renderContactHtml(data: ContactNotification): string {
  const rows = [
    ["姓名", data.name],
    ["Email", data.email],
    ["公司 / 品牌", data.company],
    ["電話", data.phone],
    ["專案類型", data.type],
    ["預算範圍", data.budget],
  ]
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#888">${k}</td><td>${escapeHtml(String(v))}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:sans-serif;line-height:1.7;color:#222">
      <h2 style="margin:0 0 16px">收到一則新的聯絡表單</h2>
      <table style="border-collapse:collapse;font-size:14px">${rows}</table>
      <p style="margin:20px 0 6px;color:#888;font-size:13px">需求內容</p>
      <div style="white-space:pre-wrap;font-size:14px;border-left:3px solid #eee;padding-left:12px">${escapeHtml(data.message)}</div>
    </div>
  `;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
