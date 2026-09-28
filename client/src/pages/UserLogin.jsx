import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { gsap } from 'gsap';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
  Sparkles,
} from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5555/api/v1/auth/user'}`;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const storeSession = ({ token, user }) => {
  localStorage.setItem('inkcarnate_user_token', token);
  localStorage.setItem('inkcarnate_user', JSON.stringify(user));
};

export default function UserLogin({ onSwitchToRegister }) {
  const root = useRef(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        '.auth-card',
        { opacity: 0, y: 34, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out', clearProps: 'opacity,transform' }
      );
      gsap.fromTo(
        '.auth-stagger',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, delay: 0.15, ease: 'power2.out', clearProps: 'opacity,transform' }
      );
      gsap.to('.auth-heart', { y: -7, rotation: 4, duration: 2.3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, root);
    return () => context.revert();
  }, []);

  const completeAuth = (data) => {
    storeSession(data);
    setMessage('Welcome back. Taking you to your sanctuary…');
    window.setTimeout(() => navigate('/userhomedashboard'), 450);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!form.email || !form.password) {
      setError('Please enter your email address and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to sign you in right now.');
      completeAuth(data);
    } catch (requestError) {
      setError(requestError.message || 'Unable to reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Google did not return a valid sign-in token. Please try again.');
      return;
    }
    setError('');
    setMessage('Connecting with Google…');
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Google sign-in was not completed.');
      completeAuth(data);
    } catch (requestError) {
      setMessage('');
      setError(requestError.message || 'Google sign-in was not completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchToRegister = () => (onSwitchToRegister ? onSwitchToRegister() : navigate('/user/register'));

  return (
    <main ref={root} className="relative flex min-h-screen items-start justify-center overflow-x-hidden bg-[#fff8f3] px-4 py-10 font-sans text-[#552b27] sm:items-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-12 h-80 w-80 rounded-full bg-rose-300/35 blur-3xl animate-pulse" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-orange-200/45 blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute left-[42%] top-[14%] h-44 w-44 rounded-full bg-pink-200/35 blur-3xl" />
      </div>

      <section className="auth-card relative z-10 mb-6 w-full max-w-md rounded-[2rem] border border-white/70 bg-white/45 px-6 py-9 shadow-[0_20px_50px_rgba(244,114,182,0.12)] backdrop-blur-2xl sm:mb-0 sm:px-10 sm:py-11">
        <div className="auth-stagger absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-[1.45rem] border border-white/80 bg-gradient-to-br from-[#f8d6cb] to-[#ed9da5] text-[#9b4650] shadow-lg">
          <Heart className="auth-heart" size={28} strokeWidth={1.7} fill="currentColor" />
        </div>
        <Sparkles className="auth-stagger absolute right-8 top-7 text-[#d89569]" size={16} />
        <div className="auth-stagger mt-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b96763]">Inkcarnate by Kats</p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight text-[#4c2420]">Reclaim your sanctuary</h1>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#7c5650]">Come back to your reflections, rituals, and every little order made for you.</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
          <label className="auth-stagger block">
            <span className="mb-2 block text-xs font-semibold text-[#754b45]">Email address</span>
            <span className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/45 px-4 py-3.5 transition focus-within:border-rose-300 focus-within:bg-white/65 focus-within:ring-4 focus-within:ring-rose-200/35">
              <Mail size={18} className="text-[#bd7472]" />
              <input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@lovely.com" className="w-full bg-transparent text-sm outline-none placeholder:text-[#b99a95]" />
            </span>
          </label>
          <label className="auth-stagger block">
            <span className="mb-2 block text-xs font-semibold text-[#754b45]">Password</span>
            <span className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/45 px-4 py-3.5 transition focus-within:border-rose-300 focus-within:bg-white/65 focus-within:ring-4 focus-within:ring-rose-200/35">
              <Lock size={18} className="text-[#bd7472]" />
              <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your secret garden" className="w-full bg-transparent text-sm outline-none placeholder:text-[#b99a95]" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="text-[#9e625d] hover:text-rose-500">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
          <div className="auth-stagger flex justify-end">
            <button type="button" onClick={() => { setError(''); setMessage('Password reset will be available here soon.'); }} className="text-xs font-semibold text-[#b65c61] transition hover:text-rose-700">
              Forgot password?
            </button>
          </div>
          {error && <p role="alert" className="rounded-xl bg-rose-100/80 px-3 py-2.5 text-center text-xs text-rose-700">{error}</p>}
          {message && <p role="status" className="rounded-xl bg-[#f8e5d7]/85 px-3 py-2.5 text-center text-xs text-[#9a594b]">{message}</p>}
          <button type="submit" disabled={isSubmitting} className="auth-stagger group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 px-5 py-4 text-sm font-bold text-white shadow-[0_12px_24px_rgba(244,114,182,0.3)] transition hover:scale-[1.02] hover:shadow-[0_14px_30px_rgba(244,114,182,0.42)] disabled:cursor-wait disabled:opacity-70">
            {isSubmitting ? 'Opening your sanctuary…' : 'Sign In'} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="auth-stagger my-6 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#aa8580]">
          <span className="h-px flex-1 bg-[#e6c9c2]" />or continue with<span className="h-px flex-1 bg-[#e6c9c2]" />
        </div>
        <div className="auth-stagger flex justify-center">
          {GOOGLE_CLIENT_ID ? (
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setError('Google sign-in was cancelled or unavailable.')} theme="outline" shape="pill" text="continue_with" width="300" />
          ) : (
            <button type="button" onClick={() => setError('Google Sign-In needs VITE_GOOGLE_CLIENT_ID in the client environment.')} className="flex w-full items-center justify-center gap-2 rounded-full border border-white/80 bg-white/55 px-5 py-3 text-sm font-semibold text-[#704842] transition hover:bg-white/75">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-bold text-[#4285F4]">G</span> Continue with Google
            </button>
          )}
        </div>
        <p className="auth-stagger mt-7 text-center text-sm text-[#805a54]">
          New to the ritual? <button type="button" onClick={switchToRegister} className="font-bold text-[#b6555d] hover:text-rose-700">Create an account</button>
        </p>
      </section>
    </main>
  );
}
