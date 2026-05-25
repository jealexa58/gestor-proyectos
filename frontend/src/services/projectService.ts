import api from './api';
import type { Project, CreateProjectPayload } from '../types';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const _delay = (ms = 400): Promise<void> => new Promise((r) => setTimeout(r, ms));

let _projects: Project[] = [
  { id: 'p1', name: 'Portal E-Commerce V2',  client: 'RetailCorp',        budget: 48_000,     endDate: '2025-09-30', sector: 'SOFTWARE',     createdAt: '2025-01-10' },
  { id: 'p2', name: 'Edificio Torre Norte',   client: 'Constructora Andina', budget: 2_800_000, endDate: '2026-03-15', sector: 'CONSTRUCCION', createdAt: '2025-02-01' },
];

export const projectService = {
  async getAll(): Promise<Project[]> {
    if (USE_MOCKS) { await _delay(); return [..._projects]; }
    return api.get<Project[], Project[]>('/projects');
  },

  async getById(id: string): Promise<Project> {
    if (USE_MOCKS) {
      await _delay();
      const p = _projects.find((x) => x.id === id);
      if (!p) throw { response: { data: { message: 'Proyecto no encontrado' } } };
      return { ...p };
    }
    return api.get<Project, Project>(`/projects/${id}`);
  },

  async create(data: CreateProjectPayload): Promise<Project> {
    if (USE_MOCKS) {
      await _delay();
      const newProject: Project = { id: `p${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], ...data };
      _projects.push(newProject);
      return { ...newProject };
    }
    return api.post<Project, Project>('/projects', data);
  },

  async remove(id: string): Promise<void> {
    if (USE_MOCKS) { await _delay(); _projects = _projects.filter((p) => p.id !== id); return; }
    return api.delete(`/projects/${id}`);
  },
};
