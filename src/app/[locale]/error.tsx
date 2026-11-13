"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { isLocale } from "@/lib/i18n";

const copy = {
  vi: { title: "Đã có lỗi xảy ra.", body: "Chúng tôi không tải được nội dung lúc này. Vui lòng thử lại.", retry: "Thử lại" },
  en: { title: "Something went wrong.", body: "We could not load this content right now. Please try again.", retry: "Try again" },
} as const;

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ locale?: string }>();
  const t = copy[params.locale && isLocale(params.locale) ? params.locale : "vi"];
  useEffect(() => {
    console.error("[route error]", error.digest ?? "", error);
  }, [error]);
  return (
    <section className="py-[var(--space-9)]">
      <div className="container-x flex flex-col items-start gap-4">
        <h1 className="text-[clamp(28px,3.4vw,42px)] font-bold leading-[1.1]">{t.title}</h1>
        <p className="max-w-xl text-muted">{t.body}</p>
        <Button onClick={reset}>{t.retry}</Button>
      </div>
    </section>
  );
}
