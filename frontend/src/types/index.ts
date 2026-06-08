// ==========================================
// AUTENTICACIÓN Y USUARIOS
// ==========================================
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ==========================================
// PROYECTOS
// ==========================================
export type Sector = 'SOFTWARE' | 'CONSTRUCCION';

export interface Project {
  id: string;
  name: string;
  client: string;
  budget: number;
  endDate: string;
  sector: Sector;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectPayload {
  name: string;
  client: string;
  budget: number;
  endDate: string;
  sector: Sector;
}

// ==========================================
// SECTOR: SOFTWARE (Kanban y Tareas Ágiles)
// ==========================================
// Nota: Se incluyen valores en español/inglés para soportar tanto los mocks del frontend como la base del backend
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BACKLOG';
export type TaskType = 'FEATURE' | 'BUG' | 'TAREA' | 'TASK';
export type TaskPriority = 'ALTA' | 'MEDIA' | 'BAJA' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
}

// ==========================================
// SECTOR: CONSTRUCCIÓN (Hitos y Materiales)
// ==========================================
export type HitoStatus = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';

export interface Hito {
  id: string;
  projectId: string;
  name: string;
  status: HitoStatus;
  startDate: string;
  endDate: string;
  progress: number;
}

export interface CreateHitoPayload {
  name: string;
  startDate: string;
  endDate: string;
}

export type MaterialType = 'MATERIAL' | 'PLANO';
export type MaterialStatus = 'SOLICITADO' | 'EN_CAMINO' | 'RECIBIDO';

export interface Material {
  id: string;
  projectId: string;
  type: MaterialType;
  name: string;
  quantity: number | null;
  unit: string | null;
  status: MaterialStatus;
}