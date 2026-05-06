"use client";

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Shield,
  Users,
  Sparkles,
  CreditCard,
  TrendingUp,
  Apple,
  Smartphone,
  Eye,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import PublicNav from '@/components/marketing/PublicNav';
import SiteFooter from '@/components/marketing/SiteFooter';

export default function LandingPage() {
  return (
    <div className="bg-white">
      <PublicNav />
      <Hero />
      <WhatWeDo />
      <SendReceive />
      <FraudProtection />
      <GroupWallets />
      <Analytics />
      <Download />
      <SiteFooter />
    </div>
  );
}

/* --------------------------- 1. Hero --------------------------- */

function Hero() {
  return (
    <section className="relative min-h-screen bg-[#00B4FF] overflow-hidden flex items-center pt-32 pb-20">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider mb-8">
            Türkiye için tasarlandı
          </div>
          <h1 className="font-black text-white tracking-[-0.04em] leading-[0.92] text-[clamp(56px,11vw,180px)]">
            Paranı yönet,<br />hayatını basitleştir.
          </h1>
          <p className="text-white/90 text-lg md:text-xl mt-8 max-w-xl leading-relaxed">
            PayPal para taşır, biz paranı yönetiriz. Akıllı transfer, fraud koruması,
            harcama analizi — hepsi tek uygulamada.
          </p>
          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              href="/signup"
              className="px-7 py-4 rounded-full bg-black text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Hesap aç <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="px-7 py-4 rounded-full bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors"
            >
              Giriş yap
            </Link>
          </div>
          <div className="flex items-center gap-6 mt-10 text-white/80 text-sm">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} /> 0 komisyon
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} /> 7/24 erişim
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} /> BDDK uyumlu
            </span>
          </div>
        </div>

        {/* Phone mockup, asymmetric */}
        <div className="lg:col-span-5 relative h-[480px] md:h-[600px] flex justify-center lg:justify-end items-center">
          <PhoneMockup />
        </div>
      </div>

      {/* Decorative wordmark behind */}
      <div className="absolute -bottom-8 right-0 left-0 text-center pointer-events-none select-none">
        <span className="font-black text-white/10 tracking-tighter text-[200px] leading-none whitespace-nowrap">
          LYRABIT
        </span>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative" style={{ transform: 'rotate(-4deg)' }}>
      <div className="w-[280px] md:w-[320px] aspect-[9/19.5] bg-[#0E1A40] rounded-[44px] p-3 shadow-2xl shadow-black/30 ring-8 ring-white/30">
        <div className="w-full h-full bg-white rounded-[36px] overflow-hidden relative">
          {/* notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black z-10" />
          <div className="p-5 pt-12 text-black">
            <p className="text-xs text-black/50">Günaydın,</p>
            <p className="text-base font-black">Furkan 👋</p>
            <div className="mt-4 p-5 rounded-3xl bg-[#0E1A40] text-white relative overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                Toplam Bakiye
              </p>
              <p className="text-3xl font-black tracking-tight mt-1 tabular-nums">
                ₺ 75.247,50
              </p>
              <p className="text-[11px] mt-1 opacity-80">+₺ 1.247 bu hafta</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="bg-black text-white py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1">
                <ArrowUpRight size={14} /> Gönder
              </button>
              <button className="bg-gray-100 text-black py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1">
                <Plus size={14} /> Yükle
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { label: 'Yemeksepeti', amt: '−₺ 247,50', date: 'Bugün' },
                { label: 'Ali Yılmaz', amt: '+₺ 500,00', date: 'Dün', pos: true },
                { label: 'Spotify', amt: '−₺ 89,90', date: '5g önce' },
              ].map((t) => (
                <div
                  key={t.label}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-black/5"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{t.label}</p>
                    <p className="text-[10px] text-black/50">{t.date}</p>
                  </div>
                  <p
                    className={`text-xs font-black tabular-nums ${
                      t.pos ? 'text-emerald-500' : 'text-black'
                    }`}
                  >
                    {t.amt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------ 2. What we do ------------------------ */

function WhatWeDo() {
  const items = [
    { num: '01', title: 'Anlık transfer', body: 'Saniyeler içinde para gönder. Email veya kullanıcı adıyla, komisyonsuz, atomik garantiyle.' },
    { num: '02', title: 'Akıllı koruma', body: '7 farklı fraud sinyali ile her transferde risk skoru. Şüpheli işlem otomatik durdurulur.' },
    { num: '03', title: 'Asistan analizi', body: 'Harcamalarını kategorize eder, abonelikleri izler, bütçeni aşmadan önce uyarır.' },
  ];

  return (
    <section className="bg-[#F5F4F0] py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mb-16 md:mb-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/50 mb-4">
            — Ne yapıyoruz
          </p>
          <h2 className="font-black text-black tracking-tight leading-[0.95] text-[clamp(40px,7vw,96px)]">
            Sıradan bir cüzdan değil. <span className="text-[#0070BA]">Asistan.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {items.map((it) => (
            <div key={it.num} className="border-t-2 border-black pt-6">
              <p className="font-black text-black text-7xl md:text-8xl tracking-tight leading-none mb-6">
                {it.num}
              </p>
              <h3 className="font-black text-black text-2xl md:text-3xl tracking-tight mb-3">
                {it.title}
              </h3>
              <p className="text-black/60 leading-relaxed">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------- 3. Send & Receive ---------------------- */

function SendReceive() {
  return (
    <section className="bg-[#0E1A40] text-white py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative">
          {/* Lifestyle photo composited with UI */}
          <div className="relative rounded-[32px] overflow-hidden aspect-[4/5] bg-gradient-to-br from-orange-200 to-pink-300">
            <img
              src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=900&q=80&auto=format&fit=crop"
              alt="Cafede telefon kullanan kişi"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Transfer card overlay */}
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-72 bg-white text-black p-5 rounded-3xl shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/50">
                Yeni Transfer
              </p>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 text-white flex items-center justify-center font-black">
                  AY
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">Ali Yılmaz</p>
                  <p className="text-[11px] text-black/50">@ali_yilmaz</p>
                </div>
              </div>
              <p className="text-3xl font-black tabular-nums mt-3">₺ 1.247,50</p>
              <button className="mt-3 w-full px-4 py-2.5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center gap-1">
                Gönder <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
            — Transfer
          </p>
          <h2 className="font-black tracking-tight leading-[0.95] text-[clamp(40px,6.5vw,88px)] mb-6">
            Saniyeler içinde,<br />
            <span className="text-[#00B4FF]">komisyonsuz.</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-lg mb-8">
            Email ya da kullanıcı adıyla anında transfer. Atomik garanti — yetersiz bakiyede
            otomatik geri alma. Yüksek tutarlarda fraud kontrolü.
          </p>
          <ul className="space-y-3">
            {[
              'IBAN gerekmez',
              'EFT/Havale ücreti yok',
              '7 sinyalle anlık risk skoru',
              'Bekleyen transferleri sen onaylarsın',
            ].map((p) => (
              <li key={p} className="flex items-center gap-3 text-white/80">
                <span className="w-6 h-6 rounded-full bg-[#00B4FF] text-black flex items-center justify-center">
                  <Check />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="mt-10 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-black font-bold hover:opacity-90 transition-opacity"
          >
            Şimdi başla <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Check() {
  return <CheckCircle2 size={14} strokeWidth={3} />;
}

/* --------------------- 4. Fraud Protection --------------------- */

function FraudProtection() {
  return (
    <section className="bg-[#F5F4F0] py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1">
          {/* Risk score visual */}
          <div className="relative">
            <div className="rounded-[32px] bg-white border-2 border-black p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
                    Şüpheli işlem · Skor 78
                  </p>
                  <p className="font-black text-2xl mt-1">Yüksek Risk</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase">
                  İncelemede
                </span>
              </div>

              <div className="space-y-4">
                <RiskRow label="Tutar" value="50.000,00 TL" risk="high" detail="Eşik: 30.000+" />
                <RiskRow label="İşlem zamanı" value="03:14" risk="high" detail="Gece saatleri" />
                <RiskRow label="Alıcı geçmişi" value="İlk kez" risk="high" detail="Önceden transfer yok" />
                <RiskRow label="Cihaz" value="Bilinmeyen" risk="med" detail="Yeni device fingerprint" />
                <RiskRow label="IP konumu" value="İstanbul, TR" risk="low" detail="Bilinen lokasyon" />
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 px-4 py-3 rounded-full bg-black text-white font-bold text-sm">
                  Onayla
                </button>
                <button className="flex-1 px-4 py-3 rounded-full bg-red-50 text-red-600 font-bold text-sm border-2 border-red-200">
                  İptal et
                </button>
              </div>
            </div>
            {/* Sticker */}
            <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-black text-white text-xs font-black uppercase tracking-wider rotate-3">
              ⚡ 7 sinyal · canlı
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/50 mb-4">
            — Güvenlik
          </p>
          <h2 className="font-black text-black tracking-tight leading-[0.95] text-[clamp(40px,6.5vw,88px)] mb-6">
            Asistanın seni dolandırıcılıktan korur.
          </h2>
          <p className="text-black/60 text-lg leading-relaxed max-w-lg">
            Her transfer 7 farklı sinyalden geçer: tutar, saat, alıcı geçmişi, cihaz parmak izi,
            IP, hesap yaşı, kanal. Yüksek risk skoru aldıysa para incelemeye düşer — sen
            onaylamadan tamamlanmaz.
          </p>
        </div>
      </div>
    </section>
  );
}

function RiskRow({
  label,
  value,
  risk,
  detail,
}: {
  label: string;
  value: string;
  risk: 'high' | 'med' | 'low';
  detail: string;
}) {
  const dot = {
    high: 'bg-red-500',
    med: 'bg-amber-500',
    low: 'bg-emerald-500',
  }[risk];
  return (
    <div className="flex items-center gap-4">
      <span className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`} />
      <div className="flex-1 min-w-0 flex items-baseline justify-between gap-3">
        <span className="text-sm font-bold text-black">{label}</span>
        <span className="text-sm font-black tabular-nums">{value}</span>
      </div>
      <span className="text-[10px] text-black/40 hidden md:block w-32 text-right">{detail}</span>
    </div>
  );
}

/* ------------------------ 5. Group Wallets --------------------- */

function GroupWallets() {
  return (
    <section className="bg-[#C5E8D8] py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/50 mb-4">
            — Group Wallet
          </p>
          <h2 className="font-black text-black tracking-tight leading-[0.95] text-[clamp(40px,6.5vw,88px)] mb-6">
            Birlikte<br />biriktirin.
          </h2>
          <p className="text-black/70 text-lg leading-relaxed max-w-lg mb-8">
            Ev arkadaşlarınla kira, geziden ortak harcama, doğum günü hediyesi.
            Otomatik bölüşüm, kim kaç ödedi takibi — kafa karışıklığı yok.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-black text-white font-bold hover:opacity-90 transition-opacity"
          >
            Grup oluştur <ArrowRight size={18} />
          </Link>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-[32px] bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/50">
                  Aktif Grup
                </p>
                <p className="font-black text-2xl mt-1">Bodrum Tatili 2026</p>
              </div>
              <Users size={28} className="text-black" />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-black/50">
                  Toplanan
                </p>
                <p className="font-black tabular-nums text-3xl">
                  ₺ 18.750
                  <span className="text-sm text-black/40 font-bold">
                    {' '}
                    / 24.000
                  </span>
                </p>
              </div>
              <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-black" style={{ width: '78%' }} />
              </div>
            </div>

            <div className="space-y-2">
              {[
                { name: 'Furkan B.', initials: 'FB', amount: 5000 },
                { name: 'Ayşe K.', initials: 'AK', amount: 5000 },
                { name: 'Mehmet D.', initials: 'MD', amount: 4500 },
                { name: 'Semra Y.', initials: 'SY', amount: 4250 },
              ].map((m) => (
                <div key={m.name} className="flex items-center justify-between p-3 rounded-xl border border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">
                      {m.initials}
                    </div>
                    <p className="font-bold text-sm">{m.name}</p>
                  </div>
                  <p className="font-black tabular-nums">
                    ₺ {m.amount.toLocaleString('tr-TR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------ 6. Analytics ------------------------- */

function Analytics() {
  const cats = [
    { name: 'Yemek', val: 4250, pct: 100, color: 'bg-[#00B4FF]' },
    { name: 'Market', val: 3120, pct: 73, color: 'bg-[#C5E8D8]' },
    { name: 'Ulaşım', val: 1890, pct: 44, color: 'bg-[#F5F4F0]' },
    { name: 'Eğlence', val: 1450, pct: 34, color: 'bg-amber-500' },
    { name: 'Abonelik', val: 974, pct: 23, color: 'bg-pink-500' },
  ];

  return (
    <section className="bg-black text-white py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
            — Analiz
          </p>
          <h2 className="font-black tracking-tight leading-[0.92] text-[clamp(48px,8vw,120px)] mb-8">
            Para nereye gitti?
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-md mb-8">
            Her harcaman otomatik kategorize. Aylık trend, abonelik takibi, bütçe aşım uyarıları.
            Asistan sana ne kadar tasarruf edebileceğini söyler.
          </p>
          <div className="grid grid-cols-2 gap-6 max-w-md">
            <Stat label="Bu ay" value="₺ 11.684" sub="Bütçenin %78'i" />
            <Stat label="Geçen aydan" value="−%12" sub="Daha az 🎉" tone="up" />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          {cats.map((c) => (
            <div key={c.name} className="border-b border-white/15 pb-3">
              <div className="flex justify-between mb-2">
                <span className="text-xl font-black">{c.name}</span>
                <span className="text-xl font-black tabular-nums">
                  ₺ {c.val.toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${c.color}`} style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: 'up';
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{label}</p>
      <p className={`font-black text-3xl tabular-nums mt-1 ${tone === 'up' ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-xs text-white/60 mt-1">{sub}</p>
    </div>
  );
}

/* ------------------------- 7. Download ------------------------- */

function Download() {
  return (
    <section className="bg-[#00B4FF] py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/60 mb-4">
          — Mobil
        </p>
        <h2 className="font-black text-black tracking-tight leading-[0.92] text-[clamp(56px,10vw,160px)]">
          Hepsi tek<br />uygulamada.
        </h2>

        <div className="mt-12 flex flex-col items-center">
          <div className="w-44 h-44 bg-white rounded-3xl shadow-2xl shadow-black/20 p-4 flex items-center justify-center">
            <QRCodePlaceholder />
          </div>
          <p className="mt-4 text-sm font-bold text-black/70">QR'ı tara, uygulamayı indir</p>

          <div className="flex gap-3 mt-8">
            <a
              href="#"
              className="px-6 py-3.5 rounded-full bg-black text-white flex items-center gap-3 font-bold hover:opacity-90 transition-opacity"
            >
              <Apple size={20} />
              <div className="text-left leading-tight">
                <p className="text-[10px] font-medium opacity-70">İndir</p>
                <p className="text-sm font-black">App Store</p>
              </div>
            </a>
            <a
              href="#"
              className="px-6 py-3.5 rounded-full bg-black text-white flex items-center gap-3 font-bold hover:opacity-90 transition-opacity"
            >
              <Smartphone size={20} />
              <div className="text-left leading-tight">
                <p className="text-[10px] font-medium opacity-70">İndir</p>
                <p className="text-sm font-black">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function QRCodePlaceholder() {
  // Simple square QR-style decoration
  const cells = Array.from({ length: 9 * 9 }, () => Math.random() > 0.45);
  return (
    <div className="grid grid-cols-9 gap-[2px] w-full h-full">
      {cells.map((on, i) => (
        <div
          key={i}
          className={on ? 'bg-black rounded-[2px]' : 'bg-transparent'}
        />
      ))}
    </div>
  );
}

