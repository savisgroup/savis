"use client";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 8000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type Labels = { label: string; slide: string; pause: string; play: string };

// Carousel hero: các banner xếp chồng trong cùng một ô lưới (chiều cao ổn định), tự chuyển sau mỗi INTERVAL_MS.
// Dừng khi rê chuột, khi đang focus bên trong, khi bấm nút tạm dừng, hoặc khi thiết bị bật giảm chuyển động.
export function HeroCarousel({ slides, labels }: { slides: React.ReactNode[]; labels: Labels }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || engaged || count < 2) return;
    const id = window.setTimeout(() => {
      if (window.matchMedia(REDUCED_MOTION).matches) return;
      setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, engaged, count]);

  return (
    <div
      role="region" aria-roledescription="carousel" aria-label={labels.label}
      onMouseEnter={() => setEngaged(true)} onMouseLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)} onBlur={() => setEngaged(false)}
    >
      <div className="grid">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={i} role="group" aria-roledescription="slide" aria-label={`${labels.slide} ${i + 1} / ${count}`}
              inert={!active}
              className={cn(
                "col-start-1 row-start-1 flex flex-wrap items-center gap-14 transition-opacity duration-700 ease-[var(--ease-out)] motion-reduce:transition-none",
                active ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {slide}
            </div>
          );
        })}
      </div>
      <div className="relative z-10 flex items-center gap-1 pb-7 pt-2">
        {slides.map((_, i) => (
          <button
            key={i} type="button" onClick={() => setIndex(i)}
            aria-label={`${labels.slide} ${i + 1}`} aria-current={i === index ? "true" : undefined}
            className="flex h-11 items-center px-1"
          >
            <span className={cn("block h-2.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none", i === index ? "w-7 bg-on-band-accent" : "w-2.5 bg-white/30")} />
          </button>
        ))}
        <button
          type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? labels.play : labels.pause}
          className="ml-2 flex size-11 items-center justify-center rounded-full text-on-band-muted hover:text-on-band motion-reduce:hidden"
        >
          {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
        </button>
      </div>
    </div>
  );
}
