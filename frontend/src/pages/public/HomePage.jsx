import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────── animation presets ─────────────────────────── */
const ease = [0.22, 1, 0.36, 1];
const fadeUp  = { hidden: { opacity: 0, y: 44 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } };
const fadeIn  = { hidden: { opacity: 0 },         visible: { opacity: 1, transition: { duration: 0.55 } } };
const stagger = { visible: { transition: { staggerChildren: 0.11 } } };

/* ─────────────────────────── data ─────────────────────────── */
const HERO_SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
    badge: 'Trusted by 500+ Students · AIRC Certified Since 2015',
    h1: 'Turn Your Study Abroad',
    accent: 'Dream Into Reality',
    sub: 'Expert guidance for UK, Canada, Australia, USA, Germany & Malaysia — from shortlisting to landing at the airport.',
    cta: 'Book Free Consultation',
    ctaHref: '/contact',
  },
  {
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
    badge: '500+ Successful Placements Worldwide',
    h1: 'Join Our Growing Family',
    accent: 'of Global Achievers',
    sub: 'Every student gets a dedicated counselor, a personalized strategy, and full support — from SOP writing to visa approval.',
    cta: 'See Our Services',
    ctaHref: '/services',
  },
  {
    img: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
    badge: '98% Visa Approval — Industry Leading',
    h1: "We Don't Just Apply —",
    accent: 'We Deliver Results',
    sub: 'Our expert visa team maintains a 98% approval rate across UK, Canada, Australia, USA & Germany. Your dream stays on track.',
    cta: 'Explore Universities',
    ctaHref: '/universities',
  },
];

const STATS = [
  { value: '500+', label: 'Students Placed', icon: '🎓' },
  { value: '50+',  label: 'Partner Universities', icon: '🏛️' },
  { value: '15+',  label: 'Countries', icon: '🌍' },
  { value: '98%',  label: 'Visa Success Rate', icon: '✅' },
];

const SERVICES = [
  { icon: '🎓', title: 'University Selection',    desc: 'Personalized shortlisting of 5–10 universities matched to your profile, budget, and career goals.' },
  { icon: '📋', title: 'Application Processing',  desc: 'End-to-end SOP, LOR, transcript management, and online submissions — error-free, deadline-safe.' },
  { icon: '🛂', title: 'Visa Assistance',         desc: '98% approval rate. Full document prep, mock interview coaching, and embassy follow-up.' },
  { icon: '💰', title: 'Scholarship Guidance',    desc: 'Identify and apply for Chevening, DAAD, university merit, and government funding.' },
  { icon: '✈️', title: 'Pre-departure Briefing',  desc: 'Country-specific orientation: accommodation, banking, culture, weather, and travel tips.' },
  { icon: '🏡', title: 'Post-arrival Support',    desc: 'Airport coordination, enrollment, SIM/banking setup, and alumni community access.' },
];

const STEPS = [
  { num: '01', icon: '💬', title: 'Free Consultation', desc: 'Book a session with our expert counselors to map your study abroad goals and profile.' },
  { num: '02', icon: '📊', title: 'Profile Assessment', desc: 'We evaluate your academic background and shortlist best-fit universities and programs.' },
  { num: '03', icon: '📝', title: 'Application & Visa', desc: 'We prepare, submit applications, and guide you step-by-step through the visa process.' },
  { num: '04', icon: '🎉', title: 'Fly & Succeed', desc: 'Depart with confidence — we stay with you from pre-departure briefing to post-arrival support.' },
];

const DESTINATIONS = [
  { flag: '🇬🇧', country: 'United Kingdom', unis: '150+ Universities', popular: 'Oxford · Cambridge · UCL',
    img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=70', tag: 'Most Popular' },
  { flag: '🇨🇦', country: 'Canada',         unis: '100+ Universities', popular: 'UofT · UBC · McGill',
    img: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=600&q=70', tag: 'PR Friendly' },
  { flag: '🇦🇺', country: 'Australia',      unis: '80+ Universities',  popular: 'ANU · Melbourne · Sydney',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=70', tag: 'Work Rights' },
  { flag: '🇺🇸', country: 'USA',            unis: '200+ Universities', popular: 'MIT · Stanford · Harvard',
    img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=70', tag: 'Top Ranked' },
  { flag: '🇩🇪', country: 'Germany',        unis: '60+ Universities',  popular: 'TU Munich · LMU · KIT',
    img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=70', tag: 'Free Tuition' },
  { flag: '🇲🇾', country: 'Malaysia',       unis: '40+ Universities',  popular: 'UM · UPM · UTM',
    img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=70', tag: 'Affordable' },
];

/* YouTube video IDs — replace with your actual StudyConsult video IDs */
const SUCCESS_VIDEOS = [
  {
    ytId: 'kzx30pObBu8',
    title: "From Dhaka to London: How I Got Into King's College",
    student: 'Md. Raihan Islam',
    program: "MSc Data Science, King's College London",
    country: '🇬🇧 United Kingdom',
    year: '2024',
    initials: 'MR',
  },
  {
    ytId: 'Q0Wr8RVg5cM',
    title: 'My Canadian University Journey — Full Process Explained',
    student: 'Nadia Rahman',
    program: 'MBA, University of Toronto',
    country: '🇨🇦 Canada',
    year: '2024',
    initials: 'NR',
  },
  {
    ytId: '8wDhFgCnhE4',
    title: 'Free Education in Germany: My TU Munich Story',
    student: 'Ariful Haque',
    program: 'MSc Mechanical Engineering, TU Munich',
    country: '🇩🇪 Germany',
    year: '2023',
    initials: 'AH',
  },
];

const TESTIMONIALS = [
  {
    name: 'Rakib Hasan', flag: '🇬🇧',
    program: 'MSc Computer Science — University of Birmingham, UK',
    text: "StudyConsult made my UK dream a reality. From shortlisting universities to visa approval, their team was with me every step. Couldn't have done it without them!",
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
  },
  {
    name: 'Fatema Akter', flag: '🇨🇦',
    program: 'MBA — University of Toronto, Canada',
    text: 'I was confused about which university to choose. The counselors did a thorough profile evaluation and suggested the perfect fit. Got a partial scholarship too!',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=80&q=80',
  },
  {
    name: 'Sajid Rahman', flag: '🇩🇪',
    program: 'BEng Mechanical — TU Munich, Germany',
    text: 'The visa assistance team was exceptional. They prepared me for the interview, handled all the paperwork, and I got my German student visa in just 3 weeks.',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80',
  },
];

/* ─────────────────────────── gradient text helper ─────────────────────────── */
const GradText = ({ children }) => (
  <span style={{
    background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  }}>
    {children}
  </span>
);

/* ─────────────────────────── wave divider ─────────────────────────── */
const WaveDown = ({ from = '#0F172A', to = '#fff' }) => (
  <div style={{ background: from, lineHeight: 0 }}>
    <svg viewBox="0 0 1440 56" className="w-full block" style={{ display: 'block' }} fill={to} preserveAspectRatio="none">
      <path d="M0,32 C360,60 1080,0 1440,32 L1440,56 L0,56 Z" />
    </svg>
  </div>
);

const WaveUp = ({ from = '#fff', to = '#0F172A' }) => (
  <div style={{ background: from, lineHeight: 0 }}>
    <svg viewBox="0 0 1440 56" className="w-full block" style={{ display: 'block' }} fill={to} preserveAspectRatio="none">
      <path d="M0,24 C360,0 1080,56 1440,24 L1440,0 L0,0 Z" />
    </svg>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [slide, setSlide]   = useState(0);
  const [paused, setPaused] = useState(false);

  const goNext = useCallback(() => setSlide(s => (s + 1) % HERO_SLIDES.length), []);
  const goPrev = useCallback(() => setSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(goNext, 5500);
    return () => clearInterval(t);
  }, [goNext, paused]);

  return (
    <>
      {/* ══════════════════════════════════════════
          01  HERO — full-screen image carousel
      ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: '100vh' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ── Background images (crossfade) ── */}
        <div className="absolute inset-0">
          {HERO_SLIDES.map((s, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{ opacity: i === slide ? 1 : 0 }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            >
              <img src={s.img} alt="" className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
            </motion.div>
          ))}
        </div>

        {/* ── Overlay gradients ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, rgba(15,23,42,0.94) 0%, rgba(15,23,42,0.78) 45%, rgba(15,23,42,0.3) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 35%)' }} />

        {/* ── Content ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center"
          style={{ minHeight: '100vh' }}>

          {/* slide text block — AnimatePresence for per-slide transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 52 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.75, delay: 0.15, ease } }}
              exit={{   opacity: 0, y: -28, transition: { duration: 0.45 } }}
              className="max-w-3xl pt-24 pb-40"
            >
              {/* badge pill */}
              <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8 border"
                style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#F59E0B' }} />
                <span className="text-sm font-semibold tracking-wide" style={{ color: '#F59E0B' }}>
                  {HERO_SLIDES[slide].badge}
                </span>
              </div>

              {/* headline */}
              <h1 className="font-extrabold text-white leading-[1.07] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.25rem)' }}>
                {HERO_SLIDES[slide].h1}<br />
                <GradText>{HERO_SLIDES[slide].accent}</GradText>
              </h1>

              {/* subtext */}
              <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
                {HERO_SLIDES[slide].sub}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to={HERO_SLIDES[slide].ctaHref}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-slate-900 transition-all hover:brightness-110 hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#F59E0B 0%,#FBBF24 100%)' }}>
                  {HERO_SLIDES[slide].cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link to="/universities"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 hover:bg-white/10 transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.25)' }}>
                  Browse Universities
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Floating stat pills — bottom of hero ── */}
          <div className="absolute bottom-24 left-4 sm:left-6 lg:left-8 right-4">
            <motion.div initial="hidden" animate="visible" variants={stagger}
              className="flex flex-wrap gap-3">
              {STATS.map(s => (
                <motion.div key={s.label} variants={fadeIn}
                  className="flex items-center gap-3 rounded-2xl px-5 py-3 border"
                  style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(14px)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  <span className="text-xl">{s.icon}</span>
                  <div>
                    <p className="text-xl font-extrabold text-white leading-none">{s.value}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Dot indicators ── */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className="rounded-full transition-all duration-400"
                style={{
                  width: i === slide ? '28px' : '8px',
                  height: '8px',
                  background: i === slide ? '#F59E0B' : 'rgba(255,255,255,0.3)',
                }} />
            ))}
          </div>

          {/* ── Prev / Next arrows ── */}
          {[
            { action: goPrev, pos: 'right-16',
              path: 'M15 19l-7-7 7-7' },
            { action: goNext, pos: 'right-4 sm:right-6 lg:right-8',
              path: 'M9 5l7 7-7 7' },
          ].map(({ action, pos, path }, idx) => (
            <button key={idx} onClick={action}
              className={`absolute bottom-8 ${pos} w-9 h-9 rounded-full border flex items-center justify-center text-white hover:bg-white/20 transition-colors`}
              style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={path} />
              </svg>
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          02  SERVICES — dark glass cards
      ══════════════════════════════════════════ */}
      <WaveDown from="#0F172A" to="#0F172A" />
      <section style={{ background: '#0F172A' }} className="pb-24 px-4 sm:px-6 lg:px-8">
        {/* accent top line */}
        <div className="max-w-7xl mx-auto">
          <div className="h-px mb-16" style={{ background: 'linear-gradient(to right, transparent, rgba(29,78,216,0.5) 30%, rgba(245,158,11,0.5) 70%, transparent)' }} />

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F59E0B' }}>What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comprehensive Study Abroad <GradText>Services</GradText>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">From first consultation to post-arrival support — every step of your journey, covered.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(s => (
              <motion.div key={s.title} variants={fadeUp}
                className="group rounded-2xl p-6 border transition-all duration-300 hover:border-blue-500/40 hover:bg-white/[0.07] cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.45) 0%, rgba(124,58,237,0.35) 100%)', border: '1px solid rgba(29,78,216,0.3)' }}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold transition-colors group-hover:text-blue-400 text-slate-600">
                  Learn more
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link to="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold border transition-colors hover:bg-white/10 text-white"
              style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              View All Services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      <WaveDown from="#0F172A" to="#ffffff" />

      {/* ══════════════════════════════════════════
          03  HOW IT WORKS — white
      ══════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F59E0B' }}>Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#0F172A' }}>How It Works</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+2.5rem)] right-0 h-px border-t-2 border-dashed border-blue-100" />
                )}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white font-extrabold text-base mb-5 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)' }}>
                    {step.num}
                    <span className="absolute -top-2 -right-2 text-lg">{step.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#0F172A' }}>{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          04  TOP DESTINATIONS — photo cards
      ══════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F59E0B' }}>Study Abroad</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#0F172A' }}>Top Destinations</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">Strong university partnerships across the world's leading study destinations.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.map(d => (
              <motion.div key={d.country} variants={fadeUp}
                whileHover={{ y: -6, scale: 1.01 }}
                className="relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
                style={{ height: '230px' }}>
                <img src={d.img} alt={d.country} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-600" />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.2) 55%, transparent 100%)' }} />
                {/* tag badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(245,158,11,0.9)', color: '#0F172A' }}>
                  {d.tag}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{d.flag}</span>
                    <h3 className="font-bold text-white text-lg">{d.country}</h3>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#93C5FD' }}>{d.unis}</p>
                  <p className="text-xs text-slate-300 mt-0.5">{d.popular}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          05  SUCCESS STORIES — YouTube videos (dark)
      ══════════════════════════════════════════ */}
      <WaveUp from="#F8FAFC" to="#0F172A" />
      <section style={{ background: '#0F172A' }} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* accent line */}
          <div className="h-px mb-16" style={{ background: 'linear-gradient(to right, transparent, rgba(239,68,68,0.4) 30%, rgba(245,158,11,0.4) 70%, transparent)' }} />

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            {/* YouTube branding row */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border"
              style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              <span className="text-sm font-semibold text-red-400">Student Success Stories on YouTube</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Hear It From <GradText>Our Students</GradText>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Real stories. Real results. Watch our students share their journeys — from Bangladesh to the world's top universities.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-3 gap-6">
            {SUCCESS_VIDEOS.map(v => (
              <motion.a
                key={v.ytId}
                href={`https://www.youtube.com/watch?v=${v.ytId}`}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group block rounded-2xl overflow-hidden border transition-all duration-300 hover:border-red-500/40 hover:shadow-[0_0_40px_rgba(239,68,68,0.12)]"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.09)' }}
              >
                {/* thumbnail */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={`https://img.youtube.com/vi/${v.ytId}/maxresdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=640&q=60'; }}
                  />
                  {/* dark overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors" />
                  {/* play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.12 }}
                      className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
                      style={{ background: '#FF0000' }}>
                      <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.div>
                  </div>
                  {/* country badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                    {v.country}
                  </div>
                  {/* year */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-xs text-slate-300"
                    style={{ background: 'rgba(0,0,0,0.7)' }}>
                    {v.year}
                  </div>
                </div>

                {/* card body */}
                <div className="p-5">
                  <h3 className="font-bold text-white text-sm leading-snug mb-4">{v.title}</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#1D4ED8,#7C3AED)' }}>
                      {v.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{v.student}</p>
                      <p className="text-xs text-slate-400 leading-snug">{v.program}</p>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* See all on YouTube */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mt-12">
            <a href="https://www.youtube.com/@StudyConsultBD" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold text-white border transition-colors hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              View All Success Stories on YouTube
            </a>
          </motion.div>
        </div>
      </section>
      <WaveDown from="#0F172A" to="#ffffff" />

      {/* ══════════════════════════════════════════
          06  TESTIMONIALS — white premium
      ══════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F59E0B' }}>Student Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#0F172A' }}>What Our Students Say</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(t => (
              <motion.div key={t.name} variants={fadeUp}
                className="relative rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #ffffff 100%)' }}>
                {/* big quote mark */}
                <span className="absolute top-5 right-6 text-6xl font-serif leading-none select-none"
                  style={{ color: 'rgba(29,78,216,0.08)' }}>"</span>
                {/* stars */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="#F59E0B">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img src={t.photo} alt={t.name} loading="lazy"
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                    style={{ boxShadow: '0 0 0 3px #EFF6FF, 0 0 0 5px #1D4ED8' }} />
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: '#0F172A' }}>{t.name}</p>
                    <p className="text-xs text-slate-400 leading-snug">{t.program}</p>
                  </div>
                  <span className="text-2xl">{t.flag}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          07  CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1e3a8a 50%, #1D4ED8 100%)' }}>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: '#F59E0B' }} />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: '#7C3AED' }} />
        {/* grid pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border"
            style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#F59E0B' }} />
            <span className="text-sm font-semibold" style={{ color: '#F59E0B' }}>Free Consultation — No Obligation</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            Ready to Begin Your<br /><GradText>Study Abroad Journey?</GradText>
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Join 500+ students who turned their international education dreams into reality with StudyConsult.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-xl font-bold transition-all hover:brightness-110 hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#F59E0B 0%,#FBBF24 100%)', color: '#0F172A' }}>
              Get Free Consultation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/universities"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-xl font-semibold border-2 text-white hover:bg-white/10 transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.25)' }}>
              Browse Universities
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
