import { Routes, Route } from 'react-router-dom';
import ProtectedRoute, { PublicRoute } from '../components/auth/ProtectedRoute.jsx';

// Public layout & pages
import PublicLayout from '../layouts/PublicLayout.jsx';
import HomePage from '../pages/public/HomePage.jsx';
import AboutPage from '../pages/public/AboutPage.jsx';
import ServicesPage from '../pages/public/ServicesPage.jsx';
import UniversitiesPage from '../pages/public/UniversitiesPage.jsx';
import ContactPage from '../pages/public/ContactPage.jsx';

// Auth
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import ApplicationsPage from '../pages/admin/ApplicationsPage.jsx';
import ManageUsers from '../pages/admin/ManageUsers.jsx';
import ManageUniversities from '../pages/admin/ManageUniversities.jsx';
import ManageCourses from '../pages/admin/ManageCourses.jsx';
import ManageSuccessStories from '../pages/admin/ManageSuccessStories.jsx';

// Counselor
import CounselorDashboard from '../pages/counselor/CounselorDashboard.jsx';
import CounselorApplicationsPage from '../pages/counselor/ApplicationsPage.jsx';
import ManageStudents from '../pages/counselor/ManageStudents.jsx';
import StudentDocumentsPage from '../pages/counselor/StudentDocumentsPage.jsx';

// Student
import StudentDashboard from '../pages/student/StudentDashboard.jsx';
import MyApplicationPage from '../pages/student/MyApplicationPage.jsx';
import DocumentsPage from '../pages/student/DocumentsPage.jsx';

// Shared
import NotFoundPage from '../pages/NotFoundPage.jsx';
import UnauthorizedPage from '../pages/UnauthorizedPage.jsx';

const AppRouter = () => (
  <Routes>
    {/* ── Landing pages ── */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/universities" element={<UniversitiesPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Route>

    {/* ── Public ── */}
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    {/* ── Admin only ── */}
    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/applications" element={<ApplicationsPage />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/admin/universities" element={<ManageUniversities />} />
      <Route path="/admin/courses" element={<ManageCourses />} />
    </Route>

    {/* ── Admin + Counselor ── */}
    <Route element={<ProtectedRoute allowedRoles={['admin', 'counselor']} />}>
      <Route path="/success-stories" element={<ManageSuccessStories />} />
      <Route path="/counselor/dashboard" element={<CounselorDashboard />} />
      <Route path="/counselor/applications" element={<CounselorApplicationsPage />} />
      <Route path="/counselor/students" element={<ManageStudents />} />
      <Route path="/counselor/students/:studentId/documents" element={<StudentDocumentsPage />} />
    </Route>

    {/* ── Student only ── */}
    <Route element={<ProtectedRoute allowedRoles={['student']} />}>
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/applications" element={<MyApplicationPage />} />
      <Route path="/student/documents" element={<DocumentsPage />} />
    </Route>

    {/* ── Fallbacks ── */}
    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRouter;
