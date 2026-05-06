"use client";

import React, { useState } from 'react';
import { FileText, Download, Plus, ArrowDownLeft, ArrowUpRight, Search, FileCheck, FileClock } from 'lucide-react';

type Invoice = {
  id: string;
  number: string;
  party: string;
  partyType: 'customer' | 'supplier';
  amount: number;
  vat: number;
  total: number;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  direction: 'incoming' | 'outgoing';
};

const INVOICES: Invoice[] = [
  { id: 'i1', number: 'FYL-2026-0042', party: 'Yatırımcı Holding A.Ş.', partyType: 'customer', amount: 45000, vat: 9000, total: 54000, issueDate: '2026-04-25', dueDate: '2026-05-25', status: 'pending', direction: 'outgoing' },
  { id: 'i2', number: 'FYL-2026-0041', party: 'Tasarım Stüdyo Ltd.', partyType: 'customer', amount: 12500, vat: 2500, total: 15000, issueDate: '2026-04-15', dueDate: '2026-05-15', status: 'paid', direction: 'outgoing' },
  { id: 'i3', number: 'AWS-INV-99211', party: 'Amazon Web Services', partyType: 'supplier', amount: 2200, vat: 440, total: 2640, issueDate: '2026-05-01', dueDate: '2026-05-15', status: 'pending', direction: 'incoming' },
  { id: 'i4', number: 'GSM-2026-7740', party: 'Vodafone İş Tarifesi', partyType: 'supplier', amount: 850, vat: 153, total: 1003, issueDate: '2026-04-30', dueDate: '2026-05-10', status: 'overdue', direction: 'incoming' },
  { id: 'i5', number: 'OFF-2026-1102', party: 'Ofis Kiralayan A.Ş.', partyType: 'supplier', amount: 18000, vat: 3240, total: 21240, issueDate: '2026-05-01', dueDate: '2026-05-31', status: 'pending', direction: 'incoming' },
  { id: 'i6', number: 'FYL-2026-0040', party: 'Akıllı Çözümler Ltd.', partyType: 'customer', amount: 8000, vat: 1600, total: 9600, issueDate: '2026-04-08', dueDate: '2026-05-08', status: 'paid', direction: 'outgoing' },
];

const STATUS_STYLE: Record<Invoice['status'], { label: string; cls: string }> = {
  paid: { label: 'Ödendi', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
  pending: { label: 'Bekliyor', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' },
  overdue: { label: 'Gecikmiş', cls: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' },
};

export default function BillsPage() {
  const [direction, setDirection] = useState<'all' | 'outgoing' | 'incoming'>('all');
  const [search, setSearch] = useState('');

  const filtered = INVOICES.filter((i) => {
    if (direction !== 'all' && i.direction !== direction) return false;
    if (search) {
      const hay = `${i.number} ${i.party}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const incomingPending = INVOICES.filter((i) => i.direction === 'incoming' && i.status !== 'paid')
    .reduce((s, i) => s + i.total, 0);
  const outgoingPending = INVOICES.filter((i) => i.direction === 'outgoing' && i.status !== 'paid')
    .reduce((s, i) => s + i.total, 0);
  const overdueCount = INVOICES.filter((i) => i.status === 'overdue').length;

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Faturalar</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Gelen ve giden faturaların, ödendi durumu, vade takibi.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 font-semibold text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all">
            <Download size={16} /> İndir (PDF)
          </button>
          <button className="bg-lyraBlue hover:bg-lyraBlue-dark text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
            <Plus size={18} /> Fatura Kes
          </button>
        </div>
      </header>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Tahsil Edilecek
            </p>
            <ArrowDownLeft className="text-emerald-500" size={18} />
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {outgoingPending.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            <span className="text-base text-emerald-600 font-semibold ml-1">TL</span>
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
            {INVOICES.filter((i) => i.direction === 'outgoing' && i.status !== 'paid').length} fatura
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Ödenecek
            </p>
            <ArrowUpRight className="text-amber-500" size={18} />
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {incomingPending.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            <span className="text-base text-amber-600 font-semibold ml-1">TL</span>
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
            {INVOICES.filter((i) => i.direction === 'incoming' && i.status !== 'paid').length} fatura
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              Gecikmiş
            </p>
            <FileClock className="text-red-500" size={18} />
          </div>
          <p className="text-3xl font-bold tracking-tight">{overdueCount}</p>
          <p className="text-xs text-red-700 dark:text-red-400 mt-1">Acil ödeme gerek</p>
        </div>
      </div>

      {/* Table */}
      <section className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
            {(
              [
                ['all', 'Tümü'],
                ['outgoing', 'Giden (Müşteri)'],
                ['incoming', 'Gelen (Tedarikçi)'],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setDirection(k)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  direction === k
                    ? 'bg-white dark:bg-slate-700 shadow text-lyraBlue'
                    : 'text-gray-500'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Fatura no veya müşteri ara..."
              className="pl-9 pr-4 py-2 w-64 bg-gray-100 dark:bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText className="mx-auto mb-2 opacity-30" size={40} />
            Eşleşen fatura yok.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((inv) => {
              const ss = STATUS_STYLE[inv.status];
              return (
                <div
                  key={inv.id}
                  className="grid grid-cols-12 items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
                >
                  <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        inv.direction === 'outgoing'
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600'
                          : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600'
                      }`}
                    >
                      {inv.status === 'paid' ? <FileCheck size={18} /> : <FileText size={18} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold truncate">{inv.party}</p>
                      <p className="text-xs text-gray-500 font-mono">{inv.number}</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-2 text-xs text-gray-500">
                    <p>Düzen.</p>
                    <p className="font-semibold text-gray-700 dark:text-slate-200">{inv.issueDate}</p>
                  </div>
                  <div className="col-span-6 md:col-span-2 text-xs text-gray-500">
                    <p>Vade</p>
                    <p className="font-semibold text-gray-700 dark:text-slate-200">{inv.dueDate}</p>
                  </div>
                  <div className="col-span-12 md:col-span-3 flex items-center justify-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${ss.cls}`}>
                      {ss.label}
                    </span>
                    <p className="font-bold text-sm">
                      {inv.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      <span className="text-gray-400 font-medium ml-1">TL</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
