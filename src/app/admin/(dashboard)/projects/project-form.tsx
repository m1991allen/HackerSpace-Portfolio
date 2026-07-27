"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/data/projects";
import { saveProjectAction } from "./actions";
import ImageUpload from "./image-upload";

const EMPTY: Project = {
  slug: "",
  title: "",
  subtitle: "",
  client: "",
  category: "",
  year: new Date().getFullYear().toString(),
  accent: "#1D5343",
  excerpt: "",
  cover: "",
  services: [],
  stack: [],
  results: [],
  story: [],
  gallery: [],
  testimonial: undefined,
  featured: false,
};

export default function ProjectForm({
  initial,
  originalSlug,
}: {
  initial?: Project;
  originalSlug: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [p, setP] = useState<Project>(initial ?? EMPTY);

  // 局部更新輔助
  const set = <K extends keyof Project>(key: K, val: Project[K]) =>
    setP((prev) => ({ ...prev, [key]: val }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // 送出前清理：移除空白項目、空段落，並修剪字串
    const t = p.testimonial;
    const noBlank = (arr: string[]) =>
      arr.map((s) => s.trim()).filter(Boolean);
    const cleaned: Project = {
      ...p,
      slug: p.slug.trim(),
      services: noBlank(p.services),
      stack: noBlank(p.stack),
      results: p.results.filter((r) => r.value.trim() || r.label.trim()),
      story: p.story
        .filter((s) => s.title.trim() || s.body.some((b) => b.trim()))
        .map((s) => ({ ...s, body: noBlank(s.body) })),
      gallery: p.gallery.filter((g) => g.src.trim()),
      testimonial:
        t && (t.quote || t.author || t.role) ? t : undefined,
    };

    startTransition(async () => {
      const res = await saveProjectAction(originalSlug, JSON.stringify(cleaned));
      if (res.ok) {
        router.push("/admin/projects");
        router.refresh();
      } else {
        setError(res.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-10 pb-20">
      <div className="flex items-center justify-between gap-4">
        <h1 className="display text-3xl text-ink">
          {originalSlug ? "編輯作品" : "新增作品"}
        </h1>
      </div>

      {error && (
        <p className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent">
          {error}
        </p>
      )}

      {/* ── 基本資訊 ─────────────────────────── */}
      <Section title="基本資訊">
        <div className="grid gap-5 sm:grid-cols-2">
          <Text
            label="作品標題"
            value={p.title}
            onChange={(v) => set("title", v)}
            required
          />
          <Text
            label="副標題"
            value={p.subtitle}
            onChange={(v) => set("subtitle", v)}
          />
          <Text
            label="網址代稱 slug（小寫英數與 -）"
            value={p.slug}
            onChange={(v) => set("slug", v)}
            placeholder="my-project"
            required
          />
          <Text
            label="客戶名稱"
            value={p.client}
            onChange={(v) => set("client", v)}
          />
          <Text
            label="分類"
            value={p.category}
            onChange={(v) => set("category", v)}
            placeholder="品牌官網"
            required
          />
          <Text
            label="年份"
            value={p.year}
            onChange={(v) => set("year", v)}
            placeholder="2025"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
          <Text
            label="主色（hex 色碼，用於標籤與光暈）"
            value={p.accent}
            onChange={(v) => set("accent", v)}
            placeholder="#1D5343"
          />
          <div>
            <label className="block text-sm font-medium text-ink">預覽</label>
            <input
              type="color"
              value={p.accent}
              onChange={(e) => set("accent", e.target.value)}
              className="mt-2 h-11 w-16 cursor-pointer rounded-lg border border-line bg-paper"
            />
          </div>
        </div>

        <Textarea
          label="一句話簡介（首頁與列表用）"
          value={p.excerpt}
          onChange={(v) => set("excerpt", v)}
          rows={2}
        />

        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={!!p.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4"
          />
          設為首頁精選作品
        </label>
      </Section>

      {/* ── 封面 ─────────────────────────────── */}
      <Section title="封面圖片">
        <ImageUpload
          value={p.cover}
          onChange={(v) => set("cover", v)}
          label="封面（建議 1600×1000，也會當作內頁頂部主視覺）"
        />
      </Section>

      {/* ── 服務與技術 ───────────────────────── */}
      <Section title="服務項目與技術">
        <LinesField
          label="服務項目（每行一個）"
          value={p.services}
          onChange={(v) => set("services", v)}
          placeholder={"品牌策略\n網站設計\n前端開發"}
        />
        <LinesField
          label="使用技術（每行一個）"
          value={p.stack}
          onChange={(v) => set("stack", v)}
          placeholder={"Next.js\nTypeScript\nVercel"}
        />
      </Section>

      {/* ── 成效數據 ─────────────────────────── */}
      <Section title="成效數據（建議 3 個）">
        <RowsEditor
          rows={p.results}
          onChange={(v) => set("results", v)}
          empty={{ value: "", label: "" }}
          addLabel="+ 新增一項數據"
          render={(row, update) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <Text
                label="數值"
                value={row.value}
                onChange={(v) => update({ ...row, value: v })}
                placeholder="3.4×"
              />
              <Text
                label="說明"
                value={row.label}
                onChange={(v) => update({ ...row, label: v })}
                placeholder="表單成長"
              />
            </div>
          )}
        />
      </Section>

      {/* ── 專案故事 ─────────────────────────── */}
      <Section title="專案故事（依序呈現，每段後方會穿插一張圖片集的圖）">
        <RowsEditor
          rows={p.story}
          onChange={(v) => set("story", v)}
          empty={{ label: "", title: "", body: [] }}
          addLabel="+ 新增一段故事"
          render={(row, update) => (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
                <Text
                  label="小標籤"
                  value={row.label}
                  onChange={(v) => update({ ...row, label: v })}
                  placeholder="背景"
                />
                <Text
                  label="段落標題"
                  value={row.title}
                  onChange={(v) => update({ ...row, title: v })}
                />
              </div>
              <LinesField
                label="內文（每行一段）"
                value={row.body}
                onChange={(v) => update({ ...row, body: v })}
                rows={4}
              />
            </div>
          )}
        />
      </Section>

      {/* ── 圖片集 ───────────────────────────── */}
      <Section title="圖片集（第 1 張建議放封面；之後每張會穿插在故事段落之間）">
        <RowsEditor
          rows={p.gallery}
          onChange={(v) => set("gallery", v)}
          empty={{ src: "", alt: "", caption: "", wide: false }}
          addLabel="+ 新增一張圖片"
          render={(row, update) => (
            <div className="space-y-3">
              <ImageUpload
                value={row.src}
                onChange={(v) => update({ ...row, src: v })}
                label="圖片"
              />
              <Text
                label="替代文字 alt（無障礙與 SEO）"
                value={row.alt}
                onChange={(v) => update({ ...row, alt: v })}
              />
              <Text
                label="圖說（選填）"
                value={row.caption ?? ""}
                onChange={(v) => update({ ...row, caption: v })}
              />
              <label className="flex items-center gap-3 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={!!row.wide}
                  onChange={(e) => update({ ...row, wide: e.target.checked })}
                  className="h-4 w-4"
                />
                滿版寬幅顯示
              </label>
            </div>
          )}
        />
      </Section>

      {/* ── 客戶回饋 ─────────────────────────── */}
      <Section title="客戶回饋（選填）">
        <Textarea
          label="引言"
          value={p.testimonial?.quote ?? ""}
          onChange={(v) =>
            set("testimonial", { ...defaultTestimonial(p), quote: v })
          }
          rows={3}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Text
            label="姓名"
            value={p.testimonial?.author ?? ""}
            onChange={(v) =>
              set("testimonial", { ...defaultTestimonial(p), author: v })
            }
          />
          <Text
            label="職稱"
            value={p.testimonial?.role ?? ""}
            onChange={(v) =>
              set("testimonial", { ...defaultTestimonial(p), role: v })
            }
          />
        </div>
      </Section>

      {/* ── 送出 ─────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-8 py-3.5 text-sm text-paper transition-colors hover:bg-accent disabled:opacity-40"
        >
          {pending ? "儲存中…" : "儲存作品"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="text-sm text-muted transition-colors hover:text-ink"
        >
          取消
        </button>
      </div>
    </form>
  );
}

function defaultTestimonial(p: Project) {
  return p.testimonial ?? { quote: "", author: "", role: "" };
}

// ─────────────────────────────────────────────────────────────
// 共用小元件
// ─────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <h2 className="border-b border-line pb-2 text-sm font-medium text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Text({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-2 w-full resize-y rounded-lg border border-line bg-paper px-3 py-2.5 text-sm leading-relaxed text-ink focus:border-ink focus:outline-none"
      />
    </div>
  );
}

/** 每行一個項目的欄位，內部用 string[] */
function LinesField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">{label}</label>
      <textarea
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full resize-y rounded-lg border border-line bg-paper px-3 py-2.5 text-sm leading-relaxed text-ink focus:border-ink focus:outline-none"
      />
    </div>
  );
}

/** 可新增 / 刪除 / 排序的列表編輯器 */
function RowsEditor<T>({
  rows,
  onChange,
  empty,
  addLabel,
  render,
}: {
  rows: T[];
  onChange: (rows: T[]) => void;
  empty: T;
  addLabel: string;
  render: (row: T, update: (next: T) => void) => React.ReactNode;
}) {
  function update(index: number, next: T) {
    onChange(rows.map((r, i) => (i === index ? next : r)));
  }
  function remove(index: number) {
    onChange(rows.filter((_, i) => i !== index));
  }
  function move(index: number, dir: -1 | 1) {
    const to = index + dir;
    if (to < 0 || to >= rows.length) return;
    const copy = [...rows];
    [copy[index], copy[to]] = [copy[to]!, copy[index]!];
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <div
          key={i}
          className="rounded-xl border border-line bg-paper-2 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-muted">第 {i + 1} 項</span>
            <div className="flex items-center gap-2 text-xs text-muted">
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="rounded px-1.5 py-0.5 transition-colors hover:text-ink"
                aria-label="上移"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                className="rounded px-1.5 py-0.5 transition-colors hover:text-ink"
                aria-label="下移"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded px-1.5 py-0.5 transition-colors hover:text-accent"
              >
                刪除
              </button>
            </div>
          </div>
          {render(row, (next) => update(i, next))}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, structuredClone(empty)])}
        className="rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-ink"
      >
        {addLabel}
      </button>
    </div>
  );
}
