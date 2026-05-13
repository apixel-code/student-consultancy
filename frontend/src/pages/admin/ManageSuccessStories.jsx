import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import {
  useGetAllSuccessStoriesQuery,
  useCreateSuccessStoryMutation,
  useUpdateSuccessStoryMutation,
  useDeleteSuccessStoryMutation,
} from '../../features/successStories/successStoryApi';

const EMPTY = {
  title: '', student: '', program: '', country: '',
  year: new Date().getFullYear().toString(), ytId: '', initials: '', isActive: true,
};

const COUNTRY_FLAGS = {
  'United Kingdom': '🇬🇧', 'Canada': '🇨🇦', 'Australia': '🇦🇺',
  'USA': '🇺🇸', 'Germany': '🇩🇪', 'Malaysia': '🇲🇾', 'Other': '🌍',
};

export default function ManageSuccessStories() {
  const { data, isLoading } = useGetAllSuccessStoriesQuery();
  const [createStory, { isLoading: creating }] = useCreateSuccessStoryMutation();
  const [updateStory, { isLoading: updating }] = useUpdateSuccessStoryMutation();
  const [deleteStory] = useDeleteSuccessStoryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null); // null = add mode, obj = edit mode
  const [form, setForm]           = useState(EMPTY);
  const [deleteId, setDeleteId]   = useState(null);
  const [error, setError]         = useState('');

  const stories = data?.data || [];

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModalOpen(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ title: s.title, student: s.student, program: s.program, country: s.country,
               year: s.year, ytId: s.ytId, initials: s.initials, isActive: s.isActive });
    setError('');
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(EMPTY); setError(''); };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await updateStory({ id: editing._id, ...form }).unwrap();
      } else {
        await createStory(form).unwrap();
      }
      closeModal();
    } catch (err) {
      setError(err?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteStory(deleteId);
    setDeleteId(null);
  };

  const handleToggle = async (s) => {
    await updateStory({ id: s._id, isActive: !s.isActive }).unwrap().catch(() => {});
  };

  return (
    <DashboardLayout>
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Success Stories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage YouTube success stories shown on the home page</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          + Add Story
        </button>
      </div>

      {/* Stories grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-56 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-3">🎬</p>
          <p className="font-medium">No success stories yet.</p>
          <button onClick={openAdd} className="mt-4 text-blue-600 text-sm font-medium hover:underline">
            Add the first one →
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map(s => (
            <div key={s._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Thumbnail */}
              <div className="relative" style={{ aspectRatio: '16/9', background: '#1e293b' }}>
                <img
                  src={`https://img.youtube.com/vi/${s.ytId}/maxresdefault.jpg`}
                  alt={s.title}
                  className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* Status badge */}
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold ${s.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {s.isActive ? 'Active' : 'Hidden'}
                </div>
              </div>

              <div className="p-4">
                <p className="font-semibold text-sm text-gray-900 leading-snug mb-1 line-clamp-2">{s.title}</p>
                <p className="text-xs text-blue-600 font-medium">{s.student}</p>
                <p className="text-xs text-gray-400 mb-3 line-clamp-1">{s.program}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{COUNTRY_FLAGS[s.country] || '🌍'} {s.country} · {s.year}</span>
                  <div className="flex items-center gap-2">
                    {/* Toggle */}
                    <button onClick={() => handleToggle(s)}
                      title={s.isActive ? 'Hide' : 'Show'}
                      className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">
                      {s.isActive ? '👁️' : '🙈'}
                    </button>
                    {/* Edit */}
                    <button onClick={() => openEdit(s)}
                      className="text-xs px-2 py-1 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
                      Edit
                    </button>
                    {/* Delete */}
                    <button onClick={() => setDeleteId(s._id)}
                      className="text-xs px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                      Del
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit Success Story' : 'Add Success Story'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Title *</label>
                <input name="title" required value={form.title} onChange={handleChange}
                  placeholder="From Dhaka to London: My King's College Journey"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                  <input name="student" required value={form.student} onChange={handleChange}
                    placeholder="Md. Raihan Islam"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initials *</label>
                  <input name="initials" required value={form.initials} onChange={handleChange}
                    placeholder="MR" maxLength={3}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
                <input name="program" required value={form.program} onChange={handleChange}
                  placeholder="MSc Data Science, King's College London"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <select name="country" required value={form.country} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select</option>
                    {Object.keys(COUNTRY_FLAGS).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <input name="year" required value={form.year} onChange={handleChange}
                    placeholder="2024"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video ID *</label>
                <input name="ytId" required value={form.ytId} onChange={handleChange}
                  placeholder="e.g. kzx30pObBu8  (from youtube.com/watch?v=kzx30pObBu8)"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-gray-400 mt-1">Copy the ID after <code>?v=</code> in the YouTube URL</p>
              </div>

              {editing && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange}
                    className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Visible on home page</span>
                </label>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating || updating}
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">
                  {creating || updating ? 'Saving…' : editing ? 'Save Changes' : 'Add Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <p className="text-4xl mb-3">🗑️</p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Story?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}
