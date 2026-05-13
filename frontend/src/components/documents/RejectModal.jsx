import { useState } from 'react';
import { useRejectDocumentMutation } from '../../features/documents/documentApi.js';
import { DOCUMENT_TYPE_CONFIG } from '../../constants/document.js';

const QUICK_REASONS = [
  'Document is blurry or unclear',
  'Document appears to be expired',
  'Wrong document type uploaded',
  'Document information does not match records',
  'Poor image quality — please re-upload',
];

const RejectModal = ({ document, onClose }) => {
  const [reason, setReason] = useState('');
  const [rejectDoc, { isLoading, error }] = useRejectDocumentMutation();

  const cfg = DOCUMENT_TYPE_CONFIG[document.documentType] || DOCUMENT_TYPE_CONFIG.other;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    const result = await rejectDoc({ id: document._id, reason: reason.trim() });
    if (result.data) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Reject Document</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {cfg.icon} {document.title}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-3">
            &times;
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
            {error.data?.message || 'Failed to reject document'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick reason chips */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Quick reasons
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={[
                    'text-xs px-2.5 py-1 rounded-full border transition-colors',
                    reason === r
                      ? 'bg-red-100 border-red-300 text-red-700'
                      : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600',
                  ].join(' ')}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Custom reason */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Explain why this document is being rejected…"
              required
              className="input-field resize-none text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !reason.trim()}
              className="btn-danger flex-1 py-2.5 text-sm"
            >
              {isLoading ? 'Rejecting…' : 'Confirm Rejection'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-2.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectModal;
