import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-5 text-4xl text-ink sm:text-5xl">
        這個頁面不存在
      </h1>
      <p className="mt-5 max-w-md leading-relaxed text-muted">
        可能是網址輸入錯誤，或這個頁面已經被移除。不如回去看看我們的作品？
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/work"
          className="rounded-full bg-ink px-7 py-3.5 text-sm text-paper transition-colors hover:bg-accent"
        >
          瀏覽作品
        </Link>
        <Link
          href="/"
          className="rounded-full border border-line px-7 py-3.5 text-sm text-ink transition-colors hover:border-ink"
        >
          回首頁
        </Link>
      </div>
    </section>
  );
}
