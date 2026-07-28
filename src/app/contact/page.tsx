import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import ContactForm from "@/components/contact-form";
import { contact, site } from "@/data/site";

const description = `透過 LINE、Email 或電話與${site.name}聯繫，或直接來${contact.address.city}${contact.address.district}的辦公室聊聊。`;

export const metadata: Metadata = {
  title: "聯絡我們",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "聯絡我們", description, url: "/contact" },
};

const channels = [
  {
    label: "LINE 官方帳號",
    value: contact.lineId,
    href: contact.lineUrl,
    hint: "最快回覆的管道，平日通常 2 小時內回覆",
    external: true,
  },
  {
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
    hint: "適合附上需求文件或參考網站",
    external: false,
  },
  {
    label: "電話",
    value: contact.phone,
    href: contact.phoneHref,
    hint: "營業時間內可直接來電",
    external: false,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── 標題 ───────────────────────────────── */}
      <section className="shell relative overflow-x-clip pt-16 pb-16 sm:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 -z-10 h-[30rem] w-[30rem] -translate-x-1/3 -translate-y-1/4 rounded-full bg-accent-soft/60 blur-[110px]"
        />
        <Reveal>
          <p className="eyebrow">聯絡我們</p>
          <h1 className="display mt-5 max-w-3xl text-[2.5rem] leading-[1.15] text-ink sm:text-6xl">
            說說你想做什麼，
            <br />
            我們一起把它想清楚
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-2">
            不論是已經有完整規格，或只是一個還很模糊的方向，都歡迎聯絡我們。第一次諮詢不收費，也不會有推銷。
          </p>
        </Reveal>
      </section>

      {/* ── 聯絡管道 ───────────────────────────── */}
      <section className="shell pb-20">
        <div className="grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-3">
          {channels.map((c, i) => (
            <Reveal key={c.label} delay={i * 70}>
              <a
                href={c.href}
                {...(c.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex h-full flex-col bg-paper p-8 transition-colors hover:bg-paper-2"
              >
                <p className="eyebrow">{c.label}</p>
                <p className="display mt-4 text-2xl break-all text-ink transition-colors group-hover:text-accent">
                  {c.value}
                </p>
                <p className="mt-auto pt-6 text-sm leading-relaxed text-muted">
                  {c.hint}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 表單 + 地址 ────────────────────────── */}
      <section className="shell pb-20">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* 表單 */}
          <Reveal>
            <div>
              <h2 className="display text-3xl text-ink sm:text-4xl">
                填一份簡單的需求
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                填得越具體，我們的回覆就越有用。收到後我們會在一個工作天內回信，安排 30
                分鐘的線上或現場會談。
              </p>
              <div className="mt-10">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          {/* 地址與營業時間 */}
          <Reveal delay={80}>
            <div className="rounded-2xl bg-paper-2 p-8 lg:p-10">
              <h2 className="display text-3xl text-ink">辦公室</h2>

              <div className="mt-8 space-y-8 text-sm">
                <div>
                  <p className="eyebrow">地址</p>
                  <address className="mt-3 text-base leading-relaxed text-ink not-italic">
                    {contact.address.zip} {contact.address.city}
                    {contact.address.district}
                    <br />
                    {contact.address.street}
                  </address>
                  <a
                    href={contact.address.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline mt-3 inline-block text-sm text-accent"
                  >
                    在 Google 地圖開啟 →
                  </a>
                </div>

                <div>
                  <p className="eyebrow">營業時間</p>
                  <dl className="mt-3 space-y-2">
                    {contact.hours.map((h) => (
                      <div key={h.day} className="flex justify-between gap-4">
                        <dt className="text-muted">{h.day}</dt>
                        <dd className="text-ink tabular-nums">{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <p className="eyebrow">交通方式</p>
                  <ul className="mt-3 space-y-2 leading-relaxed text-muted">
                    <li>捷運松江南京站 4 號出口，步行約 5 分鐘</li>
                    <li>公車南京建國路口站，步行約 2 分鐘</li>
                    <li>大樓地下停車場，訪客可折抵 2 小時</li>
                  </ul>
                </div>
              </div>

              {/* 地圖佔位：接上真實嵌入地圖後可直接替換 */}
              <a
                href={contact.address.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 block overflow-hidden rounded-xl border border-line"
                aria-label="在 Google 地圖查看辦公室位置"
              >
                <div className="relative flex aspect-4/3 items-center justify-center bg-paper">
                  <MapPlaceholder />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                    <span className="rounded-full bg-ink px-4 py-2 text-xs text-paper transition-colors group-hover:bg-accent">
                      在地圖上查看
                    </span>
                    <span className="text-[0.6875rem] text-muted">
                      （可換成 Google Maps 嵌入地圖）
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 假資料提醒 ─────────────────────────── */}
      <section className="shell pb-8">
        <div className="rounded-2xl border border-dashed border-line px-6 py-5 text-sm leading-relaxed text-muted">
          <strong className="text-ink">給網站管理者：</strong>{" "}
          目前頁面上的 LINE ID、Email、電話與地址皆為示範用假資料，請至{" "}
          <code className="rounded bg-paper-2 px-1.5 py-0.5 text-xs text-ink">
            src/data/site.ts
          </code>{" "}
          修改為真實資訊。需求表單送出後會存進後台收件匣（
          <code className="rounded bg-paper-2 px-1.5 py-0.5 text-xs text-ink">
            /admin/messages
          </code>
          ），完成 Firebase 設定後即生效。
        </div>
      </section>
    </>
  );
}

/** 簡單的示意地圖底圖（街廓線條），避免載入外部資源 */
function MapPlaceholder() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="h-full w-full"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="300" fill="var(--color-paper-2)" />
      {[40, 110, 195, 265, 340].map((x) => (
        <rect key={x} x={x} y="0" width="10" height="300" fill="var(--color-paper)" />
      ))}
      {[45, 120, 205, 260].map((y) => (
        <rect key={y} x="0" y={y} width="400" height="10" fill="var(--color-paper)" />
      ))}
      <rect x="150" y="130" width="60" height="46" fill="var(--color-accent-soft)" />
      <circle cx="200" cy="150" r="9" fill="var(--color-accent)" opacity="0.9" />
    </svg>
  );
}
