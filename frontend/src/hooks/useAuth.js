import { useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAccessToken,
  selectUserRole,
  selectAuthLoading,
} from '../features/auth/authSlice.js';

/**
 * Central auth hook.
 *
 * Returns:
 *   user            — full user object from Redux store
 *   isAuthenticated — boolean
 *   accessToken     — current JWT access token string
 *   role            — 'admin' | 'counselor' | 'student' | undefined
 *   isAdmin         — shorthand boolean
 *   isCounselor     — shorthand boolean
 *   isStudent       — shorthand boolean
 *   isLoading       — true while auth state is being resolved
 *   hasRole(roles)  — returns true if user's role is in the given array
 */
const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const accessToken = useSelector(selectAccessToken);
  const role = useSelector(selectUserRole);
  const isLoading = useSelector(selectAuthLoading);

  return {
    user,
    isAuthenticated,
    accessToken,
    role,
    isLoading,
    isAdmin: role === 'admin',
    isCounselor: role === 'counselor',
    isStudent: role === 'student',
    hasRole: (...roles) => roles.flat().includes(role),
  };
};

export default useAuth;
export { useAuth };
