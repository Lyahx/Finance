"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { ApiService, TokenStorage } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('E-posta veya kullanıcı adı zorunlu.');
      return;
    }
    setError(null);
    setStep('password');
  };

  const onPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Şifre zorunlu.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await ApiService.login({
        emailOrUsername: email.trim(),
        password,
      });
      TokenStorage.set(res.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      const detail = (err as { detail?: string; title?: string })?.detail
        ?? (err as { title?: string })?.title;
      if (status === 401) {
        setError('E-posta/kullanıcı adı veya şifre hatalı. Hesabın yoksa önce kaydol.');
      } else {
        setError(detail || 'Giriş başarısız. Lütfen tekrar dene.');
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-black">
          <img
            src="/lyrabit-logo.png"
            alt="LyraBit"
            className="w-9 h-9 rounded-lg object-cover"
          />
          <span className="font-black text-xl tracking-tight">LyraBit</span>
        </Link>
        <Link
          href="/signup"
          className="text-sm font-bold text-black hover:opacity-70 transition-opacity"
        >
          Hesap oluştur →
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {step === 'password' && (
            <button
              onClick={() => {
                setStep('email');
                setPassword('');
                setError(null);
              }}
              className="flex items-center gap-2 text-sm font-semibold text-black/60 hover:text-black mb-6 transition-colors"
            >
              <ArrowLeft size={16} /> Geri
            </button>
          )}

          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[0.95] mb-3 text-black">
            {step === 'email' ? 'Tekrar hoş geldin.' : `Merhaba${email ? `, ${email.split('@')[0]}` : ''}.`}
          </h1>
          <p className="text-base text-black/60 mb-10">
            {step === 'email'
              ? 'LyraBit hesabınla devam et.'
              : 'Şifreni girerek hesabına eriş.'}
          </p>

          {step === 'email' ? (
            <form onSubmit={onEmail} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black/60 mb-2 block">
                  E-posta veya kullanıcı adı
                </label>
                <input
                  autoFocus
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 text-lg border-2 border-black/10 rounded-2xl focus:border-black outline-none bg-white text-black transition-colors"
                  placeholder="ornek@hpay.com.tr"
                />
              </div>
              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
              <button
                type="submit"
                className="w-full px-6 py-4 rounded-full bg-black text-white font-bold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Devam et <ArrowRight size={18} />
              </button>

              <div className="pt-6 mt-6 border-t border-black/10">
                <p className="text-xs font-bold uppercase tracking-wider text-black/40 mb-3">
                  Demo hesaplar
                </p>
                <div className="flex flex-wrap gap-2">
                  {['furkan', 'ayse', 'mehmet', 'semra', 'ali_yilmaz'].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setEmail(u)}
                      className="px-3 py-1.5 rounded-full border border-black/15 text-xs font-semibold hover:bg-black hover:text-white transition-colors"
                    >
                      @{u}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={onPassword} className="space-y-4">
              <div className="px-4 py-3 rounded-2xl bg-gray-50 border border-black/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-black truncate">{email}</span>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-xs font-bold text-black/60 hover:text-black"
                >
                  Değiştir
                </button>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black/60 mb-2 block">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    autoFocus
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 pr-14 text-lg border-2 border-black/10 rounded-2xl focus:border-black outline-none bg-white text-black transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                  >
                    {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-4 rounded-full bg-black text-white font-bold text-base hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
              >
                {submitting ? 'Giriş yapılıyor…' : <>Giriş yap <ArrowRight size={18} /></>}
              </button>

              <button
                type="button"
                onClick={() => alert('Demo modu — şifre hatırlatma yakında.')}
                className="w-full text-center text-sm font-bold text-black/60 hover:text-black transition-colors mt-2"
              >
                Şifremi unuttum
              </button>
            </form>
          )}

          <p className="text-center text-sm text-black/60 mt-8">
            Hesabın yok mu?{' '}
            <Link href="/signup" className="font-bold text-black underline">
              Hesap oluştur
            </Link>
          </p>
        </div>
      </main>

      <footer className="px-6 lg:px-12 py-6 border-t border-black/10 text-xs text-black/50 flex flex-wrap items-center justify-between gap-2">
        <p>© 2026 LyraBit · Türkiye</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-black">Gizlilik</a>
          <a href="#" className="hover:text-black">Kullanım Koşulları</a>
          <a href="#" className="hover:text-black">Yardım</a>
        </div>
      </footer>
    </div>
  );
}
