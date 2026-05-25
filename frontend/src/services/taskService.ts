import api from './api';
import type { Task, TaskStatus, CreateTaskPayload } from '../types';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const _delay = (ms = 350): Promise<void> => new Promise((r) => setTimeout(r, ms));

let _tasks: Task[] = [
  { id: 't1', projectId: 'p1', title: 'Diseño del sistema de autenticación',   type: 'FEATURE', status: 'DONE',        priority: 'HIGH'   },
  { id: 't2', projectId: 'p1', title: 'Módulo de carrito de compras',           type: 'FEATURE', status: 'IN_PROGRESS', priority: 'HIGH'   },
  { id: 't3', projectId: 'p1', title: 'Integración pasarela de pago',           type: 'FEATURE', status: 'TODO',        priority: 'HIGH'   },
  { id: 't4', projectId: 'p1', title: 'Bug: precios no redondean correctamente',type: 'BUG',     status: 'TODO',        priority: 'MEDIUM' },
  { id: 't5', projectId: 'p1', title: 'Optimizar consultas de productos',       type: 'TASK',    status: 'BACKLOG',     priority: 'LOW'    },
  { id: 't6', projectId: 'p1', title: 'Tests unitarios del módulo de usuarios', type: 'TASK',    status: 'BACKLOG',     priority: 'MEDIUM' },
];

export const taskService = {
  async getByProject(projectId: string): Promise<Task[]> {
    if (USE_MOCKS) { await _delay(); return _tasks.filter((t) => t.projectId === projectId); }
    return api.get<Task[], Task[]>(`/projects/${projectId}/tasks`);
  },

  async create(projectId: string, data: CreateTaskPayload): Promise<Task> {
    if (USE_MOCKS) {
      await _delay();
      const task: Task = { id: `t${Date.now()}`, projectId, ...data };
      _tasks.push(task);
      return { ...task };
    }
    return api.post<Task, Task>(`/projects/${projectId}/tasks`, data);
  },

  async updateStatus(taskId: string, status: TaskStatus): Promise<Task> {
    if (USE_MOCKS) {
      await _delay(200);
      _tasks = _tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
      return _tasks.find((t) => t.id === taskId)!;
    }
    return api.patch<Task, Task>(`/tasks/${taskId}`, { status });
  },

  async remove(taskId: string): Promise<void> {
    if (USE_MOCKS) { await _delay(200); _tasks = _tasks.filter((t) => t.id !== taskId); return; }
    return api.delete(`/tasks/${taskId}`);
  },
};
