import { motion, AnimatePresence } from 'framer-motion';
import { useVerifyDocumentMutation } from '../../features/documents/documentApi.js';
import { DOCUMENT_TYPE_CONFIG } from '../../constants/document.js';

const VerifyModal = ({ document, onClose }) => {
  const [verifyDoc, { isLoading, error }] = useVerifyDocumentMutation();

  const cfg = DOCUMENT_TYPE_CONFIG[document?.documentType] || DOCUMENT_TYPE_CONFIG.other;

  const handleConfirm = async () => {
    const result = await verifyDoc(document._id);
    if (result.data) onClose();
  };

  return (
    <AnimatePresence>
      {document && (
        <>
          {/* Backdrop */}
          <motion.div
            key="verify-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="verify-modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Green top accent */}
              <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500" />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0">
                      {cfg.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-base">Verify Document</h3>
                      <p className="text-sm text-gray-500 truncate mt-0.5">{document.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-3 flex-shrink-0"
                  >
                    &times;
                  </button>
                </div>

                {/* Info box */}
                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✅</span>
                    <div>
                      <p className="text-sm font-semibold text-green-800">Confirm Verification</p>
                      <p className="text-xs text-green-700 mt-0.5">
                        This document will be marked as <strong>verified</strong> and the student will be notified.
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
                    {error.data?.message || 'Failed to verify document'}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isLoading
                      ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Verifying…</>
                      : '✅ Verify Document'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VerifyModal;
