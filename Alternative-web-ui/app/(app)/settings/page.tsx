"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  User,
  Lock,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Check,
  ChevronRight,
  KeyRound,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Languages,
  CircleDollarSign,
  Download,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { useCurrentUser } from '@/lib/auth-context';

type Section = 'profile' | 'security' | 'notifications' | 'preferences' | 'data';

const SECTIONS: { id: Section; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'profile',       label: 'Profil',         icon: <User size={18} />,         desc: 'Ad, email, telefon' },
  { id: 'security',      label: 'Güvenlik',       icon: <Shield size={18} />,       desc: 'Şifre, 2FA, oturumlar' },
  { id: 'notifications', label: 'Bildirimler',    icon: <Bell size={18} />,         desc: 'Email, push, SMS' },
  { id: 'preferences',   label: 'Tercihler',      icon: <Globe size={18} />,        desc: 'Tema, dil, para birimi' },
  { id: 'data',          label: 'Veri & Hesap',   icon: <Trash2 size={18} />,       desc: 'Veri indir, hesap sil' },
];

export default function SettingsPage() {
  const [section, setSection] = useState<Section>('profile');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          Hesabını, güvenliğini ve uygulama tercihlerini yönet.
        </p>
      </header>

      {toast && (
        <div className="rounded-2xl px-5 py-4 text-sm font-medium border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900 flex items-center gap-2">
          <Check size={16} /> {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabs */}
        <aside className="lg:col-span-4 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-[28px] p-3 shadow-sm h-fit lg:sticky lg:top-28">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                section === s.id
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-lyraBlue'
                  : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  section === s.id
                    ? 'bg-lyraBlue text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-500'
                }`}
              >
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{s.label}</p>
                <p className="text-[11px] text-gray-500 truncate">{s.desc}</p>
              </div>
              <ChevronRight
                size={16}
                className={`shrink-0 ${section === s.id ? 'text-lyraBlue' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </aside>

        {/* Panel */}
        <main className="lg:col-span-8 space-y-6">
          {section === 'profile' && <ProfileSection onSaved={(m) => showToast(m)} />}
          {section === 'security' && <SecuritySection onSaved={(m) => showToast(m)} />}
          {section === 'notifications' && <NotificationsSection onSaved={(m) => showToast(m)} />}
          {section === 'preferences' && <PreferencesSection onSaved={(m) => showToast(m)} />}
          {section === 'data' && <DataSection onSaved={(m) => showToast(m)} />}
        </main>
      </div>
    </div>
  );
}

/* ---------- Profile ---------- */

function ProfileSection({ onSaved }: { onSaved: (m: string) => void }) {
  const { user } = useCurrentUser();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+90 532 123 45 67');
  const [iban, setIban] = useState('TR58 0006 1005 1978 6457 8413 22');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
    }
  }, [user]);

  const username = user?.username ?? '';
  const avatarSeed = username || user?.fullName || 'lyrabit';

  return (
    <Panel title="Profil Bilgileri" sub="Hesabınla ilişkilendirilen kişisel bilgiler.">
      <div className="flex items-center gap-4 pb-5 border-b border-gray-100 dark:border-slate-800">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`}
          alt="Profil"
          className="w-20 h-20 rounded-full bg-blue-100 ring-4 ring-blue-50 dark:ring-blue-950/30"
        />
        <div className="flex-1">
          <p className="font-bold text-lg">{fullName || '...'}</p>
          <p className="text-sm text-gray-500">{username ? `@${username}` : ''}</p>
          <button
            onClick={() => onSaved('Avatar değiştirme yakında.')}
            className="text-xs font-semibold text-lyraBlue mt-1 hover:underline"
          >
            Avatarı değiştir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <Field
          label="Ad Soyad"
          icon={<User size={14} />}
          value={fullName}
          onChange={setFullName}
        />
        <Field
          label="Kullanıcı Adı"
          icon={<User size={14} />}
          value={username}
          readOnly
          hint="Değiştirilemez"
        />
        <Field label="E-posta" icon={<Mail size={14} />} value={email} onChange={setEmail} />
        <Field label="Telefon" icon={<Phone size={14} />} value={phone} onChange={setPhone} />
      </div>

      <div className="mt-4">
        <Field
          label="IBAN"
          icon={<CreditCard size={14} />}
          value={iban}
          onChange={setIban}
          mono
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => onSaved('Profil güncellendi.')}
          className="bg-lyraBlue hover:bg-lyraBlue-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
        >
          Değişiklikleri Kaydet
        </button>
      </div>
    </Panel>
  );
}

/* ---------- Security ---------- */

function SecuritySection({ onSaved }: { onSaved: (m: string) => void }) {
  const [twoFa, setTwoFa] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [showPwd, setShowPwd] = useState(false);

  const SESSIONS = [
    { device: 'MacBook Pro · Chrome', location: 'İstanbul, TR', ip: '85.34.74.122', lastActive: 'Şu an', current: true, icon: <Monitor size={16} /> },
    { device: 'iPhone 15 · LyraBit App', location: 'İstanbul, TR', ip: '85.34.74.122', lastActive: '5 dk önce', current: false, icon: <Smartphone size={16} /> },
    { device: 'Windows · Firefox', location: 'Ankara, TR', ip: '212.175.32.45', lastActive: '2 gün önce', current: false, icon: <Monitor size={16} /> },
  ];

  return (
    <>
      <Panel title="Şifre" sub="Şifreni en az 90 günde bir değiştirmeni öneririz.">
        <div className="space-y-3">
          <Field
            label="Mevcut Şifre"
            icon={<KeyRound size={14} />}
            value=""
            onChange={() => {}}
            type={showPwd ? 'text' : 'password'}
            placeholder="••••••••"
            trailing={
              <button
                onClick={() => setShowPwd((p) => !p)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
          />
          <Field label="Yeni Şifre" icon={<Lock size={14} />} value="" onChange={() => {}} type="password" placeholder="En az 8 karakter" />
          <Field label="Yeni Şifre (tekrar)" icon={<Lock size={14} />} value="" onChange={() => {}} type="password" placeholder="Tekrar girin" />
        </div>
        <div className="flex justify-end mt-5">
          <button
            onClick={() => onSaved('Şifre güncellendi.')}
            className="bg-lyraBlue hover:bg-lyraBlue-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
          >
            Şifreyi Güncelle
          </button>
        </div>
      </Panel>

      <Panel title="İki Adımlı Doğrulama (2FA)" sub="Hesabını şifrenden sonra ikinci bir kodla koru.">
        <Toggle
          label="Authenticator uygulaması"
          desc="Google Authenticator veya benzeri ile 6 haneli kod"
          on={twoFa}
          onToggle={(v) => {
            setTwoFa(v);
            onSaved(v ? '2FA aktif edildi.' : '2FA kapatıldı.');
          }}
        />
        <hr className="border-gray-100 dark:border-slate-800 my-3" />
        <Toggle
          label="Biyometrik giriş"
          desc="Yüz / parmak izi ile hızlı giriş"
          on={biometric}
          onToggle={(v) => {
            setBiometric(v);
            onSaved(v ? 'Biyometrik aktif.' : 'Biyometrik kapatıldı.');
          }}
        />
      </Panel>

      <Panel title="Aktif Oturumlar" sub="Hesabına bağlı tüm cihazları görüntüle.">
        <div className="space-y-2">
          {SESSIONS.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500">
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold flex items-center gap-2 truncate">
                    {s.device}
                    {s.current && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase">
                        Bu cihaz
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {s.location} · {s.ip} · {s.lastActive}
                  </p>
                </div>
              </div>
              {!s.current && (
                <button
                  onClick={() => onSaved('Oturum sonlandırıldı.')}
                  className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <LogOut size={12} /> Çıkış
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => onSaved('Diğer tüm oturumlar sonlandırıldı.')}
          className="mt-4 w-full px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-red-600 dark:text-red-400 font-bold text-sm transition-all"
        >
          Diğer tüm cihazlardan çıkış yap
        </button>
      </Panel>
    </>
  );
}

/* ---------- Notifications ---------- */

type NotifGroup = 'transfer' | 'fraud' | 'subscription' | 'promo';
type NotifChannel = 'Email' | 'Push' | 'Sms';
type NotifKey = `${NotifGroup}${NotifChannel}`;
type NotifPrefs = Record<NotifKey, boolean>;

function NotificationsSection({ onSaved }: { onSaved: (m: string) => void }) {
  const [prefs, setPrefs] = useState<NotifPrefs>({
    transferEmail: true,     transferPush: true,     transferSms: false,
    fraudEmail: true,        fraudPush: true,        fraudSms: true,
    subscriptionEmail: true, subscriptionPush: false, subscriptionSms: false,
    promoEmail: false,       promoPush: false,        promoSms: false,
  });

  const ROWS: { id: NotifGroup; label: string; desc: string }[] = [
    { id: 'transfer',     label: 'Transferler',       desc: 'Para gönderme/alma onayları' },
    { id: 'fraud',        label: 'Güvenlik & Fraud',  desc: 'Şüpheli işlem, giriş uyarıları' },
    { id: 'subscription', label: 'Abonelikler',       desc: 'Yenileme ve fatura kesim hatırlatıcısı' },
    { id: 'promo',        label: 'Kampanyalar',       desc: 'Pazarlama, indirim, davet kazançları' },
  ];

  const toggle = (key: NotifKey) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    onSaved('Bildirim tercihi güncellendi.');
  };

  return (
    <Panel
      title="Bildirim Tercihleri"
      sub="Hangi olaylar için hangi kanaldan haberdar olmak istersin?"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-800">
              <th className="text-left pb-3 pr-4">Olay</th>
              <th className="pb-3 px-3 text-center">E-posta</th>
              <th className="pb-3 px-3 text-center">Push</th>
              <th className="pb-3 px-3 text-center">SMS</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 dark:border-slate-800/60">
                <td className="py-4 pr-4">
                  <p className="text-sm font-bold">{r.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{r.desc}</p>
                </td>
                {(['Email', 'Push', 'Sms'] as const).map((ch) => {
                  const key: NotifKey = `${r.id}${ch}`;
                  return (
                    <td key={ch} className="px-3 text-center">
                      <SwitchInline on={prefs[key]} onToggle={() => toggle(key)} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl flex items-start gap-3">
        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong>Güvenlik & Fraud</strong> bildirimleri için en az bir kanal açık olmalı —
          hesabın güvenliği için zorunludur.
        </p>
      </div>
    </Panel>
  );
}

/* ---------- Preferences ---------- */

function PreferencesSection({ onSaved }: { onSaved: (m: string) => void }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => setMounted(true), []);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [currency, setCurrency] = useState<'TRY' | 'USD' | 'EUR'>('TRY');

  return (
    <>
      <Panel title="Görünüm" sub="Uygulamanın renk teması.">
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              ['light', 'Açık', <Sun key="s" size={18} />],
              ['dark',  'Koyu', <Moon key="m" size={18} />],
              ['system', 'Sistem', <Monitor key="sy" size={18} />],
            ] as const
          ).map(([val, lbl, ic]) => {
            const active = mounted && (theme ?? 'system') === val;
            return (
              <button
                key={val}
                onClick={() => {
                  setTheme(val);
                  onSaved(`Tema: ${lbl}`);
                }}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  active
                    ? 'border-lyraBlue bg-blue-50 dark:bg-blue-950/30'
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${active ? 'bg-lyraBlue text-white' : 'bg-gray-100 dark:bg-slate-800'}`}>
                  {ic}
                </div>
                <span className="font-bold text-sm">{lbl}</span>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Dil" sub="Arayüz dili.">
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ['tr', 'Türkçe', '🇹🇷'],
              ['en', 'English', '🇬🇧'],
            ] as const
          ).map(([val, lbl, flag]) => (
            <button
              key={val}
              onClick={() => {
                setLanguage(val);
                onSaved(`Dil: ${lbl}`);
              }}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                language === val
                  ? 'border-lyraBlue bg-blue-50 dark:bg-blue-950/30'
                  : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{flag}</span>
              <div className="text-left">
                <p className="font-bold text-sm flex items-center gap-2">
                  <Languages size={14} /> {lbl}
                </p>
                <p className="text-[11px] text-gray-500">
                  {val === 'tr' ? 'Tüm bildirimler Türkçe' : 'All notifications in English'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Ana Para Birimi" sub="Bakiye ve tutarların gösterileceği birim.">
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              ['TRY', 'Türk Lirası', '₺'],
              ['USD', 'US Dollar', '$'],
              ['EUR', 'Euro', '€'],
            ] as const
          ).map(([val, lbl, sym]) => (
            <button
              key={val}
              onClick={() => {
                setCurrency(val);
                onSaved(`Para birimi: ${val}`);
              }}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                currency === val
                  ? 'border-lyraBlue bg-blue-50 dark:bg-blue-950/30'
                  : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
              }`}
            >
              <CircleDollarSign size={20} className={currency === val ? 'text-lyraBlue' : 'text-gray-400'} />
              <p className="font-bold text-base">
                {sym} {val}
              </p>
              <p className="text-[10px] text-gray-500">{lbl}</p>
            </button>
          ))}
        </div>
      </Panel>
    </>
  );
}

/* ---------- Data & Account ---------- */

function DataSection({ onSaved }: { onSaved: (m: string) => void }) {
  const { user } = useCurrentUser();
  const [confirmText, setConfirmText] = useState('');
  const usernameLower = user?.username?.toLowerCase() ?? '';

  return (
    <>
      <Panel title="Verilerini İndir" sub="Tüm hesap verilerini GDPR/KVKK uyumlu olarak JSON ya da PDF.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => onSaved('JSON arşivi oluşturuluyor — email ile gelecek.')}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-lyraBlue hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
          >
            <Download className="text-lyraBlue shrink-0" size={20} />
            <div className="text-left">
              <p className="font-bold text-sm">JSON Arşivi</p>
              <p className="text-[11px] text-gray-500">Tüm işlemler, ayarlar, profil</p>
            </div>
          </button>
          <button
            onClick={() => onSaved('Hesap özeti PDF oluşturuluyor.')}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-lyraBlue hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
          >
            <Download className="text-lyraBlue shrink-0" size={20} />
            <div className="text-left">
              <p className="font-bold text-sm">PDF Hesap Özeti</p>
              <p className="text-[11px] text-gray-500">Yıl bazlı ekstre raporu</p>
            </div>
          </button>
        </div>
      </Panel>

      <Panel
        title="Hesabı Kalıcı Olarak Sil"
        sub="Bu işlem geri alınamaz. Tüm verilerin silinecek."
        tone="danger"
      >
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
              <strong>Hesabını silmeden önce:</strong>
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>Bakiyeni başka bir hesaba transfer et</li>
                <li>Aktif tekrarlayan ödemeleri iptal et</li>
                <li>Tüm sanal kartlarını sil</li>
              </ul>
            </div>
          </div>
        </div>
        <Field
          label="Onay için kullanıcı adını yaz"
          value={confirmText}
          onChange={setConfirmText}
          placeholder={usernameLower}
        />
        <div className="flex justify-end mt-4">
          <button
            disabled={!usernameLower || confirmText !== usernameLower}
            onClick={() => onSaved('Hesap silme demo modunda devre dışı.')}
            className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 size={14} /> Hesabımı Kalıcı Sil
          </button>
        </div>
      </Panel>
    </>
  );
}

/* ---------- Reusable bits ---------- */

function Panel({
  title,
  sub,
  children,
  tone,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
  tone?: 'danger';
}) {
  return (
    <section
      className={`rounded-[28px] p-6 shadow-sm border ${
        tone === 'danger'
          ? 'bg-white dark:bg-slate-900/50 border-red-200 dark:border-red-900'
          : 'bg-white dark:bg-slate-900/50 border-gray-100 dark:border-slate-800'
      }`}
    >
      <header className="mb-5">
        <h2 className={`font-bold ${tone === 'danger' ? 'text-red-600 dark:text-red-400' : ''}`}>
          {title}
        </h2>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  icon,
  type = 'text',
  hint,
  placeholder,
  readOnly,
  trailing,
  mono,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  icon?: React.ReactNode;
  type?: string;
  hint?: string;
  placeholder?: string;
  readOnly?: boolean;
  trailing?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
        {icon} {label}
      </label>
      <div
        className={`relative flex items-center px-3 py-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl border-2 border-transparent focus-within:border-lyraBlue transition-all ${
          readOnly ? 'opacity-70' : ''
        }`}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`flex-1 bg-transparent outline-none text-sm ${mono ? 'font-mono' : ''}`}
        />
        {trailing}
      </div>
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({
  label,
  desc,
  on,
  onToggle,
}: {
  label: string;
  desc: string;
  on: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">{label}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{desc}</p>
      </div>
      <SwitchInline on={on} onToggle={() => onToggle(!on)} />
    </div>
  );
}

function SwitchInline({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${
        on ? 'bg-lyraBlue' : 'bg-gray-300 dark:bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
          on ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  );
}
