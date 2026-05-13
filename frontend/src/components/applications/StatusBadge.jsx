import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../constants/application.js';

export const StatusBadge = ({ status, size = 'sm' }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Inquiry'];
  const sizeClass = size === 'xs' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClass} ${cfg.badge}`}>
      <span>{cfg.icon}</span>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${cfg.class}`}>
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
