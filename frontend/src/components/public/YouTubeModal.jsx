import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COUNTRY_FLAGS = {
  'United Kingdom': '🇬🇧',
  'Canada':         '🇨🇦',
  'Australia':      '🇦🇺',
  'USA':            '🇺🇸',
  'Germany':        '🇩🇪',
  'Malaysia':       '🇲🇾',
};

export default function YouTubeModal({ video, onClose }) {
  // close on ESC
  const handleKey = useCallback(e => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!video) return;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [video, handleKey]);

  const flag = COUNTRY_FLAGS[video?.country] ?? '🌍';

  return (
    <AnimatePresence>
      {video && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(5,8,20,0.88)', backdropFilter: 'blur(10px)' }}
          />

          {/* ── Modal ── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div
              className="w-full pointer-events-auto"
              style={{ maxWidth: '860px' }}
              onClick={e => e.stopPropagation()}
            >
              {/* close button */}
              <div className="flex justify-end mb-3">
                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close
                </button>
              </div>

              {/* player card */}
              <div className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
                style={{ background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.08)' }}>

                {/* YouTube iframe — 16:9 */}
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${video.ytId}?autoplay=1&rel=0&modestbranding=1&color=white`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 'none' }}
                  />
                </div>

                {/* info bar */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                  style={{ background: 'linear-gradient(135deg,#0d1426 0%,#111827 100%)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

                  {/* avatar */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#1D4ED8,#7C3AED)' }}>
                    {video.initials}
                  </div>

                  {/* text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 mb-1">{video.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">{video.student}</span>
                      <span className="text-slate-600">·</span>
                      <span className="line-clamp-1">{video.program}</span>
                    </div>
                  </div>

                  {/* right side */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#FCD34D' }}>
                      {flag} {video.country} · {video.year}
                    </div>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.ytId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-80"
                      style={{ background: '#FF0000' }}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                      YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
