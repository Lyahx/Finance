"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { ApiService, TokenStorage } from '@/services/api';

const STEPS = ['email', 'name', 'username', 'password'] as const;
type Step = (typeof STEPS)[number];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const next = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Geçerli bir e-posta gir.');
        return;
      }
      setStep('name');
    } else if (step === 'name') {
      if (fullName.trim().length < 2) {
        setError('Ad soyad en az 2 karakter olmalı.');
        return;
      }
      setStep('username');
    } else if (step === 'username') {
      if (!/^[a-zA-Z0-9_]{3,50}$/.test(username.trim())) {
        setError('Kullanıcı adı 3-50 karakter; sadece harf, rakam ve _ kullanılabilir.');
        return;
      }
      setStep('password');
    } else {
      if (password.length < 8) {
        setError('Şifre en az 8 karakter olmalı.');
        return;
      }
      setSubmitting(true);
      try {
        const res = await ApiService.register({
          email: email.trim(),
          username: username.trim(),
          fullName: fullName.trim(),
          password,
        });
        TokenStorage.set(res.token);
        router.push('/dashboard');
      } catch (err: unknown) {
        const detail = (err as { detail?: string; title?: string })?.detail
          ?? (err as { title?: string })?.title;
        setError(detail || 'Kayıt başarısız. Lütfen tekrar dene.');
        setSubmitting(false);
      }
    }
  };

  const back = () => {
    setError(null);
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-black">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-lg">
            L
          </div>
          <span className="font-black text-xl tracking-tight">LyraBit</span>
        </Link>
        <Link
          href="/login"
          className="text-sm font-bold text-black hover:opacity-70 transition-opacity"
        >
          Giriş yap →
        </Link>
      </header>

      {/* Progress */}
      <div className="px-6 lg:px-12">
        <div className="max-w-md mx-auto h-1 bg-black/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="max-w-md mx-auto mt-2 text-xs font-bold uppercase tracking-wider text-black/40">
          Adım {stepIndex + 1} / {STEPS.length}
        </p>
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {stepIndex > 0 && (
            <button
              onClick={back}
              className="flex items-center gap-2 text-sm font-semibold text-black/60 hover:text-black mb-6 transition-colors"
            >
              <ArrowLeft size={16} /> Geri
            </button>
          )}

          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[0.95] mb-3 text-black">
            {step === 'email' && 'Hesabını oluştur.'}
            {step === 'name' && `Tanışalım${email ? '.' : ''}`}
            {step === 'username' && 'Kullanıcı adı seç.'}
            {step === 'password' && 'Bir şifre belirle.'}
          </h1>
          <p className="text-base text-black/60 mb-10">
            {step === 'email' && 'E-postanla başlayalım. Komisyonsuz transfer dakikalar içinde.'}
            {step === 'name' && 'Bizim seni nasıl çağıracağımızı söyle.'}
            {step === 'username' && 'Para gönderirken arkadaşların seni bununla bulacak.'}
            {step === 'password' && 'En az 8 karakter, hesabın senin elinde.'}
          </p>

          <form onSubmit={next} className="space-y-4">
            {step === 'email' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black/60 mb-2 block">
                  E-posta
                </label>
                <input
                  autoFocus
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 text-lg border-2 border-black/10 rounded-2xl focus:border-black outline-none bg-white text-black transition-colors"
                  placeholder="ornek@hpay.com.tr"
                />
              </div>
            )}

            {step === 'name' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black/60 mb-2 block">
                  Ad Soyad
                </label>
                <input
                  autoFocus
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-5 py-4 text-lg border-2 border-black/10 rounded-2xl focus:border-black outline-none bg-white text-black transition-colors"
                  placeholder="Furkan Bağdemir"
                />
              </div>
            )}

            {step === 'username' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black/60 mb-2 block">
                  Kullanıcı adı
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-black/40 font-semibold">
                    @
                  </span>
                  <input
                    autoFocus
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                    className="w-full pl-12 pr-5 py-4 text-lg border-2 border-black/10 rounded-2xl focus:border-black outline-none bg-white text-black transition-colors"
                    placeholder="furkan_b"
                    autoComplete="username"
                  />
                </div>
                <p className="mt-2 text-xs text-black/40">3-50 karakter · harf, rakam ve _ kullanabilirsin</p>
              </div>
            )}

            {step === 'password' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black/60 mb-2 block">
                  Şifre
                </label>
                <input
                  autoFocus
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 text-lg border-2 border-black/10 rounded-2xl focus:border-black outline-none bg-white text-black transition-colors"
                  placeholder="••••••••"
                />
                <ul className="mt-3 space-y-1">
                  <Pwd ok={password.length >= 8} text="En az 8 karakter" />
                  <Pwd ok={/[A-Z]/.test(password)} text="Bir büyük harf" />
                  <Pwd ok={/\d/.test(password)} text="Bir rakam" />
                </ul>
              </div>
            )}

            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-4 rounded-full bg-black text-white font-bold text-base hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
            >
              {submitting ? (
                'Hesap oluşturuluyor…'
              ) : (
                <>
                  {step === 'password' ? 'Hesabı oluştur' : 'Devam et'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-black/50 mt-8 leading-relaxed">
            Hesap oluşturarak{' '}
            <a href="#" className="underline">Kullanım Koşulları</a> ve{' '}
            <a href="#" className="underline">Gizlilik Politikası</a>'nı kabul etmiş olursun.
          </p>

          <p className="text-center text-sm text-black/60 mt-6">
            Zaten hesabın var mı?{' '}
            <Link href="/login" className="font-bold text-black underline">
              Giriş yap
            </Link>
          </p>
        </div>
      </main>

      <footer className="px-6 lg:px-12 py-6 border-t border-black/10 text-xs text-black/50">
        © 2026 LyraBit · Türkiye
      </footer>
    </div>
  );
}

function Pwd({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className={`flex items-center gap-2 text-xs ${ok ? 'text-emerald-600' : 'text-black/40'}`}>
      <span
        className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] ${
          ok ? 'bg-emerald-500' : 'bg-black/15'
        }`}
      >
        {ok && <Check size={10} />}
      </span>
      {text}
    </li>
  );
}
