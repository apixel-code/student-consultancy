import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthLoading,
} from '../../features/auth/authSlice.js';
import Loader from '../common/Loader.jsx';

const ROLE_HOME = {
  admin: '/admin/dashboard',
  counselor: '/counselor/dashboard',
  student: '/student/dashboard',
};

/**
 * Wraps protected routes.
 *
 * Props:
 *   allowedRoles  — array of role strings that may access the route.
 *                   Omit to allow any authenticated user.
 *
 * Edge cases handled:
 *   - Not authenticated         → redirect to /login (preserves intended URL)
 *   - Authenticated, wrong role → redirect to /unauthorized
 *   - Inactive account          → backend returns 403; frontend hits /unauthorized
 *   - Auth loading              → show full-screen spinner instead of flash-redirecting
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Verifying session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the URL the user tried to visit so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

/**
 * Wraps public-only routes (login, register).
 * Authenticated users are redirected to their role dashboard.
 */
export const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME[user?.role] || '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
