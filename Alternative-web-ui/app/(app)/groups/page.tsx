"use client";

import React, { useState } from 'react';
import { Users, Plus, Plane, Home, Coffee, Heart, Crown, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

type Member = {
  username: string;
  fullName: string;
  contributed: number;
  isOwner?: boolean;
};

type Group = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  goal: number;
  collected: number;
  members: Member[];
  recentActivity: { who: string; amount: number; when: string }[];
};

const GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Bodrum Tatili 2026',
    icon: <Plane size={20} />,
    color: 'from-cyan-500 to-blue-600',
    goal: 24000,
    collected: 18750,
    members: [
      { username: 'furkan', fullName: 'Furkan B.', contributed: 5000, isOwner: true },
      { username: 'ayse', fullName: 'Ayşe K.', contributed: 5000 },
      { username: 'mehmet', fullName: 'Mehmet D.', contributed: 4500 },
      { username: 'semra', fullName: 'Semra Y.', contributed: 4250 },
    ],
    recentActivity: [
      { who: 'ayse', amount: 1500, when: '2 saat önce' },
      { who: 'mehmet', amount: 2000, when: 'Dün' },
      { who: 'furkan', amount: 1000, when: '3 gün önce' },
    ],
  },
  {
    id: 'g2',
    name: 'Ortak Ev Giderleri',
    icon: <Home size={20} />,
    color: 'from-emerald-500 to-teal-600',
    goal: 18000,
    collected: 14400,
    members: [
      { username: 'furkan', fullName: 'Furkan B.', contributed: 6000, isOwner: true },
      { username: 'ali_yilmaz', fullName: 'Ali Y.', contributed: 4400 },
      { username: 'mehmet', fullName: 'Mehmet D.', contributed: 4000 },
    ],
    recentActivity: [
      { who: 'mehmet', amount: 4000, when: 'Bugün' },
      { who: 'ali_yilmaz', amount: 4400, when: '4 gün önce' },
    ],
  },
  {
    id: 'g3',
    name: 'Doğum Günü Sürprizi',
    icon: <Heart size={20} />,
    color: 'from-pink-500 to-rose-600',
    goal: 5000,
    collected: 3200,
    members: [
      { username: 'furkan', fullName: 'Furkan B.', contributed: 1000, isOwner: true },
      { username: 'ayse', fullName: 'Ayşe K.', contributed: 1200 },
      { username: 'semra', fullName: 'Semra Y.', contributed: 1000 },
    ],
    recentActivity: [
      { who: 'ayse', amount: 1200, when: 'Bugün' },
    ],
  },
];

export default function GroupsPage() {
  const [activeId, setActiveId] = useState(GROUPS[0].id);
  const active = GROUPS.find((g) => g.id === activeId)!;
  const pct = Math.round((active.collected / active.goal) * 100);

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Group Wallet</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Arkadaşlarınla ortak cüzdan oluştur, hedefe birlikte ulaş.
          </p>
        </div>
        <button className="bg-lyraBlue hover:bg-lyraBlue-dark text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
          <Plus size={18} /> Yeni Grup
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Group list */}
        <aside className="lg:col-span-4 space-y-3">
          {GROUPS.map((g) => {
            const p = Math.round((g.collected / g.goal) * 100);
            return (
              <button
                key={g.id}
                onClick={() => setActiveId(g.id)}
                className={`w-full text-left rounded-[28px] p-5 transition-all border-2 ${
                  activeId === g.id
                    ? 'border-lyraBlue bg-blue-50 dark:bg-blue-950/30'
                    : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${g.color} text-white flex items-center justify-center shadow-md shrink-0`}
                  >
                    {g.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm leading-tight">{g.name}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{g.members.length} üye · %{p}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${g.color} h-full transition-all`}
                    style={{ width: `${p}%` }}
                  />
                </div>
                <p className="text-xs font-semibold mt-2 text-gray-700 dark:text-slate-200">
                  {g.collected.toLocaleString('tr-TR')}
                  <span className="text-gray-400 font-medium">
                    {' '}
                    / {g.goal.toLocaleString('tr-TR')} TL
                  </span>
                </p>
              </button>
            );
          })}
        </aside>

        {/* Active group detail */}
        <section className="lg:col-span-8 space-y-6">
          {/* Hero */}
          <div className={`relative bg-gradient-to-br ${active.color} text-white rounded-[32px] p-8 shadow-xl overflow-hidden`}>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  {active.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80">Grup Cüzdan</p>
                  <h2 className="text-2xl font-bold">{active.name}</h2>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs opacity-80 mb-1">Toplanan</p>
                <h3 className="text-5xl font-bold tracking-tight">
                  {active.collected.toLocaleString('tr-TR')}
                  <span className="text-2xl font-semibold opacity-80 ml-1">TL</span>
                </h3>
                <p className="text-sm opacity-90 mt-1">
                  Hedef: {active.goal.toLocaleString('tr-TR')} TL · %{pct} tamamlandı
                </p>
                <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-white h-full rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="bg-white text-slate-900 px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-all shadow-md">
                  <ArrowUpRight size={16} /> Katkı Yap
                </button>
                <button className="bg-white/20 backdrop-blur text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/30 transition-all">
                  <Plus size={16} /> Üye Davet Et
                </button>
              </div>
            </div>
          </div>

          {/* Members + activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-lyraBlue" />
                <h3 className="font-bold">Üyeler ({active.members.length})</h3>
              </div>
              <div className="space-y-3">
                {active.members
                  .slice()
                  .sort((a, b) => b.contributed - a.contributed)
                  .map((m) => (
                    <div key={m.username} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-xs font-bold">
                          {m.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold flex items-center gap-1">
                            {m.fullName}
                            {m.isOwner && <Crown size={12} className="text-amber-500" />}
                          </p>
                          <p className="text-[11px] text-gray-500">@{m.username}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold">
                        {m.contributed.toLocaleString('tr-TR')} TL
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Coffee size={18} className="text-lyraBlue" />
                <h3 className="font-bold">Son Aktivite</h3>
              </div>
              <div className="space-y-3">
                {active.recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <ArrowDownLeft size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">@{a.who} katkı yaptı</p>
                        <p className="text-[11px] text-gray-500">{a.when}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-emerald-500">
                      +{a.amount.toLocaleString('tr-TR')} TL
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
