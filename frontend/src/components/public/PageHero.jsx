import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export default function PageHero({ title, subtitle, breadcrumb, image }) {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">

      {/* ── Background image ── */}
      {image && (
        <div className="absolute inset-0">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>
      )}

      {/* ── Dark gradient overlay (stronger when image present) ── */}
      <div
        className="absolute inset-0"
        style={{
          background: image
            ? 'linear-gradient(135deg, rgba(15,23,42,0.88) 0%, rgba(30,58,138,0.80) 50%, rgba(29,78,216,0.75) 100%)'
            : 'linear-gradient(135deg, #0F172A 0%, #1e3a8a 55%, #1D4ED8 100%)',
        }}
      />

      {/* ── Grid pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Glow blobs ── */}
      <div
        className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {breadcrumb && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
            style={{ background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.35)' }}
          >
            <span className="text-sm font-semibold" style={{ color: '#F59E0B' }}>{breadcrumb}</span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease }}
          className="font-extrabold text-white leading-tight tracking-tight mb-5"
          style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22, ease }}
            className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* ── Bottom wave ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 40" className="w-full block" fill="#F8FAFC" preserveAspectRatio="none">
          <path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" />
        </svg>
      </div>
    </section>
  );
}
