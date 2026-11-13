import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { dict, isLocale, locales } from "@/lib/i18n";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MotionProvider } from "@/components/site/MotionProvider";

// Tự host qua next/font (không gọi Google từ trình duyệt). Sora không có subset vietnamese:
// Inter được xếp sau Sora trong --font-display để làm dự phòng cho dấu tiếng Việt.
const sora = Sora({ subsets: ["latin", "latin-ext"], weight: ["600", "700"], variable: "--font-sora", display: "swap" });
const inter = Inter({ subsets: ["latin", "latin-ext", "vietnamese"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.savis.vn"),
  title: { default: "SAVIS Group", template: "%s | SAVIS Group" },
};
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <MotionProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-brand focus:px-5 focus:py-3 focus:font-semibold focus:text-brand-ink"
          >
            {dict[locale].a11y.skip}
          </a>
          <Header locale={locale} />
          <main id="main" tabIndex={-1} className="outline-none">{children}</main>
          <Footer locale={locale} />
        </MotionProvider>
      </body>
    </html>
  );
}
