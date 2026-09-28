import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Heart,
  Leaf,
  Quote,
  Sparkles,
  Star,
} from 'lucide-react';
import journalCover from '../../images/image.jpg';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    number: '01',
    title: 'Mindset rewiring',
    copy: 'Guided prompts and best-case-scenario journaling to shift the stories you carry.',
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'Words that hold you',
    copy: 'Curated quotes and soft self-acceptance reflections for the days you need them most.',
    icon: Quote,
  },
  {
    number: '03',
    title: 'Your daily return',
    copy: 'Little grounding practices and self-love rituals to make coming home a habit.',
    icon: Leaf,
  },
  {
    number: '04',
    title: 'Made to be kept',
    copy: 'Premium bleed-proof pages, a sturdy gold twin-wire bind, and room to breathe.',
    icon: BookOpen,
  },
];

const previews = [
  {
    label: 'Self acceptance',
    title: 'The art of self acceptance',
    quote: 'The way you speak to yourself shapes the person you become.',
    prompt: 'What would change if you offered yourself the same grace you give the people you love?',
  },
  {
    label: 'Gentle becoming',
    title: 'You are allowed to begin again',
    quote: 'Growth can be soft, slow, and still entirely yours.',
    prompt: 'Name one small promise you can keep for yourself today.',
  },
  {
    label: 'Coming home',
    title: 'A place within yourself',
    quote: 'You do not have to earn your own belonging.',
    prompt: 'Where do you feel most like yourself, and how can you meet that feeling today?',
  },
];

const loveNotes = [
  ['“It feels like a warm conversation with the version of me I had forgotten.”', 'Rhea M.'],
  ['“Beautifully made, beautifully written. My quiet ten minutes have become sacred.”', 'Aanya S.'],
  ['“Every prompt lands exactly where it needs to. This is a little treasure.”', 'Nikita J.'],
  ['“The paper, the questions, the gentle tone — I love every thoughtful detail.”', 'Prisha K.'],
  ['“A truly lovely nudge to put myself back on my own list.”', 'Meera V.'],
];

const GlassCard = ({ children, className = '' }) => (
  <div className={`border border-white/60 bg-white/40 shadow-[0_8px_32px_0_rgba(231,111,81,0.08)] backdrop-blur-xl ${className}`}>
    {children}
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  const root = useRef(null);
  const [activePreview, setActivePreview] = useState(0);
  const [dockVisible, setDockVisible] = useState(false);

  const goToLogin = () => navigate('/user/login');
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.hero-reveal', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      });
      gsap.to('.book-float', {
        y: -15,
        rotation: 0.8,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.orb-one', { x: 38, y: -22, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.orb-two', { x: -25, y: 34, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.utils.toArray('.scroll-reveal').forEach((element) => {
        gsap.from(element, {
          y: 32,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 84%' },
        });
      });
    }, root);

    const onScroll = () => setDockVisible(window.scrollY > window.innerHeight * 0.58);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      context.revert();
    };
  }, []);

  const preview = previews[activePreview];

  return (
    <main ref={root} className="min-h-screen overflow-hidden bg-[#fff9f3] font-sans text-[#4a201b] selection:bg-[#e9a592]/40">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="orb-one absolute -left-28 top-24 h-80 w-80 rounded-full bg-[#f2b7aa]/35 blur-3xl" />
        <div className="orb-two absolute right-[-7rem] top-[27rem] h-96 w-96 rounded-full bg-[#efd19a]/30 blur-3xl" />
        <div className="absolute bottom-20 left-[30%] h-64 w-64 rounded-full bg-[#eeb6c6]/25 blur-3xl" />
      </div>

      <header className="fixed inset-x-0 top-4 z-50 px-3 sm:top-6 sm:px-6">
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/70 bg-white/60 px-4 py-2.5 shadow-[0_8px_32px_0_rgba(111,52,42,0.11)] backdrop-blur-md sm:px-6">
          <button onClick={() => scrollTo('top')} className="group flex items-center gap-2 text-left" aria-label="Go to the top">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7ddd5] text-[#a94d43] transition-transform group-hover:scale-110"><Heart size={15} fill="currentColor" /></span>
            <span className="font-serif text-xl leading-none tracking-tight text-[#48201b] sm:text-2xl">Inkcarnate <em className="ml-1 font-sans text-[9px] not-italic tracking-[0.14em] text-[#9a6259]">by Kats</em></span>
          </button>
          <div className="hidden items-center gap-6 text-xs font-medium tracking-wide text-[#73423b] md:flex">
            <button onClick={() => scrollTo('journal')} className="transition hover:text-[#b84e45]">The Journal</button>
            <button onClick={() => scrollTo('prompts')} className="transition hover:text-[#b84e45]">Prompts Inside</button>
            <button onClick={() => scrollTo('story')} className="transition hover:text-[#b84e45]">Our Story</button>
            <button onClick={() => scrollTo('reviews')} className="transition hover:text-[#b84e45]">Reviews</button>
          </div>
          <button onClick={goToLogin} className="rounded-full border border-white/80 bg-gradient-to-r from-[#ca7166] to-[#e69c93] px-4 py-2 text-xs font-semibold text-white shadow-[0_7px_20px_rgba(190,91,80,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(190,91,80,0.38)] sm:px-5">Get Started</button>
        </nav>
      </header>

      <section id="top" className="relative z-10 mx-auto grid min-h-[790px] max-w-7xl items-center gap-10 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-4 lg:px-12 lg:pt-28">
        <div className="order-2 max-w-xl lg:order-1">
          <div className="hero-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#a04f46] shadow-sm backdrop-blur-xl"><Sparkles size={13} /> The little book of self love</div>
          <h1 className="hero-reveal font-serif text-5xl leading-[0.9] tracking-[-0.035em] text-[#43201c] sm:text-6xl lg:text-7xl">Where thoughts become ink <span className="font-light italic text-[#b4654f]">&amp; ink becomes transformation.</span></h1>
          <p className="hero-reveal mt-7 max-w-md text-sm leading-7 text-[#704b44] sm:text-[15px]">Returning home isn't just a physical journey; it's a profound reconnection with the self, a quiet reclamation of the space where you truly belong.</p>
          <div className="hero-reveal mt-8 flex flex-wrap gap-3">
            <button onClick={goToLogin} className="group relative overflow-hidden rounded-full bg-[#a94d43] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(166,72,62,0.24)] transition hover:-translate-y-0.5"><span className="relative z-10 flex items-center gap-2">Claim your copy <ArrowRight size={16} /></span><span className="absolute inset-y-0 -left-16 w-10 -skew-x-12 bg-white/35 blur-md transition-all duration-700 group-hover:left-[110%]" /></button>
            <button onClick={() => scrollTo('prompts')} className="rounded-full border border-white/80 bg-white/45 px-6 py-3.5 text-sm font-medium text-[#70423b] shadow-sm backdrop-blur-xl transition hover:bg-white/70">Peek inside</button>
          </div>
          <div className="hero-reveal mt-8 flex items-center gap-3 text-xs text-[#7c554d]"><div className="flex -space-x-1">{[0, 1, 2].map((i) => <span key={i} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#fff9f3] bg-[#edc3b6] text-[9px]">♡</span>)}</div><span className="flex text-[#d68b51]">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={13} fill="currentColor" />)}</span><span>Loved by 640+ mindful journalers</span></div>
        </div>

        <div className="hero-reveal relative order-1 mx-auto flex w-full max-w-[650px] items-center justify-center lg:order-2">
          <div className="absolute h-[82%] w-[75%] rounded-full bg-[#edb39e]/45 blur-3xl" />
          <div className="book-float relative z-10 w-[86%] max-w-[580px] overflow-hidden rounded-[2rem] border-[8px] border-white/45 shadow-[0_35px_65px_rgba(100,47,35,0.22)] sm:rounded-[2.5rem]">
            <img src={journalCover} alt="I can love me self love guided journal" className="aspect-[1.58/1] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#572c24]/25 to-transparent" />
          </div>
          <GlassCard className="absolute left-0 top-[12%] z-20 hidden max-w-44 rounded-2xl px-3 py-3 text-xs font-semibold text-[#75413a] sm:block">✨ 100+ Guided<br />Reflections</GlassCard>
          <GlassCard className="absolute bottom-[8%] right-0 z-20 max-w-48 rounded-2xl px-3 py-3 text-xs font-semibold leading-5 text-[#75413a]">🤍 Mindset Rewiring<br />Prompts</GlassCard>
        </div>
      </section>

      <section id="journal" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
        <div className="scroll-reveal mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd705f]">Within these pages</p><h2 className="mt-3 font-serif text-4xl tracking-tight text-[#48201b] sm:text-5xl">A softer way to meet yourself.</h2></div><p className="max-w-xs text-sm leading-6 text-[#7a554d]">Designed for real life, quiet pauses, and every version of you.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ number, title, copy, icon: Icon }) => <GlassCard key={number} className="scroll-reveal group rounded-[1.6rem] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/55"><div className="flex items-start justify-between"><span className="font-serif text-3xl text-[#d9a18b]">{number}</span><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f7dcd3]/75 text-[#ad5d50]"><Icon size={18} /></span></div><h3 className="mt-10 font-serif text-2xl text-[#51251f]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#78534b]">{copy}</p></GlassCard>)}</div>
      </section>

      <section id="prompts" className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div className="scroll-reveal"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd705f]">A little peek inside</p><h2 className="mt-3 max-w-md font-serif text-4xl leading-tight tracking-tight text-[#48201b] sm:text-5xl">Pages that listen without interrupting.</h2><p className="mt-5 max-w-md text-sm leading-7 text-[#765149]">Open anywhere. Follow the thought. Let the page hold the rest. Each reflection is an invitation, never an instruction.</p><div className="mt-8 flex flex-wrap gap-2">{previews.map((item, index) => <button key={item.label} onClick={() => setActivePreview(index)} className={`rounded-full px-4 py-2 text-xs transition ${activePreview === index ? 'bg-[#a95147] text-white shadow-md' : 'border border-white/70 bg-white/45 text-[#795148] backdrop-blur-xl hover:bg-white/75'}`}>{item.label}</button>)}</div></div>
        <div className="scroll-reveal relative mx-auto w-full max-w-xl py-6"><GlassCard className="rotate-[-2deg] rounded-[2rem] p-3 sm:p-5"><article className="min-h-[400px] rounded-[1.35rem] bg-[#fffdf8] p-8 shadow-inner sm:p-12" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 35px, rgba(204,164,145,0.18) 36px)' }}><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bd7c69]">{String(activePreview + 7).padStart(2, '0')} / reflection</p><h3 className="mt-12 font-serif text-4xl leading-none text-[#552820] sm:text-5xl">{preview.title}</h3><div className="mt-8 border-l-2 border-[#eab5a4] pl-4 font-serif text-xl italic leading-8 text-[#8f574d]">“{preview.quote}”</div><p className="mt-10 text-sm leading-7 text-[#79544c]">{preview.prompt}</p><div className="mt-6 flex gap-2"><span className="h-1.5 w-12 rounded-full bg-[#d58a78]" /><span className="h-1.5 w-20 rounded-full bg-[#ecd3c6]" /></div></article></GlassCard><div className="absolute -bottom-1 left-1/2 -z-10 h-14 w-[88%] -translate-x-1/2 rounded-full bg-[#c68169]/35 blur-2xl" /></div>
      </section>

      <section id="story" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12"><GlassCard className="scroll-reveal overflow-hidden rounded-[2rem] p-8 sm:p-12"><div className="grid gap-9 md:grid-cols-[0.9fr_1.1fr] md:items-center"><div className="flex min-h-56 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#f0c3b3] via-[#e7a78e] to-[#b86755] p-8"><Heart size={94} strokeWidth={1} className="text-[#fff7ef]" /><span className="sr-only">A heart-shaped reminder of self love</span></div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd705f]">Made by Kats, for you</p><h2 className="mt-3 font-serif text-4xl tracking-tight text-[#48201b]">Your inner voice deserves a beautiful place to land.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-[#765149]">Inkcarnate is a small love letter to the unglamorous, extraordinary work of becoming your own safe place. We made this journal tactile, warm, and full of words worth returning to.</p><button onClick={goToLogin} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#a95147] transition hover:gap-3">Start your ritual <ArrowRight size={16} /></button></div></div></GlassCard></section>

      <section id="reviews" className="relative z-10 mx-auto max-w-7xl px-5 pb-32 pt-20 sm:px-8 lg:px-12"><div className="scroll-reveal mx-auto max-w-xl text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd705f]">Love notes</p><h2 className="mt-3 font-serif text-4xl tracking-tight text-[#48201b] sm:text-5xl">Notes from tender hearts.</h2></div><div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">{loveNotes.map(([quote, name], index) => <GlassCard key={name} className="scroll-reveal mb-4 break-inside-avoid rounded-[1.5rem] p-6"><div className="flex text-[#d48a4d]">{[0, 1, 2, 3, 4].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div><p className="mt-4 font-serif text-xl leading-7 text-[#5a2e28]">{quote}</p><div className="mt-5 flex items-center gap-3"><span className={`h-8 w-8 rounded-full ${index % 2 ? 'bg-[#e9c3b6]' : 'bg-[#e7b1a5]'}`} /><span className="text-xs font-semibold tracking-wide text-[#875b52]">{name}</span></div></GlassCard>)}</div></section>

      <div className={`fixed inset-x-0 bottom-3 z-50 px-3 transition-all duration-500 ${dockVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-20 opacity-0'}`}><GlassCard className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl px-3 py-2.5 shadow-[0_12px_36px_rgba(100,47,35,0.2)]"><img src={journalCover} alt="Journal cover" className="h-11 w-14 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-serif text-sm text-[#50261f]">I can love me</p><p className="text-xs text-[#966158]">Guided self-love journal · <b>₹699</b></p></div><button onClick={goToLogin} className="rounded-xl bg-[#a95147] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#913f37]">Order now</button></GlassCard></div>

      <button onClick={() => scrollTo('top')} className="fixed bottom-5 right-5 z-40 hidden h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/60 text-[#a95147] shadow-lg backdrop-blur-xl md:flex" aria-label="Back to top"><ChevronDown size={18} className="rotate-180" /></button>
    </main>
  );
}
