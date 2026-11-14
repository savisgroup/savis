"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// Biên độ trôi parallax (px). Lớp ảnh cao hơn khung 2 × PARALLAX_PX để không lộ mép khi trôi.
const PARALLAX_PX = 28;
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

// Ảnh trụ cột với 3 lớp chuyển động, mỗi lớp một phần tử để không đè transform của nhau:
// 1. Hiện dần: mờ → rõ, thu từ 1.06 về 1 khi cuộn tới (một lần).
// 2. Parallax: trôi ±PARALLAX_PX theo vị trí cuộn, bên trong khung bo góc.
// 3. Rê chuột vào cả hàng trụ cột (class `group/pillar` ở hàng cha): phóng nhẹ 1.03.
// Giảm chuyển động: MotionConfig (reducedMotion="user") bỏ phần thu phóng của (1), chỉ giữ mờ dần;
// (2) và (3) tắt bằng CSS motion-reduce để HTML server và client giống nhau (tránh lỗi hydration).
export function PillarImage({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-PARALLAX_PX, PARALLAX_PX]);

  return (
    <div ref={ref} className={cn("relative aspect-[4/3] overflow-hidden rounded-lg bg-band", className)}>
      <motion.div style={{ y, top: -PARALLAX_PX, bottom: -PARALLAX_PX }} className="absolute inset-x-0 motion-reduce:transform-none!">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        >
          <div className="absolute inset-0 transition-transform duration-[600ms] ease-out group-hover/pillar:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/pillar:scale-100">
            <Image src={src} alt="" fill sizes="(min-width: 860px) 50vw, 100vw" className="object-cover" />
          </div>
        </motion.div>
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(11,31,77,0)_40%,rgba(11,31,77,.35)_100%)]" />
    </div>
  );
}
