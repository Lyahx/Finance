"use client";

import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

const InsightCard = () => {
  return (
    <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] p-6 text-white shadow-xl card-hover">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
          <Sparkles size={20} />
        </div>
        <h4 className="font-bold">LyraBit AI Koçu</h4>
      </div>
      <p className="text-indigo-100 text-sm leading-relaxed mb-6">
        "Bu ay yemek harcamaların bütçenin **%12 üzerine** çıktı. Haftaya yapılacak kira ödemen için 5.000 TL kenara ayırdım."
      </p>
      <div className="bg-black/20 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-emerald-400" size={24}/>
          <span className="text-xs font-medium">Fraud Koruması Aktif</span>
        </div>
        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full uppercase">Güvenli</span>
      </div>
    </section>
  );
};

export default InsightCard;
