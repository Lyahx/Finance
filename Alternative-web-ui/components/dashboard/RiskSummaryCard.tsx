"use client";

import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

const RiskSummaryCard = () => {
  const blockedCount = 3;
  const isSafe = true;

  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-[28px] p-6 shadow-lg shadow-emerald-500/20 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
          {isSafe ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Hesap Güvenliği</p>
          <h3 className="text-xl font-bold mt-1">Hesabın güvenli</h3>
          <p className="text-xs text-white/90 mt-2 leading-relaxed">
            Bu ay <strong>{blockedCount} şüpheli işlem</strong> incelemeye düştü ve seninle
            doğrulandı. Fraud koruman aktif.
          </p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/20">
        <div>
          <p className="text-2xl font-bold">98</p>
          <p className="text-[10px] uppercase tracking-wider opacity-80">Güvenlik Skoru</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{blockedCount}</p>
          <p className="text-[10px] uppercase tracking-wider opacity-80">Engellenen</p>
        </div>
        <div>
          <p className="text-2xl font-bold">2FA</p>
          <p className="text-[10px] uppercase tracking-wider opacity-80">Aktif</p>
        </div>
      </div>
    </div>
  );
};

export default RiskSummaryCard;
