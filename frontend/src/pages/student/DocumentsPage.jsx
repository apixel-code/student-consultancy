import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { useGetMyDocumentsQuery } from '../../features/documents/documentApi.js';
import DocumentCard from '../../components/documents/DocumentCard.jsx';
import DocumentUploader from '../../components/documents/DocumentUploader.jsx';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_CONFIG } from '../../constants/document.js';

// ── Skeleton ──────────────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
    <div className="flex gap-3">
      <div className="h-10 w-10 rounded-xl bg-gray-100 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
      </div>
    </div>
    <div className="h-6 bg-gray-100 rounded w-1/3 animate-pulse" />
    <div className="h-8 bg-gray-100 rounded animate-pulse" />
  </div>
);

// ── Section header + upload trigger ───────────────────────────────────────────
const TypeSection = ({ type, docs, isLoading }) => {
  const [showUploader, setShowUploader] = useState(false);
  const cfg = DOCUMENT_TYPE_CONFIG[type];

  return (
    <section className="mb-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cfg.icon}</span>
          <h3 className="font-semibold text-gray-800 text-sm">{cfg.label}</h3>
          {docs.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
              {docs.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowUploader((v) => !v)}
          className={[
            'text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
            showUploader
              ? 'bg-gray-100 text-gray-600'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100',
          ].join(' ')}
        >
          {showUploader ? '✕ Cancel' : '+ Upload'}
        </button>
      </div>

      {/* Uploader */}
      {showUploader && (
        <div className="mb-3">
          <DocumentUploader
            documentType={type}
            onSuccess={() => setShowUploader(false)}
            onCancel={() => setShowUploader(false)}
          />
        </div>
      )}

      {/* Document cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CardSkeleton />
        </div>
      ) : docs.length === 0 ? (
        <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400">No {cfg.label.toLowerCase()} uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {docs.map((doc) => (
            <DocumentCard key={doc._id} doc={doc} canVerify={false} />
          ))}
        </div>
      )}
    </section>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const DocumentsPage = () => {
  const { data, isLoading } = useGetMyDocumentsQuery();
  const grouped = data?.data?.grouped || {};

  // Count totals
  const total = data?.data?.documents?.length || 0;
  const verified = data?.data?.documents?.filter((d) => d.status === 'verified').length || 0;
  const pending = data?.data?.documents?.filter((d) => d.status === 'pending').length || 0;
  const rejected = data?.data?.documents?.filter((d) => d.status === 'rejected').length || 0;

  return (
    <DashboardLayout title="My Documents">
      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total',    value: total,    color: 'border-blue-500' },
          { label: 'Verified', value: verified, color: 'border-green-500' },
          { label: 'Pending',  value: pending,  color: 'border-yellow-500' },
          { label: 'Rejected', value: rejected, color: 'border-red-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`card border-l-4 ${color}`}>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* One section per document type */}
      {DOCUMENT_TYPES.map((type) => (
        <TypeSection
          key={type}
          type={type}
          docs={grouped[type] || []}
          isLoading={isLoading}
        />
      ))}
    </DashboardLayout>
  );
};

export default DocumentsPage;
