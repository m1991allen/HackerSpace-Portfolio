import { NextResponse } from "next/server";
import { createMessage } from "@/lib/messages";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { sendContactNotification } from "@/lib/mailer";

/**
 * 聯絡表單接收端點（公開）。
 * 1. 基本驗證 + 蜜罐防機器人
 * 2. 存進 Firestore（後台收件匣看得到）
 * 3. 若有設定寄信帳號，寄通知信給收件名單上的人
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

    // 寄信失敗不影響表單送出（訊息已存進後台收件匣）
    try {
      await sendContactNotification(data);
    } catch (err) {
      console.error("[api/contact] 通知信寄送失敗", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact] 處理失敗", err);
    return NextResponse.json(
      { error: "送出失敗，請稍後再試" },
      { status: 500 },
    );
  }
}
