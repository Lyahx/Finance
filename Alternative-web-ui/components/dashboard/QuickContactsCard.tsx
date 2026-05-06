"use client";

import React from 'react';
import Link from 'next/link';
import { Users, Plus, ArrowRight } from 'lucide-react';

const FAVS = [
  { username: 'ayse', name: 'Ayşe', initials: 'AK', color: 'from-pink-500 to-rose-500' },
  { username: 'mehmet', name: 'Mehmet', initials: 'MD', color: 'from-blue-500 to-indigo-500' },
  { username: 'ali_yilmaz', name: 'Ali', initials: 'AY', color: 'from-emerald-500 to-teal-500' },
  { username: 'semra', name: 'Semra', initials: 'SY', color: 'from-amber-500 to-orange-500' },
  { username: 'kerem', name: 'Kerem', initials: 'KA', color: 'from-violet-500 to-purple-500' },
];

const QuickContactsCard = () => {
  return (
    <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-emerald-500" />
          <h4 className="font-bold text-sm">Hızlı Kişiler</h4>
        </div>
        <Link
          href="/contacts"
          className="text-xs text-lyraBlue font-semibold hover:underline flex items-center gap-1"
        >
          Tümü <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {FAVS.map((c) => (
          <Link
            key={c.username}
            href={`/transfers?recipient=${c.username}`}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${c.color} text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform`}
            >
              {c.initials}
            </div>
            <p className="text-[10px] font-semibold text-gray-700 dark:text-slate-300 truncate w-full text-center">
              {c.name}
            </p>
          </Link>
        ))}
      </div>

      <Link
        href="/contacts"
        className="mt-4 w-full px-3 py-2.5 rounded-xl border border-dashed border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-500 hover:border-lyraBlue hover:text-lyraBlue transition-all flex items-center justify-center gap-1.5"
      >
        <Plus size={14} /> Kişi Ekle
      </Link>
    </div>
  );
};

export default QuickContactsCard;
