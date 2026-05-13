export const DOCUMENT_TYPES = [
  'passport',
  'national_id',
  'photo',
  'transcript',
  'english_test',
  'offer_letter',
  'visa_application',
  'visa_approval',
  'bank_statement',
  'other',
];

// Types that have an expiry date
export const EXPIRY_TYPES = new Set(['passport', 'english_test', 'visa_approval']);

export const DOCUMENT_TYPE_CONFIG = {
  passport:         { label: 'Passport',                 icon: '🛂', hasExpiry: true },
  national_id:      { label: 'National ID',              icon: '🪪', hasExpiry: false },
  photo:            { label: 'Photo',                    icon: '🖼️', hasExpiry: false },
  transcript:       { label: 'Academic Transcript',      icon: '📜', hasExpiry: false },
  english_test:     { label: 'English Test (IELTS/TOEFL)', icon: '📝', hasExpiry: true },
  offer_letter:     { label: 'Offer Letter',             icon: '📨', hasExpiry: false },
  visa_application: { label: 'Visa Application',         icon: '✈️', hasExpiry: false },
  visa_approval:    { label: 'Visa Approval',            icon: '✅', hasExpiry: true },
  bank_statement:   { label: 'Bank Statement',           icon: '🏦', hasExpiry: false },
  other:            { label: 'Other',                    icon: '📎', hasExpiry: false },
};

export const DOCUMENT_STATUS_CONFIG = {
  pending:  { label: 'Pending Review', class: 'bg-yellow-100 text-yellow-700 border border-yellow-200', icon: '⏳' },
  verified: { label: 'Verified',       class: 'bg-green-100  text-green-700  border border-green-200',  icon: '✅' },
  rejected: { label: 'Rejected',       class: 'bg-red-100    text-red-700    border border-red-200',    icon: '❌' },
};

// ── Expiry helpers ─────────────────────────────────────────────────────────────

export const daysUntilExpiry = (dateStr) => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
};

export const getExpiryState = (dateStr) => {
  const days = daysUntilExpiry(dateStr);
  if (days === null) return null;
  if (days < 0)   return { label: 'Expired',           class: 'bg-red-100 text-red-700',    urgent: true };
  if (days <= 30) return { label: `Expires in ${days}d`, class: 'bg-orange-100 text-orange-700', urgent: true };
  return { label: `Valid (${days}d left)`, class: 'bg-green-100 text-green-700', urgent: false };
};

// ── File helpers ──────────────────────────────────────────────────────────────

export const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const isPdf = (mimeType) => mimeType === 'application/pdf';
