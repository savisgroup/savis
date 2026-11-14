"use client";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { PillarId } from "@/content/home";
import {
  contactFeature, pillarCopy, pillarMenus, resolveHref, simpleMenus, solutionsMenu,
  type NavItem, type SimpleMenu,
} from "@/content/navigation";
import { cn } from "@/lib/utils";

// Mega menu theo DS (components/MegaMenu): Radix NavigationMenu lo mở/đóng, aria-expanded, Esc, focus.
// Panel rộng toàn trang ngay dưới header: cột trái (trụ cột hoặc phần giới thiệu), giữa (nhóm link), phải (card nổi bật nền navy).
// Mở bằng hover, click hoặc bàn phím. Dưới 1100px header dùng MobileMenu thay cho menu này.
export function MegaMenu({ locale, label }: { locale: Locale; label: string }) {
  return (
    <NavigationMenu.Root aria-label={label} className="hidden flex-1 self-stretch min-[1100px]:flex" delayDuration={120}>
      <NavigationMenu.List className="flex h-full items-stretch gap-0.5">
        <NavigationMenu.Item value="solutions" className="flex">
          <Trigger>{solutionsMenu.label[locale]}</Trigger>
          <NavigationMenu.Content><SolutionsPanel locale={locale} /></NavigationMenu.Content>
        </NavigationMenu.Item>
        {simpleMenus.map((m) => (
          <NavigationMenu.Item key={m.id} value={m.id} className="flex">
            <Trigger>{m.label[locale]}</Trigger>
            <NavigationMenu.Content><SimplePanel locale={locale} menu={m} /></NavigationMenu.Content>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
      {/* Root không đặt position nên viewport bám theo <header> (sticky) và trải hết chiều ngang. */}
      <div className="absolute inset-x-0 top-full">
        <NavigationMenu.Viewport className="max-h-[calc(100dvh-var(--header-height)-24px)] overflow-y-auto border-b border-line bg-raised text-ink shadow-[var(--shadow-mega)]" />
      </div>
    </NavigationMenu.Root>
  );
}

function Trigger({ children }: { children: React.ReactNode }) {
  return (
    <NavigationMenu.Trigger className="group inline-flex min-h-[var(--header-height)] items-center gap-1 whitespace-nowrap border-b-[3px] border-transparent px-[11px] text-[14.5px] font-semibold leading-5 text-ink transition-colors duration-[var(--motion-fast)] hover:text-brand data-[state=open]:border-brand data-[state=open]:text-brand">
      {children}
      <ChevronDown aria-hidden className="size-3.5 transition-transform duration-[var(--motion-fast)] group-data-[state=open]:rotate-180" />
    </NavigationMenu.Trigger>
  );
}

const grid = "container-x grid items-start gap-8 py-7 pb-[34px] min-[1100px]:grid-cols-[270px_minmax(0,1fr)_300px]";

/** Link trong menu; trang chưa dựng (không có href) hiện dạng chữ mờ để không dẫn vào 404. */
function MenuLink({ locale, item, className, children }: { locale: Locale; item: Pick<NavItem, "path" | "fallback">; className?: string; children: React.ReactNode }) {
  const href = resolveHref(locale, item);
  if (!href) return <span className={cn(className, "cursor-default text-muted")}>{children}</span>;
  return (
    <NavigationMenu.Link asChild>
      <Link href={href} className={cn(className, "hover:text-brand")}>{children}</Link>
    </NavigationMenu.Link>
  );
}

function SolutionsPanel({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<PillarId>("identity");
  const pillar = pillarMenus.find((p) => p.id === active) ?? pillarMenus[0];
  const copy = pillarCopy(locale, pillar.id);
  return (
    <div className={grid}>
      <div>
        <ul className="flex flex-col gap-1">
          {pillarMenus.map((p) => {
            const isActive = p.id === pillar.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setActive(p.id)}
                  onMouseEnter={() => setActive(p.id)}
                  onFocus={() => setActive(p.id)}
                  className={cn(
                    "flex w-full flex-col gap-0.5 rounded-md px-3 py-2.5 text-left transition-colors duration-[var(--motion-fast)]",
                    isActive ? "bg-chip text-chip-ink" : "text-ink hover:bg-chip/60",
                  )}
                >
                  <span className="text-[14.5px] font-semibold leading-5">{pillarCopy(locale, p.id).name}</span>
                  <span className={cn("text-[12.5px] leading-[18px]", isActive ? "text-chip-ink/80" : "text-muted")}>{p.desc[locale]}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <MenuLink locale={locale} item={solutionsMenu.catalogue} className="mt-3 block px-3 text-sm font-semibold text-brand">
          {solutionsMenu.catalogue.label[locale]} →
        </MenuLink>
      </div>
      <div className="min-w-0">
        <MenuLink locale={locale} item={pillar} className="mb-5 inline-block font-display text-[22px] font-bold leading-7 text-ink">
          {copy.name} →
        </MenuLink>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-5">
          {pillar.groups.map((g) => (
            <div key={g.label}>
              <h3 className="mb-2 text-[12.5px] font-semibold uppercase leading-4 tracking-[0.12em] text-muted">{g.label}</h3>
              <ul className="flex flex-col gap-1.5">
                {g.items.map((it) => (
                  <li key={it.path}>
                    <MenuLink locale={locale} item={it} className="text-sm leading-5 text-ink">{it.label[locale]}</MenuLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <FeatureCard locale={locale} eyebrow={solutionsMenu.label[locale]} title={copy.name} text={copy.text} cta={{ label: { en: copy.link, vi: copy.link }, path: pillar.path, fallback: pillar.fallback }} />
    </div>
  );
}

function SimplePanel({ locale, menu }: { locale: Locale; menu: SimpleMenu }) {
  return (
    <div className={grid}>
      <div className="flex flex-col gap-3 min-[1100px]:border-r min-[1100px]:border-line min-[1100px]:pr-6">
        <span className="eyebrow">{menu.eyebrow[locale]}</span>
        <span className="font-display text-2xl font-bold leading-[1.2] text-ink">{menu.title[locale]}</span>
        {resolveHref(locale, menu.cta) && (
          <MenuLink locale={locale} item={menu.cta} className="text-sm font-semibold text-brand">{menu.cta.label[locale]} →</MenuLink>
        )}
      </div>
      <ul className="grid min-w-0 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] content-start gap-x-6 gap-y-1">
        {menu.items.map((it) => (
          <li key={`${it.path}-${it.label.en}`}>
            <MenuLink locale={locale} item={it} className="flex flex-col gap-0.5 rounded-md px-3 py-2.5 hover:bg-chip/60">
              <b className="text-[14.5px] font-semibold leading-5">{it.label[locale]}</b>
              {it.desc && <span className="text-[12.5px] leading-[18px] text-muted">{it.desc[locale]}</span>}
            </MenuLink>
          </li>
        ))}
      </ul>
      <FeatureCard locale={locale} eyebrow={contactFeature.eyebrow[locale]} title={contactFeature.title[locale]} text={contactFeature.text[locale]} cta={contactFeature.cta} />
    </div>
  );
}

function FeatureCard({ locale, eyebrow, title, text, cta }: { locale: Locale; eyebrow: string; title: string; text: string; cta: NavItem }) {
  const href = resolveHref(locale, cta);
  return (
    <div className="on-band flex flex-col gap-3 rounded-lg bg-band p-6 text-on-band">
      <span className="eyebrow">{eyebrow}</span>
      <h3 className="font-display text-xl font-bold leading-7">{title}</h3>
      <p className="text-sm leading-[21px] text-on-band-muted">{text}</p>
      {href && (
        <NavigationMenu.Link asChild>
          <Link href={href} className="mt-1 text-sm font-semibold text-on-band underline-offset-4 hover:underline">{cta.label[locale]} →</Link>
        </NavigationMenu.Link>
      )}
    </div>
  );
}
