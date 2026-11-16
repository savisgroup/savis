"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, Fingerprint, ScanFace, ShieldCheck } from "lucide-react";
import type { HomeContent } from "@/content/home";
import { cn } from "@/lib/utils";

type Hero = HomeContent["hero"];

// Vòng lặp ký số trên điện thoại (hình trang trí, aria-hidden): quét CCCD, đối chiếu khuôn mặt (Smart eKYC), vân tay, ký xong.
// Thời lượng mỗi bước (ms); bước cuối giữ lâu hơn để người xem đọc "Certificate valid". Tổng ≈ 8 s, khớp thời gian một banner hero.
const STEP_MS = [1700, 1700, 1700, 2800] as const;
const LAST = STEP_MS.length - 1;
const TOTAL_MS = STEP_MS.reduce((a, b) => a + b, 0);
const TICK_MS = 100;

const stepAt = (elapsed: number) => {
  let t = elapsed % TOTAL_MS;
  for (let i = 0; i < STEP_MS.length; i++) {
    if (t < STEP_MS[i]) return i;
    t -= STEP_MS[i];
  }
  return LAST;
};
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Giá trị prefers-reduced-motion theo dõi được; phía server luôn false (bước đầu), client cập nhật sau hydration.
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_MOTION).matches;

// Dừng khi phần tử ra khỏi khung nhìn hoặc tab bị ẩn. Giảm chuyển động: không lặp, hiện trạng thái đã ký xong.
export function HeroSigningPhone({ c }: { c: Hero }) {
  const p = c.phone;
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Đồng hồ chạy khi banner đang hiện: banner bị ẩn (carousel đặt `inert`) thì về bước đầu để lần hiện sau chạy lại từ đầu.
  useEffect(() => {
    if (reduced || !visible) return;
    let elapsed = 0;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      if (ref.current?.closest("[inert]")) {
        elapsed = 0;
        setStep(0);
        return;
      }
      elapsed += TICK_MS;
      setStep(stepAt(elapsed));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [visible, reduced]);

  const s = reduced ? LAST : step;
  const hint = [p.scan, p.kycMethod, p.hint, p.done][s];
  const stage = "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-500 ease-[var(--ease-out)]";
  const on = (i: number) => (s === i ? "scale-100 opacity-100" : "scale-90 opacity-0");

  return (
    <div ref={ref} aria-hidden className="relative flex min-h-[520px] min-w-0 flex-[1_1_420px] justify-center">
      <div className="hero-phone -mb-10 h-[540px] w-[280px] rounded-[40px] bg-[#050b1c] p-3 shadow-[0_40px_80px_rgba(0,0,0,.45),0_0_0_1px_rgba(255,255,255,.08)]">
        <div className="flex size-full flex-col overflow-hidden rounded-[30px] bg-white text-[#1f2a44]">
          <div className="flex items-center justify-between border-b border-[#e1e7f2] px-[18px] pb-3 pt-[18px]">
            <b className="font-display text-[15px] text-[#0b1f4d]">{p.title}</b>
            <span className="rounded-full bg-[#e7f0ff] px-2 py-[3px] text-[11px] font-semibold text-[#0040c7]">{p.badge}</span>
          </div>
          <ol className="flex gap-1 px-[18px] pt-3">
            {p.steps.map((label, i) => (
              <li key={label} className={cn("flex min-w-0 flex-1 flex-col gap-1 text-[9.5px] font-semibold leading-3 transition-colors duration-500", s >= i ? "text-[#0040c7]" : "text-[#8793ad]")}>
                <span className={cn("h-1 rounded-full transition-colors duration-500", s > i || (reduced && i === LAST) ? "bg-[#0aa06e]" : s === i ? "bg-[#0052ff]" : "bg-[#e1e7f2]")} />
                <span className="truncate">{label}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-col gap-3 px-[18px] pb-4 pt-3">
            <div className="relative flex items-center gap-2.5 rounded-[12px] border border-[#e1e7f2] p-3">
              <div className="h-[42px] w-[34px] flex-none rounded-md border border-[#e1e7f2] bg-[#f3f6fc]" />
              <div className="min-w-0">
                <div className="text-[13px] font-semibold leading-[18px] text-[#0b1f4d]">{p.file}</div>
                <div className="text-[11.5px] leading-4 text-[#56617a]">{p.pages}</div>
              </div>
              <span className={cn("absolute right-2.5 top-1/2 -translate-y-1/2 -rotate-6 rounded border-2 border-[#0aa06e] px-1.5 py-0.5 text-[9.5px] font-bold uppercase leading-3 tracking-wide text-[#0aa06e] transition-[opacity,transform] duration-500 ease-[var(--ease-out)]", s === LAST ? "scale-100 opacity-100" : "scale-150 opacity-0")}>
                {c.floatB.title}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium text-[#56617a]"><span>{p.kyc}</span><span className="text-[#0052ff]">{p.kycMethod}</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#e1e7f2]">
                <div className={cn("h-full rounded-full bg-[#0052ff] transition-[width] ease-[var(--ease-out)]", s >= 1 ? "w-full duration-[1800ms]" : "w-0 duration-300")} />
              </div>
            </div>
            <div className="relative mt-1 size-[140px] self-center rounded-full bg-[#e7f0ff]">
              <div className={cn(stage, on(0))}>
                <div className="relative h-[82px] w-[116px] overflow-hidden rounded-lg border-2 border-[#0052ff] bg-white shadow-[0_0_0_6px_rgba(0,82,255,.12)]">
                  <div className="absolute left-2 top-2 h-[34px] w-[26px] rounded bg-[#dbe6fb]" />
                  <div className="absolute left-[42px] top-2.5 h-1.5 w-11 rounded bg-[#c9d6f0]" />
                  <div className="absolute left-[42px] top-[22px] h-1.5 w-8 rounded bg-[#c9d6f0]" />
                  <div className="absolute inset-x-2 bottom-2 h-1.5 rounded bg-[#e1e7f2]" />
                  <div className="hero-scan absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-transparent via-[#0052ff]/50 to-[#0052ff]/80 shadow-[0_2px_8px_rgba(0,82,255,.6)]" />
                </div>
              </div>
              <div className={cn(stage, on(1))}>
                <ScanFace className="size-[68px] text-[#0052ff]" strokeWidth={1.5} />
                <span className="hero-ring absolute inset-2 rounded-full border-[3px] border-[#0052ff]/50" />
                <span className="hero-ring absolute inset-2 rounded-full border-[3px] border-[#0052ff]/50 [animation-delay:700ms]" />
              </div>
              <div className={cn(stage, on(2))}>
                <Fingerprint className="size-[68px] text-[#0052ff]" strokeWidth={1.6} />
                <span className="hero-ring absolute inset-2 rounded-full border-[3px] border-[#0052ff]/50" />
                <span className="hero-ring absolute inset-2 rounded-full border-[3px] border-[#0052ff]/50 [animation-delay:700ms]" />
              </div>
              <div className={cn(stage, on(3))}>
                <span className="flex size-[84px] items-center justify-center rounded-full bg-[#0aa06e] text-white shadow-[0_0_0_10px_rgba(10,160,110,.18)]"><Check className="size-11" strokeWidth={2.5} /></span>
              </div>
            </div>
            <div className="text-center text-xs text-[#56617a]">{hint}</div>
          </div>
          <div className="mt-auto px-[18px] pb-[22px] pt-4">
            <div className={cn("flex h-11 items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-white transition-colors duration-500", s === LAST ? "bg-[#0aa06e]" : "bg-[#0052ff]")}>
              {s === LAST && <Check className="size-4" strokeWidth={2.5} />}
              {s === LAST ? p.signed : p.action}
            </div>
          </div>
        </div>
      </div>
      <FloatCard shown={s >= 1} className="hero-float-a left-0 top-[215px]" icon={<Check className="size-[22px] text-brand" strokeWidth={2} />} title={c.floatA.title} sub={c.floatA.sub} />
      <FloatCard shown={s === LAST} className="hero-float-b right-0 top-[395px]" icon={<ShieldCheck className="size-[22px] text-brand" strokeWidth={2} />} title={c.floatB.title} sub={c.floatB.sub} />
    </div>
  );
}

// Lớp ngoài bật/tắt hiện thẻ (mờ và trượt), lớp trong giữ chuyển động trôi liên tục của hero.
function FloatCard({ shown, className, icon, title, sub }: { shown: boolean; className: string; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className={cn("absolute transition-[opacity,transform] duration-500 ease-[var(--ease-out)]", shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0", className.replace(/hero-float-[ab] /, ""))}>
      <div className={cn("flex max-w-[230px] items-center gap-2.5 rounded-md bg-raised px-3.5 py-3 text-foreground shadow-float", className.match(/hero-float-[ab]/)?.[0])}>
        {icon}
        <div>
          <div className="text-[13.5px] font-semibold leading-[18px] text-ink">{title}</div>
          <div className="text-xs leading-4 text-muted">{sub}</div>
        </div>
      </div>
    </div>
  );
}
