import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { useGetAllStudentsQuery } from '../../features/students/studentApi.js';
import { useGetApplicationStatsQuery } from '../../features/applications/applicationApi.js';
import { useGetAllUniversitiesQuery } from '../../features/universities/universityApi.js';
import Loader from '../../components/common/Loader.jsx';

const StatCard = ({ label, value, color }) => (
  <div className={`card border-l-4 ${color}`}>
    <p className="text-sm text-gray-500 font-medium">{label}</p>
    <p className="text-3xl font-bold text-gray-900 mt-1">{value ?? '—'}</p>
  </div>
);

const STATUS_COLORS = {
  Inquiry: 'bg-gray-100 text-gray-700',
  Applied: 'bg-blue-100 text-blue-700',
  Offer: 'bg-yellow-100 text-yellow-700',
  Visa: 'bg-purple-100 text-purple-700',
  Enrolled: 'bg-green-100 text-green-700',
};

const AdminDashboard = () => {
  const { data: studentData, isLoading: loadingStudents } = useGetAllStudentsQuery({ limit: 5 });
  const { data: statsData, isLoading: loadingStats } = useGetApplicationStatsQuery();
  const { data: uniData } = useGetAllUniversitiesQuery({ limit: 1 });

  const stats = statsData?.data;
  const students = studentData?.data?.students || [];

  return (
    <DashboardLayout title="Admin Dashboard">
      {loadingStats ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Loading stats..." />
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Applications" value={stats?.total} color="border-blue-500" />
            <StatCard label="Enrolled" value={stats?.byStatus?.Enrolled} color="border-green-500" />
            <StatCard label="Visa Stage" value={stats?.byStatus?.Visa} color="border-purple-500" />
            <StatCard label="Universities" value={uniData?.data?.total} color="border-orange-500" />
          </div>

          {/* Application pipeline */}
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Pipeline</h3>
            <div className="flex flex-wrap gap-3">
              {stats?.byStatus &&
                Object.entries(stats.byStatus).map(([status, count]) => (
                  <div
                    key={status}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${STATUS_COLORS[status]}`}
                  >
                    {status}: {count}
                  </div>
                ))}
            </div>
          </div>

          {/* Recent students */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Students</h3>
            {loadingStudents ? (
              <Loader />
            ) : students.length === 0 ? (
              <p className="text-gray-400 text-sm">No students yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Name</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Email</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium">{s.name}</td>
                        <td className="py-3 px-2 text-gray-500">{s.email}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              s.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {s.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-gray-500">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
