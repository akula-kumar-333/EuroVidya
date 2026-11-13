import { Eye, EyeOff, Loader2, LogIn, UserPlus, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInEmail: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  onSignUpEmail: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  onSignInGoogle: () => Promise<{ ok: true } | { ok: false; error: string }>;
}

export function AuthModal({
  isOpen,
  onClose,
  onSignInEmail,
  onSignUpEmail,
  onSignInGoogle,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && fullName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    const res =
      mode === 'signup'
        ? await onSignUpEmail(fullName, email, password)
        : await onSignInEmail(email, password);
    setSubmitting(false);

    if (res.ok) {
      onClose();
    } else {
      setError(res.error);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setSubmitting(true);
    const res = await onSignInGoogle();
    setSubmitting(false);
    if (res.ok) {
      onClose();
    } else {
      setError(res.error);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="EuroVidya Student Account Authentication"
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00253E]/45 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-[#D9E2E8] rounded-xl shadow-[0_12px_32px_rgba(23,59,87,0.14)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-4 border-b border-[#D9E2E8] flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/EuroVidya_Logo_Square.jpg_ce32e512.jpeg"
              alt="EuroVidya Study Abroad Square Emblem"
              className="w-14 h-14 object-contain rounded border border-[#D9E2E8] bg-white p-1 shrink-0"
            />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#167C80]">
                Student Portal Account
              </p>
              <h2 className="font-display text-lg font-semibold text-[#173B57]">
                {mode === 'login' ? 'Log In to My Shortlist' : 'Create Student Account'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            className="p-1.5 rounded border border-[#D9E2E8] text-[#667784] hover:text-[#173B57] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#EAF2F5] rounded">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                mode === 'login' ? 'bg-white text-[#173B57] shadow-xs' : 'text-[#667784] hover:text-[#173B57]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                mode === 'signup' ? 'bg-white text-[#173B57] shadow-xs' : 'text-[#667784] hover:text-[#173B57]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="authFullName" className="block text-xs font-semibold text-[#173B57] mb-1">
                  Student Full Name
                </label>
                <input
                  id="authFullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
                />
              </div>
            )}

            <div>
              <label htmlFor="authEmail" className="block text-xs font-semibold text-[#173B57] mb-1">
                Email Address
              </label>
              <input
                id="authEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
              />
            </div>

            <div>
              <label htmlFor="authPassword" className="block text-xs font-semibold text-[#173B57] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="authPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#667784] hover:text-[#173B57] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="p-3 rounded bg-[#FFDAD6]/50 border border-[#BA1A1A]/40 text-xs leading-relaxed text-[#93000A]"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-[#167C80] hover:bg-[#00696D] disabled:opacity-60 text-white text-sm font-semibold rounded transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Log In with Email' : 'Create My EuroVidya Account'}
            </button>
          </form>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-[#D9E2E8]" />
            <span className="shrink-0 mx-3 text-[11px] uppercase tracking-wider text-[#667784]">or</span>
            <div className="flex-grow border-t border-[#D9E2E8]" />
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={handleGoogle}
            className="w-full py-2.5 px-4 bg-white border-[1.5px] border-[#173B57] text-[#173B57] hover:bg-[#173B57]/[0.04] text-sm font-semibold rounded transition-colors cursor-pointer"
          >
            Continue with Google
          </button>

          <p className="text-[11px] text-center text-[#667784] leading-relaxed">
            Signing in saves your liked programs, shortlisted European universities, and visa checklist securely in the
            cloud.
          </p>
        </div>
      </div>
    </div>
  );
}
