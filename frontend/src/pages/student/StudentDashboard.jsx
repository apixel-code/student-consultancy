import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { useGetMyApplicationsQuery } from '../../features/applications/applicationApi.js';
import { useGetMyDocumentsQuery } from '../../features/documents/documentApi.js';
import { useGetMyCounselorQuery } from '../../features/students/studentApi.js';
import useAuth from '../../hooks/useAuth.js';
import { StatusBadge } from '../../components/applications/StatusBadge.jsx';
import { APPLICATION_STATUSES, STATUS_CONFIG, formatIntake } from '../../constants/application.js';
import Loader from '../../components/common/Loader.jsx';

// Show progress bar for latest application
const LatestProgress = ({ app }) => {
  const activeStatuses = APPLICATION_STATUSES.filter((s) => s !== 'Rejected');
  const currentIdx = activeStatuses.indexOf(app.status);

  return (
    <div className="card mb-8">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Latest Application Progress</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {app.course?.name} — {app.university?.name}
          </p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="flex items-center min-w-max gap-0">
          {activeStatuses.map((step, i) => {
            const cfg = STATUS_CONFIG[step];
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={[
                    'h-7 w-7 rounded-full flex items-center justify-center text-xs transition-all',
                    done ? `${cfg.badge} ring-2 ring-offset-1` : '',
                    active ? `${cfg.badge} ring-2 ring-offset-2` : '',
                    !done && !active ? 'bg-gray-100 text-gray-300' : '',
                  ].join(' ')}>
                    {done ? '✓' : cfg.icon}
                  </div>
                  <span className={`text-[8px] mt-1 font-medium text-center max-w-[48px] leading-tight ${active ? 'text-gray-900' : done ? 'text-gray-400' : 'text-gray-300'}`}>
                    {step}
                  </span>
                </div>
                {i < activeStatuses.length - 1 && (
                  <div className={`w-5 h-0.5 mb-5 ${i < currentIdx ? 'bg-blue-400' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const { data: appsData, isLoading } = useGetMyApplicationsQuery();
  const { data: docsData } = useGetMyDocumentsQuery();
  const { data: counselorData } = useGetMyCounselorQuery();

  const applications = appsData?.data || [];
  const docs = docsData?.data || [];
  const counselor = counselorData?.data;
  const latestApp = applications[0];

  return (
    <DashboardLayout title={`Welcome, ${user?.name?.split(' ')[0]} 👋`}>
      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-3xl font-bold">{applications.length}</p>
        </div>
        <div className="card border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Documents Uploaded</p>
          <p className="text-3xl font-bold">{docs.length}</p>
        </div>
        <div className="card border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">My Counselor</p>
          <p className="text-base font-semibold mt-1 truncate">{counselor?.name || 'Not assigned'}</p>
        </div>
      </div>

      {/* Latest app progress */}
      {latestApp && <LatestProgress app={latestApp} />}

      {/* Applications list & counselor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">My Applications</h3>
            <Link to="/student/applications" className="text-sm text-blue-600 hover:underline">View all →</Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-6"><Loader /></div>
          ) : applications.length === 0 ? (
            <p className="text-sm text-gray-400">No applications yet. Your counselor will create one.</p>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 4).map((app) => (
                <div key={app._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-900 truncate">{app.course?.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {app.university?.name} · {formatIntake(app.intakeMonth, app.intakeYear)}
                    </p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <StatusBadge status={app.status} size="xs" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-base font-semibold mb-4">My Counselor</h3>
          {counselor ? (
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mx-auto mb-3 uppercase">
                {counselor.name?.[0]}
              </div>
              <p className="font-semibold text-gray-900">{counselor.name}</p>
              <a href={`mailto:${counselor.email}`} className="text-sm text-blue-600 hover:underline mt-1 block">
                {counselor.email}
              </a>
              {counselor.phone && <p className="text-sm text-gray-500 mt-1">{counselor.phone}</p>}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No counselor assigned yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
