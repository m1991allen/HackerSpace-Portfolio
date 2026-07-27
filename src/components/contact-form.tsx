"use client";

import { useState, type FormEvent } from "react";

const budgets = ["10 萬以下", "10–30 萬", "30–60 萬", "60 萬以上", "還不確定"];
const types = ["品牌官網", "電子商務", "網頁系統", "改版優化", "其他"];

/**
 * 需求表單。
 *
 * 送出後會 POST 到 /api/contact：訊息存進後台收件匣，
 * 並（若有設定 Resend）寄一封通知信到管理者信箱。
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [budget, setBudget] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      company: fd.get("company"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      message: fd.get("message"),
      _gotcha: fd.get("_gotcha"),
      type,
      budget,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "送出失敗，請稍後再試");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送出失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-line bg-paper-2 px-8 py-14 text-center"
      >
        <p className="display text-2xl text-ink">收到了，謝謝你！</p>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
          我們會在一個工作天內回覆。如果比較急，也可以直接用 LINE 找我們。
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-8 rounded-full border border-line px-6 py-3 text-sm text-ink transition-colors hover:border-ink"
        >
          再填一份
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="姓名 / 稱呼" name="name" required placeholder="王小明" />
        <Field
          label="公司 / 品牌"
          name="company"
          placeholder="選填"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
        <Field
          label="聯絡電話"
          name="phone"
          type="tel"
          placeholder="選填"
        />
      </div>

      <ChipGroup
        legend="專案類型"
        name="type"
        options={types}
        value={type}
        onChange={setType}
      />

      <ChipGroup
        legend="預算範圍"
        name="budget"
        options={budgets}
        value={budget}
        onChange={setBudget}
      />

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-ink"
        >
          想做什麼？<span className="ml-1 text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="例如：我們是一間開了五年的甜點店，想做一個可以線上預訂的官網，希望能有品牌感一點……"
          className="mt-3 w-full resize-y rounded-xl border border-line bg-paper px-4 py-3.5 text-sm leading-relaxed text-ink transition-colors placeholder:text-muted/60 focus:border-ink focus:outline-none"
        />
      </div>

      {/* 蜜罐欄位：隱藏，正常使用者不會填，用來擋機器人 */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          請勿填寫
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-ink px-8 py-4 text-sm text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "送出中…" : "送出需求"}
        </button>
        <p className="text-xs text-muted">
          我們不會把你的資料用於行銷或提供給第三方。
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-ink focus:outline-none"
      />
    </div>
  );
}

function ChipGroup({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o === value;
          return (
            <label
              key={o}
              className={`cursor-pointer rounded-full px-4 py-2.5 text-sm transition-colors ${
                on
                  ? "bg-ink text-paper"
                  : "border border-line text-muted hover:border-ink hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o}
                checked={on}
                onChange={() => onChange(o)}
                className="sr-only"
              />
              {o}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
