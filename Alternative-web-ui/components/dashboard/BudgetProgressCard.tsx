"use client";

import React from 'react';
import Link from 'next/link';
import { Target, ArrowRight } from 'lucide-react';

const MONTHLY_LIMIT = 15000;
const SPENT = 11684;

const BudgetProgressCard = () => {
  const pct = Math.min(100, Math.round((SPENT / MONTHLY_LIMIT) * 100));
  const remaining = Math.max(0, MONTHLY_LIMIT - SPENT);
  const over = SPENT > MONTHLY_LIMIT;

  return (
    <Link
      href="/budget"
      className="block bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-lyraBlue" />
          <h4 className="font-bold text-sm">Aylık Bütçe</h4>
        </div>
        <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <p className="text-2xl font-bold tracking-tight">
          {SPENT.toLocaleString('tr-TR')}
        </p>
        <p className="text-xs text-gray-400 font-medium">
          / {MONTHLY_LIMIT.toLocaleString('tr-TR')} TL
        </p>
      </div>

      <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${over ? 'bg-amber-500' : 'bg-lyraBlue'} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {over ? (
          <span className="text-amber-600 font-semibold">Bütçeyi aştın</span>
        ) : (
          <>
            <span className="font-semibold text-emerald-500">
              {remaining.toLocaleString('tr-TR')} TL
            </span>{' '}
            kaldı · %{pct} kullanıldı
          </>
        )}
      </p>
    </Link>
  );
};

export default BudgetProgressCard;
