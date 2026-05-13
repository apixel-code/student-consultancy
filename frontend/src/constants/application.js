export const APPLICATION_STATUSES = [
  'Inquiry',
  'Applied',
  'Document Submitted',
  'Offer Received',
  'Visa Applied',
  'Visa Approved',
  'Enrolled',
  'Rejected',
];

export const TERMINAL_STATUSES = ['Enrolled', 'Rejected'];

// Per-status Tailwind classes (badge, column header, dot)
export const STATUS_CONFIG = {
  'Inquiry': {
    badge: 'bg-gray-100 text-gray-700 border border-gray-200',
    column: 'bg-gray-50 border-gray-200',
    header: 'text-gray-700 bg-gray-100',
    dot: 'bg-gray-400',
    icon: '🔍',
  },
  'Applied': {
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
    column: 'bg-blue-50 border-blue-200',
    header: 'text-blue-700 bg-blue-100',
    dot: 'bg-blue-500',
    icon: '📝',
  },
  'Document Submitted': {
    badge: 'bg-cyan-100 text-cyan-700 border border-cyan-200',
    column: 'bg-cyan-50 border-cyan-200',
    header: 'text-cyan-700 bg-cyan-100',
    dot: 'bg-cyan-500',
    icon: '📁',
  },
  'Offer Received': {
    badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    column: 'bg-yellow-50 border-yellow-200',
    header: 'text-yellow-700 bg-yellow-100',
    dot: 'bg-yellow-500',
    icon: '🎉',
  },
  'Visa Applied': {
    badge: 'bg-orange-100 text-orange-700 border border-orange-200',
    column: 'bg-orange-50 border-orange-200',
    header: 'text-orange-700 bg-orange-100',
    dot: 'bg-orange-500',
    icon: '✈️',
  },
  'Visa Approved': {
    badge: 'bg-purple-100 text-purple-700 border border-purple-200',
    column: 'bg-purple-50 border-purple-200',
    header: 'text-purple-700 bg-purple-100',
    dot: 'bg-purple-500',
    icon: '✅',
  },
  'Enrolled': {
    badge: 'bg-green-100 text-green-700 border border-green-200',
    column: 'bg-green-50 border-green-200',
    header: 'text-green-700 bg-green-100',
    dot: 'bg-green-500',
    icon: '🎓',
  },
  'Rejected': {
    badge: 'bg-red-100 text-red-700 border border-red-200',
    column: 'bg-red-50 border-red-200',
    header: 'text-red-700 bg-red-100',
    dot: 'bg-red-500',
    icon: '❌',
  },
};

export const PRIORITY_CONFIG = {
  low:    { label: 'Low',    class: 'bg-green-100 text-green-700' },
  medium: { label: 'Medium', class: 'bg-yellow-100 text-yellow-700' },
  high:   { label: 'High',   class: 'bg-red-100 text-red-700' },
};

export const MONTH_NAMES = [
  '', // index 0 unused
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const formatIntake = (month, year) =>
  `${MONTH_NAMES[month] || month} ${year}`;
