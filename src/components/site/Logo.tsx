import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = Omit<React.ComponentProps<typeof Link>, "aria-label"> & { label: string; onBand?: boolean };

// Logo lấy nguyên từ canvas "SAVIS Website Trang chủ" (bản C: mark 512x512, wordmark 499x200), không vẽ lại.
// Bản này mới hơn nhóm asset Logos của design system (bản cũ 256x256 / 278x120, đã thay thế trong repo).
// Hiện là PNG: cần bản SVG gốc từ nhóm thương hiệu trước khi lên production.
// Nhận props còn lại để dùng được với `asChild` của Radix.
export function Logo({ label, onBand = false, className, ...linkProps }: Props) {
  return (
    <Link aria-label={label} className={cn("flex flex-none items-center gap-3 text-ink", className)} {...linkProps}>
      <Image src="/brand/savis-mark.png" alt="" width={42} height={42} className="size-[42px]" preload />
      {onBand ? (
        <Image src="/brand/savis-wordmark-dark.png" alt="" width={499} height={200} className="h-[42px] w-auto" />
      ) : (
        <>
          <Image src="/brand/savis-wordmark-light.png" alt="" width={499} height={200} className="h-[42px] w-auto dark:hidden" />
          <Image src="/brand/savis-wordmark-dark.png" alt="" width={499} height={200} className="hidden h-[42px] w-auto dark:block" />
        </>
      )}
    </Link>
  );
}
