"use client";
import { motion } from "framer-motion";

// Hiện dần khi cuộn tới. Không đọc useReducedMotion ở đây: giá trị đó khác nhau giữa server và client nên gây lỗi
// hydration. MotionConfig reducedMotion="user" (MotionProvider) đã bỏ phần dịch chuyển, chỉ giữ mờ dần.
export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
