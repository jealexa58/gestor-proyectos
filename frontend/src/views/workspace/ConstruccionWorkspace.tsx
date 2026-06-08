import type { Project } from '../../types';

interface Props {
  project: Project;
}

const ConstruccionWorkspace = ({ project }: Props) => {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Control de Obra</h2>
        <div className="flex gap-2">
          <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700">+ Nuevo Hito</button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">+ Agregar Material</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
          <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Cronograma de Hitos</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
          <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Materiales y Planos</h3>
        </div>
      </div>
    </div>
  );
};

export default ConstruccionWorkspace;