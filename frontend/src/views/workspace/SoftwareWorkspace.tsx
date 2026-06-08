import { useEffect, useState } from 'react';
import type { Project, Task } from '../../types';
import { taskService } from '../../services/taskService';

interface Props {
  project: Project;
}

const COLUMNS = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'] as const;

const SoftwareWorkspace = ({ project }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await taskService.getTasksByProject(project.id);
        setTasks(data);
      } catch (err: any) {
        setError('No se pudieron cargar las tareas. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [project.id]);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Tablero Ágil (Kanban)</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">+ Nueva Tarea</button>
      </div>
      
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start">
        {isLoading ? (
          <div className="text-gray-500 w-full text-center mt-10">Cargando tablero...</div>
        ) : (
          COLUMNS.map((status) => {
            // Filtramos las tareas que pertenecen a esta columna
            const columnTasks = tasks.filter((t) => t.status === status);
            
            return (
              <div key={status} className="bg-gray-100 rounded-xl w-80 flex-shrink-0 flex flex-col max-h-full border border-gray-200">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <span className="font-semibold text-gray-700 text-sm">{status}</span>
                  <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                </div>
                <div className="p-3 flex-1 overflow-y-auto min-h-[150px] flex flex-col gap-3">
                  {columnTasks.length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center mt-4">Sin tareas</p>
                  ) : (
                    columnTasks.map((task) => (
                      <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-grab hover:border-indigo-300 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide
                            ${task.type === 'BUG' ? 'bg-red-100 text-red-700' : task.type === 'FEATURE' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                            {task.type}
                          </span>
                          <span className={`text-[10px] uppercase font-bold ${task.priority === 'ALTA' || task.priority === 'HIGH' ? 'text-red-500' : task.priority === 'MEDIA' || task.priority === 'MEDIUM' ? 'text-amber-500' : 'text-blue-500'}`}>
                            {task.priority}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-800 leading-snug">{task.title}</h4>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SoftwareWorkspace;