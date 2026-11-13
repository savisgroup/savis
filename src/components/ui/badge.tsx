import { cn } from "@/lib/utils";
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full bg-chip px-3 py-1 text-xs font-semibold tracking-wide text-chip-ink", className)}
      {...props}
    />
  );
}
