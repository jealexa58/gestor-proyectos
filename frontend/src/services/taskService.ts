import { api } from './api';
import type { Task, CreateTaskPayload } from '../types';

export const taskService = {
  /**
   * Obtiene todas las tareas asociadas a un proyecto específico.
   */
  async getTasksByProject(projectId: string): Promise<Task[]> {
    const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
  },

  /**
   * Crea una nueva tarea en un proyecto.
   */
  async createTask(projectId: string, payload: CreateTaskPayload): Promise<Task> {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, payload);
    return response.data;
  },

  /**
   * Actualiza una tarea existente (ej. cambiar estado al mover en el Kanban).
   */
  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${taskId}`, updates);
    return response.data;
  },

  /**
   * Elimina una tarea por su ID.
   */
  async deleteTask(taskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  }
};