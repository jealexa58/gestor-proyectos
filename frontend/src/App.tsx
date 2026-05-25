import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }    from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { useAuth }         from './hooks/useAuth';
import AppLayout           from './components/layout/AppLayout';
import LoginView           from './views/auth/LoginView';
import RegisterView        from './views/auth/RegisterView';
import DashboardView       from './views/dashboard/DashboardView';
import CreateProjectView   from './views/project/CreateProjectView';
import WorkspaceView       from './views/workspace/WorkspaceView';
import type { ReactNode }  from 'react';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login"    element={<PublicRoute><LoginView /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterView /></PublicRoute>} />

    <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
      <Route path="/dashboard"            element={<DashboardView />} />
      <Route path="/proyecto/nuevo"       element={<CreateProjectView />} />
      <Route path="/workspace/:projectId" element={<WorkspaceView />} />
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ProjectProvider>
        <AppRoutes />
      </ProjectProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
