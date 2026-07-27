import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/reveal";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

export const revalidate = 300;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "找不到作品" };

  return {
    title: `${project.title}｜${project.subtitle}`,
    description: project.excerpt,
    openGraph: {
      title: `${project.title}｜${project.subtitle}`,
      description: project.excerpt,
      images: [{ url: project.cover }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const projects = await getAllProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length]!;

  // 封面已經當作頂部主視覺，故事段落之間不要再重複同一張
  const storyImages = project.gallery.filter((img) => img.src !== project.cover);

  const meta = [
    { label: "客戶", value: project.client },
    { label: "年份", value: project.year },
    { label: "類型", value: project.category },
    { label: "服務項目", value: project.services.join("、") },
    { label: "技術", value: project.stack.join("、") },
  ];

  return (
    <>
      {/* ── 標題區 ─────────────────────────────── */}
      <section className="shell relative overflow-x-clip pt-12 pb-14 sm:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[28rem] w-[46rem] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-20 blur-[120px]"
          style={{ backgroundColor: project.accent }}
        />

        <Reveal>
          <Link
            href="/work"
            className="link-underline text-sm text-muted transition-colors hover:text-ink"
          >
            ← 回作品列表
          </Link>
        </Reveal>

        <Reveal delay={60}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3.5 py-1.5 text-xs text-paper"
              style={{ backgroundColor: project.accent }}
            >
              {project.category}
            </span>
            <span className="text-xs text-muted tabular-nums">
              {project.year}
            </span>
          </div>

          <h1 className="display mt-6 max-w-4xl text-[2.5rem] leading-[1.15] text-ink sm:text-6xl">
            {project.title}
            <span className="mt-3 block font-sans text-xl font-normal text-muted sm:text-2xl">
              {project.subtitle}
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2">
            {project.excerpt}
          </p>
        </Reveal>
      </section>

      {/* ── 主視覺 ─────────────────────────────── */}
      <section className="shell">
        <Reveal>
          <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-paper-2 sm:aspect-16/9">
            <Image
              src={project.cover}
              alt={`${project.title} 專案主視覺`}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* ── 專案資訊 ───────────────────────────── */}
      <section className="shell py-16 lg:py-20">
        <Reveal>
          <dl className="grid gap-x-8 gap-y-8 border-y border-line py-10 sm:grid-cols-2 lg:grid-cols-5">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="eyebrow">{m.label}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-ink">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ── 成效數據 ───────────────────────────── */}
      <section className="shell pb-20">
        <Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-3">
            {project.results.map((r) => (
              <div key={r.label} className="bg-paper-2 px-8 py-12 text-center">
                <p
                  className="display text-5xl tabular-nums sm:text-6xl"
                  style={{ color: project.accent }}
                >
                  {r.value}
                </p>
                <p className="mt-3 text-sm text-muted">{r.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── 專案故事 + 圖片交錯 ────────────────── */}
      <section className="shell pb-8">
        {project.story.map((block, i) => (
          <div key={block.label}>
            <Reveal>
              <article className="mx-auto grid max-w-5xl gap-8 py-14 lg:grid-cols-[10rem_1fr] lg:gap-16">
                <div>
                  <p
                    className="eyebrow"
                    style={{ color: project.accent }}
                  >
                    {block.label}
                  </p>
                </div>
                <div>
                  <h2 className="display text-3xl leading-snug text-ink sm:text-4xl">
                    {block.title}
                  </h2>
                  <div className="mt-7 space-y-5 text-lg leading-[1.85] text-ink-2">
                    {block.body.map((p, k) => (
                      <p key={k}>{p}</p>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>

            {/* 每段故事後面穿插對應的圖片 */}
            {storyImages[i] && (
              <Reveal>
                <figure
                  className={
                    storyImages[i]!.wide
                      ? "mx-auto max-w-6xl py-6"
                      : "mx-auto max-w-4xl py-6"
                  }
                >
                  <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-paper-2">
                    <Image
                      src={storyImages[i]!.src}
                      alt={storyImages[i]!.alt}
                      fill
                      sizes="(max-width: 1280px) 100vw, 1150px"
                      className="object-cover"
                    />
                  </div>
                  {storyImages[i]!.caption && (
                    <figcaption className="mt-4 text-center text-sm text-muted">
                      {storyImages[i]!.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            )}
          </div>
        ))}

        {/* 故事段落用完後，剩下的圖片以兩欄排列 */}
        {storyImages.length > project.story.length && (
          <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-2">
            {storyImages.slice(project.story.length).map((img, i) => (
              <Reveal key={img.src} delay={i * 80}>
                <figure className={img.wide ? "md:col-span-2" : ""}>
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-paper-2">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="mt-3 text-sm text-muted">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ── 客戶回饋 ───────────────────────────── */}
      {project.testimonial && (
        <section className="shell py-16">
          <Reveal>
            <blockquote className="mx-auto max-w-3xl border-t border-line pt-14 text-center">
              <p className="display text-2xl leading-relaxed text-ink sm:text-3xl">
                「{project.testimonial.quote}」
              </p>
              <footer className="mt-8 text-sm text-muted">
                <span className="text-ink">{project.testimonial.author}</span>
                <span className="mx-2">·</span>
                {project.testimonial.role}
              </footer>
            </blockquote>
          </Reveal>
        </section>
      )}

      {/* ── 下一個作品 ─────────────────────────── */}
      <section className="shell pb-8">
        <Reveal>
          <Link
            href={`/work/${next.slug}`}
            className="group relative block overflow-hidden rounded-3xl"
          >
            <div className="relative aspect-21/9 min-h-72">
              <Image
                src={next.cover}
                alt={next.title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/60" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="eyebrow text-paper/60">下一個作品</p>
              <p className="display mt-4 text-4xl text-paper sm:text-5xl">
                {next.title}
              </p>
              <p className="mt-3 text-sm text-paper/70">{next.subtitle}</p>
              <span className="mt-8 rounded-full border border-paper/40 px-6 py-3 text-sm text-paper transition-colors group-hover:bg-paper group-hover:text-ink">
                查看專案 →
              </span>
            </div>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
