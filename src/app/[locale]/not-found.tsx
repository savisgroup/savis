import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-3 text-muted">Page not found.</p>
      <Link href="/" className="mt-6 inline-block font-semibold text-brand">← Home</Link>
    </div>
  );
}
