"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { TokenStorage } from '@/services/api';
import {
  Bell,
  Search,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  ShieldAlert,
  ArrowDownLeft,
  Sparkles,
  CheckCheck,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

type Notification = {
  id: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  tone: 'warn' | 'success' | 'info';
};

const INITIAL_NOTIFS: Notification[] = [
  {
    id: 'n1',
    icon: <ShieldAlert size={18} />,
    title: 'Şüpheli İşlem Tespit Edildi',
    body: '50.000 TL\'lik transfer yüksek risk skoru aldı (85). İncelemeyi onayla.',
    time: '3 dk önce',
    unread: true,
    tone: 'warn',
  },
  {
    id: 'n2',
    icon: <ArrowDownLeft size={18} />,
    title: 'Para alındı',
    body: 'Ali Yılmaz sana 500,00 TL gönderdi.',
    time: '2 saat önce',
    unread: true,
    tone: 'success',
  },
  {
    id: 'n3',
    icon: <Sparkles size={18} />,
    title: 'Aylık özet hazır',
    body: 'Yemek harcamaların bütçenin %12 üzerinde — detayları gör.',
    time: 'Dün',
    unread: true,
    tone: 'info',
  },
  {
    id: 'n4',
    icon: <Bell size={18} />,
    title: 'Spotify Türkiye yenilendi',
    body: '89,90 TL otomatik tahsilat yapıldı.',
    time: '3 gün önce',
    unread: false,
    tone: 'info',
  },
];

const Navbar = () => {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<'notifs' | 'profile' | null>(null);
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const unreadCount = notifs.filter((n) => n.unread).length;
  const isDark = mounted && resolvedTheme === 'dark';

  // Click outside + escape close
  useEffect(() => {
    if (!openMenu) return;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpenMenu(null);
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [openMenu]);

  const toggle = (m: 'notifs' | 'profile') => setOpenMenu((cur) => (cur === m ? null : m));

  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })));
  const markRead = (id: string) =>
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <header className="flex justify-between items-center px-8 py-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 sticky top-0 z-30">
      {/* Search */}
      <div className="relative w-64 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="İşlem ara..."
          className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {/* Right cluster */}
      <div ref={containerRef} className="flex items-center gap-3 relative">
        <ThemeToggle />

        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => toggle('notifs')}
            className={`p-2.5 rounded-full border transition-all relative ${
              openMenu === 'notifs'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-lyraBlue'
                : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
            aria-label="Bildirimler"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {openMenu === 'notifs' && (
            <div className="absolute right-0 top-full mt-2 w-[380px] max-w-[90vw] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
                <div>
                  <p className="font-bold text-sm">Bildirimler</p>
                  <p className="text-xs text-gray-400">{unreadCount} okunmamış</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs font-semibold text-lyraBlue hover:underline flex items-center gap-1"
                  >
                    <CheckCheck size={14} /> Tümünü okundu işaretle
                  </button>
                )}
              </div>

              <div className="max-h-[420px] overflow-y-auto">
                {notifs.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-12">Bildirim yok.</div>
                ) : (
                  notifs.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`w-full text-left flex gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all border-b border-gray-50 dark:border-slate-800/60 last:border-0 ${
                        n.unread ? 'bg-blue-50/40 dark:bg-blue-950/10' : ''
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          n.tone === 'warn'
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                            : n.tone === 'success'
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                        }`}
                      >
                        {n.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold leading-snug">{n.title}</p>
                          {n.unread && (
                            <span className="w-2 h-2 bg-lyraBlue rounded-full shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {n.body}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1.5 font-medium">{n.time}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="border-t border-gray-100 dark:border-slate-800">
                <Link
                  href="/transfers"
                  onClick={() => setOpenMenu(null)}
                  className="block text-center px-5 py-3 text-xs font-semibold text-lyraBlue hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
                >
                  Tüm bildirimleri gör
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative pl-2 ml-1 border-l border-gray-200 dark:border-slate-700">
          <button
            onClick={() => toggle('profile')}
            className={`flex items-center gap-3 pl-3 pr-2 py-1 rounded-full transition-all ${
              openMenu === 'profile'
                ? 'bg-blue-50 dark:bg-blue-950/40'
                : 'hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500 font-medium leading-tight">Merhaba,</p>
              <p className="text-sm font-bold leading-tight">Furkan 👋</p>
            </div>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Furkan"
              alt="Profil"
              className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-blue-100 shadow-sm"
            />
          </button>

          {openMenu === 'profile' && (
            <div className="absolute right-0 top-full mt-2 w-[280px] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-800">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Furkan"
                  alt="Profil"
                  className="w-12 h-12 rounded-full bg-blue-100"
                />
                <div className="min-w-0">
                  <p className="font-bold truncate">Furkan Bağdemir</p>
                  <p className="text-xs text-gray-500 truncate">furkan@hpay.com.tr</p>
                </div>
              </div>

              <div className="py-2">
                <MenuItem
                  href="/settings"
                  icon={<User size={16} />}
                  label="Profilim"
                  onClick={() => setOpenMenu(null)}
                />
                <MenuItem
                  href="/settings"
                  icon={<Settings size={16} />}
                  label="Ayarlar"
                  onClick={() => setOpenMenu(null)}
                />
                <button
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className="w-full flex items-center justify-between gap-3 px-5 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-all"
                >
                  <span className="flex items-center gap-3">
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    Tema
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">
                    {mounted ? (isDark ? 'Koyu' : 'Açık') : '…'}
                  </span>
                </button>
                <MenuItem
                  href="#"
                  icon={<HelpCircle size={16} />}
                  label="Yardım & Destek"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenu(null);
                    alert('Demo modu — destek yakında.');
                  }}
                />
              </div>

              <div className="border-t border-gray-100 dark:border-slate-800 p-2">
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    TokenStorage.clear();
                    router.replace('/login');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                >
                  <LogOut size={16} /> Çıkış Yap
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const MenuItem = ({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: (e: React.MouseEvent) => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 px-5 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-all"
  >
    {icon} {label}
  </Link>
);

export default Navbar;
