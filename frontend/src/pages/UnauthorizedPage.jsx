import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const ROLE_HOME = {
  admin: '/admin/dashboard',
  counselor: '/counselor/dashboard',
  student: '/student/dashboard',
};

const UnauthorizedPage = () => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <p className="text-8xl font-black text-red-100">403</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Access Denied</h1>
        <p className="text-gray-500 mt-2">
          You don&apos;t have permission to view this page.
        </p>
        <Link
          to={ROLE_HOME[role] || '/login'}
          className="mt-6 inline-block btn-primary px-6 py-2.5"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
