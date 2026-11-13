import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = Omit<React.ComponentProps<typeof Link>, "aria-label"> & { label: string; onBand?: boolean };

// Logo lấy nguyên từ nhóm asset Logos của design system, không vẽ lại.
// Hiện là PNG: cần bản SVG gốc từ nhóm thương hiệu trước khi lên production.
// Nhận props còn lại để dùng được với `asChild` của Radix.
export function Logo({ label, onBand = false, className, ...linkProps }: Props) {
  return (
    <Link aria-label={label} className={cn("flex flex-none items-center gap-3 text-ink", className)} {...linkProps}>
      <Image src="/brand/savis-mark.png" alt="" width={42} height={42} className="size-[42px]" preload />
      {onBand ? (
        <Image src="/brand/savis-wordmark-dark.png" alt="" width={278} height={120} className="h-9 w-auto" />
      ) : (
        <>
          <Image src="/brand/savis-wordmark-light.png" alt="" width={278} height={120} className="h-9 w-auto dark:hidden" />
          <Image src="/brand/savis-wordmark-dark.png" alt="" width={278} height={120} className="hidden h-9 w-auto dark:block" />
        </>
      )}
    </Link>
  );
}
