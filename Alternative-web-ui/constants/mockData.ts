import { Transaction } from "@/types";

export const USER_DATA = {
  userId: "1",
  name: "Furkan",
  balance: 84250.50,
  currency: "TRY",
};

// Yeni gruplu yapı — Sidebar bunu kullanır.
export type NavItemDef = { id: string; label: string; path: string };
export type NavGroupDef = { id: string; label: string; items: NavItemDef[] };

export const NAV_GROUPS: NavGroupDef[] = [
  {
    id: 'daily',
    label: 'Günlük Kullanım',
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
      { id: 'transfers', label: 'Transferler', path: '/transfers' },
      { id: 'payments', label: 'Ödemeler', path: '/payments' },
      { id: 'cards', label: 'Kartlarım', path: '/cards' },
    ],
  },
  {
    id: 'smart',
    label: 'Akıllı Yönetim',
    items: [
      { id: 'insights', label: 'AI Insights', path: '/insights' },
      { id: 'budget', label: 'Bütçe', path: '/budget' },
      { id: 'rules', label: 'Otomatik Kurallar', path: '/rules' },
      { id: 'groups', label: 'Group Wallet', path: '/groups' },
    ],
  },
  {
    id: 'other',
    label: 'Diğer',
    items: [
      { id: 'contacts', label: 'Kişiler', path: '/contacts' },
      { id: 'bills', label: 'Faturalar', path: '/bills' },
    ],
  },
];

// Geriye dönük uyum (hala import eden bir yer kalırsa diye)
export const NAV_LINKS = NAV_GROUPS.flatMap((g) => g.items);

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    name: 'Midpoint Gastro',
    senderUsername: 'furkan',
    receiverUsername: 'Midpoint',
    amount: -420.00,
    currency: 'TRY',
    status: 'Completed',
    category: 'YEMEK',
    createdAt: '2026-05-05T14:20:00Z',
    time: '14:20',
    date: 'Bugün',
    icon: '🍴' // İkon bilgisini ekle
  },
  {
    id: '99',
    name: 'Bilinmeyen Hesap',
    senderUsername: 'furkan',
    receiverUsername: 'Bilinmeyen',
    amount: -50000.00,
    currency: 'TRY',
    status: 'FlaggedForReview',
    riskScore: 85,
    category: 'TRANSFER',
    createdAt: '2026-05-05T03:00:00Z',
    time: '03:00',
    date: 'Bugün',
    icon: '⚠️'
  }
];