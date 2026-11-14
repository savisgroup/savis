import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import type { Locale } from "@/lib/i18n";
import type { HomeContent } from "@/content/home";
import { resolveHref } from "@/content/navigation";
import { offices } from "@/content/site";
import { cn } from "@/lib/utils";

// Khối hiện diện toàn cầu: 10 thẻ văn phòng, trụ sở chính nền navy. Dữ liệu dùng chung với cột văn phòng ở footer.
export function GlobalPresence({ locale, content }: { locale: Locale; content: HomeContent["presence"] }) {
  const aboutHref = resolveHref(locale, { path: "/about" });
  return (
    <section className="py-24">
      <div className="container-x flex flex-col gap-9">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[760px]">
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="mt-3 text-[clamp(30px,3.4vw,46px)] font-bold leading-[1.08] tracking-[-0.02em]">{content.title}</h2>
          </div>
          {aboutHref && <Link href={aboutHref} className="font-semibold text-brand hover:underline">{content.about} →</Link>}
        </div>
        <Reveal>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-4">
            {offices.map((o) => (
              <li key={o.name.en} className={cn("flex min-w-0 flex-col gap-1.5 rounded-lg border p-[22px]", o.hq ? "on-band border-band bg-band" : "border-line bg-raised")}>
                <span className={cn("eyebrow", !o.hq && "text-muted")}>{o.region[locale]}</span>
                <h3 className="text-xl font-bold leading-[25px]">{o.name[locale]}</h3>
                {o.address && <p className={cn("text-sm leading-[21px]", o.hq ? "text-on-band-muted" : "text-muted")}>{o.address[locale]}</p>}
                {o.contact && (
                  <p className="flex flex-col text-sm leading-[21px] text-muted">
                    <a className="hover:text-brand" href={`tel:${o.contact.phone.replace(/\s/g, "")}`}>{o.contact.phone}</a>
                    <a className="break-all hover:text-brand" href={`mailto:${o.contact.email}`}>{o.contact.email}</a>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
