import { useState } from 'react';
import {
  DOCUMENT_TYPE_CONFIG,
  DOCUMENT_STATUS_CONFIG,
  formatFileSize,
  getExpiryState,
  isPdf,
} from '../../constants/document.js';
import { useDeleteDocumentMutation } from '../../features/documents/documentApi.js';
import useAuth from '../../hooks/useAuth.js';
import DeleteModal from '../common/DeleteModal.jsx';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const StatusBadge = ({ status }) => {
  const cfg = DOCUMENT_STATUS_CONFIG[status] || DOCUMENT_STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.class}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const ExpiryBadge = ({ expiryDate }) => {
  const state = getExpiryState(expiryDate);
  if (!state) return null;
  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${state.class}`}>
      {state.urgent ? '⚠️ ' : '🗓️ '}
      {state.label}
    </span>
  );
};

const DocumentCard = ({ doc, onVerify, onReject, canVerify = false }) => {
  const { user, isAdmin, isCounselor } = useAuth();
  const [deleteDoc, { isLoading: deleting }] = useDeleteDocumentMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const typeCfg = DOCUMENT_TYPE_CONFIG[doc.documentType] || DOCUMENT_TYPE_CONFIG.other;
  const isOwner = doc.student?._id
    ? doc.student._id === user?._id
    : doc.student?.toString() === user?._id;
  const canDelete = isAdmin || isCounselor || isOwner;

  const handleDelete = async () => {
    await deleteDoc(doc._id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className={[
        'bg-white rounded-xl border p-4 flex flex-col gap-3 transition-shadow hover:shadow-md',
        doc.status === 'rejected' ? 'border-red-200' : 'border-gray-100',
      ].join(' ')}>
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div className={[
            'h-10 w-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
            isPdf(doc.mimeType) ? 'bg-red-50' : 'bg-blue-50',
          ].join(' ')}>
            {isPdf(doc.mimeType) ? '📄' : typeCfg.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{doc.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatFileSize(doc.fileSize)} · {formatDate(doc.createdAt)}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={doc.status} />
          {doc.expiryDate && <ExpiryBadge expiryDate={doc.expiryDate} />}
        </div>

        {/* Rejection reason */}
        {doc.status === 'rejected' && doc.rejectionReason && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-red-700 mb-0.5">Rejection reason:</p>
            <p className="text-xs text-red-600">{doc.rejectionReason}</p>
          </div>
        )}

        {/* Verified info */}
        {doc.status === 'verified' && doc.verifiedBy && (
          <p className="text-xs text-gray-400">
            ✅ Verified by{' '}
            <span className="font-medium text-gray-600">{doc.verifiedBy.name}</span>
            {doc.verifiedAt && ` on ${formatDate(doc.verifiedAt)}`}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-50">
          <button
            onClick={() => window.open(doc.fileUrl, '_blank', 'noopener,noreferrer')}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            ⬇️ View / Download
          </button>

          {canVerify && doc.status !== 'verified' && (
            <button onClick={() => onVerify?.(doc)}
              className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
              ✅ Verify
            </button>
          )}
          {canVerify && doc.status !== 'rejected' && (
            <button onClick={() => onReject?.(doc)}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
              ❌ Reject
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 ml-auto"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Document?"
        description="This document will be permanently deleted and cannot be recovered."
        itemName={doc.title}
        loading={deleting}
      />
    </>
  );
};

export default DocumentCard;
