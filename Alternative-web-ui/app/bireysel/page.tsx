"use client";

import Link from "next/link";
import {
  ArrowRight,
  Wallet,
  Shield,
  Sparkles,
  PiggyBank,
  Send,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import PublicNav from "@/components/marketing/PublicNav";
import SiteFooter from "@/components/marketing/SiteFooter";

const FEATURES = [
  {
    icon: <Send size={24} />,
    title: "0 komisyonla anlık transfer",
    body: "Türkiye içi tüm transferler ücretsiz. IBAN, kullanıcı adı veya QR ile saniyeler içinde gönder.",
  },
  {
    icon: <Shield size={24} />,
    title: "Akıllı fraud koruması",
    body: "Şüpheli işlem mi? AI otomatik bayraklar, sen onaylamadan para çıkmaz.",
  },
  {
    icon: <Sparkles size={24} />,
    title: "AI harcama koçu",
    body: "Nereye ne kadar harcadığını anla. Bütçe önerileri al, tasarruf hedeflerini takip et.",
  },
  {
    icon: <PiggyBank size={24} />,
    title: "Hedef kasaları",
    body: "Tatil, telefon, ev — istediğin kadar küçük cüzdan oluştur, otomatik para ayır.",
  },
  {
    icon: <Wallet size={24} />,
    title: "Tek panel, tüm hesaplar",
    body: "Banka kartların, kripto cüzdanların, abonelikler — hepsi tek ekranda.",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Akıllı raporlar",
    body: "Aylık, haftalık, kategori bazlı — paranın nereye gittiğini gerçekten gör.",
  },
];

export default function BireyselPage() {
  return (
    <div className="bg-white">
      <PublicNav tone="light" />

      {/* Hero */}
      <section className="relative min-h-[80vh] bg-[#00B4FF] overflow-hidden flex items-center pt-32 pb-20">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider mb-8">
            Bireysel
          </div>
          <h1 className="font-black text-white tracking-[-0.04em] leading-[0.92] text-[clamp(48px,9vw,140px)] max-w-5xl">
            Paranın patronu sensin.
          </h1>
          <p className="text-white/90 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
            Komisyonsuz transfer, AI destekli bütçe ve sıfır kuyruk.
            LyraBit, bireysel kullanıcılar için baştan tasarlandı.
          </p>
          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              href="/signup"
              className="px-7 py-4 rounded-full bg-black text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Ücretsiz hesap aç <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="px-7 py-4 rounded-full bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors"
            >
              Giriş yap
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-10 text-white/80 text-sm">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Aylık ücret yok
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} /> 2 dakikada hesap
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} /> İPTAL kolay
            </span>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <h2 className="font-black tracking-[-0.03em] text-[clamp(40px,6vw,80px)] leading-[1] max-w-4xl text-black">
            Sana lazım olan her şey, tek uygulamada.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-black/10 p-8 hover:border-black transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#00B4FF]/10 text-[#00B4FF] flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="font-black text-2xl tracking-tight text-black mb-3">
                  {f.title}
                </h3>
                <p className="text-black/60 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <h2 className="font-black tracking-[-0.03em] text-[clamp(36px,5vw,64px)] leading-[1] max-w-2xl">
            2 dakikada başla. Sonsuza kadar ücretsiz.
          </h2>
          <Link
            href="/signup"
            className="px-7 py-4 rounded-full bg-white text-black font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
          >
            Hesap aç <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
