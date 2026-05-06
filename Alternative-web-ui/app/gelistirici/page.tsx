"use client";

import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Webhook,
  Terminal,
  KeyRound,
  Zap,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import PublicNav from "@/components/marketing/PublicNav";
import SiteFooter from "@/components/marketing/SiteFooter";

const FEATURES = [
  {
    icon: <Code2 size={24} />,
    title: "REST + JSON, başka bir şey yok",
    body: "Tahmin edilebilir endpoint'ler, anlamlı hata kodları. cURL ile 1 dakikada deneyebilirsin.",
  },
  {
    icon: <Webhook size={24} />,
    title: "Gerçek zamanlı webhook'lar",
    body: "Ödeme onayı, transfer, iade — anında HTTP POST. HMAC ile imzalı.",
  },
  {
    icon: <Terminal size={24} />,
    title: "Sandbox + test cüzdanları",
    body: "Sahte para, gerçek davranış. CI'da çalıştırabileceğin idempotent API.",
  },
  {
    icon: <KeyRound size={24} />,
    title: "OAuth2 + JWT",
    body: "Endüstri standardı kimlik doğrulama. Scope bazlı izin, kısa ömürlü token.",
  },
  {
    icon: <Zap size={24} />,
    title: "1.000 req/s rate limit",
    body: "Yüksek hacim için kurumsal limit. Burst desteği ve geri-baskı header'ları.",
  },
  {
    icon: <BookOpen size={24} />,
    title: "OpenAPI 3.1 + SDK'lar",
    body: "TypeScript, Python, Go, .NET. Otomatik üretilen tipler, IDE içinde otomatik tamamlama.",
  },
];

const CODE_SAMPLE = `curl https://api.lyrabit.com.tr/v1/transactions/transfer \\
  -H "Authorization: Bearer \$LYRABIT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "receiverEmailOrUsername": "ayse",
    "amount": 250.00,
    "description": "Akşam yemeği"
  }'`;

export default function GelistiriciPage() {
  return (
    <div className="bg-white">
      <PublicNav tone="light" />

      {/* Hero */}
      <section className="relative min-h-[80vh] bg-[#0a0a0a] text-white overflow-hidden flex items-center pt-32 pb-20">
        {/* Grid background */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative w-full max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00B4FF] text-white text-xs font-bold uppercase tracking-wider mb-8">
              Geliştirici
            </div>
            <h1 className="font-black tracking-[-0.04em] leading-[0.92] text-[clamp(48px,8vw,128px)]">
              Para hareketi,<br />
              <span className="text-[#00B4FF]">tek API</span> uzakta.
            </h1>
            <p className="text-white/70 text-lg md:text-xl mt-8 max-w-xl leading-relaxed">
              Saatler değil, dakikalar içinde entegre et. Sandbox açık,
              dökümantasyon sade, SDK her dilde.
            </p>
            <div className="flex flex-wrap gap-3 mt-10">
              <a
                href="#"
                className="px-7 py-4 rounded-full bg-[#00B4FF] text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Dökümantasyona git <ArrowRight size={18} />
              </a>
              <Link
                href="/signup"
                className="px-7 py-4 rounded-full bg-transparent border-2 border-white/40 text-white font-bold hover:bg-white hover:text-black transition-colors"
              >
                API anahtarı al
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-10 text-white/60 text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Sandbox sınırsız
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} /> 99.99% uptime
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Açık kaynak SDK
              </span>
            </div>
          </div>

          {/* Code preview */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-3 text-xs font-mono text-white/50">
                  POST /v1/transactions/transfer
                </span>
              </div>
              <pre className="p-5 text-[13px] leading-relaxed font-mono text-white/90 overflow-x-auto">
                <code>{CODE_SAMPLE}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <h2 className="font-black tracking-[-0.03em] text-[clamp(40px,6vw,80px)] leading-[1] max-w-4xl text-black">
            Geliştirici deneyimi,<br />ürünün kendisi kadar önemli.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-black/10 p-8 hover:border-black transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-5">
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
            curl ile başla,<br />ürünle bitir.
          </h2>
          <Link
            href="/signup"
            className="px-7 py-4 rounded-full bg-[#00B4FF] text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
          >
            Sandbox aç <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
