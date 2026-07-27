import Link from "next/link";
import Reveal from "@/components/reveal";
import ProjectCard from "@/components/project-card";
import { getFeaturedProjects } from "@/lib/projects";
import { process, services, site, stats } from "@/data/site";

// 每 5 分鐘重新產生一次；後台編輯後也會即時更新（見 revalidatePath）
export const revalidate = 300;

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();
  return (
    <>
      {/* ── Hero ───────────────────────────────── */}
      <section className="shell relative overflow-x-clip pt-16 pb-16 sm:pt-24 lg:pt-32 lg:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 -z-10 h-[34rem] w-[34rem] translate-x-1/4 -translate-y-1/4 rounded-full bg-accent-soft/55 blur-[110px]"
        />

        <Reveal>
          <p className="eyebrow">數位設計工作室 · EST. {site.foundedYear}</p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="display mt-7 max-w-4xl text-[2.75rem] leading-[1.12] text-ink sm:text-6xl lg:text-7xl">
            把品牌的價值，
            <br />
            變成<span className="text-accent">看得見</span>的網站。
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-9 max-w-xl text-lg leading-relaxed text-ink-2">
            我們替品牌設計官網、電商與網頁系統。不從版型出發，而是從你的商業目標出發——
            先問清楚網站要解決什麼，再決定它該長什麼樣子。
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-11 flex flex-wrap items-center gap-4">
            <Link
              href="/work"
              className="rounded-full bg-ink px-7 py-3.5 text-sm text-paper transition-colors hover:bg-accent"
            >
              看看我們的作品
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-line px-7 py-3.5 text-sm text-ink transition-colors hover:border-ink"
            >
              聊聊你的專案
            </Link>
          </div>
        </Reveal>

        {/* 數據列 */}
        <Reveal delay={320}>
          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-12 sm:grid-cols-4 lg:mt-20">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="display block text-4xl text-ink tabular-nums sm:text-5xl">
                    {s.value}
                  </span>
                  <span className="mt-2 block text-sm text-muted">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ── 精選作品 ───────────────────────────── */}
      <section className="shell py-24 lg:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <div>
              <p className="eyebrow">精選作品</p>
              <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
                每個專案，都是一個問題
              </h2>
            </div>
            <Link
              href="/work"
              className="link-underline pb-1 text-sm text-muted transition-colors hover:text-ink"
            >
              查看全部作品 →
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 space-y-16">
          {/* 第一個作品用大卡 */}
          {featuredProjects[0] && (
            <Reveal>
              <ProjectCard project={featuredProjects[0]} size="large" priority />
            </Reveal>
          )}

          {/* 其餘三欄 */}
          <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.slice(1).map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 服務 ───────────────────────────────── */}
      <section id="services" className="bg-paper-2 py-24 lg:py-32">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">服務項目</p>
            <h2 className="display mt-4 max-w-2xl text-4xl text-ink sm:text-5xl">
              從一句話的想法，到一個會賺錢的網站
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.no} delay={i * 70}>
                <div className="h-full bg-paper p-8 lg:p-10">
                  <span className="display text-sm text-accent">{s.no}</span>
                  <h3 className="display mt-4 text-2xl text-ink">{s.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {s.desc}
                  </p>
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {s.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 關於 ───────────────────────────────── */}
      <section id="about" className="shell py-24 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow">關於我們</p>
              <h2 className="display mt-4 text-4xl leading-tight text-ink sm:text-5xl">
                好的網站
                <br />
                是問對問題的結果
              </h2>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <div className="space-y-6 text-lg leading-relaxed text-ink-2">
                <p>
                  {site.name}成立於 {site.foundedYear}{" "}
                  年，是一個由設計師與工程師組成的小團隊。我們刻意維持小規模——因為我們相信，每個專案都應該由真正理解它的人親手完成。
                </p>
                <p>
                  過去九年我們完成了 120
                  多個專案，橫跨建設、餐飲、生技、電商與服務業。這些產業差異極大，但我們的做法始終一樣：先花時間搞懂你的生意，再開始畫任何一個畫面。
                </p>
                <p>
                  我們不會告訴你「現在流行什麼設計」，我們會問你「你希望客戶看完網站後做什麼」。這兩個問題會導向完全不同的結果，而後者才是你付錢想要的東西。
                </p>
              </div>
            </Reveal>

            {/* 合作流程 */}
            <div className="mt-16 border-t border-line">
              {process.map((p, i) => (
                <Reveal key={p.step} delay={i * 70}>
                  <div className="flex gap-6 border-b border-line py-7 sm:gap-10">
                    <span className="display shrink-0 text-sm text-accent tabular-nums">
                      {p.step}
                    </span>
                    <div>
                      <h3 className="text-base font-medium text-ink">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────── */}
      <section className="shell pb-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-20 text-center lg:px-16 lg:py-28">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/25 blur-[100px]"
            />
            <p className="eyebrow text-paper/50">下一步</p>
            <h2 className="display mx-auto mt-5 max-w-2xl text-4xl leading-tight text-paper sm:text-5xl">
              先聊聊，不用先有完整的想法
            </h2>
            <p className="mx-auto mt-6 max-w-lg leading-relaxed text-paper/60">
              大部分客戶第一次找我們時，手上只有一個模糊的方向。這完全沒問題——把想法講清楚，本來就是我們工作的一部分。
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-paper px-8 py-4 text-sm text-ink transition-colors hover:bg-accent hover:text-paper"
            >
              聯絡我們
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
