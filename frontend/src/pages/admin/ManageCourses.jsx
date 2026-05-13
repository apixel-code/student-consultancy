import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import {
  useGetAllCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from '../../features/courses/courseApi.js';
import { useGetAllUniversitiesQuery } from '../../features/universities/universityApi.js';
import Loader from '../../components/common/Loader.jsx';
import DeleteModal from '../../components/common/DeleteModal.jsx';

const LEVELS = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];

const emptyForm = {
  name: '',
  university: '',
  level: 'Bachelor',
  duration: '',
  tuitionFee: { amount: '', currency: 'USD' },
  requirements: { ielts: '', toefl: '', gpa: '' },
};

const ManageCourses = () => {
  const [page, setPage] = useState(1);
  const [levelFilter, setLevelFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

  const { data, isLoading } = useGetAllCoursesQuery({ page, limit: 10, level: levelFilter || undefined });
  const { data: uniData } = useGetAllUniversitiesQuery({ limit: 100 });
  const [createCourse, { isLoading: creating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: deleting }] = useDeleteCourseMutation();

  const courses = data?.data?.courses || [];
  const universities = uniData?.data?.universities || [];
  const totalPages = data?.data?.totalPages || 1;

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c._id);
    setForm({
      name: c.name, university: c.university?._id || '', level: c.level, duration: c.duration,
      tuitionFee: { amount: c.tuitionFee?.amount || '', currency: c.tuitionFee?.currency || 'USD' },
      requirements: { ielts: c.requirements?.ielts || '', toefl: c.requirements?.toefl || '', gpa: c.requirements?.gpa || '' },
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tuitionFee: { amount: Number(form.tuitionFee.amount), currency: form.tuitionFee.currency } };
    const result = editing
      ? await updateCourse({ id: editing, ...payload })
      : await createCourse(payload);
    if (result.data) { setShowModal(false); setEditing(null); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCourse(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <DashboardLayout title="Manage Courses">
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={levelFilter} onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }} className="input-field max-w-[160px]">
          <option value="">All Levels</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <button onClick={openCreate} className="btn-primary ml-auto">+ Add Course</button>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader size="lg" /></div>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No courses found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Course', 'University', 'Level', 'Duration', 'Fee (USD)', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium">{c.name}</td>
                    <td className="py-3 px-3 text-gray-500">{c.university?.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{c.level}</span>
                    </td>
                    <td className="py-3 px-3 text-gray-500">{c.duration}</td>
                    <td className="py-3 px-3 text-gray-500">
                      {c.tuitionFee?.amount ? `$${c.tuitionFee.amount.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="text-xs text-blue-600 hover:underline">Edit</button>
                        <button
                          onClick={() => setDeleteTarget({ id: c._id, name: c.name })}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm px-3 py-1">Prev</button>
            <span className="py-1 px-3 text-sm text-gray-600">{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm px-3 py-1">Next</button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-5">{editing ? 'Edit Course' : 'Add Course'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
                <select value={form.university} onChange={(e) => setForm(f => ({ ...f, university: e.target.value }))} required className="input-field">
                  <option value="">Select university</option>
                  {universities.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                  <select value={form.level} onChange={(e) => setForm(f => ({ ...f, level: e.target.value }))} className="input-field">
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                  <input type="text" placeholder="e.g. 3 years" value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} required className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee (USD/year)</label>
                <input type="number" min={0} value={form.tuitionFee.amount}
                  onChange={(e) => setForm(f => ({ ...f, tuitionFee: { ...f.tuitionFee, amount: e.target.value } }))}
                  className="input-field" placeholder="e.g. 15000" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[['IELTS', 'ielts'], ['TOEFL', 'toefl'], ['Min GPA', 'gpa']].map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                    <input type="number" step="0.1" min={0} value={form.requirements[key]}
                      onChange={(e) => setForm(f => ({ ...f, requirements: { ...f.requirements, [key]: e.target.value } }))}
                      className="input-field text-sm" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={creating || updating} className="btn-primary flex-1">
                  {creating || updating ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Course?"
        description="This course will be permanently deleted and removed from all applications."
        itemName={deleteTarget?.name}
        loading={deleting}
      />
    </DashboardLayout>
  );
};

export default ManageCourses;
