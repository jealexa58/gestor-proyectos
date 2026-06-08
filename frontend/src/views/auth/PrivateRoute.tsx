import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AppLayout from '../../components/layout/AppLayout';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  // Si no está autenticado, lo redirigimos a /login. 
  // Usamos "replace" para evitar que el usuario vuelva a esta ruta con el botón "Atrás" del navegador.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza el AppLayout que contiene el Sidebar, Header y Outlet
  return <AppLayout />;
};

export default PrivateRoute;