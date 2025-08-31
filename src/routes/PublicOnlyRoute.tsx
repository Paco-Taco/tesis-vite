import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/authContext';

export default function PublicOnlyRoute() {
  const { session, loading } = useAuth();
  if (loading) return null;
  return session ? <Navigate to="/" replace /> : <Outlet />;
}
