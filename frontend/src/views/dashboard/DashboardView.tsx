import { useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProject';
import { projectService } from '../../services/projectService';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { Project, Sector } from '../../types';

const SECTOR_META: Record<Sector, { label: string; variant: string; icon: string }> = {
  SOFTWARE:     { label: 'Software',     variant: 'software',     icon: '⬡' },
  CONSTRUCCION: { label: 'Construcción', variant: 'construccion', icon: '⬢' },
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

const DashboardView = () => {
  const { projects, loadProjects, selectProject, removeProject } = useProject();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await projectService.getAll();
        loadProjects(data);
      } catch { setError('No se pudieron cargar los proyectos.'); }
      finally   { setIsLoading(false); }
    })();
  }, [loadProjects]);

  const handleOpen = (project: Project) => {
    selectProject(project);
    navigate(`/workspace/${project.id}`);
  };

  const handleDelete = async (e: MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar este proyecto?')) return;
    await projectService.remove(projectId);
    removeProject(projectId);
  };

  if (isLoading) return <LoadingSpinner text="Cargando proyectos..." />;
  if (error)     return <div className="text-center py-16 text-red-500 text-sm">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'}</p>
        <Button size="sm" onClick={() => navigate('/proyecto/nuevo')}>+ Nuevo proyecto</Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm mb-3">Sin proyectos aún</p>
          <Button size="sm" onClick={() => navigate('/proyecto/nuevo')}>Crea tu primer proyecto</Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((project) => {
            const meta = SECTOR_META[project.sector];
            return (
              <div key={project.id} onClick={() => handleOpen(project)}
                className="group bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all">
                <span className={`text-2xl shrink-0 ${project.sector === 'SOFTWARE' ? 'text-indigo-400' : 'text-amber-400'}`}>{meta.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-gray-900 truncate">{project.name}</span>
                    <Badge label={meta.label} variant={meta.variant} />
                  </div>
                  <p className="text-xs text-gray-400 truncate">Cliente: {project.client}</p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-sm font-medium text-gray-700">{formatCurrency(project.budget)}</span>
                  <span className="text-xs text-gray-400">Cierre: {formatDate(project.endDate)}</span>
                </div>
                <button onClick={(e) => handleDelete(e, project.id)}
                  className="ml-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardView;
