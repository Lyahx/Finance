"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Plus, Star, Send, MoreVertical, UserCheck } from 'lucide-react';

type Contact = {
  username: string;
  fullName: string;
  email: string;
  totalSent: number;
  txCount: number;
  lastTx: string;
  favorite: boolean;
};

const INITIAL_CONTACTS: Contact[] = [
  { username: 'ayse', fullName: 'Ayşe Kaya', email: 'ayse@hpay.com.tr', totalSent: 4250.5, txCount: 12, lastTx: 'Bugün, 14:20', favorite: true },
  { username: 'mehmet', fullName: 'Mehmet Demir', email: 'mehmet@hpay.com.tr', totalSent: 8920.0, txCount: 18, lastTx: 'Dün', favorite: true },
  { username: 'ali_yilmaz', fullName: 'Ali Yılmaz', email: 'ali@hpay.com.tr', totalSent: 12400.0, txCount: 22, lastTx: '2 gün önce', favorite: true },
  { username: 'semra', fullName: 'Semra Yeşilan', email: 'semra@hpay.com.tr', totalSent: 1850.0, txCount: 7, lastTx: '5 gün önce', favorite: false },
  { username: 'kerem', fullName: 'Kerem Aksoy', email: 'kerem@example.com', totalSent: 320.0, txCount: 2, lastTx: '3 hafta önce', favorite: false },
  { username: 'zeynep', fullName: 'Zeynep Aydın', email: 'zeynep@example.com', totalSent: 90.0, txCount: 1, lastTx: '2 ay önce', favorite: false },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'fav'>('all');

  const toggleFav = (u: string) =>
    setContacts((cs) => cs.map((c) => (c.username === u ? { ...c, favorite: !c.favorite } : c)));

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      if (tab === 'fav' && !c.favorite) return false;
      if (search) {
        const hay = `${c.fullName} ${c.username} ${c.email}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [contacts, search, tab]);

  const favorites = contacts.filter((c) => c.favorite).slice(0, 4);

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Kişiler</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Sık transfer ettiğin alıcılar, tek tıkla ulaş.
          </p>
        </div>
        <button className="bg-lyraBlue hover:bg-lyraBlue-dark text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
          <Plus size={18} /> Kişi Ekle
        </button>
      </header>

      {/* Favorites strip */}
      {favorites.length > 0 && (
        <section className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Star size={18} className="text-amber-500 fill-amber-500" />
            <h2 className="font-bold">Favoriler</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {favorites.map((c) => (
              <Link
                key={c.username}
                href={`/transfers?recipient=${c.username}`}
                className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-lyraBlue hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all min-w-[110px]"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {c.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <p className="text-xs font-bold text-center">
                  {c.fullName.split(' ')[0]}
                </p>
                <p className="text-[10px] text-gray-500 text-center">@{c.username}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Search & list */}
      <section className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
            {(
              [
                ['all', `Tümü (${contacts.length})`],
                ['fav', `Favoriler (${contacts.filter((c) => c.favorite).length})`],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tab === k ? 'bg-white dark:bg-slate-700 shadow text-lyraBlue' : 'text-gray-500'
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
              placeholder="İsim, kullanıcı adı veya email ara..."
              className="pl-9 pr-4 py-2 w-72 bg-gray-100 dark:bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <UserCheck className="mx-auto mb-2 opacity-30" size={40} />
            Eşleşen kişi yok.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((c) => (
              <div
                key={c.username}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold shrink-0">
                    {c.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold truncate">{c.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">
                      @{c.username} · {c.email}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {c.txCount} işlem · toplam {c.totalSent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}{' '}
                      TL · son: {c.lastTx}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleFav(c.username)}
                    className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
                  >
                    <Star
                      size={18}
                      className={c.favorite ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}
                    />
                  </button>
                  <Link
                    href={`/transfers?recipient=${c.username}`}
                    className="px-4 py-2 rounded-xl bg-lyraBlue text-white text-xs font-bold hover:bg-lyraBlue-dark flex items-center gap-1.5 transition-all"
                  >
                    <Send size={14} /> Gönder
                  </Link>
                  <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
                    <MoreVertical size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
