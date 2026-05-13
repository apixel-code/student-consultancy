import { NavLink, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../features/auth/authApi.js';
import useAuth from '../../hooks/useAuth.js';

const NAV_LINKS = {
  admin: [
    { label: 'Dashboard',       path: '/admin/dashboard',    icon: '📊' },
    { label: 'Applications',    path: '/admin/applications', icon: '📋' },
    { label: 'Universities',    path: '/admin/universities', icon: '🏛️' },
    { label: 'Courses',         path: '/admin/courses',      icon: '📚' },
    { label: 'Users',           path: '/admin/users',        icon: '👥' },
    { label: 'Success Stories', path: '/success-stories',    icon: '🎬' },
  ],
  counselor: [
    { label: 'Dashboard',       path: '/counselor/dashboard',    icon: '📊' },
    { label: 'Applications',    path: '/counselor/applications', icon: '📋' },
    { label: 'My Students',     path: '/counselor/students',     icon: '🎓' },
    { label: 'Success Stories', path: '/success-stories',        icon: '🎬' },
  ],
  student: [
    { label: 'Dashboard',       path: '/student/dashboard',    icon: '📊' },
    { label: 'My Applications', path: '/student/applications', icon: '📋' },
    { label: 'My Documents',    path: '/student/documents',    icon: '📁' },
  ],
};

const Sidebar = ({ onClose }) => {
  const { user } = useAuth();
  const [logoutFn] = useLogoutMutation();
  const navigate = useNavigate();

  const links = NAV_LINKS[user?.role] || [];

  const handleLogout = async () => {
    await logoutFn();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 h-full bg-gray-900 text-white flex flex-col overflow-y-auto">

      {/* Brand */}
      <div className="p-5 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-base flex-shrink-0">
            🎓
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">StudyConsult</p>
            <p className="text-[10px] text-gray-400 capitalize">{user?.role} Portal</p>
          </div>
        </div>

        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-2"
          aria-label="Close menu"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-0.5">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={handleNavClick}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
              ].join(' ')
            }
          >
            <span className="text-base w-5 text-center flex-shrink-0">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold uppercase flex-shrink-0">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 py-2 px-3 rounded-lg text-left transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
