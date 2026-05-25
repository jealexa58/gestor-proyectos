import api from './api';
import type { Hito, HitoStatus, Material, CreateHitoPayload } from '../types';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const _delay = (ms = 350): Promise<void> => new Promise((r) => setTimeout(r, ms));

let _hitos: Hito[] = [
  { id: 'h1', projectId: 'p2', name: 'Replanteo y excavación',   status: 'COMPLETADO', startDate: '2025-02-10', endDate: '2025-03-20', progress: 100 },
  { id: 'h2', projectId: 'p2', name: 'Cimentación y estructura', status: 'EN_CURSO',   startDate: '2025-03-21', endDate: '2025-07-15', progress: 62  },
  { id: 'h3', projectId: 'p2', name: 'Muros y mampostería',      status: 'PENDIENTE',  startDate: '2025-07-16', endDate: '2025-10-30', progress: 0   },
  { id: 'h4', projectId: 'p2', name: 'Instalaciones eléctricas', status: 'PENDIENTE',  startDate: '2025-11-01', endDate: '2026-01-15', progress: 0   },
  { id: 'h5', projectId: 'p2', name: 'Acabados y entrega final', status: 'PENDIENTE',  startDate: '2026-01-16', endDate: '2026-03-15', progress: 0   },
];

const _materiales: Material[] = [
  { id: 'm1', projectId: 'p2', type: 'MATERIAL', name: 'Cemento Portland 50kg',            quantity: 2400,  unit: 'sac', status: 'RECIBIDO'   },
  { id: 'm2', projectId: 'p2', type: 'MATERIAL', name: 'Varilla corrugada 3/8"',           quantity: 850,   unit: 'und', status: 'EN_CAMINO'  },
  { id: 'm3', projectId: 'p2', type: 'MATERIAL', name: 'Bloque de concreto',               quantity: 18000, unit: 'und', status: 'SOLICITADO' },
  { id: 'm4', projectId: 'p2', type: 'PLANO',    name: 'Planos estructurales Rev.3',       quantity: null,  unit: null,  status: 'RECIBIDO'   },
  { id: 'm5', projectId: 'p2', type: 'PLANO',    name: 'Planos arquitectónicos Rev.2',     quantity: null,  unit: null,  status: 'RECIBIDO'   },
  { id: 'm6', projectId: 'p2', type: 'PLANO',    name: 'Planos hidrosanitarios',           quantity: null,  unit: null,  status: 'SOLICITADO' },
];

export const hitoService = {
  async getHitosByProject(projectId: string): Promise<Hito[]> {
    if (USE_MOCKS) { await _delay(); return _hitos.filter((h) => h.projectId === projectId); }
    return api.get<Hito[], Hito[]>(`/projects/${projectId}/hitos`);
  },

  async getMaterialesByProject(projectId: string): Promise<Material[]> {
    if (USE_MOCKS) { await _delay(); return _materiales.filter((m) => m.projectId === projectId); }
    return api.get<Material[], Material[]>(`/projects/${projectId}/materiales`);
  },

  async createHito(projectId: string, data: CreateHitoPayload): Promise<Hito> {
    if (USE_MOCKS) {
      await _delay();
      const hito: Hito = { id: `h${Date.now()}`, projectId, progress: 0, status: 'PENDIENTE', ...data };
      _hitos.push(hito);
      return { ...hito };
    }
    return api.post<Hito, Hito>(`/projects/${projectId}/hitos`, data);
  },

  async updateHitoProgress(hitoId: string, progress: number): Promise<Hito> {
    if (USE_MOCKS) {
      await _delay(200);
      const status: HitoStatus = progress === 100 ? 'COMPLETADO' : progress > 0 ? 'EN_CURSO' : 'PENDIENTE';
      _hitos = _hitos.map((h) => h.id === hitoId ? { ...h, progress, status } : h);
      return _hitos.find((h) => h.id === hitoId)!;
    }
    return api.patch<Hito, Hito>(`/hitos/${hitoId}`, { progress });
  },
};
