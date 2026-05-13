import { STATUS_CONFIG } from '../../constants/application.js';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const TimelineEntry = ({ entry, isLast }) => {
  const cfg = STATUS_CONFIG[entry.status] || STATUS_CONFIG['Inquiry'];

  return (
    <div className="flex gap-4">
      {/* Spine */}
      <div className="flex flex-col items-center">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-base flex-shrink-0 ${cfg.badge}`}>
          {cfg.icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1 mb-0 min-h-[24px]" />}
      </div>

      {/* Content */}
      <div className={`pb-6 flex-1 ${isLast ? '' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{entry.status}</p>
            {entry.changedBy && (
              <p className="text-xs text-gray-500 mt-0.5">
                by{' '}
                <span className="font-medium text-gray-700">
                  {entry.changedBy?.name || 'System'}
                </span>
              </p>
            )}
          </div>
          <time className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            {formatDate(entry.date || entry.createdAt)}
          </time>
        </div>
        {entry.note && (
          <div className="mt-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600">
            {entry.note}
          </div>
        )}
      </div>
    </div>
  );
};

const ApplicationTimeline = ({ statusHistory = [], currentStatus }) => {
  if (!statusHistory.length) {
    return (
      <p className="text-sm text-gray-400 italic">No status history yet.</p>
    );
  }

  const sorted = [...statusHistory].sort(
    (a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-gray-700">Status History</span>
        <span className="text-xs text-gray-400">({sorted.length} entries)</span>
      </div>
      <div>
        {sorted.map((entry, idx) => (
          <TimelineEntry
            key={idx}
            entry={entry}
            isLast={idx === sorted.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default ApplicationTimeline;
