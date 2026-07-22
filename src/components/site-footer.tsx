import Link from "next/link";
import { contact, nav, site } from "@/data/site";
import { projects } from "@/data/projects";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 bg-ink text-paper">
      <div className="shell py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* 品牌 + CTA */}
          <div>
            <p className="display text-3xl leading-snug text-paper sm:text-4xl">
              有一個想法
              <br />
              想讓它上線嗎？
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-paper px-6 py-3.5 text-sm text-ink transition-colors hover:bg-accent hover:text-paper"
            >
              開始一段對話
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* 網站導覽 */}
          <div>
            <p className="eyebrow text-paper/45">網站導覽</p>
            <ul className="mt-6 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-10 text-paper/45">精選作品</p>
            <ul className="mt-6 space-y-3">
              {projects.slice(0, 3).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/work/${p.slug}`}
                    className="link-underline text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 聯絡資訊 */}
          <div>
            <p className="eyebrow text-paper/45">聯絡我們</p>
            <ul className="mt-6 space-y-4 text-sm text-paper/70">
              <li>
                <span className="block text-xs text-paper/40">LINE</span>
                <a
                  href={contact.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline transition-colors hover:text-paper"
                >
                  {contact.lineId}
                </a>
              </li>
              <li>
                <span className="block text-xs text-paper/40">Email</span>
                <a
                  href={`mailto:${contact.email}`}
                  className="link-underline transition-colors hover:text-paper"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <span className="block text-xs text-paper/40">電話</span>
                <a
                  href={contact.phoneHref}
                  className="link-underline transition-colors hover:text-paper"
                >
                  {contact.phone}
                </a>
              </li>
              <li>
                <span className="block text-xs text-paper/40">地址</span>
                <a
                  href={contact.address.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline leading-relaxed transition-colors hover:text-paper"
                >
                  {contact.address.full}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/12 pt-8 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} {site.nameEn}. All rights reserved.
          </p>
          <p>本站聯絡資訊為示範用假資料，上線前請替換。</p>
        </div>
      </div>
    </footer>
  );
}
