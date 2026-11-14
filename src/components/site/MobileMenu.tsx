"use client";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import type { MobileSection } from "@/content/navigation";

type Props = {
  homeHref: string;
  sections: MobileSection[];
  links: { href: string; label: string }[];
  contact: { href: string; label: string };
  labels: { open: string; close: string; title: string; home: string };
  footer?: React.ReactNode;
};

const gutter = "px-[max(16px,env(safe-area-inset-left,0px))]";

// Menu toàn màn hình cho màn hình hẹp (dưới 1240px). Dùng Radix Dialog: focus trap, Esc đóng, trả focus về nút mở.
// Mỗi menu L1 là một mục <details> thu gọn; mục chưa có trang hiện dạng chữ mờ (giống mega menu desktop).
export function MobileMenu({ homeHref, sections, links, contact, labels, footer }: Props) {
  const [open, setOpen] = useState(false);
  // Header nằm trong layout nên Dialog không bị unmount khi đổi route: đóng menu khi bấm bất kỳ link nào.
  const closeOnLinkClick = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  };
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={labels.open}
          className="inline-flex size-[46px] items-center justify-center rounded-md border border-border-strong bg-surface text-ink min-[1240px]:hidden"
        >
          <Menu aria-hidden className="size-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          onClick={closeOnLinkClick}
          className="fixed inset-0 z-[70] flex flex-col overflow-auto bg-background pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] text-ink"
        >
          <Dialog.Title className="sr-only">{labels.title}</Dialog.Title>
          <div className={`flex min-h-[68px] items-center justify-between border-b border-line ${gutter}`}>
            <Logo href={homeHref} label={labels.home} />
            <Dialog.Close asChild>
              <button type="button" aria-label={labels.close} className="inline-flex size-11 items-center justify-center text-ink">
                <X aria-hidden className="size-6" />
              </button>
            </Dialog.Close>
          </div>
          <ul className={gutter}>
            {sections.map((s) => (
              <li key={s.id} className="border-b border-line">
                <details className="group">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-display text-[17px] font-semibold leading-6 [&::-webkit-details-marker]:hidden">
                    {s.label}
                    <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="flex flex-col pb-3">
                    {s.links.map((l) => (
                      <li key={l.label}>
                        {l.href ? (
                          <Link href={l.href} className="flex min-h-11 items-center text-[15px] leading-[22px] text-ink">{l.label}</Link>
                        ) : (
                          <span className="flex min-h-11 items-center text-[15px] leading-[22px] text-muted">{l.label}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
            {links.map((l) => (
              <li key={l.href} className="border-b border-line">
                <Link href={l.href} className="flex min-h-14 items-center font-display text-[17px] font-semibold leading-6 text-ink">{l.label}</Link>
              </li>
            ))}
          </ul>
          <div className={`mt-auto flex flex-col gap-4 py-4 ${gutter}`}>
            <Button asChild>
              <Link href={contact.href}>{contact.label}</Link>
            </Button>
            {footer}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
