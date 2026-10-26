import React, { FormEvent, useId, useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

const SESSION_KEY = 'pcwi_site_unlocked_v1';

const EXPECTED_PASSWORD =
  (import.meta.env.VITE_SITE_PASSWORD as string | undefined)?.trim() || 'reco2026';

function readUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function writeUnlocked(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // sessionStorage unavailable — unlock only for this in-memory session
  }
}

interface Props {
  children: React.ReactNode;
}

export function PasswordGate({ children }: Props) {
  const [unlocked, setUnlocked] = useState(readUnlocked);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();

  if (unlocked) {
    return <>{children}</>;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const attempt = password.trim();
    if (!attempt) {
      setError('Enter the access password to continue.');
      return;
    }
    if (attempt === EXPECTED_PASSWORD) {
      writeUnlocked();
      setError(null);
      setPassword('');
      setUnlocked(true);
      return;
    }
    setError('Incorrect password. Please try again.');
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-100 text-slate-900">
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-recovinyl-dark via-recovinyl-blue to-recovinyl-dark px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/recovinyl-logo.png"
                  alt="Recovinyl"
                  className="h-9 w-auto object-contain bg-white/95 rounded-lg px-2 py-1"
                />
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-recovinyl-green">
                    Recovinyl / VinylPlus Europe
                  </div>
                  <h1 className="text-base sm:text-lg font-black tracking-tight leading-snug">
                    Post-Consumer Waste Information
                  </h1>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5" noValidate>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-9 h-9 rounded-xl bg-recovinyl-light border border-recovinyl-blue/25 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-recovinyl-dark" aria-hidden />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Demo access</h2>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Enter the shared password to open the PCWI demo portal. Access stays unlocked for this
                    browser tab until you close it.
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor={inputId} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password
                </label>
                <input
                  id={inputId}
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${inputId}-error` : undefined}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-recovinyl-blue/30 focus:border-recovinyl-blue ${
                    error ? 'border-red-400' : 'border-slate-200'
                  }`}
                  placeholder="Enter access password"
                />
                {error && (
                  <p
                    id={`${inputId}-error`}
                    role="alert"
                    className="mt-2 flex items-start gap-1.5 text-xs font-semibold text-red-700"
                  >
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden />
                    <span>{error}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-recovinyl-green hover:bg-recovinyl-greenDark text-slate-950 text-sm font-extrabold py-2.5 shadow-sm transition"
              >
                Unlock demo
              </button>

              <p className="text-[10px] text-slate-500 leading-relaxed text-center">
                Soft privacy gate for this public demo — not production authentication.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
