import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import type { Project } from '../../types';
import SoftwareWorkspace from './SoftwareWorkspace';
import ConstruccionWorkspace from './ConstruccionWorkspace';

const WorkspaceView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const data = await projectService.getProjectById(id);
        setProject(data);
      } catch (err: any) {
        setError('No se pudo cargar el proyecto.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando espacio de trabajo...</div>;
  if (error || !project) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Proyecto no encontrado'}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-sm text-gray-500">Cliente: {project.client} | Cierre: {new Date(project.endDate).toLocaleDateString()}</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
          ← Volver al Dashboard
        </button>
      </header>

      <main className="flex-1 overflow-hidden">
        {project.sector === 'SOFTWARE' ? <SoftwareWorkspace project={project} /> : <ConstruccionWorkspace project={project} />}
      </main>
    </div>
  );
};

export default WorkspaceView;