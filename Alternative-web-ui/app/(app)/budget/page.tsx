"use client";

import React, { useState } from 'react';
import {
  Wallet as WalletIcon,
  Plus,
  Edit3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Lightbulb,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react';

const MONTHLY_LIMIT = 15000;
const DAYS_IN_MONTH = 31;
const TODAY = 12;

const CATEGORY_BUDGETS = [
  { name: 'Yemek',     spent: 4250, limit: 3500, color: 'bg-orange-500',  light: 'text-orange-600',  emoji: '🍔' },
  { name: 'Ulaşım',    spent: 1890, limit: 2000, color: 'bg-blue-500',    light: 'text-blue-600',    emoji: '🚕' },
  { name: 'Abonelik',  spent: 974,  limit: 1000, color: 'bg-purple-500',  light: 'text-purple-600',  emoji: '🔁' },
  { name: 'Market',    spent: 3120, limit: 4000, color: 'bg-emerald-500', light: 'text-emerald-600', emoji: '🛒' },
  { name: 'Eğlence',   spent: 1450, limit: 1500, color: 'bg-pink-500',    light: 'text-pink-600',    emoji: '🎬' },
  { name: 'Sağlık',    spent: 480,  limit: 1000, color: 'bg-red-500',     light: 'text-red-600',     emoji: '💊' },
];

const WEEKLY_DATA = [
  { week: '1. Hafta', spent: 3120, peak: 'Market' },
  { week: '2. Hafta', spent: 4480, peak: 'Yemek' },
  { week: '3. Hafta', spent: 2840, peak: 'Eğlence' },
  { week: '4. Hafta', spent: 1244, peak: 'Yemek' },
];

const HISTORY = [
  { month: 'Aralık', spent: 13200, limit: 14000, status: 'under' as const },
  { month: 'Ocak',   spent: 14250, limit: 14000, status: 'over'  as const },
  { month: 'Şubat',  spent: 12800, limit: 14000, status: 'under' as const },
  { month: 'Mart',   spent: 15200, limit: 15000, status: 'over'  as const },
  { month: 'Nisan',  spent: 14400, limit: 15000, status: 'under' as const },
  { month: 'Mayıs',  spent: 11684, limit: 15000, status: 'now'   as const },
];

const TOP_MERCHANTS = [
  { name: 'Migros Sanal Market', amount: 1247.5, count: 4, emoji: '🛒' },
  { name: 'Yemeksepeti',         amount: 985.0,  count: 7, emoji: '🍔' },
  { name: 'BiTaksi',             amount: 642.3,  count: 12, emoji: '🚕' },
  { name: 'Cinemaximum',         amount: 480.0,  count: 3, emoji: '🎬' },
  { name: 'Starbucks Türkiye',   amount: 298.5,  count: 9, emoji: '☕' },
];

export default function BudgetPage() {
  const [monthlyLimit, setMonthlyLimit] = useState(MONTHLY_LIMIT);
  const totalSpent = CATEGORY_BUDGETS.reduce((s, c) => s + c.spent, 0);
  const remaining = monthlyLimit - totalSpent;
  const usedPct = Math.min(100, Math.round((totalSpent / monthlyLimit) * 100));
  const dailyBurn = totalSpent / TODAY;
  const projectedEndOfMonth = dailyBurn * DAYS_IN_MONTH;
  const projectedDelta = projectedEndOfMonth - monthlyLimit;
  const safeDailyBudget = remaining / (DAYS_IN_MONTH - TODAY);
  const willRunOutDay = remaining > 0 ? Math.ceil(remaining / dailyBurn) + TODAY : TODAY;
  const willRunOut = willRunOutDay < DAYS_IN_MONTH;

  const overBudgetCats = CATEGORY_BUDGETS.filter((c) => c.spent > c.limit);
  const maxWeekly = Math.max(...WEEKLY_DATA.map((w) => w.spent));
  const maxHistory = Math.max(...HISTORY.map((h) => h.limit));

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Bütçe</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Aylık bütçeni planla, kategori limitlerini yönet, harcama trendini izle.
          </p>
        </div>
      </header>

      {/* Hero — aylık özet */}
      <section className="bg-gradient-to-br from-lyraBlue to-blue-700 text-white rounded-[32px] p-8 shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-12 -bottom-12 w-56 h-56 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <WalletIcon size={14} /> Aylık Bütçe
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-bold tracking-tight">
                {monthlyLimit.toLocaleString('tr-TR')}
              </h2>
              <span className="text-lg opacity-80">TL</span>
              <button
                onClick={() => {
                  const v = window.prompt('Yeni bütçe (TL):', String(monthlyLimit));
                  const n = Number(v);
                  if (n > 0) setMonthlyLimit(n);
                }}
                className="ml-2 p-1 hover:bg-white/10 rounded transition-all"
              >
                <Edit3 size={14} className="opacity-70" />
              </button>
            </div>
            <p className="text-xs text-blue-100 mt-1">Mayıs 2026</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TrendingUp size={14} /> Harcanan
            </p>
            <h2 className="text-4xl font-bold tracking-tight">
              {totalSpent.toLocaleString('tr-TR')}
              <span className="text-lg opacity-80 ml-1">TL</span>
            </h2>
            <p className="text-xs text-blue-100 mt-1">%{usedPct} kullanıldı</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CalendarDays size={14} /> Kalan
            </p>
            <h2 className={`text-4xl font-bold tracking-tight ${remaining < 0 ? 'text-red-200' : ''}`}>
              {remaining.toLocaleString('tr-TR')}
              <span className="text-lg opacity-80 ml-1">TL</span>
            </h2>
            <p className="text-xs text-blue-100 mt-1">
              {DAYS_IN_MONTH - TODAY} gün için günlük güvenli:{' '}
              <strong>{Math.max(0, safeDailyBudget).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL</strong>
            </p>
          </div>
        </div>
        <div className="relative z-10 mt-6">
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${usedPct >= 100 ? 'bg-red-300' : 'bg-white'}`}
              style={{ width: `${usedPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] mt-1.5 opacity-80">
            <span>1 May</span>
            <span>Bugün ({TODAY}.gün)</span>
            <span>31 May</span>
          </div>
        </div>
      </section>

      {/* Akıllı uyarılar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InsightTile
          tone={projectedDelta > 0 ? 'warn' : 'good'}
          icon={projectedDelta > 0 ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
          title={
            projectedDelta > 0
              ? `~${Math.round(projectedDelta).toLocaleString('tr-TR')} TL aşacaksın`
              : 'Yolundasın'
          }
          body={
            projectedDelta > 0
              ? `Bu hızda gidersen ay sonunda ${Math.round(projectedEndOfMonth).toLocaleString('tr-TR')} TL harcamış olacaksın.`
              : `Bu hızda ay sonunda ~${Math.round(monthlyLimit - projectedEndOfMonth).toLocaleString('tr-TR')} TL artacak.`
          }
        />
        <InsightTile
          tone={willRunOut ? 'warn' : 'info'}
          icon={<Calendar size={20} />}
          title={willRunOut ? `${willRunOutDay}. günde bütçe biter` : 'Bütçe ay sonuna yeter'}
          body={
            willRunOut
              ? `Ortalama günlük harcaman ${Math.round(dailyBurn).toLocaleString('tr-TR')} TL. Bu hızla ay bitmeden bütçeni tüketeceksin.`
              : `Günlük ortalama ${Math.round(dailyBurn).toLocaleString('tr-TR')} TL harcadın — sürdürülebilir tempodasın.`
          }
        />
        <InsightTile
          tone="info"
          icon={<Lightbulb size={20} />}
          title="Asistan önerisi"
          body={
            overBudgetCats.length > 0
              ? `${overBudgetCats[0].name} bütçeni aşıyor (${overBudgetCats[0].spent.toLocaleString('tr-TR')} / ${overBudgetCats[0].limit.toLocaleString('tr-TR')} TL). Haftada 2 kez tasarruf önerisi gönderiliyor.`
              : 'Tüm kategoriler limit içinde — şu an ek öneri yok.'
          }
        />
      </div>

      {/* Kategori limitleri + haftalık dağılım */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Kategori Limitleri</h2>
            <span className="text-xs text-gray-500">{CATEGORY_BUDGETS.length} kategori</span>
          </div>

          <div className="space-y-5">
            {CATEGORY_BUDGETS.map((c) => {
              const pct = Math.min(100, Math.round((c.spent / c.limit) * 100));
              const over = c.spent > c.limit;
              return (
                <div key={c.name}>
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{c.emoji}</span>
                      <span className="font-bold">{c.name}</span>
                      {over && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded uppercase">
                          Aşıldı
                        </span>
                      )}
                    </div>
                    <span className={`font-bold ${over ? 'text-amber-600' : 'text-gray-700 dark:text-slate-200'}`}>
                      {c.spent.toLocaleString('tr-TR')}
                      <span className="text-gray-400 font-medium">
                        {' '}
                        / {c.limit.toLocaleString('tr-TR')}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${over ? 'bg-amber-500' : c.color} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full mt-6 px-4 py-3 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-500 hover:border-lyraBlue hover:text-lyraBlue transition-all flex items-center justify-center gap-2">
            <Plus size={16} /> Kategori Limit Ekle
          </button>
        </section>

        <section className="lg:col-span-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Bu Ayın Haftaları</h2>
            <p className="text-xs text-gray-500 mb-4">En yoğun harcadığın hafta</p>
            <div className="space-y-3">
              {WEEKLY_DATA.map((w, i) => {
                const pct = Math.round((w.spent / maxWeekly) * 100);
                const isThisWeek = i === Math.floor((TODAY - 1) / 7);
                return (
                  <div key={w.week}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`${isThisWeek ? 'font-bold text-lyraBlue' : 'font-semibold text-gray-600 dark:text-slate-300'}`}>
                        {w.week}
                        {isThisWeek && <span className="ml-1 text-[10px] uppercase">·şu an</span>}
                      </span>
                      <span className="font-bold tabular-nums">
                        {w.spent.toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${isThisWeek ? 'bg-lyraBlue' : 'bg-gray-300 dark:bg-slate-700'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">En yoğun: {w.peak}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-sm">En Çok Para Kaybettiklerin</h3>
            <div className="space-y-2">
              {TOP_MERCHANTS.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{m.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{m.name}</p>
                      <p className="text-[11px] text-gray-500">{m.count} işlem</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold tabular-nums shrink-0">
                    {m.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 6 aylık geçmiş */}
      <section className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold">Bütçe Geçmişin</h2>
            <p className="text-xs text-gray-500 mt-0.5">Son 6 ay — bütçeye uydun mu?</p>
          </div>
          <div className="flex gap-3 text-xs">
            <Legend color="bg-emerald-500" label="Bütçeye uydu" />
            <Legend color="bg-amber-500" label="Aşıldı" />
            <Legend color="bg-lyraBlue" label="Bu ay" />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3 items-end h-56">
          {HISTORY.map((h) => {
            const limitPct = (h.limit / maxHistory) * 100;
            const spentPct = (h.spent / maxHistory) * 100;
            const color =
              h.status === 'now'
                ? 'bg-lyraBlue'
                : h.status === 'over'
                ? 'bg-amber-500'
                : 'bg-emerald-500';
            return (
              <div key={h.month} className="flex flex-col items-center gap-2 h-full justify-end relative">
                {/* limit reference line */}
                <div
                  className="absolute left-0 right-0 border-t-2 border-dashed border-gray-300 dark:border-slate-600 z-10"
                  style={{ bottom: `${limitPct}%` }}
                  title={`Limit: ${h.limit.toLocaleString('tr-TR')} TL`}
                />
                <div
                  className={`w-full rounded-t-xl ${color} transition-all`}
                  style={{ height: `${spentPct}%`, minHeight: '8px' }}
                />
                <div className="text-center">
                  <p className="text-xs font-bold">{h.month}</p>
                  <p className="text-[10px] text-gray-500 tabular-nums">
                    {(h.spent / 1000).toFixed(1)}k
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4 pt-5 border-t border-gray-100 dark:border-slate-800">
          <Stat
            label="Ortalama harcama"
            value={`${Math.round(HISTORY.reduce((s, h) => s + h.spent, 0) / HISTORY.length).toLocaleString('tr-TR')} TL`}
            sub="Son 6 ay"
          />
          <Stat
            label="Bütçeye uyma oranı"
            value={`%${Math.round((HISTORY.filter((h) => h.status === 'under').length / (HISTORY.length - 1)) * 100)}`}
            sub={`${HISTORY.filter((h) => h.status === 'under').length} / ${HISTORY.length - 1} ay`}
            tone="good"
          />
          <Stat
            label="En tasarruflu ay"
            value={
              [...HISTORY]
                .filter((h) => h.status !== 'now')
                .sort((a, b) => a.spent - b.spent)[0].month
            }
            sub={`${[...HISTORY]
              .filter((h) => h.status !== 'now')
              .sort((a, b) => a.spent - b.spent)[0].spent.toLocaleString('tr-TR')} TL`}
          />
        </div>
      </section>
    </div>
  );
}

function InsightTile({
  tone,
  icon,
  title,
  body,
}: {
  tone: 'warn' | 'good' | 'info';
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  const styles = {
    warn: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300',
    good: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300',
    info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300',
  };
  const iconColor = {
    warn: 'text-amber-500',
    good: 'text-emerald-500',
    info: 'text-lyraBlue',
  };
  return (
    <div className={`rounded-[24px] p-5 border ${styles[tone]}`}>
      <div className={`mb-3 ${iconColor[tone]}`}>{icon}</div>
      <h3 className="font-bold text-sm mb-1">{title}</h3>
      <p className="text-xs leading-relaxed opacity-90">{body}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-gray-500">
      <span className={`w-3 h-3 rounded ${color}`} />
      {label}
    </span>
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
  sub?: string;
  tone?: 'good' | 'bad';
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-slate-400">
        {label}
      </p>
      <p
        className={`text-xl font-bold tracking-tight mt-1 ${
          tone === 'good' ? 'text-emerald-500' : tone === 'bad' ? 'text-red-500' : ''
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}
