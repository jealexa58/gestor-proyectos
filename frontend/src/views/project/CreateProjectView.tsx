import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProject';
import { projectService } from '../../services/projectService';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import type { Sector, CreateProjectPayload } from '../../types';

const SECTOR_OPTIONS = [
  { value: 'SOFTWARE',     label: '⬡  Software — Desarrollo & Producto'       },
  { value: 'CONSTRUCCION', label: '⬢  Construcción — Obras & Ingeniería civil' },
];

const SECTOR_PREVIEW: Record<Sector, { color: string; text: string; desc: string }> = {
  SOFTWARE:     { color: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', desc: 'Backlog ágil, Kanban de tareas, seguimiento de bugs y sprints.'         },
  CONSTRUCCION: { color: 'bg-amber-50 border-amber-200',   text: 'text-amber-700',  desc: 'Cronograma de hitos, control de materiales y gestión de planos.'         },
};

interface FormState { name: string; client: string; budget: string; endDate: string; sector: string; }
type FieldErrors = Partial<FormState>;

const INITIAL: FormState = { name: '', client: '', budget: '', endDate: '', sector: '' };

const CreateProjectView = () => {
  const { addProject, selectProject } = useProject();
  const navigate = useNavigate();

  const [form, setForm]               = useState<FormState>(INITIAL);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading]     = useState(false);
  const [apiError, setApiError]       = useState<string | null>(null);

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!form.name.trim())                        errs.name    = 'El nombre es requerido';
    if (!form.client.trim())                      errs.client  = 'El cliente es requerido';
    if (!form.budget || isNaN(Number(form.budget))) errs.budget = 'Ingresa un presupuesto válido';
    if (!form.endDate)                            errs.endDate = 'La fecha de cierre es requerida';
    if (!form.sector)                             errs.sector  = 'Selecciona un sector';
    return errs;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFieldErrors({}); setApiError(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setIsLoading(true);
    try {
      const payload: CreateProjectPayload = { ...form, budget: Number(form.budget), sector: form.sector as Sector };
      const created = await projectService.create(payload);
      addProject(created);
      selectProject(created);
      navigate(`/workspace/${created.id}`);
    } catch { setApiError('Error al crear el proyecto. Inténtalo de nuevo.'); }
    finally { setIsLoading(false); }
  };

  const preview = form.sector ? SECTOR_PREVIEW[form.sector as Sector] : null;

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {apiError && (
          <div className="mb-5 px-4 py-2.5 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">{apiError}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input id="name" name="name" label="Nombre del proyecto" placeholder="Portal E-Commerce V2"
            value={form.name} onChange={handleChange} error={fieldErrors.name} />
          <Input id="client" name="client" label="Cliente" placeholder="RetailCorp S.A."
            value={form.client} onChange={handleChange} error={fieldErrors.client} />
          <div className="grid grid-cols-2 gap-4">
            <Input id="budget" name="budget" type="number" label="Presupuesto (COP)" placeholder="48000000"
              value={form.budget} onChange={handleChange} error={fieldErrors.budget} />
            <Input id="endDate" name="endDate" type="date" label="Fecha de cierre"
              value={form.endDate} onChange={handleChange} error={fieldErrors.endDate} />
          </div>
          <Select id="sector" name="sector" label="Sector económico"
            placeholder="— Elige el sector del proyecto —"
            options={SECTOR_OPTIONS} value={form.sector}
            onChange={handleChange} error={fieldErrors.sector} />

          {preview && (
            <div className={`rounded-xl border p-4 ${preview.color} transition-all`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${preview.text}`}>Workspace que se activará</p>
              <p className="text-sm text-gray-600">{preview.desc}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => navigate('/dashboard')} type="button">Cancelar</Button>
            <Button type="submit" loading={isLoading} fullWidth>Crear proyecto →</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectView;
