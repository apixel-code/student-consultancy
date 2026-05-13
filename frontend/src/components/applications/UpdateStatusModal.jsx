import { useState } from 'react';
import { APPLICATION_STATUSES, STATUS_CONFIG } from '../../constants/application.js';
import { useUpdateApplicationStatusMutation } from '../../features/applications/applicationApi.js';

const UpdateStatusModal = ({ application, onClose }) => {
  const [status, setStatus] = useState(application.status);
  const [note, setNote] = useState('');
  const [updateStatus, { isLoading, error }] = useUpdateApplicationStatusMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateStatus({ id: application._id, status, note });
    if (result.data) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-900">Update Status</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Application:{' '}
          <span className="font-medium text-gray-800">
            {application.student?.name} — {application.course?.name}
          </span>
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-4">
            {error.data?.message || 'Update failed'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Status</label>
            <div className="grid grid-cols-1 gap-1.5">
              {APPLICATION_STATUSES.map((s) => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <label
                    key={s}
                    className={[
                      'flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-colors',
                      status === s
                        ? `${cfg.badge} border-current`
                        : 'border-gray-100 hover:bg-gray-50',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={status === s}
                      onChange={() => setStatus(s)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm">{cfg.icon}</span>
                    <span className="text-sm font-medium">{s}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Note <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Add a note about this status change..."
              className="input-field resize-none text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={isLoading || status === application.status} className="btn-primary flex-1 py-2.5">
              {isLoading ? 'Saving...' : 'Update Status'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
