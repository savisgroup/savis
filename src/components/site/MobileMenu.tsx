"use client";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

type Props = {
  homeHref: string;
  links: { href: string; label: string }[];
  contact: { href: string; label: string };
  labels: { open: string; close: string; title: string; home: string };
  footer?: React.ReactNode;
};

// Menu toàn màn hình cho màn hình hẹp (dưới bp-lg 1100px). Dùng Radix Dialog: focus trap, Esc đóng, trả focus về nút mở.
export function MobileMenu({ homeHref, links, contact, labels, footer }: Props) {
  const [open, setOpen] = useState(false);
  // Header nằm trong layout nên Dialog không bị unmount khi đổi route: đóng menu khi bấm bất kỳ link nào trong vùng footer (đổi ngôn ngữ, link hash).
  const closeOnLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  };
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={labels.open}
          className="inline-flex size-[46px] items-center justify-center rounded-md border border-border-strong bg-surface text-ink min-[1100px]:hidden"
        >
          <Menu aria-hidden className="size-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[70] flex flex-col overflow-auto bg-background pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] text-ink"
        >
          <Dialog.Title className="sr-only">{labels.title}</Dialog.Title>
          <div className="flex min-h-[68px] items-center justify-between border-b border-line px-[max(16px,env(safe-area-inset-left,0px))]">
            <Dialog.Close asChild>
              <Logo href={homeHref} label={labels.home} />
            </Dialog.Close>
            <Dialog.Close asChild>
              <button type="button" aria-label={labels.close} className="inline-flex size-11 items-center justify-center text-ink">
                <X aria-hidden className="size-6" />
              </button>
            </Dialog.Close>
          </div>
          <ul className="px-[max(16px,env(safe-area-inset-left,0px))]">
            {links.map((l) => (
              <li key={l.href} className="border-b border-line">
                <Dialog.Close asChild>
                  <Link href={l.href} className="flex min-h-14 items-center font-display text-[17px] font-semibold leading-6 text-ink">
                    {l.label}
                  </Link>
                </Dialog.Close>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-4 px-[max(16px,env(safe-area-inset-left,0px))] py-4">
            <Dialog.Close asChild>
              <Button asChild>
                <Link href={contact.href}>{contact.label}</Link>
              </Button>
            </Dialog.Close>
            <div onClick={closeOnLinkClick}>{footer}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
