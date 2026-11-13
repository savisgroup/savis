import { cn } from "@/lib/utils";
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-3 rounded-lg border border-line bg-raised p-6", className)} {...props} />;
}
