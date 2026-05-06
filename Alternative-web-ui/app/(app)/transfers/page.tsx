"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Send,
  Plus,
  ShieldAlert,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { MOCK_TRANSACTIONS } from '@/constants/mockData';
import { useCurrentUser } from '@/lib/auth-context';

type Mode = 'send' | 'topup';

const QUICK_RECIPIENTS = [
  { username: 'ayse', name: 'Ayşe Kaya', avatar: 'A' },
  { username: 'mehmet', name: 'Mehmet Demir', avatar: 'M' },
  { username: 'semra', name: 'Semra Yeşilan', avatar: 'S' },
  { username: 'ali_yilmaz', name: 'Ali Yılmaz', avatar: 'A' },
];

const QUICK_AMOUNTS = [100, 250, 500, 1000];

export default function TransfersPage() {
  return (
    <Suspense fallback={<div className="text-gray-400">Yükleniyor...</div>}>
      <TransfersInner />
    </Suspense>
  );
}

function TransfersInner() {
  const searchParams = useSearchParams();
  const initialMode: Mode = searchParams.get('action') === 'topup' ? 'topup' : 'send';

  const { user } = useCurrentUser();
  const balance = user?.balance ?? 0;
  const [mode, setMode] = useState<Mode>(initialMode);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'flagged'>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (kind: 'success' | 'error', msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount.replace(',', '.'));
    if (mode === 'send') {
      if (!recipient.trim()) return showToast('error', 'Alıcı zorunlu.');
      if (!(amt > 0)) return showToast('error', "Tutar 0'dan büyük olmalı.");
      if (amt > balance) return showToast('error', 'Yetersiz bakiye.');
      showToast(
        'success',
        `${amt.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL ${recipient}'e gönderildi.`,
      );
    } else {
      if (!(amt > 0)) return showToast('error', "Tutar 0'dan büyük olmalı.");
      showToast(
        'success',
        `${amt.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL cüzdana eklendi.`,
      );
    }
    setRecipient('');
    setAmount('');
    setDescription('');
  };

  const filteredTxs = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((tx) => {
      if (filter === 'sent' && tx.amount >= 0) return false;
      if (filter === 'received' && tx.amount < 0) return false;
      if (filter === 'flagged' && tx.status !== 'FlaggedForReview') return false;
      if (search) {
        const hay = `${tx.name} ${tx.category} ${tx.description ?? ''}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [filter, search]);

  const pendingApprovals = MOCK_TRANSACTIONS.filter((t) => t.status === 'FlaggedForReview');

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Transferler</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          Kişiye P2P transfer, geçmişin ve bekleyen onayların.
        </p>
      </header>

      {toast && (
        <div
          className={`rounded-2xl px-5 py-4 text-sm font-medium border ${
            toast.kind === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
              : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {pendingApprovals.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-[28px] p-5 flex items-start gap-4">
          <Clock className="text-amber-500 shrink-0 mt-0.5" size={22} />
          <div className="flex-1">
            <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
              {pendingApprovals.length} bekleyen onay
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
              Yüksek risk skoru aldığı için incelemeye düşen transferler. Doğru olduğunu onayla, ya
              da iptal et.
            </p>
            <div className="mt-3 space-y-2">
              {pendingApprovals.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between bg-white dark:bg-slate-900/40 rounded-xl p-3"
                >
                  <div>
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      {p.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL · skor{' '}
                      {p.riskScore}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => showToast('success', 'Transfer onaylandı.')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 size={14} /> Onayla
                    </button>
                    <button
                      onClick={() => showToast('success', 'Transfer iptal edildi.')}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-semibold"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl mb-8 w-fit">
            <button
              onClick={() => setMode('send')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                mode === 'send'
                  ? 'bg-white dark:bg-slate-700 shadow text-lyraBlue'
                  : 'text-gray-500'
              }`}
            >
              <Send size={16} /> Para Gönder
            </button>
            <button
              onClick={() => setMode('topup')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                mode === 'topup'
                  ? 'bg-white dark:bg-slate-700 shadow text-lyraBlue'
                  : 'text-gray-500'
              }`}
            >
              <Plus size={16} /> Para Yükle
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'send' && (
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Alıcı
                </label>
                <input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Kullanıcı adı veya email"
                  className="mt-2 w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-lyraBlue focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all"
                />
                <div className="flex gap-2 mt-3 flex-wrap">
                  {QUICK_RECIPIENTS.map((r) => (
                    <button
                      type="button"
                      key={r.username}
                      onClick={() => setRecipient(r.username)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-lyraBlue dark:hover:bg-slate-700 text-xs font-semibold transition-all"
                    >
                      <span className="w-6 h-6 rounded-full bg-lyraBlue text-white flex items-center justify-center text-[10px] font-bold">
                        {r.avatar}
                      </span>
                      @{r.username}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Tutar
              </label>
              <div className="mt-2 relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                  ₺
                </span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className="w-full pl-12 pr-4 py-5 text-3xl font-bold bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-lyraBlue focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all"
                />
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {QUICK_AMOUNTS.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setAmount(String(a))}
                    className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-lyraBlue dark:hover:bg-slate-700 text-xs font-semibold transition-all"
                  >
                    {a.toLocaleString('tr-TR')} TL
                  </button>
                ))}
              </div>
            </div>

            {mode === 'send' && (
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Açıklama (opsiyonel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Pizza paylaşımı, kira payı..."
                  rows={3}
                  className="mt-2 w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-lyraBlue focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all resize-none"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-lyraBlue hover:bg-lyraBlue-dark text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
            >
              {mode === 'send' ? (
                <>
                  <Send size={18} /> Gönderiyi Onayla
                </>
              ) : (
                <>
                  <Plus size={18} /> Cüzdana Yükle
                </>
              )}
            </button>
          </form>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-lyraBlue to-blue-700 text-white rounded-[32px] p-7 shadow-xl shadow-blue-500/20">
            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">
              Mevcut Bakiye
            </p>
            <h2 className="text-4xl font-bold tracking-tight mt-2">
              {balance.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <span className="text-xl font-semibold opacity-80 ml-1">TL</span>
            </h2>
            <p className="text-xs text-blue-100 mt-4 leading-relaxed">
              Anlık transfer · 0 komisyon · 7/24 erişim. Şüpheli işlem fraud koruması ile durdurulur.
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-[32px] p-6">
            <div className="flex gap-3 items-start">
              <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={22} />
              <div>
                <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                  Akıllı Koruma
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                  Tutar 30.000 TL üstündeyse veya alıcı ilk kezse, transferin risk skoru hesaplanır
                  ve yüksek skorda incelemeye düşer.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Transfer Geçmişi</h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ara..."
              className="pl-9 pr-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {(
            [
              ['all', 'Tümü'],
              ['sent', 'Gönderilen'],
              ['received', 'Alınan'],
              ['flagged', 'İncelemede'],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === k
                  ? 'bg-lyraBlue text-white shadow'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {filteredTxs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Bu filtreyle eşleşen işlem yok.</div>
        ) : (
          <div className="space-y-4">
            {filteredTxs.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm border ${
                      tx.status === 'FlaggedForReview'
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700'
                    }`}
                  >
                    {tx.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{tx.name}</p>
                      {tx.status === 'FlaggedForReview' && (
                        <ShieldAlert size={14} className="text-amber-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>
                        {tx.time} {tx.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {tx.amount > 0 ? (
                    <ArrowDownLeft className="text-emerald-500" size={16} />
                  ) : (
                    <ArrowUpRight className="text-gray-400" size={16} />
                  )}
                  <p
                    className={`font-bold ${
                      tx.amount > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}
                    {tx.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
