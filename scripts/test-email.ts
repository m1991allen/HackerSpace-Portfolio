/**
 * 寄信測試腳本：確認 Gmail 寄信設定正確，不會寫入 Firestore。
 *
 * 執行方式（先在 .env.local 填好 GMAIL_USER、GMAIL_APP_PASSWORD）：
 *   npm run test:email
 *
 * 走的是正式表單同一支 sendContactNotification()，
 * 所以測得過就代表真的送表單時也寄得出去。
 */

import {
  getRecipients,
  isMailConfigured,
  sendContactNotification,
} from "../src/lib/mailer";

async function main() {
  if (!isMailConfigured()) {
    console.error(
      "\n❌ 缺少 GMAIL_USER 或 GMAIL_APP_PASSWORD，請參考 .env.local.example 設定。\n",
    );
    process.exit(1);
  }

  const to = getRecipients();
  if (to.length === 0) {
    console.error("\n❌ CONTACT_NOTIFY_EMAIL 沒有有效的收件地址。\n");
    process.exit(1);
  }

  console.log(
    `\n寄件人：${process.env.GMAIL_USER}\n收件人：${to.join("、")}\n寄送中…`,
  );

  await sendContactNotification({
    name: "測試訪客",
    email: "test@example.com",
    company: "測試公司",
    type: "測試用途",
    message: "這是一封測試信。收到代表寄信設定正常，可以刪掉了。",
  });

  console.log(
    `\n✅ 已送出，請到上面這 ${to.length} 個信箱收信（順便看一下垃圾信匣）。\n`,
  );
}

main().catch((err) => {
  console.error("\n❌ 寄送失敗：\n", err, "\n");
  process.exit(1);
});
