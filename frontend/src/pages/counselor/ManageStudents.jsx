import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { useGetAllStudentsQuery } from '../../features/students/studentApi.js';
import { useGetDocumentsByStudentQuery } from '../../features/documents/documentApi.js';
import Loader from '../../components/common/Loader.jsx';

const DocumentsPanel = ({ studentId }) => {
  const { data, isLoading } = useGetDocumentsByStudentQuery(studentId);
  const docs = data?.data?.documents || [];

  if (isLoading) return <Loader size="sm" />;
  if (docs.length === 0) return <p className="text-xs text-gray-400">No documents uploaded.</p>;

  return (
    <ul className="mt-2 space-y-1">
      {docs.map((d) => (
        <li key={d._id} className="flex items-center gap-2 text-xs text-gray-600">
          <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">{d.documentType}</span>
          <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
            {d.title}
          </a>
        </li>
      ))}
    </ul>
  );
};

const ManageStudents = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const { data, isLoading } = useGetAllStudentsQuery({ page, limit: 10, search: search || undefined });
  const students = data?.data?.students || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <DashboardLayout title="My Students">
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field max-w-sm"
        />
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader size="lg" /></div>
        ) : students.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No students assigned to you.</p>
        ) : (
          <div className="space-y-3">
            {students.map((s) => (
              <div key={s._id} className="border border-gray-100 rounded-xl overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(expandedId === s._id ? null : s._id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700 text-sm uppercase">
                      {s.name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/counselor/students/${s._id}/documents`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-blue-600 hover:underline font-medium px-2 py-1 rounded hover:bg-blue-50"
                    >
                      📁 Documents
                    </Link>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-gray-400 text-sm">{expandedId === s._id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expandedId === s._id && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Documents</p>
                    <DocumentsPanel studentId={s._id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm px-3 py-1">Prev</button>
            <span className="py-1 px-3 text-sm text-gray-600">{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm px-3 py-1">Next</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageStudents;
