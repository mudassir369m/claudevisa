import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-[120px] font-extrabold leading-none text-gold-gradient">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-white/55">The link may be broken or the page may have moved.</p>
      <Link href="/" className="btn-gold mt-8 rounded-full px-7 py-3.5 text-sm">
        Back to home →
      </Link>
    </div>
  );
}
