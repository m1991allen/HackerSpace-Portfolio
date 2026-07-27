import { NextResponse } from "next/server";
import { createMessage } from "@/lib/messages";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { site } from "@/data/site";

/**
 * 聯絡表單接收端點（公開）。
 * 1. 基本驗證 + 蜜罐防機器人
 * 2. 存進 Firestore（後台收件匣看得到）
 * 3. 若有設定 Resend，寄一封通知信到你的信箱
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      company,
      phone,
      type,
      budget,
      message,
      _gotcha, // 蜜罐：正常使用者不會填
    } = body ?? {};

    // 機器人多半會填到隱藏欄位，直接假裝成功、不處理
    if (_gotcha) return NextResponse.json({ ok: true });

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "請填寫姓名、Email 與需求內容" },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email 格式不正確" }, { status: 400 });
    }

    if (!isFirebaseConfigured()) {
      // 尚未接資料庫，至少不要讓使用者以為送出成功
      return NextResponse.json(
        { error: "表單尚未完成設定，請改用其他聯絡方式" },
        { status: 503 },
      );
    }

    const data = {
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      company: company ? String(company).slice(0, 200) : undefined,
      phone: phone ? String(phone).slice(0, 100) : undefined,
      type: type ? String(type).slice(0, 100) : undefined,
      budget: budget ? String(budget).slice(0, 100) : undefined,
      message: String(message).slice(0, 5000),
    };

    await createMessage(data);
    await sendNotification(data);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact] 處理失敗", err);
    return NextResponse.json(
      { error: "送出失敗，請稍後再試" },
      { status: 500 },
    );
  }
}

/** 用 Resend 寄送通知信，未設定則安靜略過（訊息仍已存進資料庫） */
async function sendNotification(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  type?: string;
  budget?: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
  if (!apiKey || !to) return;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const rows = [
      ["姓名", data.name],
      ["Email", data.email],
      ["公司 / 品牌", data.company],
      ["電話", data.phone],
      ["專案類型", data.type],
      ["預算範圍", data.budget],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#888">${k}</td><td>${escapeHtml(String(v))}</td></tr>`)
      .join("");

    await resend.emails.send({
      from: `${site.name} 網站 <${from}>`,
      to,
      replyTo: data.email,
      subject: `【網站來訊】${data.name}`,
      html: `
        <div style="font-family:sans-serif;line-height:1.7;color:#222">
          <h2 style="margin:0 0 16px">收到一則新的聯絡表單</h2>
          <table style="border-collapse:collapse;font-size:14px">${rows}</table>
          <p style="margin:20px 0 6px;color:#888;font-size:13px">需求內容</p>
          <div style="white-space:pre-wrap;font-size:14px;border-left:3px solid #eee;padding-left:12px">${escapeHtml(data.message)}</div>
        </div>
      `,
    });
  } catch (err) {
    // 寄信失敗不影響表單送出（訊息已存進後台）
    console.error("[api/contact] 通知信寄送失敗", err);
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
