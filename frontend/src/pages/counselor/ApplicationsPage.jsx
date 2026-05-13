import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import {
  useGetAllApplicationsQuery,
  useGetAllApplicationsForKanbanQuery,
  useGetApplicationStatsQuery,
  useUpdateApplicationStatusMutation,
} from '../../features/applications/applicationApi.js';
import { StatusBadge, PriorityBadge } from '../../components/applications/StatusBadge.jsx';
import KanbanBoard from '../../components/applications/KanbanBoard.jsx';
import ApplicationTimeline from '../../components/applications/ApplicationTimeline.jsx';
import CreateApplicationModal from '../../components/applications/CreateApplicationModal.jsx';
import UpdateStatusModal from '../../components/applications/UpdateStatusModal.jsx';
import { APPLICATION_STATUSES, STATUS_CONFIG, formatIntake } from '../../constants/application.js';

const TableSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
  </div>
);

const ApplicationsPage = () => {
  const [view, setView] = useState('table');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [statusModal, setStatusModal] = useState(null);
  const [detailApp, setDetailApp] = useState(null);

  const tableParams = { page, limit: 20, ...(statusFilter ? { status: statusFilter } : {}) };
  const kanbanParams = statusFilter ? { status: statusFilter } : {};

  const { data, isLoading, isFetching } = useGetAllApplicationsQuery(tableParams, { skip: view === 'kanban' });
  const { data: kanbanData, isLoading: kanbanLoading } = useGetAllApplicationsForKanbanQuery(
    kanbanParams,
    { skip: view === 'table' }
  );
  const { data: statsData } = useGetApplicationStatsQuery();
  const [updateStatus] = useUpdateApplicationStatusMutation();

  const applications = data?.data?.applications || [];
  const kanbanApps = kanbanData?.data || [];
  const totalPages = data?.data?.totalPages || 1;
  const stats = statsData?.data;

  return (
    <DashboardLayout title="My Applications">
      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {['Inquiry', 'Applied', 'Offer Received', 'Enrolled'].map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <div key={s} className={`rounded-xl border px-3 py-2.5 ${cfg.column}`}>
              <p className="text-xs text-gray-500">{s}</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{stats?.byStatus?.[s] ?? '—'}</p>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-field max-w-[200px] text-sm"
        >
          <option value="">All Statuses</option>
          {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden text-sm">
            {[['table', '☰ Table'], ['kanban', '⠿ Kanban']].map(([v, label]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 font-medium transition-colors ${view === v ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary text-sm px-4 py-2">
            + New Application
          </button>
        </div>
      </div>

      {/* Table view */}
      {view === 'table' && (
        <div className="card">
          {isLoading || isFetching ? (
            <TableSkeleton />
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <span className="text-4xl mb-3">📋</span>
              <p className="text-gray-500 font-medium">No applications yet</p>
              <p className="text-gray-400 text-sm mt-1">Create one to get started</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Student', 'University / Course', 'Intake', 'Status', 'Priority', 'Actions'].map((h) => (
                        <th key={h} className="text-left py-3 px-3 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id} className="border-b border-gray-50 hover:bg-gray-50 group">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 uppercase">
                              {app.student?.name?.[0]}
                            </div>
                            <p className="font-medium text-gray-900">{app.student?.name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-gray-800 truncate max-w-[160px]">{app.university?.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[160px]">{app.course?.name}</p>
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-500 whitespace-nowrap">
                          {formatIntake(app.intakeMonth, app.intakeYear)}
                        </td>
                        <td className="py-3 px-3"><StatusBadge status={app.status} /></td>
                        <td className="py-3 px-3"><PriorityBadge priority={app.priority} /></td>
                        <td className="py-3 px-3">
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setDetailApp(app)} className="text-xs text-blue-600 hover:underline px-1">Timeline</button>
                            <button onClick={() => setStatusModal(app)} className="text-xs text-green-600 hover:underline px-1">Status</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm px-3 py-1">Prev</button>
                  <span className="py-1 px-3 text-sm text-gray-600">{page} / {totalPages}</span>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm px-3 py-1">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Kanban view */}
      {view === 'kanban' && (
        <KanbanBoard
          applications={kanbanApps}
          onStatusChange={({ id, status }) => updateStatus({ id, status })}
          isLoading={kanbanLoading}
        />
      )}

      {/* Modals */}
      {showCreate && <CreateApplicationModal onClose={() => setShowCreate(false)} />}
      {statusModal && <UpdateStatusModal application={statusModal} onClose={() => setStatusModal(null)} />}

      {/* Timeline drawer */}
      {detailApp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDetailApp(null)} />
          <div className="relative bg-white w-full max-w-md h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-900">{detailApp.student?.name}</h3>
                <p className="text-sm text-gray-500">{detailApp.course?.name} — {detailApp.university?.name}</p>
              </div>
              <button onClick={() => setDetailApp(null)} className="text-gray-400 hover:text-gray-600 text-xl ml-4">&times;</button>
            </div>
            <div className="mb-4 flex gap-2 flex-wrap">
              <StatusBadge status={detailApp.status} />
              <PriorityBadge priority={detailApp.priority} />
            </div>
            <ApplicationTimeline statusHistory={detailApp.statusHistory} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ApplicationsPage;
