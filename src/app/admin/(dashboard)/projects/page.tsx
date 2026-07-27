import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import DeleteProjectButton from "./delete-project-button";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="display text-3xl text-ink">作品管理</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-accent"
        >
          + 新增作品
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {projects.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-muted">
            還沒有任何作品，點右上角「新增作品」開始。
          </p>
        )}
        {projects.map((p, i) => (
          <div
            key={p.slug}
            className={`flex items-center gap-4 px-5 py-4 ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-ink">{p.title}</span>
                {p.featured && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.6875rem] text-accent">
                    精選
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-xs text-muted">
                {p.category} · {p.year} · /work/{p.slug}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link
                href={`/admin/projects/${p.slug}/edit`}
                className="text-ink-2 transition-colors hover:text-ink"
              >
                編輯
              </Link>
              <DeleteProjectButton slug={p.slug} title={p.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
