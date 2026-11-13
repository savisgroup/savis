"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LocaleSwitch({ current, label, onBand = false }: { current: Locale; label: string; onBand?: boolean }) {
  const pathname = usePathname() ?? `/${current}`;
  const rest = pathname.replace(/^\/(vi|en)(?=\/|$)/, "");
  return (
    <nav className="flex items-center gap-1 text-sm font-semibold" aria-label={label}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className={onBand ? "text-on-band-muted" : "text-muted"}>·</span>}
          <Link
            href={`/${l}${rest}`}
            hrefLang={l}
            lang={l}
            aria-current={l === current ? "true" : undefined}
            className={cn(
              "uppercase transition-colors duration-[var(--motion-fast)]",
              onBand
                ? l === current ? "text-on-band" : "text-on-band-muted hover:text-on-band"
                : l === current ? "text-ink" : "text-muted hover:text-brand",
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </nav>
  );
}
