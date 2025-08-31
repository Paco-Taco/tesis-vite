import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/authContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">Cargando sesión…</div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
