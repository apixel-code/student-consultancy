import { useAuth } from './useAuth.js';

export const useRole = () => {
  const { role } = useAuth();

  return {
    role,
    isAdmin: role === 'admin',
    isCounselor: role === 'counselor',
    isStudent: role === 'student',
    hasRole: (...roles) => roles.includes(role),
  };
};
