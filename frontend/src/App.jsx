import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRouter from './routes/AppRouter.jsx';
import { useRefreshTokenMutation } from './features/auth/authApi.js';
import { useAuth } from './hooks/useAuth.js';
import { logout } from './features/auth/authSlice.js';
import ScrollToTop from './components/ScrollToTop.jsx';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [refreshToken] = useRefreshTokenMutation();

  // Silently refresh access token every 14 minutes while logged in
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        await refreshToken().unwrap();
      } catch {
        dispatch(logout());
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshToken, dispatch]);

  return (
    <>
      <ScrollToTop />
      <AppRouter />
    </>
  );
};

export default App;
