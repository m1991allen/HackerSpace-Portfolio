"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ContactMessage } from "@/lib/messages";
import { markReadAction, deleteMessageAction } from "./actions";

export default function MessageItem({ msg }: { msg: ContactMessage }) {
  const router = useRouter();
  const [open, setOpen] = useState(!msg.read);
  const [pending, startTransition] = useTransition();

  const fields = [
    ["Email", msg.email],
    ["公司 / 品牌", msg.company],
    ["電話", msg.phone],
    ["專案類型", msg.type],
    ["預算範圍", msg.budget],
  ].filter(([, v]) => v);

  function toggleRead() {
    startTransition(async () => {
      await markReadAction(msg.id, !msg.read);
      router.refresh();
    });
  }

  function remove() {
    if (!confirm("確定要刪除這則訊息嗎？")) return;
    startTransition(async () => {
      await deleteMessageAction(msg.id);
      router.refresh();
    });
  }

  const date = new Date(msg.createdAt).toLocaleString("zh-TW", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div
      className={`rounded-2xl border p-5 transition-colors ${
        msg.read ? "border-line bg-paper" : "border-ink/20 bg-paper-2"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 text-left"
      >
        {!msg.read && (
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
        )}
        <span className="text-sm font-medium text-ink">{msg.name}</span>
        <span className="truncate text-xs text-muted">{msg.email}</span>
        <span className="ml-auto shrink-0 text-xs text-muted">{date}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-4 border-t border-line pt-4">
          <table className="text-sm">
            <tbody>
              {fields.map(([k, v]) => (
                <tr key={k}>
                  <td className="py-1 pr-4 align-top text-muted">{k}</td>
                  <td className="py-1 text-ink">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <p className="text-xs text-muted">需求內容</p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {msg.message}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-1 text-sm">
            <a
              href={`mailto:${msg.email}`}
              className="rounded-full bg-ink px-4 py-2 text-xs text-paper transition-colors hover:bg-accent"
            >
              回信
            </a>
            <button
              type="button"
              onClick={toggleRead}
              disabled={pending}
              className="text-xs text-ink-2 transition-colors hover:text-ink disabled:opacity-40"
            >
              標記為{msg.read ? "未讀" : "已讀"}
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="text-xs text-muted transition-colors hover:text-accent disabled:opacity-40"
            >
              刪除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
