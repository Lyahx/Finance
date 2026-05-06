"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  CreditCard,
  Plus,
  Lock,
  Eye,
  EyeOff,
  Snowflake,
  Trash2,
  Wifi,
  ShieldAlert,
  X,
  Check,
} from 'lucide-react';

type Card = {
  id: string;
  label: string;
  number: string;
  cvv: string;
  expiry: string;
  type: 'main' | 'virtual';
  frozen: boolean;
  spent: number;
  limit: number;
};

const INITIAL_CARDS: Card[] = [
  { id: '1', label: 'Ana Kart', number: '5294 7621 9034 1820', cvv: '442', expiry: '08/29', type: 'main', frozen: false, spent: 4250, limit: 25000 },
  { id: '2', label: 'Trendyol Sanal', number: '4532 8801 6219 0012', cvv: '108', expiry: '11/26', type: 'virtual', frozen: false, spent: 890, limit: 2000 },
  { id: '3', label: 'Netflix Tek Kullanım', number: '5176 0033 4421 9985', cvv: '329', expiry: '05/26', type: 'virtual', frozen: true, spent: 149.9, limit: 200 },
];

const FREEZE_REASONS = [
  { id: 'lost', label: 'Kartımı kaybettim', desc: 'Kart fiziksel olarak elimde değil' },
  { id: 'stolen', label: 'Kartım çalındı', desc: 'Yetkililere de bildirin' },
  { id: 'suspicious', label: 'Şüpheli işlem fark ettim', desc: 'Hesap özetinde tanımadığım harcama' },
  { id: 'temporary', label: 'Geçici dondurma', desc: 'Birkaç gün sonra tekrar açacağım' },
] as const;

const DEMO_PIN = '1234';

type ConfirmIntent =
  | { kind: 'freeze'; cardId: string }
  | { kind: 'unfreeze'; cardId: string }
  | { kind: 'delete'; cardId: string }
  | null;

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [activeId, setActiveId] = useState<string>(INITIAL_CARDS[0].id);
  const [reveal, setReveal] = useState(false);
  const [intent, setIntent] = useState<ConfirmIntent>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  };

  const active = cards.find((c) => c.id === activeId)!;

  const askFreezeOrUnfreeze = (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (!card) return;
    setIntent({ kind: card.frozen ? 'unfreeze' : 'freeze', cardId: id });
  };

  const askDelete = (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.type === 'main') return;
    setIntent({ kind: 'delete', cardId: id });
  };

  const apply = () => {
    if (!intent) return;
    if (intent.kind === 'freeze') {
      setCards((cs) => cs.map((c) => (c.id === intent.cardId ? { ...c, frozen: true } : c)));
      showToast('Kart donduruldu. Tüm işlemler engellendi.');
    } else if (intent.kind === 'unfreeze') {
      setCards((cs) => cs.map((c) => (c.id === intent.cardId ? { ...c, frozen: false } : c)));
      showToast('Kart yeniden aktif. Hoş geldin.');
    } else if (intent.kind === 'delete') {
      setCards((cs) => cs.filter((c) => c.id !== intent.cardId));
      if (activeId === intent.cardId) setActiveId(cards[0].id);
      showToast('Kart kalıcı olarak silindi.');
    }
    setIntent(null);
  };

  const generateCard = () => {
    const newCard: Card = {
      id: String(Date.now()),
      label: 'Yeni Sanal Kart',
      number:
        '4' +
        Array.from({ length: 15 }, () => Math.floor(Math.random() * 10))
          .join('')
          .replace(/(.{4})/g, '$1 ')
          .trim(),
      cvv: String(Math.floor(Math.random() * 900) + 100),
      expiry: '12/29',
      type: 'virtual',
      frozen: false,
      spent: 0,
      limit: 1000,
    };
    setCards([...cards, newCard]);
    setActiveId(newCard.id);
    showToast('Yeni sanal kart oluşturuldu.');
  };

  const masked = (n: string) => n.replace(/\d(?=\d{4})/g, '•');

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Kartlarım</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Sanal kartlar üret, dondur, harcama limitlerini yönet.
          </p>
        </div>
        <button
          onClick={generateCard}
          className="bg-lyraBlue hover:bg-lyraBlue-dark text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
        >
          <Plus size={18} /> Yeni Sanal Kart
        </button>
      </header>

      {toast && (
        <div className="rounded-2xl px-5 py-4 text-sm font-medium border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900 flex items-center gap-2">
          <Check size={16} /> {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 space-y-6">
          <div
            className={`relative aspect-[1.586/1] max-w-md mx-auto rounded-[32px] p-8 text-white shadow-2xl shadow-blue-500/30 overflow-hidden transition-all ${
              active.frozen ? 'opacity-60 grayscale' : ''
            }`}
            style={{
              background:
                active.type === 'main'
                  ? 'linear-gradient(135deg, #0055ff 0%, #002db3 100%)'
                  : 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #7e22ce 100%)',
            }}
          >
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                    {active.label}
                  </p>
                  <p className="text-xs mt-1 opacity-80">
                    {active.type === 'main' ? 'Mastercard' : 'Visa Sanal'}
                  </p>
                </div>
                <Wifi className="rotate-90 opacity-80" size={24} />
              </div>

              <div>
                <p className="text-xl font-mono tracking-widest font-semibold">
                  {reveal ? active.number : masked(active.number)}
                </p>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider opacity-70">Son K.T.</p>
                    <p className="font-mono font-semibold">{active.expiry}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider opacity-70">CVV</p>
                    <p className="font-mono font-semibold">{reveal ? active.cvv : '•••'}</p>
                  </div>
                  <p className="text-2xl font-bold italic tracking-tighter">LyraBit</p>
                </div>
              </div>
            </div>

            {active.frozen && (
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-white/90 text-slate-900 px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Snowflake size={16} /> Donduruldu
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => setReveal((r) => !r)}
              className="px-5 py-2.5 rounded-2xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              {reveal ? (
                <>
                  <EyeOff size={16} /> Gizle
                </>
              ) : (
                <>
                  <Eye size={16} /> Detayları Göster
                </>
              )}
            </button>
            <button
              onClick={() => askFreezeOrUnfreeze(active.id)}
              className={`px-5 py-2.5 rounded-2xl font-semibold text-sm flex items-center gap-2 transition-all ${
                active.frozen
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-950/40 dark:text-blue-300'
              }`}
            >
              <Snowflake size={16} /> {active.frozen ? 'Dondurmayı Kaldır' : 'Dondur'}
            </button>
            {active.type === 'virtual' && (
              <button
                onClick={() => askDelete(active.id)}
                className="px-5 py-2.5 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <Trash2 size={16} /> Kalıcı Sil
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Aylık Harcama</h3>
              <p className="text-sm text-gray-500">
                <span className="font-bold text-slate-900 dark:text-white">
                  {active.spent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                </span>
                {' / '}
                {active.limit.toLocaleString('tr-TR')} TL limit
              </p>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-lyraBlue h-full transition-all"
                style={{ width: `${Math.min(100, (active.spent / active.limit) * 100)}%` }}
              />
            </div>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-slate-400 px-2">
            Tüm Kartlar ({cards.length})
          </h3>
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full text-left p-4 rounded-[24px] flex items-center gap-4 transition-all border-2 ${
                activeId === c.id
                  ? 'bg-blue-50 border-lyraBlue dark:bg-blue-950/30'
                  : 'bg-white dark:bg-slate-900/50 border-gray-100 dark:border-slate-800 hover:border-gray-300'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  c.type === 'main'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                    : 'bg-gradient-to-br from-indigo-700 to-purple-700'
                } text-white`}
              >
                {c.frozen ? <Lock size={18} /> : <CreditCard size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm flex items-center gap-2">
                  {c.label}
                  {c.frozen && <Snowflake size={12} className="text-blue-500" />}
                </p>
                <p className="text-xs text-gray-500 font-mono">•••• {c.number.slice(-4)}</p>
              </div>
              <p className="text-xs text-gray-400 font-semibold">{c.expiry}</p>
            </button>
          ))}
        </aside>
      </div>

      {intent && (
        <ConfirmModal
          intent={intent}
          card={cards.find((c) => c.id === intent.cardId)!}
          onCancel={() => setIntent(null)}
          onConfirm={apply}
        />
      )}
    </div>
  );
}

function ConfirmModal({
  intent,
  card,
  onCancel,
  onConfirm,
}: {
  intent: NonNullable<ConfirmIntent>;
  card: Card;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [reasonId, setReasonId] = useState<typeof FREEZE_REASONS[number]['id']>('temporary');
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const setDigit = (idx: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(0, 1);
    setPin((p) => {
      const next = [...p];
      next[idx] = v;
      return next;
    });
    setError(null);
    if (v && idx < 3) inputRefs.current[idx + 1]?.focus();
  };

  const onKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const submit = () => {
    const code = pin.join('');
    if (code.length !== 4) {
      setError('4 haneli PIN gir.');
      return;
    }
    if (code !== DEMO_PIN) {
      setError('PIN hatalı. (Demo PIN: 1234)');
      setPin(['', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }
    onConfirm();
  };

  const titles: Record<NonNullable<ConfirmIntent>['kind'], string> = {
    freeze: 'Kartı Dondur',
    unfreeze: 'Dondurmayı Kaldır',
    delete: 'Kartı Kalıcı Sil',
  };
  const subtitles: Record<NonNullable<ConfirmIntent>['kind'], string> = {
    freeze: 'Tüm online ve fiziksel işlemler anında durdurulur. İstediğin an çözebilirsin.',
    unfreeze: 'Kart yeniden aktif olacak ve işlem yapabileceksin.',
    delete: 'Bu işlem geri alınamaz. Karta bağlı tüm tekrarlayan ödemeler iptal olur.',
  };

  const isDelete = intent.kind === 'delete';
  const isFreeze = intent.kind === 'freeze';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[28px] shadow-2xl w-full max-w-md p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
        >
          <X size={18} />
        </button>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            isDelete
              ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
              : isFreeze
              ? 'bg-blue-100 dark:bg-blue-950/40 text-lyraBlue'
              : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600'
          }`}
        >
          {isDelete ? <ShieldAlert size={24} /> : <Snowflake size={24} />}
        </div>

        <h2 className="text-xl font-bold tracking-tight">{titles[intent.kind]}</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
          {subtitles[intent.kind]}
        </p>

        <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center gap-3">
          <CreditCard size={18} className="text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">{card.label}</p>
            <p className="text-xs text-gray-500 font-mono">•••• {card.number.slice(-4)}</p>
          </div>
        </div>

        {isFreeze && (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
              Dondurma Nedeni
            </p>
            <div className="space-y-2">
              {FREEZE_REASONS.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    reasonId === r.id
                      ? 'border-lyraBlue bg-blue-50 dark:bg-blue-950/30'
                      : 'border-gray-100 dark:border-slate-800 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={reasonId === r.id}
                    onChange={() => setReasonId(r.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-bold">{r.label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{r.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
            Güvenlik PIN'i
          </p>
          <div className="flex gap-2 justify-center">
            {pin.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                inputMode="numeric"
                maxLength={1}
                type="password"
                className="w-14 h-14 text-center text-2xl font-bold bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-lyraBlue focus:bg-white dark:focus:bg-slate-900 rounded-xl outline-none transition-all"
              />
            ))}
          </div>
          {error && <p className="text-xs text-red-500 mt-2 text-center font-semibold">{error}</p>}
          <p className="text-[11px] text-gray-400 mt-2 text-center">
            Demo PIN: <code className="font-mono font-bold text-gray-600 dark:text-slate-300">1234</code>
          </p>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 font-semibold text-sm transition-all"
          >
            Vazgeç
          </button>
          <button
            onClick={submit}
            className={`flex-1 px-4 py-3 rounded-xl text-white font-bold text-sm transition-all ${
              isDelete
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                : 'bg-lyraBlue hover:bg-lyraBlue-dark shadow-lg shadow-blue-500/30'
            }`}
          >
            {isDelete ? 'Kalıcı Sil' : titles[intent.kind]}
          </button>
        </div>
      </div>
    </div>
  );
}
