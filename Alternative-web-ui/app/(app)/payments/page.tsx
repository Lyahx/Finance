"use client";

import React, { useState } from 'react';
import {
  Lightbulb,
  Droplet,
  Flame,
  Smartphone,
  Wifi,
  Tv,
  Bus,
  Car,
  Receipt,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

type BillProvider = {
  id: string;
  name: string;
  category: 'electric' | 'water' | 'gas' | 'mobile' | 'internet' | 'tv' | 'transit' | 'fuel';
  icon: React.ReactNode;
  color: string;
};

const PROVIDERS: BillProvider[] = [
  { id: 'bedas', name: 'BEDAŞ', category: 'electric', icon: <Lightbulb size={20} />, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400' },
  { id: 'iski', name: 'İSKİ', category: 'water', icon: <Droplet size={20} />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' },
  { id: 'igdas', name: 'İGDAŞ', category: 'gas', icon: <Flame size={20} />, color: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400' },
  { id: 'turkcell', name: 'Turkcell', category: 'mobile', icon: <Smartphone size={20} />, color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' },
  { id: 'turknet', name: 'TurkNet', category: 'internet', icon: <Wifi size={20} />, color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' },
  { id: 'digiturk', name: 'D-Smart', category: 'tv', icon: <Tv size={20} />, color: 'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400' },
  { id: 'istanbulkart', name: 'İstanbulkart', category: 'transit', icon: <Bus size={20} />, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
  { id: 'opet', name: 'OPET', category: 'fuel', icon: <Car size={20} />, color: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' },
];

type Bill = {
  id: string;
  provider: BillProvider;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidAt?: string;
  reference: string;
};

const INITIAL_BILLS: Bill[] = [
  { id: 'b1', provider: PROVIDERS[0], amount: 487.5,  dueDate: '2026-05-12', paid: false, reference: '4422-...-9831' },
  { id: 'b2', provider: PROVIDERS[1], amount: 142.3,  dueDate: '2026-05-15', paid: false, reference: '7711-...-2204' },
  { id: 'b3', provider: PROVIDERS[2], amount: 689.0,  dueDate: '2026-05-20', paid: false, reference: '5566-...-7710' },
  { id: 'b4', provider: PROVIDERS[3], amount: 199.9,  dueDate: '2026-05-08', paid: true,  paidAt: '2026-05-04', reference: '0532-...-1198' },
  { id: 'b5', provider: PROVIDERS[4], amount: 349.0,  dueDate: '2026-05-18', paid: true,  paidAt: '2026-05-02', reference: 'TKN-...-7745' },
  { id: 'b6', provider: PROVIDERS[6], amount: 75.0,   dueDate: '2026-05-30', paid: true,  paidAt: '2026-04-30', reference: 'IK-...-9931' },
];

export default function PaymentsPage() {
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [tab, setTab] = useState<'pending' | 'paid' | 'all'>('pending');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2800);
  };

  const filtered = bills.filter((b) =>
    tab === 'pending' ? !b.paid : tab === 'paid' ? b.paid : true,
  );

  const pendingTotal = bills.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0);
  const pendingCount = bills.filter((b) => !b.paid).length;
  const paidThisMonth = bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);

  const payBill = (id: string) => {
    setBills((bs) =>
      bs.map((b) =>
        b.id === id
          ? { ...b, paid: true, paidAt: new Date().toISOString().slice(0, 10) }
          : b,
      ),
    );
    const b = bills.find((x) => x.id === id);
    if (b) showToast(`${b.provider.name} faturası ödendi · ${b.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Ödemeler</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Elektrik, su, doğalgaz, mobil — fatura ve abonelik ödemelerin tek yerde.
          </p>
        </div>
      </header>

      {toast && (
        <div className="rounded-2xl px-5 py-4 text-sm font-medium border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900 flex items-center gap-2">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-[28px] p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Bekleyen
          </p>
          <p className="text-3xl font-bold tracking-tight mt-2">
            {pendingTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            <span className="text-base text-amber-600 font-semibold ml-1">TL</span>
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-semibold">
            {pendingCount} fatura ödenmeyi bekliyor
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Bu Ay Ödenen
          </p>
          <p className="text-3xl font-bold tracking-tight mt-2">
            {paidThisMonth.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            <span className="text-base text-gray-400 font-semibold ml-1">TL</span>
          </p>
          <p className="text-xs text-emerald-500 mt-1 font-semibold">
            {bills.filter((b) => b.paid).length} fatura ödendi
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Otomatik Ödeme
          </p>
          <p className="text-3xl font-bold tracking-tight mt-2">2</p>
          <p className="text-xs text-gray-500 mt-1">Aktif sözleşme</p>
        </div>
      </div>

      {/* Hızlı ödeme tile'ları */}
      <section className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-1">Hızlı Ödeme</h2>
        <p className="text-xs text-gray-500 mb-6">
          Aboneliğin yoksa bile elle abone olup ödeyebilirsin.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => showToast(`${p.name} ödeme akışı yakında — şu an demo.`)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-lyraBlue hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.color}`}>
                {p.icon}
              </div>
              <span className="text-xs font-semibold">{p.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Fatura listesi */}
      <section className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Faturalarım</h2>
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
            {(
              [
                ['pending', 'Bekleyen'],
                ['paid', 'Ödenen'],
                ['all', 'Tümü'],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tab === k
                    ? 'bg-white dark:bg-slate-700 shadow text-lyraBlue'
                    : 'text-gray-500'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Receipt className="mx-auto mb-2 opacity-30" size={40} />
            Bu sekmede fatura yok.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${b.provider.color}`}>
                    {b.provider.icon}
                  </div>
                  <div>
                    <p className="font-bold">{b.provider.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <Calendar size={12} />
                      {b.paid ? (
                        <span>Ödendi · {b.paidAt}</span>
                      ) : (
                        <span>Son ödeme · {b.dueDate}</span>
                      )}
                      <span>·</span>
                      <span className="font-mono">{b.reference}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold">
                    {b.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                  </p>
                  {b.paid ? (
                    <span className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Ödendi
                    </span>
                  ) : (
                    <button
                      onClick={() => payBill(b.id)}
                      className="px-4 py-2 rounded-xl bg-lyraBlue text-white text-xs font-bold hover:bg-lyraBlue-dark transition-all flex items-center gap-1.5"
                    >
                      <ArrowUpRight size={14} /> Öde
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
