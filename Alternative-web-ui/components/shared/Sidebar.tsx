"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Sparkles,
  CreditCard,
  Settings,
  LogOut,
  ArrowLeftRight,
  PiggyBank,
  Zap,
  Users,
  Receipt,
  UserPlus,
  Contact,
  Target,
} from 'lucide-react';
import { NAV_GROUPS } from "@/constants/mockData";

const ICONS: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard size={18} />,
  transfers: <ArrowLeftRight size={18} />,
  payments: <Wallet size={18} />,
  cards: <CreditCard size={18} />,
  insights: <Sparkles size={18} />,
  budget: <Target size={18} />,
  rules: <Zap size={18} />,
  groups: <Users size={18} />,
  contacts: <Contact size={18} />,
  bills: <Receipt size={18} />,
  invite: <UserPlus size={18} />,
  settings: <Settings size={18} />,
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hidden lg:flex flex-col p-5 sticky top-0 h-screen overflow-y-auto">
      <Link href="/dashboard" className="flex items-center mb-6 px-1">
        <img
          src="/lyrabit-logo.png"
          alt="LyraBit"
          className="w-full max-w-[200px] h-auto object-contain dark:bg-white dark:rounded-md dark:p-1"
        />
      </Link>

      <nav className="flex-1 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.id}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((link) => (
                <NavItem
                  key={link.id}
                  href={link.path}
                  icon={ICONS[link.id] ?? <PiggyBank size={18} />}
                  label={link.label}
                  active={pathname === link.path}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800 space-y-0.5">
        <NavItem
          href="/settings"
          icon={ICONS.settings}
          label="Ayarlar"
          active={pathname === '/settings'}
        />
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
        >
          <LogOut size={18} />
          <span className="font-semibold text-sm">Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
      active
        ? 'bg-lyraBlue text-white shadow-sm shadow-blue-500/20 font-semibold'
        : 'text-gray-600 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800'
    }`}
  >
    <span className={active ? '' : 'text-gray-400 dark:text-slate-500'}>{icon}</span>
    {label}
  </Link>
);

export default Sidebar;
