import { StatCardSkeleton } from './ChartSkeleton.jsx';

const calcChange = (current, previous) => {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
};

const CARD_CONFIGS = {
  students: {
    icon: '🎓',
    bg: 'bg-blue-50',
    accent: 'text-blue-600',
    border: 'border-l-blue-500',
  },
  applications: {
    icon: '📋',
    bg: 'bg-indigo-50',
    accent: 'text-indigo-600',
    border: 'border-l-indigo-500',
  },
  pendingDocs: {
    icon: '📄',
    bg: 'bg-yellow-50',
    accent: 'text-yellow-600',
    border: 'border-l-yellow-500',
  },
  counselors: {
    icon: '👤',
    bg: 'bg-green-50',
    accent: 'text-green-600',
    border: 'border-l-green-500',
  },
};

const StatCard = ({
  type = 'students',
  label,
  value,
  previousValue,
  isLoading = false,
}) => {
  if (isLoading) return <StatCardSkeleton />;

  const cfg = CARD_CONFIGS[type] || CARD_CONFIGS.students;
  const change = calcChange(value, previousValue);
  const isPositive = change !== null && change >= 0;

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${cfg.border} p-5 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-xl ${cfg.bg}`}>
          {cfg.icon}
        </div>

        {change !== null && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}
          >
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <p className="text-3xl font-bold text-gray-900 mt-3 tabular-nums">
        {value?.toLocaleString() ?? '—'}
      </p>
      <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>

      {change !== null && (
        <p className="text-xs text-gray-400 mt-1">vs last month</p>
      )}
    </div>
  );
};

export default StatCard;
