import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { useGetDocumentsByStudentQuery } from '../../features/documents/documentApi.js';
import { useGetStudentByIdQuery } from '../../features/students/studentApi.js';
import DocumentCard from '../../components/documents/DocumentCard.jsx';
import RejectModal from '../../components/documents/RejectModal.jsx';
import VerifyModal from '../../components/documents/VerifyModal.jsx';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_CONFIG } from '../../constants/document.js';
import Loader from '../../components/common/Loader.jsx';

// ── Section ───────────────────────────────────────────────────────────────────
const TypeSection = ({ type, docs, onVerify, onReject }) => {
  const cfg = DOCUMENT_TYPE_CONFIG[type];
  if (docs.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{cfg.icon}</span>
        <h3 className="font-semibold text-gray-800 text-sm">{cfg.label}</h3>
        <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
          {docs.length}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {docs.map((doc) => (
          <DocumentCard
            key={doc._id}
            doc={doc}
            canVerify
            onVerify={() => onVerify(doc)}
            onReject={() => onReject(doc)}
          />
        ))}
      </div>
    </section>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const PageSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
    ))}
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const StudentDocumentsPage = () => {
  const { studentId } = useParams();
  const [rejectTarget, setRejectTarget] = useState(null);
  const [verifyTarget, setVerifyTarget] = useState(null);

  const { data: studentData } = useGetStudentByIdQuery(studentId);
  const { data, isLoading, error } = useGetDocumentsByStudentQuery(studentId);

  const student = studentData?.data;
  const grouped = data?.data?.grouped || {};
  const allDocs = data?.data?.documents || [];

  const pending  = allDocs.filter((d) => d.status === 'pending').length;
  const verified = allDocs.filter((d) => d.status === 'verified').length;
  const rejected = allDocs.filter((d) => d.status === 'rejected').length;

  const handleVerify = (doc) => setVerifyTarget(doc);

  // Types that actually have documents (show in order)
  const typesWithDocs = DOCUMENT_TYPES.filter((t) => (grouped[t] || []).length > 0);

  return (
    <DashboardLayout title="Student Documents">
      {/* Back link */}
      <Link
        to="/counselor/students"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-5"
      >
        ← Back to Students
      </Link>

      {/* Student info */}
      {student && (
        <div className="card mb-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 uppercase flex-shrink-0">
            {student.name?.[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900">{student.name}</p>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      {allDocs.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total',    value: allDocs.length, color: 'border-blue-500' },
            { label: 'Verified', value: verified,       color: 'border-green-500' },
            { label: 'Pending',  value: pending,        color: 'border-yellow-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`card border-l-4 ${color} py-3`}>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <PageSkeleton />
      ) : error ? (
        <div className="card flex flex-col items-center py-12 text-center">
          <span className="text-4xl mb-3">⚠️</span>
          <p className="text-red-600 font-medium">Failed to load documents</p>
          <p className="text-gray-400 text-sm mt-1">{error.data?.message || 'Unknown error'}</p>
        </div>
      ) : allDocs.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <span className="text-5xl mb-4">📂</span>
          <h3 className="font-semibold text-gray-800">No documents uploaded</h3>
          <p className="text-sm text-gray-400 mt-1">
            This student hasn't uploaded any documents yet.
          </p>
        </div>
      ) : (
        <>
          {/* Pending first for quick review */}
          {pending > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5 flex items-center gap-2 text-sm text-yellow-800">
              <span>⏳</span>
              <span>
                <strong>{pending}</strong> document{pending > 1 ? 's' : ''} pending review
              </span>
            </div>
          )}

          {typesWithDocs.map((type) => (
            <TypeSection
              key={type}
              type={type}
              docs={grouped[type] || []}
              onVerify={handleVerify}
              onReject={(doc) => setRejectTarget(doc)}
            />
          ))}
        </>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <RejectModal
          document={rejectTarget}
          onClose={() => setRejectTarget(null)}
        />
      )}

      {/* Verify modal */}
      <VerifyModal
        document={verifyTarget}
        onClose={() => setVerifyTarget(null)}
      />
    </DashboardLayout>
  );
};

export default StudentDocumentsPage;
