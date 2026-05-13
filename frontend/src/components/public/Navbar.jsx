import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home',         to: '/' },
  { label: 'About',        to: '/about' },
  { label: 'Services',     to: '/services' },
  { label: 'Universities', to: '/universities' },
  { label: 'Contact',      to: '/contact' },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled
        ? { background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 30px rgba(0,0,0,0.3)' }
        : { background: 'transparent' }
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg,#1D4ED8 0%,#7C3AED 100%)' }}>
            <span className="text-white font-extrabold text-xs tracking-tight">SC</span>
          </div>
          <span className="font-bold text-lg text-white tracking-tight">StudyConsult</span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/8'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"
            className="px-5 py-2 rounded-lg text-sm font-bold text-slate-900 transition-all hover:brightness-110 hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#F59E0B 0%,#FBBF24 100%)' }}>
            Student Login
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }}
            className="block w-4.5 h-0.5 bg-white rounded-full" style={{ width: '18px' }} />
          <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }}
            className="block w-4.5 h-0.5 bg-white rounded-full" style={{ width: '18px' }} />
          <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }}
            className="block w-4.5 h-0.5 bg-white rounded-full" style={{ width: '18px' }} />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t"
            style={{ background: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="px-4 pt-3 pb-5 space-y-1">
              {NAV_LINKS.map(link => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/8'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="block mt-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-900 text-center"
                style={{ background: 'linear-gradient(135deg,#F59E0B 0%,#FBBF24 100%)' }}>
                Student Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
