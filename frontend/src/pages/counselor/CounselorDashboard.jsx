import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { useGetAllStudentsQuery } from '../../features/students/studentApi.js';
import { useGetAllApplicationsQuery, useGetApplicationStatsQuery } from '../../features/applications/applicationApi.js';
import { StatusBadge, PriorityBadge } from '../../components/applications/StatusBadge.jsx';
import { STATUS_CONFIG, formatIntake } from '../../constants/application.js';
import Loader from '../../components/common/Loader.jsx';

const CounselorDashboard = () => {
  const { data: studentsData } = useGetAllStudentsQuery({ limit: 5 });
  const { data: appsData, isLoading } = useGetAllApplicationsQuery({ limit: 6 });
  const { data: statsData } = useGetApplicationStatsQuery();

  const applications = appsData?.data?.applications || [];
  const students = studentsData?.data?.students || [];
  const stats = statsData?.data;

  const highlight = ['Inquiry', 'Applied', 'Offer Received', 'Enrolled'];

  return (
    <DashboardLayout title="Counselor Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {highlight.map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <div key={s} className={`rounded-xl border px-4 py-3 ${cfg.column}`}>
              <p className="text-xs text-gray-500">{s}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.byStatus?.[s] ?? '—'}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent applications */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Applications</h3>
            <Link to="/counselor/applications" className="text-sm text-blue-600 hover:underline">
              View all →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8"><Loader /></div>
          ) : applications.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No applications assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 uppercase flex-shrink-0">
                      {app.student?.name?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{app.student?.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {app.course?.name} · {formatIntake(app.intakeMonth, app.intakeYear)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <PriorityBadge priority={app.priority} />
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My students */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">My Students</h3>
            <Link to="/counselor/students" className="text-sm text-blue-600 hover:underline">
              View all →
            </Link>
          </div>
          {students.length === 0 ? (
            <p className="text-sm text-gray-400">No students yet.</p>
          ) : (
            <ul className="space-y-2">
              {students.map((s) => (
                <li key={s._id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 uppercase flex-shrink-0">
                    {s.name?.[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                    <p className="text-xs text-gray-400 truncate">{s.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CounselorDashboard;
