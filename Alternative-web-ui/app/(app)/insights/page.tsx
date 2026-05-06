"use client";

import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, Target, AlertTriangle, Lightbulb } from 'lucide-react';

const CATEGORIES = [
  { name: 'Yemek', amount: 4250, budget: 3500, color: 'bg-orange-500', light: 'bg-orange-100 text-orange-700' },
  { name: 'Ulaşım', amount: 1890, budget: 2000, color: 'bg-blue-500', light: 'bg-blue-100 text-blue-700' },
  { name: 'Abonelik', amount: 974, budget: 1000, color: 'bg-purple-500', light: 'bg-purple-100 text-purple-700' },
  { name: 'Market', amount: 3120, budget: 4000, color: 'bg-emerald-500', light: 'bg-emerald-100 text-emerald-700' },
  { name: 'Eğlence', amount: 1450, budget: 1500, color: 'bg-pink-500', light: 'bg-pink-100 text-pink-700' },
];

const MONTHLY = [
  { label: 'Ara', value: 8200 },
  { label: 'Oca', value: 9100 },
  { label: 'Şub', value: 8800 },
  { label: 'Mar', value: 11200 },
  { label: 'Nis', value: 10400 },
  { label: 'May', value: 11684 },
];

const INSIGHTS = [
  {
    icon: <AlertTriangle className="text-amber-500" size={22} />,
    title: 'Yemek bütçeni aşıyorsun',
    body: 'Bu ay yemek harcaman 4.250 TL — bütçenin 750 TL üzerinde. Haftada 2 kez evde yemek yapsan ayda ~600 TL tasarruf edebilirsin.',
    accent: 'border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900',
  },
  {
    icon: <Lightbulb className="text-blue-500" size={22} />,
    title: 'Aktif aboneliklerin',
    body: '3 aktif abonelik (Spotify, Netflix, Disney+) toplam 318,80 TL/ay. Yıllık plana geçersen ~800 TL tasarruf var.',
    accent: 'border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900',
  },
  {
    icon: <Target className="text-emerald-500" size={22} />,
    title: 'Ulaşımda iyi gidiyorsun',
    body: 'Ulaşım harcaman geçen aydan %8 daha az. BiTaksi yerine metro tercih ettiğin günlerde ortalama 110 TL tasarruf ediyorsun.',
    accent: 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900',
  },
];

export default function InsightsPage() {
  const maxMonthly = Math.max(...MONTHLY.map((m) => m.value));
  const totalThisMonth = CATEGORIES.reduce((s, c) => s + c.amount, 0);
  const totalBudget = CATEGORIES.reduce((s, c) => s + c.budget, 0);

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-lyraBlue text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} /> AI Insights
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Harcama Analizleri</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Asistanın senin için izledikleri.
          </p>
        </div>
      </header>

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Bu ay toplam</p>
          <p className="text-3xl font-bold tracking-tight mt-2">
            {totalThisMonth.toLocaleString('tr-TR')} <span className="text-base text-gray-400 font-semibold">TL</span>
          </p>
          <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp size={12} /> Bütçenin %{Math.round((totalThisMonth / totalBudget) * 100)}'i kullanıldı
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Tasarruf hedefi</p>
          <p className="text-3xl font-bold tracking-tight mt-2">
            5.000 <span className="text-base text-gray-400 font-semibold">TL</span>
          </p>
          <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-lyraBlue h-full" style={{ width: '64%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">3.200 TL biriktirildi (%64)</p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Geçen aya göre</p>
          <p className="text-3xl font-bold tracking-tight mt-2 flex items-center gap-2">
            <TrendingDown className="text-emerald-500" size={24} /> %12
          </p>
          <p className="text-xs text-emerald-500 mt-1 font-semibold">Daha az harcadın 🎉</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories */}
        <section className="lg:col-span-7 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Kategori Bazında Harcama</h2>
          <div className="space-y-5">
            {(() => {
              const maxAmount = Math.max(...CATEGORIES.map((c) => c.amount));
              return CATEGORIES.map((c) => {
                const pct = Math.round((c.amount / maxAmount) * 100);
                const over = c.amount > c.budget;
                return (
                  <div key={c.name}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.light}`}>{c.name}</span>
                        {over && <span className="text-[10px] font-bold text-amber-600 uppercase">Bütçe aşıldı</span>}
                      </div>
                      <p className="text-sm font-bold">
                        {c.amount.toLocaleString('tr-TR')} <span className="text-gray-400 font-medium">TL</span>
                      </p>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${over ? 'bg-amber-500' : c.color} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </section>

        {/* Monthly trend */}
        <section className="lg:col-span-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-2">Son 6 Ay</h2>
          <p className="text-xs text-gray-500 mb-6">Aylık toplam harcama trendin</p>
          <div className="flex items-end justify-between gap-2 h-40 mb-2">
            {MONTHLY.map((m, i) => {
              const h = Math.round((m.value / maxMonthly) * 100);
              const isLast = i === MONTHLY.length - 1;
              return (
                <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-xl transition-all ${isLast ? 'bg-lyraBlue' : 'bg-gray-200 dark:bg-slate-700'}`}
                    style={{ height: `${h}%`, minHeight: '8px' }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between gap-2">
            {MONTHLY.map((m) => (
              <span key={m.label} className="flex-1 text-center text-xs text-gray-500 font-medium">{m.label}</span>
            ))}
          </div>
        </section>
      </div>

      {/* AI insights */}
      <section>
        <h2 className="text-xl font-bold mb-4">Senin İçin Notlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {INSIGHTS.map((i, idx) => (
            <div key={idx} className={`rounded-[28px] p-6 border ${i.accent}`}>
              <div className="mb-4">{i.icon}</div>
              <h3 className="font-bold mb-2">{i.title}</h3>
              <p className="text-xs leading-relaxed text-gray-700 dark:text-slate-300">{i.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
