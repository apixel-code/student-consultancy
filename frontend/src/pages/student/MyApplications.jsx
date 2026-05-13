import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { useGetMyApplicationsQuery } from '../../features/applications/applicationApi.js';
import { useGetMyDocumentsQuery, useUploadDocumentMutation, useDeleteDocumentMutation } from '../../features/documents/documentApi.js';
import Loader from '../../components/common/Loader.jsx';

const STATUS_BADGE = {
  Inquiry: 'badge-inquiry',
  Applied: 'badge-applied',
  Offer: 'badge-offer',
  Visa: 'badge-visa',
  Enrolled: 'badge-enrolled',
};

const DOC_TYPES = ['Passport', 'Visa', 'Transcript', 'OfferLetter', 'IELTS', 'TOEFL', 'CV', 'SOP', 'LOR', 'Other'];

const MyApplications = () => {
  const { data: appsData, isLoading } = useGetMyApplicationsQuery();
  const { data: docsData, isLoading: loadingDocs } = useGetMyDocumentsQuery();
  const [uploadDocument, { isLoading: uploading }] = useUploadDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const [docType, setDocType] = useState('Passport');
  const [docFile, setDocFile] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const applications = appsData?.data || [];
  const documents = docsData?.data || [];

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadError('');
    if (!docFile) return setUploadError('Please select a file');

    const formData = new FormData();
    formData.append('file', docFile);
    formData.append('type', docType);

    const result = await uploadDocument(formData);
    if (result.data) {
      setDocFile(null);
      e.target.reset();
    } else if (result.error) {
      setUploadError(result.error.data?.message || 'Upload failed');
    }
  };

  return (
    <DashboardLayout title="My Applications">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-semibold text-gray-700">Application History</h3>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader size="lg" /></div>
          ) : applications.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-gray-400">No applications found. Your counselor will create one for you.</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app._id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{app.course?.name}</h4>
                    <p className="text-sm text-gray-500">{app.university?.name} · {app.university?.country}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{app.intakeSemester} {app.intakeYear} · {app.course?.level}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[app.status]}`}>
                    {app.status}
                  </span>
                </div>

                {/* Mini pipeline */}
                <div className="flex gap-1 mt-3">
                  {['Inquiry', 'Applied', 'Offer', 'Visa', 'Enrolled'].map((step) => {
                    const statuses = ['Inquiry', 'Applied', 'Offer', 'Visa', 'Enrolled'];
                    const isReached = statuses.indexOf(step) <= statuses.indexOf(app.status);
                    return (
                      <div key={step} className={`flex-1 h-1.5 rounded-full ${isReached ? 'bg-blue-500' : 'bg-gray-200'}`} />
                    );
                  })}
                </div>

                {app.counselor && (
                  <p className="text-xs text-gray-400 mt-2">
                    Counselor: <span className="text-gray-600 font-medium">{app.counselor.name}</span>
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Documents sidebar */}
        <div className="space-y-4">
          {/* Upload form */}
          <div className="card">
            <h3 className="text-base font-semibold text-gray-700 mb-4">Upload Document</h3>
            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select value={docType} onChange={(e) => setDocType(e.target.value)} className="input-field">
                  {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF/Image/Doc)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => setDocFile(e.target.files[0])}
                  required
                  className="text-sm text-gray-600 w-full"
                />
              </div>
              {uploadError && (
                <p className="text-xs text-red-600">{uploadError}</p>
              )}
              <button type="submit" disabled={uploading} className="btn-primary w-full">
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>

          {/* Document list */}
          <div className="card">
            <h3 className="text-base font-semibold text-gray-700 mb-4">My Documents</h3>
            {loadingDocs ? (
              <Loader size="sm" />
            ) : documents.length === 0 ? (
              <p className="text-sm text-gray-400">No documents uploaded yet.</p>
            ) : (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc._id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <div className="overflow-hidden">
                      <span className="text-xs font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{doc.type}</span>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-xs text-gray-600 hover:text-blue-600 truncate mt-0.5"
                      >
                        {doc.name}
                      </a>
                    </div>
                    <button
                      onClick={() => window.confirm('Delete document?') && deleteDocument(doc._id)}
                      className="text-xs text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;
