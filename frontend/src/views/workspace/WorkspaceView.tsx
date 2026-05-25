import { useEffect, ReactElement } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProject';
import { projectService } from '../../services/projectService';
import { SECTOR } from '../../contexts/ProjectContext';
import SoftwareWorkspace     from './software/SoftwareWorkspace';
import ConstruccionWorkspace from './construccion/ConstruccionWorkspace';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { Sector } from '../../types';

const WORKSPACE_STRATEGY: Record<Sector, ReactElement> = {
  [SECTOR.SOFTWARE]:     <SoftwareWorkspace />,
  [SECTOR.CONSTRUCCION]: <ConstruccionWorkspace />,
};

const WorkspaceView = () => {
  const { projectId }                               = useParams<{ projectId: string }>();
  const { activeProject, activeSector, selectProject } = useProject();
  const navigate                                    = useNavigate();

  useEffect(() => {
    if (!projectId || activeProject?.id === projectId) return;
    (async () => {
      try {
        const project = await projectService.getById(projectId);
        selectProject(project);
      } catch { navigate('/dashboard'); }
    })();
  }, [projectId, activeProject, selectProject, navigate]);

  if (!activeProject || activeProject.id !== projectId) {
    return <LoadingSpinner text="Cargando workspace..." />;
  }

  const workspace = activeSector ? WORKSPACE_STRATEGY[activeSector] : null;

  if (!workspace) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        Sector no reconocido: <code className="bg-gray-100 px-2 py-0.5 rounded">{activeSector}</code>
      </div>
    );
  }

  return workspace;
};

export default WorkspaceView;
