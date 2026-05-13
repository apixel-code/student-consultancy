import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { useGetMyApplicationsQuery } from '../../features/applications/applicationApi.js';
import { useGetMyDocumentsQuery } from '../../features/documents/documentApi.js';
import { useGetMyCounselorQuery } from '../../features/students/studentApi.js';
import { StatusBadge, PriorityBadge } from '../../components/applications/StatusBadge.jsx';
import ApplicationTimeline from '../../components/applications/ApplicationTimeline.jsx';
import {
  APPLICATION_STATUSES,
  STATUS_CONFIG,
  formatIntake,
} from '../../constants/application.js';
import { DOCUMENT_TYPE_CONFIG, DOCUMENT_STATUS_CONFIG } from '../../constants/document.js';

// ─── Progress Pipeline ────────────────────────────────────────────────────────
const ProgressPipeline = ({ status }) => {
  const activeStatuses = APPLICATION_STATUSES.filter((s) => s !== 'Rejected');
  const currentIdx = activeStatuses.indexOf(status);

  if (status === 'Rejected') {
    return (
      <div className="flex items-center gap-2 py-2">
        <span className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-xs">
          ❌
        </span>
        <span className="text-sm text-red-600 font-medium">Application Rejected</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex items-center min-w-max gap-0">
        {activeStatuses.map((step, i) => {
          const cfg = STATUS_CONFIG[step];
          const isCompleted = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    'h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all',
                    isCompleted ? `${cfg.badge} ring-2 ring-offset-1` : '',
                    isCurrent ? `${cfg.badge} ring-2 ring-offset-2` : '',
                    !isCompleted && !isCurrent ? 'bg-gray-100 text-gray-300' : '',
                  ].join(' ')}
                >
                  {isCompleted ? '✓' : cfg.icon}
                </div>
                <span
                  className={`text-[9px] mt-1 font-medium text-center max-w-[52px] leading-tight ${
                    isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-500' : 'text-gray-300'
                  }`}
                >
                  {step}
                </span>
              </div>
              {i < activeStatuses.length - 1 && (
                <div
                  className={`w-6 h-0.5 mb-5 ${i < currentIdx ? 'bg-blue-400' : 'bg-gray-200'}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Application Card ─────────────────────────────────────────────────────────
const AppCard = ({ app }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900 truncate">{app.course?.name}</h4>
            <span className="text-xs text-gray-400">{app.course?.level}</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {app.university?.name} · {app.university?.country}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatIntake(app.intakeMonth, app.intakeYear)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <StatusBadge status={app.status} />
          <PriorityBadge priority={app.priority} />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50">
        <ProgressPipeline status={app.status} />
      </div>

      {app.counselor && (
        <p className="text-xs text-gray-400 mt-2">
          Counselor:{' '}
          <span className="text-gray-600 font-medium">{app.counselor.name}</span>
          {app.counselor.email && (
            <a
              href={`mailto:${app.counselor.email}`}
              className="ml-1 text-blue-500 hover:underline"
            >
              {app.counselor.email}
            </a>
          )}
        </p>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-3 text-xs text-blue-600 hover:underline flex items-center gap-1"
      >
        {open ? '▲ Hide' : '▼ Show'} status timeline
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-gray-50">
          <ApplicationTimeline statusHistory={app.statusHistory} />
        </div>
      )}
    </div>
  );
};

// ─── Skeletons ────────────────────────────────────────────────────────────────
const AppSkeleton = () => (
  <div className="space-y-4">
    {[1, 2].map((i) => (
      <div key={i} className="card space-y-3">
        <div className="h-5 bg-gray-100 rounded w-2/3 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
        <div className="h-8 bg-gray-100 rounded animate-pulse" />
      </div>
    ))}
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const MyApplicationPage = () => {
  const { data: appsData, isLoading } = useGetMyApplicationsQuery();
  const { data: docsData, isLoading: loadingDocs } = useGetMyDocumentsQuery();
  const { data: counselorData } = useGetMyCounselorQuery();

  const applications = appsData?.data || [];
  const documents = (docsData?.data?.documents || []).slice(0, 5);
  const counselor = counselorData?.data;

  // Count by status for the documents summary
  const pendingCount = docsData?.data?.documents?.filter((d) => d.status === 'pending').length || 0;
  const verifiedCount = docsData?.data?.documents?.filter((d) => d.status === 'verified').length || 0;
  const totalDocs = docsData?.data?.documents?.length || 0;

  return (
    <DashboardLayout title="My Applications">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Applications */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <AppSkeleton />
          ) : applications.length === 0 ? (
            <div className="card flex flex-col items-center py-16 text-center">
              <span className="text-5xl mb-4">🎓</span>
              <h3 className="text-lg font-semibold text-gray-800">No Applications Yet</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-xs">
                Your counselor will create an application for you. Check back soon!
              </p>
            </div>
          ) : (
            applications.map((app) => <AppCard key={app._id} app={app} />)
          )}
        </div>

        {/* Right: Counselor + Documents summary */}
        <div className="space-y-4">
          {/* Counselor card */}
          {counselor && (
            <div className="card">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">My Counselor</h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700 uppercase flex-shrink-0">
                  {counselor.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{counselor.name}</p>
                  <a
                    href={`mailto:${counselor.email}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {counselor.email}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Documents summary card */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">My Documents</h3>
              <Link
                to="/student/documents"
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                View all →
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: 'Total', value: totalDocs, color: 'text-gray-900' },
                { label: 'Verified', value: verifiedCount, color: 'text-green-600' },
                { label: 'Pending', value: pendingCount, color: 'text-yellow-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center py-2 bg-gray-50 rounded-lg">
                  <p className={`text-lg font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent documents list */}
            {loadingDocs ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-gray-400 mb-2">No documents uploaded yet</p>
                <Link
                  to="/student/documents"
                  className="btn-primary text-xs px-3 py-1.5 inline-block"
                >
                  Upload Documents
                </Link>
              </div>
            ) : (
              <>
                <ul className="space-y-1.5">
                  {documents.map((doc) => {
                    const typeCfg = DOCUMENT_TYPE_CONFIG[doc.documentType] || DOCUMENT_TYPE_CONFIG.other;
                    const statusCfg = DOCUMENT_STATUS_CONFIG[doc.status] || DOCUMENT_STATUS_CONFIG.pending;
                    return (
                      <li
                        key={doc._id}
                        className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-2"
                      >
                        <span className="text-sm flex-shrink-0">{typeCfg.icon}</span>
                        <p className="text-xs text-gray-700 truncate flex-1">{doc.title}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${statusCfg.class}`}>
                          {statusCfg.icon}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {totalDocs > 5 && (
                  <Link
                    to="/student/documents"
                    className="block text-center text-xs text-blue-600 hover:underline mt-2"
                  >
                    +{totalDocs - 5} more
                  </Link>
                )}
                <Link
                  to="/student/documents"
                  className="btn-primary text-xs px-3 py-2 w-full text-center block mt-3"
                >
                  Upload More Documents
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyApplicationPage;
