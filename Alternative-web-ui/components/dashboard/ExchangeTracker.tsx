"use client";

import React from 'react';
import { TrendingUp } from 'lucide-react';

const ExchangeTracker = () => {
  return (
    <section className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold">Otomatik Kur Takibi</h4>
        <TrendingUp size={20} className="text-[#0055ff]" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-500 text-xs">Hedef: USD/TRY</span>
          <span className="text-[#0055ff]">40,00 TL</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-[#0055ff] h-full w-[85%] transition-all duration-1000" />
        </div>
        <p className="text-[11px] text-gray-400 italic leading-snug">
          Dolar 40 TL olduğunda otomatik 1.000 USD alımı tetiklenecek.
        </p>
      </div>
    </section>
  );
};

export default ExchangeTracker;
