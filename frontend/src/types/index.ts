// ── Auth ──────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ── Proyectos ─────────────────────────────────────────────────────────
export type Sector = 'SOFTWARE' | 'CONSTRUCCION';

export interface Project {
  id: string;
  name: string;
  client: string;
  budget: number;
  endDate: string;
  sector: Sector;
  createdAt: string;
}

export interface CreateProjectPayload {
  name: string;
  client: string;
  budget: number;
  endDate: string;
  sector: Sector;
}

// ── Sector SOFTWARE ───────────────────────────────────────────────────
export type TaskStatus   = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskType     = 'FEATURE' | 'BUG' | 'TASK';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface CreateTaskPayload {
  title: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
}

// ── Sector CONSTRUCCION ───────────────────────────────────────────────
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
  status?: HitoStatus;
}

export type MaterialType   = 'MATERIAL' | 'PLANO';
export type MaterialStatus = 'SOLICITADO' | 'EN_CAMINO' | 'RECIBIDO';

export interface Material {
  id: string;
  projectId: string;
  name: string;
  type: MaterialType;
  quantity: number | null;
  unit: string | null;
  status: MaterialStatus;
}
