import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import PrivateRoute from './views/auth/PrivateRoute';

// Vistas de Autenticación
import LoginView from './views/auth/LoginView';
import RegisterView from './views/auth/RegisterView';

// Vistas Privadas (Ajusta las rutas de importación según tu estructura actual)
import DashboardView from './views/dashboard/DashboardView'; 
import CreateProjectView from './views/project/CreateProjectView';
import WorkspaceView from './views/workspace/WorkspaceView';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />

            {/* Rutas Privadas */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/projects/new" element={<CreateProjectView />} />
              <Route path="/workspace/:id" element={<WorkspaceView />} />
            </Route>

            {/* Redirección por defecto: Si entra a '/' o una ruta que no existe, se va al dashboard (o al login si no está autenticado) */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;