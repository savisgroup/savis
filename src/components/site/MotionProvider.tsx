"use client";
import { MotionConfig } from "framer-motion";

// Theo design system: tôn trọng cài đặt giảm chuyển động của người dùng cho mọi animation Framer Motion.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
