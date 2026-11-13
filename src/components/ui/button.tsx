import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Theo design system: nút pill, mỗi cụm chỉ một `primary`; hành động thứ hai dùng `ghost` (hoặc `onBand` trên dải navy).
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent font-semibold transition-[filter,color,border-color] duration-[var(--motion-fast)] ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-ink hover:brightness-[1.08]",
        ghost: "border-current bg-transparent text-ink hover:text-brand",
        onBand: "border-current bg-transparent text-on-band hover:text-on-band-accent",
      },
      size: { default: "min-h-[46px] px-[22px] text-[15px] leading-5", sm: "min-h-10 px-[18px] text-sm leading-5" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = "Button";
export { buttonVariants };
