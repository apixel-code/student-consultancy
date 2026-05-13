import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/common/Sidebar.jsx';

const DashboardLayout = ({ children, title }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-40 transform transition-transform duration-300 ease-in-out
          lg:sticky lg:translate-x-0 lg:z-auto lg:flex-shrink-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 overflow-auto">

        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-base font-bold text-gray-900 truncate">{title || 'Dashboard'}</p>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {title && (
            <h2 className="hidden lg:block text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
