"use client";

import React from 'react';
import Link from 'next/link';
import { Bell, ArrowRight } from 'lucide-react';

const UPCOMING = [
  { name: 'Spotify Türkiye', emoji: '🎵', amount: 89.9, days: 1 },
  { name: 'Netflix Türkiye', emoji: '🎬', amount: 149.9, days: 4 },
  { name: 'Disney+', emoji: '🐭', amount: 79.9, days: 11 },
];

const UpcomingSubscriptionsCard = () => {
  const total = UPCOMING.reduce((s, x) => s + x.amount, 0);

  return (
    <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-purple-500" />
          <h4 className="font-bold text-sm">Yaklaşan Abonelikler</h4>
        </div>
        <Link
          href="/rules"
          className="text-xs text-lyraBlue font-semibold hover:underline flex items-center gap-1"
        >
          Tümü <ArrowRight size={12} />
        </Link>
      </div>

      <div className="space-y-3">
        {UPCOMING.map((u) => (
          <div key={u.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0 border border-gray-100 dark:border-slate-700">
                {u.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{u.name}</p>
                <p className="text-[11px] text-gray-500">
                  {u.days === 0
                    ? 'Bugün yenilenecek'
                    : u.days === 1
                    ? 'Yarın yenilenecek'
                    : `${u.days} gün sonra`}
                </p>
              </div>
            </div>
            <p className="text-sm font-bold shrink-0">
              {u.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
        <p className="text-xs text-gray-500">Önümüzdeki 14 gün</p>
        <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
          {total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
        </p>
      </div>
    </div>
  );
};

export default UpcomingSubscriptionsCard;
