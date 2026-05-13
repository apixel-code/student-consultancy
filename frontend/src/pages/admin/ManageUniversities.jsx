import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import {
  useGetAllUniversitiesQuery,
  useCreateUniversityMutation,
  useUpdateUniversityMutation,
  useDeleteUniversityMutation,
} from '../../features/universities/universityApi.js';
import Loader from '../../components/common/Loader.jsx';
import DeleteModal from '../../components/common/DeleteModal.jsx';

const emptyForm = { name: '', country: '', city: '', ranking: '', website: '', description: '' };

const ManageUniversities = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useGetAllUniversitiesQuery({ page, limit: 10, search: search || undefined });
  const [createUniversity, { isLoading: creating }] = useCreateUniversityMutation();
  const [updateUniversity, { isLoading: updating }] = useUpdateUniversityMutation();
  const [deleteUniversity] = useDeleteUniversityMutation();

  const universities = data?.data?.universities || [];
  const totalPages = data?.data?.totalPages || 1;

  const openCreate = () => { setEditing(null); setForm(emptyForm); setLogoFile(null); setShowModal(true); };
  const openEdit = (u) => {
    setEditing(u._id);
    setForm({ name: u.name, country: u.country, city: u.city || '', ranking: u.ranking || '', website: u.website || '', description: u.description || '' });
    setLogoFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => v && formData.append(k, v));
    if (logoFile) formData.append('logo', logoFile);

    const result = editing
      ? await updateUniversity({ id: editing, formData })
      : await createUniversity(formData);

    if (result.data) { setShowModal(false); setEditing(null); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteUniversity(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <DashboardLayout title="Manage Universities">
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search universities..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field max-w-xs"
        />
        <button onClick={openCreate} className="btn-primary ml-auto">+ Add University</button>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader size="lg" /></div>
        ) : universities.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No universities found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map((u) => (
              <div key={u._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                {u.logo?.url && (
                  <img src={u.logo.url} alt={u.name} className="h-12 w-12 object-cover rounded-lg mb-3" />
                )}
                <h4 className="font-semibold text-gray-900">{u.name}</h4>
                <p className="text-sm text-gray-500">{u.city ? `${u.city}, ` : ''}{u.country}</p>
                {u.ranking && <p className="text-xs text-gray-400 mt-1">Rank #{u.ranking}</p>}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(u)} className="text-xs text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => setDeleteTarget({ id: u._id, name: u.name })} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-5">{editing ? 'Edit University' : 'Add University'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'University Name *', name: 'name', required: true },
                { label: 'Country *', name: 'country', required: true },
                { label: 'City', name: 'city' },
                { label: 'Global Ranking', name: 'ranking', type: 'number' },
                { label: 'Website URL', name: 'website' },
              ].map(({ label, name, type = 'text', required }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[name]}
                    onChange={(e) => setForm(f => ({ ...f, [name]: e.target.value }))}
                    required={required}
                    className="input-field"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  className="text-sm text-gray-600"
                />
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
        title="Delete University?"
        description="This university and all its associated courses will be permanently deleted."
        itemName={deleteTarget?.name}
      />
    </DashboardLayout>
  );
};

export default ManageUniversities;
