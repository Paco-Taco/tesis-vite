import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/authContext';

export default function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a full-screen loader/spinner
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
