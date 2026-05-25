import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Project, Sector } from '../types';

export const SECTOR = {
  SOFTWARE:     'SOFTWARE'     as const,
  CONSTRUCCION: 'CONSTRUCCION' as const,
};

interface ProjectContextValue {
  projects: Project[];
  activeProject: Project | null;
  activeSector: Sector | null;
  loadProjects: (list: Project[]) => void;
  addProject: (project: Project) => void;
  selectProject: (project: Project) => void;
  clearActiveProject: () => void;
  removeProject: (projectId: string) => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects]           = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const activeSector: Sector | null = activeProject?.sector ?? null;

  const loadProjects  = useCallback((list: Project[]) => setProjects(list), []);
  const addProject    = useCallback((p: Project) => setProjects((prev) => [p, ...prev]), []);
  const selectProject = useCallback((p: Project) => setActiveProject(p), []);

  const clearActiveProject = useCallback(() => setActiveProject(null), []);

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setActiveProject((prev) => (prev?.id === id ? null : prev));
  }, []);

  return (
    <ProjectContext.Provider value={{ projects, activeProject, activeSector, loadProjects, addProject, selectProject, clearActiveProject, removeProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = (): ProjectContextValue => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjectContext must be inside ProjectProvider');
  return ctx;
};
