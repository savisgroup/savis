import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, formatDate, isLocale } from "@/lib/i18n";
import { getInsightBySlug, getInsights, mediaUrl } from "@/lib/payload/client";
import type { Insight } from "@/lib/payload/types";
import { RichText } from "@/components/lexical/RichText";
import { InsightCard } from "@/components/insights/InsightCard";

export const revalidate = 60;
type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getInsightBySlug(locale, slug);
  if (!post) return {};
  const img = mediaUrl(post.featuredImage);
  return {
    title: post.title, description: post.summary,
    alternates: { canonical: `/${locale}/insights/${slug}`, languages: { vi: `/vi/insights/${slug}`, en: `/en/insights/${slug}` } },
    openGraph: { title: post.title, description: post.summary, type: "article", publishedTime: post.publishedDate ?? undefined, images: img ? [img] : undefined },
  };
}

export default async function InsightPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = await getInsightBySlug(locale, slug);
  if (!post) notFound();
  const t = dict[locale].insights;
  const cat = typeof post.category === "object" && post.category ? post.category.name : null;
  const date = formatDate(post.publishedDate, locale);
  const img = mediaUrl(post.featuredImage, "card");

  // Bài liên quan: ưu tiên relatedPosts đã chọn trong CMS, nếu không có thì lấy 3 bài mới nhất khác
  const picked = (post.relatedPosts ?? []).filter((r): r is Insight => typeof r === "object");
  const more = picked.length ? picked.slice(0, 3) : (await getInsights(locale, { limit: 4 })).docs.filter((d) => d.id !== post.id).slice(0, 3);

  return (
    <>
      <section className="on-band bg-band text-on-band">
        <div className="container-x py-16">
          <nav className="mb-6 text-sm text-on-band-muted" aria-label={dict[locale].a11y.breadcrumb}>
            <Link href={`/${locale}`} className="hover:text-on-band">{t.home}</Link> / <Link href={`/${locale}/insights`} className="hover:text-on-band">Insights</Link>
            {cat && <> / <span className="text-on-band">{cat}</span></>}
          </nav>
          <span className="eyebrow">{[cat, date].filter(Boolean).join(" · ")}</span>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-on-band md:text-5xl">{post.title}</h1>
          <p className="mt-5 max-w-3xl text-lg text-on-band-muted">{post.summary}</p>
        </div>
      </section>
      <article className="py-12">
        <div className="container-x">
          {img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="" className="mb-10 w-full max-w-3xl rounded-lg border border-line" />
          )}
          <RichText data={post.body} />
          {post.mediaContact && <p className="mt-10 text-sm text-muted">{t.mediaContact}: <a className="text-brand" href={`mailto:${post.mediaContact}`}>{post.mediaContact}</a></p>}
        </div>
      </article>
      {more.length > 0 && (
        <section className="bg-surface py-14">
          <div className="container-x">
            <h2 className="mb-6 text-2xl font-bold">{t.moreNews}</h2>
            <div className="grid gap-5 md:grid-cols-3">{more.map((d) => <InsightCard key={d.id} insight={d} locale={locale} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
