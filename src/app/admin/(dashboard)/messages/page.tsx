import { getAllMessages } from "@/lib/messages";
import MessageItem from "./message-item";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await getAllMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="display text-3xl text-ink">聯絡訊息</h1>
        {unread > 0 && (
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-paper">
            {unread} 未讀
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-muted">
        訪客透過聯絡表單送出的需求都會出現在這裡。
      </p>

      <div className="mt-8 space-y-3">
        {messages.length === 0 && (
          <p className="rounded-2xl border border-line px-6 py-10 text-center text-sm text-muted">
            目前還沒有任何訊息。
          </p>
        )}
        {messages.map((m) => (
          <MessageItem key={m.id} msg={m} />
        ))}
      </div>
    </div>
  );
}
