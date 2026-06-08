import { api } from './api';
import type { Project, Sector } from '../types';

export interface CreateProjectPayload {
  name: string;
  client: string;
  budget: number;
  endDate: string;
  sector: Sector;
}

export const projectService = {
  /**
   * Obtiene todos los proyectos vinculados al usuario autenticado.
   */
  async getProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  /**
   * Obtiene la información detallada de un proyecto por su ID.
   */
  async getProjectById(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo proyecto asociado al usuario actual.
   */
  async createProject(payload: CreateProjectPayload): Promise<Project> {
    const response = await api.post<Project>('/projects', payload);
    return response.data;
  },

  /**
   * Elimina un proyecto por su ID.
   */
  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  }
};