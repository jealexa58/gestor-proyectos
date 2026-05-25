import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useProject } from '../../../hooks/useProject';
import { taskService } from '../../../services/taskService';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import type { Task, TaskStatus, TaskType, TaskPriority, CreateTaskPayload } from '../../../types';

interface Column { id: TaskStatus; label: string; color: string; }

const COLUMNS: Column[] = [
  { id: 'BACKLOG',     label: 'Backlog',     color: 'border-t-slate-400'   },
  { id: 'TODO',        label: 'Por hacer',   color: 'border-t-gray-400'    },
  { id: 'IN_PROGRESS', label: 'En progreso', color: 'border-t-blue-500'    },
  { id: 'DONE',        label: 'Completado',  color: 'border-t-emerald-500' },
];

const TYPE_OPTIONS:   TaskType[]     = ['FEATURE', 'BUG', 'TASK'];
const PRIO_OPTIONS:   TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = COLUMNS.map((c) => ({ value: c.id, label: c.label }));

const EMPTY_FORM: CreateTaskPayload = { title: '', type: 'FEATURE', priority: 'MEDIUM', status: 'BACKLOG' };

// ── Tarjeta de tarea ──────────────────────────────────────────────────
interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({ task, onStatusChange, onDelete }: TaskCardProps) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-3 space-y-2 group hover:border-gray-200 hover:shadow-sm transition-all">
    <div className="flex items-start justify-between gap-2">
      <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>
      <button onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all shrink-0 text-xs">✕</button>
    </div>
    <div className="flex items-center gap-1.5 flex-wrap">
      <Badge label={task.type}     variant={task.type.toLowerCase()} />
      <Badge label={task.priority} variant={task.priority.toLowerCase()} />
    </div>
    <select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
      className="w-full text-xs border border-gray-100 rounded-lg px-2 py-1 bg-gray-50 text-gray-500 cursor-pointer outline-none hover:border-gray-300 transition"
      onClick={(e) => e.stopPropagation()}>
      {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  </div>
);

// ── Formulario nueva tarea ────────────────────────────────────────────
interface AddTaskFormProps { onAdd: (data: CreateTaskPayload) => void; onCancel: () => void; isLoading: boolean; }

const AddTaskForm = ({ onAdd, onCancel, isLoading }: AddTaskFormProps) => {
  const [form, setForm] = useState<CreateTaskPayload>(EMPTY_FORM);
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e: FormEvent) => { e.preventDefault(); if (form.title.trim()) onAdd(form); };

  return (
    <form onSubmit={handleSubmit} className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-3">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Título de la tarea..." autoFocus
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-indigo-400" />
      <div className="grid grid-cols-2 gap-2">
        <select name="type" value={form.type} onChange={handleChange}
          className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white outline-none cursor-pointer">
          {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select name="priority" value={form.priority} onChange={handleChange}
          className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white outline-none cursor-pointer">
          {PRIO_OPTIONS.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={isLoading} fullWidth>Agregar</Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
};

// ── Vista principal ───────────────────────────────────────────────────
const SoftwareWorkspace = () => {
  const { activeProject }                     = useProject();
  const [tasks, setTasks]                     = useState<Task[]>([]);
  const [isLoading, setIsLoading]             = useState(true);
  const [showForm, setShowForm]               = useState(false);
  const [addingTask, setAddingTask]           = useState(false);

  useEffect(() => {
    if (!activeProject) return;
    (async () => {
      try { setTasks(await taskService.getByProject(activeProject.id)); }
      finally { setIsLoading(false); }
    })();
  }, [activeProject]);

  const handleAddTask = async (data: CreateTaskPayload) => {
    if (!activeProject) return;
    setAddingTask(true);
    try { setTasks((prev) => [await taskService.create(activeProject.id, data), ...prev]); setShowForm(false); }
    finally { setAddingTask(false); }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status } : t));
    await taskService.updateStatus(taskId, status);
  };

  const handleDelete = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await taskService.remove(taskId);
  };

  if (isLoading) return <LoadingSpinner text="Cargando backlog..." />;

  const byStatus = (s: TaskStatus) => tasks.filter((t) => t.status === s);
  const completion = tasks.length ? Math.round((byStatus('DONE').length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {COLUMNS.map((col) => (
          <div key={col.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400 mb-0.5">{col.label}</p>
            <p className="text-2xl font-bold text-gray-800">{byStatus(col.id).length}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex items-center gap-4">
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${completion}%` }} />
        </div>
        <span className="text-sm font-semibold text-gray-600 shrink-0">{completion}% completado</span>
        <Button size="sm" onClick={() => setShowForm(true)} className="shrink-0">+ Tarea</Button>
      </div>

      {showForm && <AddTaskForm onAdd={handleAddTask} onCancel={() => setShowForm(false)} isLoading={addingTask} />}

      <div className="grid grid-cols-4 gap-3">
        {COLUMNS.map((col) => {
          const colTasks = byStatus(col.id);
          return (
            <div key={col.id} className={`bg-gray-50 rounded-xl border-t-4 ${col.color} border border-gray-100 p-3 space-y-2`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{col.label}</span>
                <span className="text-xs text-gray-400 bg-white border border-gray-100 rounded-full px-2 py-0.5">{colTasks.length}</span>
              </div>
              {colTasks.length === 0 && <p className="text-xs text-gray-300 text-center py-6">Sin tareas</p>}
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SoftwareWorkspace;
