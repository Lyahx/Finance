"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldAlert } from 'lucide-react';
import { MOCK_TRANSACTIONS } from "@/constants/mockData";

const TransactionList = () => {
  return (
    <section className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-xl font-bold">Son İşlemler</h4>
        <Link href="/transfers" className="text-lyraBlue font-semibold text-sm hover:underline flex items-center gap-1">
          Tümünü Gör <ChevronRight size={16} />
        </Link>
      </div>
      
      <div className="space-y-6">
        {MOCK_TRANSACTIONS.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between group cursor-pointer transition-all hover:translate-x-1">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${tx.status === 'FlaggedForReview' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700'} border`}>
                {tx.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-lg">{tx.name}</p>
                  {tx.status === 'FlaggedForReview' && <ShieldAlert size={16} className="text-amber-500" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                    {tx.category}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{tx.time} • {tx.date}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
              </p>
              {tx.status === 'FlaggedForReview' && (
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">İnceleniyor</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TransactionList;