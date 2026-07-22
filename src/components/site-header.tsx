"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/data/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 選單開啟時鎖住背景捲動
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]!);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex items-baseline gap-2.5"
          aria-label={`${site.name} 首頁`}
        >
          <span className="display text-xl text-ink">{site.name}</span>
          <span className="hidden text-[0.625rem] tracking-[0.22em] text-muted sm:inline">
            {site.nameEn}
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="主選單">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`link-underline text-sm transition-colors ${
                isActive(item.href) && item.href !== "/#services" && item.href !== "/#about"
                  ? "text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-accent md:inline-block"
          >
            聊聊你的專案
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-11 w-11 items-center justify-center md:hidden"
            aria-label={open ? "關閉選單" : "開啟選單"}
            aria-expanded={open}
          >
            <span className="relative block h-3.5 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-ink transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-ink transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* 手機選單 */}
      <div
        className={`fixed inset-0 top-20 z-40 bg-paper transition-all duration-400 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="shell flex flex-col gap-1 py-8" aria-label="行動版選單">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="display border-b border-line py-5 text-3xl text-ink"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-8 rounded-full bg-ink px-6 py-4 text-center text-paper"
          >
            聊聊你的專案
          </Link>
        </nav>
      </div>
    </header>
  );
}
