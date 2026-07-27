import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import { getUnreadCount } from "@/lib/messages";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [projects, unread] = await Promise.all([
    getAllProjects(),
    getUnreadCount(),
  ]);

  const cards = [
    {
      href: "/admin/projects",
      label: "作品",
      value: `${projects.length} 件`,
      hint: "新增、編輯、刪除作品",
    },
    {
      href: "/admin/messages",
      label: "聯絡訊息",
      value: unread > 0 ? `${unread} 則未讀` : "沒有未讀",
      hint: "查看客戶來訊",
    },
  ];

  return (
    <div>
      <h1 className="display text-3xl text-ink">總覽</h1>
      <p className="mt-3 text-sm text-muted">歡迎回來，這裡可以管理網站內容。</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-line bg-paper-2 p-6 transition-colors hover:border-ink"
          >
            <p className="eyebrow">{c.label}</p>
            <p className="display mt-3 text-2xl text-ink">{c.value}</p>
            <p className="mt-2 text-sm text-muted">{c.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/admin/projects/new"
          className="inline-block rounded-full bg-ink px-6 py-3 text-sm text-paper transition-colors hover:bg-accent"
        >
          + 新增作品
        </Link>
      </div>
    </div>
  );
}
