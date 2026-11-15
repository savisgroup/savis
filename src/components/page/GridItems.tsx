import { cn } from "@/lib/utils";
import type { Card, GridItem, Office, Step } from "@/content/pages/types";

// Thẻ trong lưới trang cấp 2. Thiết kế đặt mọi thẻ là liên kết tới trang cấp 3 (chưa thiết kế), nên thẻ hiện là khối thường,
// không có "Learn more →" và không hover như link, để không dẫn vào 404.

const badgeTone = { new: "bg-[#e3f8ec] text-[#0b6b3a]", default: "bg-chip text-chip-ink", tbc: "bg-[#fff2d9] text-[#8a5200]" } as const;

export function GridItemView({ item }: { item: GridItem }) {
  if (item.t === "card") return <CardView card={item} />;
  if (item.t === "step") return <StepView step={item} />;
  return <OfficeView office={item} />;
}

export function CardView({ card, className }: { card: Card; className?: string }) {
  const dark = card.dark;
  return (
    <div className={cn("flex min-w-0 flex-col gap-2.5 rounded-lg border p-6", dark ? "border-white/20 bg-white/5 text-on-band" : "border-line bg-raised text-ink", className)}>
      {card.badges?.map((b) => (
        <span key={b.text} className={cn("self-start rounded-full px-[9px] py-[3px] text-[11px] font-semibold uppercase leading-4 tracking-[0.04em]", badgeTone[b.tone])}>{b.text}</span>
      ))}
      {card.eyebrow && <span className="eyebrow">{card.eyebrow}</span>}
      {card.title && <h3 className="text-[19px] font-bold leading-[25px] tracking-[-0.005em]">{card.title}</h3>}
      {card.text && <p className={cn("text-[15px] leading-[23px]", dark ? "text-on-band-muted" : "text-muted")}>{card.text}</p>}
      {card.list && (
        <ul className={cn("flex list-disc flex-col gap-1 pl-[18px] text-[14.5px] leading-[22px]", dark ? "text-on-band-muted" : "text-muted")}>
          {card.list.map((li) => <li key={li}>{li}</li>)}
        </ul>
      )}
      {card.chain && <Chain steps={card.chain} />}
    </div>
  );
}

function Chain({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium leading-[18px] text-muted">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden className="text-brand">→</span>}
          <span className="rounded-full border border-line bg-surface px-2.5 py-1">{s}</span>
        </li>
      ))}
    </ol>
  );
}

function StepView({ step }: { step: Step }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-white/20 bg-white/5 p-[26px]">
      {step.num && <b className="text-sm font-bold leading-5 tracking-[0.08em] text-on-band-accent">{step.num}</b>}
      {step.title && <h3 className="text-xl font-bold leading-[26px] text-on-band">{step.title}</h3>}
      {step.text && <p className={step.title ? "text-[15px] leading-[23px] text-on-band-muted" : "font-display text-lg font-semibold leading-[26px] text-on-band"}>{step.text}</p>}
    </div>
  );
}

// Dòng liên hệ của văn phòng ("+61 ... | email") tách thành số điện thoại và email có link.
function ContactLine({ line, hq }: { line: string; hq?: boolean }) {
  const parts = line.split("|").map((p) => p.trim());
  const cls = cn("text-sm leading-[21px]", hq ? "text-on-band-muted" : "text-muted");
  return (
    <p className={cls}>
      {parts.map((p, i) => (
        <span key={p}>
          {i > 0 && " | "}
          {p.includes("@") ? <a className="hover:text-brand" href={`mailto:${p}`}>{p}</a> : /^\+?[\d\s]{8,}$/.test(p) ? <a className="hover:text-brand" href={`tel:${p.replace(/\s/g, "")}`}>{p}</a> : p}
        </span>
      ))}
    </p>
  );
}

function OfficeView({ office }: { office: Office }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5 rounded-lg border p-[22px]", office.hq ? "on-band border-band bg-band" : "border-line bg-raised")}>
      <span className={cn("eyebrow", !office.hq && "text-muted")}>{office.region}</span>
      <h3 className="text-xl font-bold leading-[25px]">{office.name}</h3>
      {office.lines.map((l) => <ContactLine key={l} line={l} hq={office.hq} />)}
    </div>
  );
}
