import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/authContext';

export default function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();
  // if (loading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
