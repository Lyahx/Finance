"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Power,
  ArrowRight,
  Info,
  Bell,
} from 'lucide-react';

type FxRule = {
  id: string;
  pair: 'USD/TRY' | 'EUR/TRY' | 'GBP/TRY';
  trigger: 'below' | 'above';
  threshold: number;
  amount: number;
  enabled: boolean;
  triggered?: number; // kaç kere tetiklendi
};

const INITIAL_FX: FxRule[] = [
  { id: 'fx1', pair: 'USD/TRY', trigger: 'above', threshold: 40,   amount: 1000, enabled: true,  triggered: 0 },
  { id: 'fx2', pair: 'EUR/TRY', trigger: 'below', threshold: 42,   amount: 500,  enabled: true,  triggered: 2 },
  { id: 'fx3', pair: 'USD/TRY', trigger: 'above', threshold: 45,   amount: 2000, enabled: false, triggered: 0 },
  { id: 'fx4', pair: 'GBP/TRY', trigger: 'below', threshold: 48.5, amount: 300,  enabled: true,  triggered: 1 },
];

// Son 30 günün USD/TRY kuru (mock)
const USD_HISTORY = [
  37.8, 37.9, 38.1, 38.0, 38.3, 38.5, 38.4, 38.6, 38.9, 39.1,
  39.0, 39.2, 39.5, 39.4, 39.3, 39.6, 39.8, 39.7, 39.9, 40.1,
  39.8, 39.6, 39.7, 39.9, 40.2, 40.4, 40.1, 40.3, 40.6, 40.5,
];

const RATES = [
  { pair: 'USD/TRY' as const, current: 40.5, change: '+1.84%', up: true,  flag: '🇺🇸' },
  { pair: 'EUR/TRY' as const, current: 43.2, change: '+0.95%', up: true,  flag: '🇪🇺' },
  { pair: 'GBP/TRY' as const, current: 49.1, change: '-0.42%', up: false, flag: '🇬🇧' },
];

const TRIGGER_HISTORY = [
  { rule: 'EUR/TRY ≤ 42', amount: 500, when: '12 Nis 2026', rate: 41.8 },
  { rule: 'EUR/TRY ≤ 42', amount: 500, when: '28 Mar 2026', rate: 41.9 },
  { rule: 'GBP/TRY ≤ 48.5', amount: 300, when: '04 Mar 2026', rate: 48.3 },
];

export default function RulesPage() {
  const [rules, setRules] = useState<FxRule[]>(INITIAL_FX);
  const [showNew, setShowNew] = useState(false);

  const toggle = (id: string) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  const remove = (id: string) =>
    setRules((rs) => rs.filter((r) => r.id !== id));

  const activeCount = rules.filter((r) => r.enabled).length;
  const totalTriggered = rules.reduce((s, r) => s + (r.triggered ?? 0), 0);

  // SVG sparkline path
  const min = Math.min(...USD_HISTORY) - 0.2;
  const max = Math.max(...USD_HISTORY) + 0.2;
  const range = max - min;
  const w = 600;
  const h = 160;
  const points = USD_HISTORY.map((v, i) => {
    const x = (i / (USD_HISTORY.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${w},${h} L 0,${h} Z`;

  // Hangi kurallar bu chart'ta görünür (USD/TRY için)
  const usdRules = rules.filter((r) => r.pair === 'USD/TRY');

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-lyraBlue text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp size={14} /> Otomasyon
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Otomatik Kurallar</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Belirlediğin kur eşiğine ulaşıldığında otomatik döviz alımı veya satışı yapılır.
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="bg-lyraBlue hover:bg-lyraBlue-dark text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
        >
          <Plus size={18} /> Yeni Kural
        </button>
      </header>

      {/* Canlı kurlar */}
      <section className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Canlı Kurlar</h2>
          <p className="text-[11px] text-gray-400">Son güncelleme: az önce</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {RATES.map((r) => (
            <div
              key={r.pair}
              className="rounded-2xl border border-gray-100 dark:border-slate-800 p-4 hover:border-lyraBlue transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{r.flag}</span>
                  <span className="font-bold text-sm">{r.pair}</span>
                </div>
                <span
                  className={`text-xs font-bold flex items-center gap-0.5 ${
                    r.up ? 'text-emerald-500' : 'text-red-500'
                  }`}
                >
                  {r.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {r.change}
                </span>
              </div>
              <p className="text-2xl font-bold tracking-tight tabular-nums">
                {r.current.toFixed(2)}
                <span className="text-sm text-gray-400 font-medium ml-1">TL</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* USD/TRY trend grafiği */}
      <section className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="font-bold">USD/TRY · Son 30 Gün</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Aktif kurallar yatay çizgi olarak işaretli
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="w-3 h-3 rounded bg-lyraBlue" /> Kur
            </span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="w-3 h-0.5 bg-emerald-500" /> Eşik
            </span>
          </div>
        </div>

        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${w} ${h + 30}`}
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="rate-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0055ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0055ff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Threshold lines */}
            {usdRules.filter((r) => r.enabled).map((r) => {
              const y = h - ((r.threshold - min) / range) * h;
              if (y < 0 || y > h) return null;
              const color = r.trigger === 'above' ? '#10b981' : '#f59e0b';
              return (
                <g key={r.id}>
                  <line
                    x1="0"
                    y1={y}
                    x2={w}
                    y2={y}
                    stroke={color}
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                  <text x={w - 4} y={y - 4} textAnchor="end" fontSize="11" fontWeight="700" fill={color}>
                    {r.threshold} TL · {r.trigger === 'above' ? 'üst' : 'alt'}
                  </text>
                </g>
              );
            })}

            {/* Area + line */}
            <path d={areaD} fill="url(#rate-fill)" />
            <path d={pathD} stroke="#0055ff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

            {/* Last point */}
            {(() => {
              const last = USD_HISTORY[USD_HISTORY.length - 1];
              const x = w;
              const y = h - ((last - min) / range) * h;
              return (
                <>
                  <circle cx={x} cy={y} r="5" fill="#0055ff" />
                  <circle cx={x} cy={y} r="9" fill="#0055ff" opacity="0.2" />
                </>
              );
            })()}

            {/* X-axis labels */}
            <text x="0" y={h + 18} fontSize="10" fill="#94a3b8">
              30g önce
            </text>
            <text x={w / 2} y={h + 18} fontSize="10" fill="#94a3b8" textAnchor="middle">
              15g önce
            </text>
            <text x={w} y={h + 18} fontSize="10" fill="#94a3b8" textAnchor="end">
              Bugün
            </text>
          </svg>
        </div>
      </section>

      {/* Açıklama / nasıl çalışır */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-[24px] p-5 flex items-start gap-3">
        <Info className="text-lyraBlue shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200">
            Kurallar nasıl çalışır?
          </h4>
          <p className="text-xs text-blue-800 dark:text-blue-300 mt-1 leading-relaxed">
            Belirlediğin eşiğe (örn. USD/TRY 40 TL üstüne çıkarsa) ulaşıldığında belirttiğin
            tutarda otomatik döviz alımı tetiklenir. Yatırım tavsiyesi değil — kuru sürekli takip
            etmekten kurtarır. Tetiklenen her kural anında bildirim olarak sana ulaşır.
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Aktif Kural
          </p>
          <p className="text-3xl font-bold tracking-tight mt-2">
            {activeCount}
            <span className="text-base text-gray-400 font-semibold ml-1">/ {rules.length}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {rules.length - activeCount} pasif kural var
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Bu Yıl Tetiklenen
          </p>
          <p className="text-3xl font-bold tracking-tight mt-2">{totalTriggered}</p>
          <p className="text-xs text-emerald-500 mt-1 font-semibold">
            ~{(totalTriggered * 1000).toLocaleString('tr-TR')} TL otomatik dönüştürüldü
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Bildirim
          </p>
          <p className="text-3xl font-bold tracking-tight mt-2 flex items-center gap-2">
            <Bell size={22} className="text-amber-500" /> Açık
          </p>
          <p className="text-xs text-gray-500 mt-1">Tetiklenen kurallarda anında bildirim</p>
        </div>
      </div>

      {/* Kurallar listesi */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Kurallarım</h2>
          <span className="text-xs text-gray-500">{rules.length} kural</span>
        </div>

        <div className="space-y-3">
          {rules.map((r) => (
            <div
              key={r.id}
              className={`bg-white dark:bg-slate-900/50 border rounded-[24px] p-5 transition-all ${
                r.enabled ? 'border-gray-100 dark:border-slate-800' : 'border-gray-100 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-lyraBlue flex items-center justify-center font-bold text-xs">
                    {r.pair.split('/')[0]}
                  </div>
                  <div>
                    <p className="font-bold flex items-center gap-2 flex-wrap">
                      {r.pair}
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          r.trigger === 'above'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        }`}
                      >
                        {r.trigger === 'above' ? '↗ Üstüne çıkarsa' : '↘ Altına düşerse'}
                      </span>
                      {r.triggered != null && r.triggered > 0 && (
                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                          · {r.triggered}× tetiklendi
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-gray-700 dark:text-slate-200">
                        {r.threshold} TL
                      </span>
                      olduğunda
                      <ArrowRight size={12} />
                      <span className="font-bold text-gray-700 dark:text-slate-200">
                        {r.amount} {r.pair.split('/')[0]}
                      </span>
                      al
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggle(r.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      r.enabled
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Power size={14} /> {r.enabled ? 'Aktif' : 'Pasif'}
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowNew(true)}
            className="w-full px-4 py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-500 hover:border-lyraBlue hover:text-lyraBlue transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Yeni Kur Kuralı Ekle
          </button>
        </div>
      </section>

      {/* Tetiklenme geçmişi */}
      <section className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
        <h2 className="font-bold mb-4">Son Tetiklenmeler</h2>
        {TRIGGER_HISTORY.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">Henüz tetiklenmiş kural yok.</p>
        ) : (
          <div className="space-y-2">
            {TRIGGER_HISTORY.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <TrendingDown size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.rule}</p>
                    <p className="text-[11px] text-gray-500">
                      {t.when} · kur {t.rate}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold">+{t.amount}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {showNew && (
        <NewRuleModal
          onCancel={() => setShowNew(false)}
          onSave={(r) => {
            setRules((rs) => [...rs, { ...r, id: 'fx' + Date.now(), enabled: true, triggered: 0 }]);
            setShowNew(false);
          }}
        />
      )}
    </div>
  );
}

function NewRuleModal({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (r: Omit<FxRule, 'id' | 'enabled' | 'triggered'>) => void;
}) {
  const [pair, setPair] = useState<FxRule['pair']>('USD/TRY');
  const [trigger, setTrigger] = useState<'below' | 'above'>('above');
  const [threshold, setThreshold] = useState('40');
  const [amount, setAmount] = useState('1000');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[28px] shadow-2xl w-full max-w-md p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold tracking-tight mb-1">Yeni Kur Kuralı</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">
          Eşiğe ulaşıldığında otomatik dönüşüm tetiklenir.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              Döviz Çifti
            </label>
            <div className="flex gap-2 mt-2">
              {(['USD/TRY', 'EUR/TRY', 'GBP/TRY'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPair(p)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    pair === p
                      ? 'bg-lyraBlue text-white'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              Tetikleyici
            </label>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setTrigger('above')}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  trigger === 'above'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                }`}
              >
                <TrendingUp size={14} /> Üstüne çıkarsa
              </button>
              <button
                onClick={() => setTrigger('below')}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  trigger === 'below'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                }`}
              >
                <TrendingDown size={14} /> Altına düşerse
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Eşik (TL)
              </label>
              <input
                type="number"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="mt-2 w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl border-2 border-transparent focus:border-lyraBlue outline-none transition-all font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Tutar ({pair.split('/')[0]})
              </label>
              <input
                type="number"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2 w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl border-2 border-transparent focus:border-lyraBlue outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            <strong>{pair}</strong> {Number(threshold).toLocaleString('tr-TR')} TL'nin{' '}
            <strong>{trigger === 'above' ? 'üstüne çıkarsa' : 'altına düşerse'}</strong>, otomatik
            olarak <strong>{amount} {pair.split('/')[0]}</strong> alınacak.
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 font-semibold text-sm transition-all"
          >
            Vazgeç
          </button>
          <button
            onClick={() => {
              const t = parseFloat(threshold);
              const a = parseFloat(amount);
              if (t > 0 && a > 0) {
                onSave({ pair, trigger, threshold: t, amount: a });
              }
            }}
            className="flex-1 px-4 py-3 rounded-xl bg-lyraBlue hover:bg-lyraBlue-dark text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/30"
          >
            Kuralı Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}
