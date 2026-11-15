"use client";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Block } from "@/content/pages/types";

type Form = Extract<Block, { t: "contact" }>;

// Chưa có backend nhận form: gửi bằng cách mở thư soạn sẵn tới hộp thư của SAVIS (mailto), không lưu gì trên website.
// Khi có API, thay `submit` bằng lệnh POST và giữ nguyên phần giao diện.
const INBOX = "dichvuso@savis.vn";
const inputCls = "min-h-12 w-full rounded-md border border-line bg-raised px-3.5 py-3 text-base leading-6 text-ink";
const labelCls = "text-sm font-semibold leading-5 text-ink";
const OPTIONS = [
  "Digital Identity & Trust", "Cybersecurity & Quantum-Safe Infrastructure", "Digital Government & Smart Infrastructure",
  "Open Finance & Secure Digital Transactions", "AI, Data & Digital Platforms", "Services", "Other",
];
const isRequired = (label: string) => /name|email/i.test(label);

export function ContactForm({ form }: { form: Form }) {
  const uid = useId();
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const value = (i: number) => String(data.get(`f${i}`) ?? "").trim();
    const body = form.fields.map((f, i) => `${f.label}: ${value(i)}`).join("\n");
    window.location.href = `mailto:${INBOX}?subject=${encodeURIComponent(`Website enquiry - ${value(0)}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const short = form.fields.map((f, i) => ({ f, i })).filter(({ f }) => f.kind !== "textarea");
  const long = form.fields.map((f, i) => ({ f, i })).filter(({ f }) => f.kind === "textarea");
  return (
    <div className="grid items-start gap-12 min-[860px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
          {short.map(({ f, i }) => (
            <div key={f.label} className="flex flex-col gap-1.5">
              <label htmlFor={`${uid}-${i}`} className={labelCls}>{f.label}</label>
              {f.kind === "select" ? (
                <select id={`${uid}-${i}`} name={`f${i}`} defaultValue="" className={inputCls}>
                  <option value="">{f.placeholder}</option>
                  {OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input id={`${uid}-${i}`} name={`f${i}`} type={/email/i.test(f.label) ? "email" : "text"} required={isRequired(f.label)} className={inputCls} />
              )}
            </div>
          ))}
        </div>
        {long.map(({ f, i }) => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <label htmlFor={`${uid}-${i}`} className={labelCls}>{f.label}</label>
            <textarea id={`${uid}-${i}`} name={`f${i}`} className={`${inputCls} min-h-[140px] resize-y`} />
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit">{form.send}</Button>
          {sent && <p role="status" className="text-sm text-muted">Your email app should open with the message ready to send to {INBOX}.</p>}
        </div>
      </form>
      <div className="flex flex-col gap-4">
        {form.side.map((c) => {
          const hotline = c.eyebrow === "HOTLINE";
          const href = hotline ? `tel:${(c.title ?? "").replace(/\s/g, "")}` : `mailto:${c.title}`;
          return (
            <div key={c.title} className={hotline ? "on-band flex flex-col gap-2.5 rounded-lg border border-white/20 bg-band p-6 text-on-band" : "flex flex-col gap-2.5 rounded-lg border border-line bg-raised p-6"}>
              <span className="eyebrow">{c.eyebrow}</span>
              <a href={href} className={hotline ? "font-display text-[30px] font-bold leading-9 hover:underline" : "font-display text-[19px] font-bold leading-[25px] hover:text-brand"}>{c.title}</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
