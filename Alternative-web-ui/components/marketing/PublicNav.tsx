"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Bireysel", href: "/bireysel" },
  { label: "Kurumsal", href: "/kurumsal" },
  { label: "Geliştirici", href: "/gelistirici" },
];

type Tone = "light" | "dark";

export default function PublicNav({ tone = "light" }: { tone?: Tone }) {
  const pathname = usePathname();
  const isLight = tone === "light";

  const linkBase = isLight ? "text-white/80 hover:text-white" : "text-black/70 hover:text-black";
  const linkActive = isLight ? "text-white" : "text-black";
  const ctaPrimary = isLight
    ? "bg-black text-white"
    : "bg-black text-white";
  const ctaGhost = isLight ? "text-white" : "text-black";
  const brand = isLight ? "text-white" : "text-black";

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 flex items-center justify-between">
      <Link href="/" className={`flex items-center gap-2.5 ${brand}`}>
        <img
          src="/lyrabit-logo.png"
          alt="LyraBit"
          className="w-10 h-10 rounded-lg object-cover"
        />
        <span className="font-black text-xl tracking-tight">LyraBit</span>
      </Link>
      <nav className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                active ? linkActive : linkBase
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className={`px-5 py-2.5 text-sm font-bold hover:opacity-80 transition-opacity ${ctaGhost}`}
        >
          Giriş Yap
        </Link>
        <Link
          href="/signup"
          className={`px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity ${ctaPrimary}`}
        >
          Hesap Aç
        </Link>
      </div>
    </header>
  );
}
