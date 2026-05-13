import { useState, useEffect } from 'react';
import { useCreateApplicationMutation } from '../../features/applications/applicationApi.js';
import { useGetAllStudentsQuery } from '../../features/students/studentApi.js';
import { useGetAllUniversitiesQuery } from '../../features/universities/universityApi.js';
import { useGetCoursesByUniversityQuery } from '../../features/courses/courseApi.js';
import { useGetAllUsersQuery } from '../../features/users/userApi.js';
import { MONTH_NAMES } from '../../constants/application.js';
import useAuth from '../../hooks/useAuth.js';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR + i);

const emptyForm = {
  student: '',
  university: '',
  course: '',
  intakeYear: String(CURRENT_YEAR),
  intakeMonth: '9',
  priority: 'medium',
  notes: '',
  counselor: '',
};

const CreateApplicationModal = ({ onClose }) => {
  const { isAdmin, user } = useAuth();
  const [form, setForm] = useState(emptyForm);

  const { data: studentsData } = useGetAllStudentsQuery({ limit: 200 });
  const { data: univData } = useGetAllUniversitiesQuery({ limit: 200, isActive: 'true' });
  const { data: coursesData, isFetching: fetchingCourses } = useGetCoursesByUniversityQuery(
    form.university,
    { skip: !form.university }
  );
  const { data: counselorsData } = useGetAllUsersQuery(
    { role: 'counselor', limit: 100 },
    { skip: !isAdmin }
  );
  const [createApplication, { isLoading, error }] = useCreateApplicationMutation();

  const students = studentsData?.data?.students || [];
  const universities = univData?.data?.universities || [];
  const courses = coursesData?.data || [];
  const counselors = counselorsData?.data?.users || [];

  // Reset course when university changes
  useEffect(() => {
    setForm((f) => ({ ...f, course: '' }));
  }, [form.university]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      student: form.student,
      university: form.university,
      course: form.course,
      intakeYear: Number(form.intakeYear),
      intakeMonth: Number(form.intakeMonth),
      priority: form.priority,
      notes: form.notes,
      counselor: isAdmin ? form.counselor || undefined : undefined,
    };

    const result = await createApplication(payload);
    if (result.data) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">New Application</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error.data?.message || 'Failed to create application'}
            </div>
          )}

          {/* Student */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Student *</label>
            <select value={form.student} onChange={set('student')} required className="input-field">
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
              ))}
            </select>
          </div>

          {/* University */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">University *</label>
            <select value={form.university} onChange={set('university')} required className="input-field">
              <option value="">Select university</option>
              {universities.map((u) => (
                <option key={u._id} value={u._id}>{u.name} — {u.country}</option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Course *</label>
            <select
              value={form.course}
              onChange={set('course')}
              required
              disabled={!form.university || fetchingCourses}
              className="input-field disabled:bg-gray-50"
            >
              <option value="">
                {!form.university
                  ? 'Select university first'
                  : fetchingCourses
                  ? 'Loading...'
                  : courses.length === 0
                  ? 'No courses available'
                  : 'Select course'}
              </option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.level})
                </option>
              ))}
            </select>
          </div>

          {/* Intake Year + Month */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Intake Year *</label>
              <select value={form.intakeYear} onChange={set('intakeYear')} required className="input-field">
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Intake Month *</label>
              <select value={form.intakeMonth} onChange={set('intakeMonth')} required className="input-field">
                {MONTH_NAMES.slice(1).map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
            <select value={form.priority} onChange={set('priority')} className="input-field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Counselor (admin only) */}
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign Counselor</label>
              <select value={form.counselor} onChange={set('counselor')} className="input-field">
                <option value="">Unassigned</option>
                {counselors.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={set('notes')}
              rows={3}
              placeholder="Optional initial notes..."
              className="input-field resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isLoading} className="btn-primary flex-1 py-2.5">
              {isLoading ? 'Creating...' : 'Create Application'}
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

export default CreateApplicationModal;
