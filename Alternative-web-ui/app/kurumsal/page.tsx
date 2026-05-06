"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Receipt,
  Users,
  ShieldCheck,
  BarChart3,
  Banknote,
  CheckCircle2,
} from "lucide-react";
import PublicNav from "@/components/marketing/PublicNav";
import SiteFooter from "@/components/marketing/SiteFooter";

const FEATURES = [
  {
    icon: <Users size={24} />,
    title: "Toplu maaş & ödeme",
    body: "Tek tıkla yüzlerce çalışana maaş ya da tedarikçiye ödeme. Excel yükle, doğrula, gönder.",
  },
  {
    icon: <Receipt size={24} />,
    title: "Otomatik fatura eşleştirme",
    body: "Gelen ödemeyi açık faturanla otomatik eşleştir. Muhasebe ekibi rahat etsin.",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Gerçek zamanlı nakit akışı",
    body: "Hangi müşteriden ne zaman ne giriyor, hangi giderin ne zaman çıkıyor — tek panelde.",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Çift onay & rol bazlı erişim",
    body: "Yüksek tutarlı işlemler için zorunlu çift onay. Departman bazlı limit ve yetki.",
  },
  {
    icon: <Banknote size={24} />,
    title: "Kurumsal kart yönetimi",
    body: "Sınırsız sanal kart oluştur, harcama kategorilerini sınırla, anında dondur.",
  },
  {
    icon: <Building2 size={24} />,
    title: "ERP entegrasyonu",
    body: "Logo, Mikro, NetSuite, SAP — webhook & API ile mevcut sisteminle konuşur.",
  },
];

export default function KurumsalPage() {
  return (
    <div className="bg-white">
      <PublicNav tone="light" />

      {/* Hero */}
      <section className="relative min-h-[80vh] bg-black text-white overflow-hidden flex items-center pt-32 pb-20">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider mb-8">
            Kurumsal
          </div>
          <h1 className="font-black tracking-[-0.04em] leading-[0.92] text-[clamp(48px,9vw,140px)] max-w-5xl">
            İşin büyür,<br />finansın akar.
          </h1>
          <p className="text-white/70 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
            10 kişilik startup'tan 10.000 kişilik kuruma kadar — tek bir
            finans operasyon merkezi. Maaş, ödeme, fatura, raporlama.
          </p>
          <div className="flex flex-wrap gap-3 mt-10">
            <a
              href="mailto:satis@lyrabit.com.tr?subject=Kurumsal%20demo%20talebi"
              className="px-7 py-4 rounded-full bg-[#00B4FF] text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Demo talep et <ArrowRight size={18} />
            </a>
            <Link
              href="/signup"
              className="px-7 py-4 rounded-full bg-transparent border-2 border-white/40 text-white font-bold hover:bg-white hover:text-black transition-colors"
            >
              Ücretsiz dene
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-10 text-white/60 text-sm">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} /> BDDK uyumlu
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} /> SOC 2 Tip II
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Türkiye veri merkezi
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <h2 className="font-black tracking-[-0.03em] text-[clamp(40px,6vw,80px)] leading-[1] max-w-4xl text-black">
            Operasyonu sadeleştirir,<br />ekibini hızlandırır.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-black/10 p-8 hover:border-black transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-black/5 text-black flex items-center justify-center mb-5">
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

      {/* Stats / trust */}
      <section className="py-20 bg-[#f8fafc] border-y border-black/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { k: "₺2.4 mlr", v: "Aylık işlem hacmi" },
            { k: "12.000+", v: "Aktif şirket" },
            { k: "%99.99", v: "Uptime SLA" },
            { k: "<200ms", v: "Ortalama API yanıt" },
          ].map((s) => (
            <div key={s.v}>
              <p className="font-black text-[clamp(28px,4vw,52px)] tracking-tight text-black">
                {s.k}
              </p>
              <p className="text-sm text-black/60 mt-2">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#00B4FF] text-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <h2 className="font-black tracking-[-0.03em] text-[clamp(36px,5vw,64px)] leading-[1] max-w-2xl">
            Kurumuna özel demo<br />30 dk içinde planla.
          </h2>
          <a
            href="mailto:satis@lyrabit.com.tr?subject=Kurumsal%20demo%20talebi"
            className="px-7 py-4 rounded-full bg-black text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
          >
            Satış ekibiyle konuş <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
