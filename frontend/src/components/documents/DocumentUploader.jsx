import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance.js';
import { documentApi } from '../../features/documents/documentApi.js';
import {
  DOCUMENT_TYPE_CONFIG,
  EXPIRY_TYPES,
  formatFileSize,
  isPdf,
} from '../../constants/document.js';

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

// ── File Preview ──────────────────────────────────────────────────────────────
const FilePreview = ({ file }) => {
  if (!file) return null;
  const url = URL.createObjectURL(file);

  return (
    <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
      {isPdf(file.type) ? (
        <div className="h-12 w-12 rounded-lg bg-red-50 flex items-center justify-center text-2xl flex-shrink-0">
          📄
        </div>
      ) : (
        <img
          src={url}
          alt="preview"
          className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
          onLoad={() => URL.revokeObjectURL(url)}
        />
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
      </div>
    </div>
  );
};

// ── Progress Bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ progress }) => (
  <div className="mt-3">
    <div className="flex justify-between text-xs text-gray-500 mb-1">
      <span>Uploading…</span>
      <span>{progress}%</span>
    </div>
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 rounded-full transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const DocumentUploader = ({ documentType, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const cfg = DOCUMENT_TYPE_CONFIG[documentType];
  const needsExpiry = EXPIRY_TYPES.has(documentType);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted, rejected) => {
    setError('');
    if (rejected.length) {
      const msg = rejected[0].errors[0];
      if (msg.code === 'file-too-large') setError('File exceeds 10 MB limit');
      else if (msg.code === 'file-invalid-type') setError('Only PDF, JPG, PNG files are allowed');
      else setError(msg.message);
      return;
    }
    const picked = accepted[0];
    setFile(picked);
    // Auto-fill title from filename (without extension)
    if (!title) setTitle(picked.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '));
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file');
    if (!title.trim()) return setError('Please enter a document title');
    if (needsExpiry && !expiryDate) return setError('Expiry date is required for this document type');

    setError('');
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('title', title.trim());
    if (expiryDate) formData.append('expiryDate', expiryDate);

    try {
      await axiosInstance.post('/documents', formData, {
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      // Invalidate RTK Query cache so document lists refresh
      dispatch(documentApi.util.invalidateTags(['Document']));
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{cfg.icon}</span>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{cfg.label}</p>
          <p className="text-xs text-gray-400">PDF, JPG, PNG · max 10 MB</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={[
            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50',
            uploading ? 'pointer-events-none opacity-60' : '',
          ].join(' ')}
        >
          <input {...getInputProps()} />
          {file ? (
            <FilePreview file={file} />
          ) : (
            <>
              <div className="text-3xl mb-2">📁</div>
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Drop the file here' : 'Drag & drop or click to select'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10 MB</p>
            </>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Document Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`e.g. My ${cfg.label}`}
            required
            disabled={uploading}
            className="input-field text-sm disabled:bg-gray-50"
          />
        </div>

        {/* Expiry date (conditionally required) */}
        {needsExpiry && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              disabled={uploading}
              min={new Date().toISOString().split('T')[0]}
              className="input-field text-sm disabled:bg-gray-50"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        )}

        {/* Progress */}
        {uploading && <ProgressBar progress={progress} />}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={!file || uploading}
            className="btn-primary flex-1 text-sm py-2 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <span className="h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Uploading…
              </>
            ) : (
              'Upload'
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={uploading}
              className="btn-secondary flex-1 text-sm py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DocumentUploader;
