import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useProject } from '../../../hooks/useProject';
import { hitoService } from '../../../services/hitoService';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import type { Hito, HitoStatus, Material, CreateHitoPayload } from '../../../types';

const HITO_META: Record<HitoStatus, { bar: string; badge: string; label: string }> = {
  PENDIENTE:  { bar: 'bg-gray-300',    badge: 'pendiente',  label: 'Pendiente'  },
  EN_CURSO:   { bar: 'bg-amber-400',   badge: 'en_curso',   label: 'En curso'   },
  COMPLETADO: { bar: 'bg-emerald-500', badge: 'completado', label: 'Completado' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });

// ── Tarjeta de hito ───────────────────────────────────────────────────
interface HitoCardProps { hito: Hito; onProgressChange: (id: string, p: number) => void; }

const HitoCard = ({ hito, onProgressChange }: HitoCardProps) => {
  const meta = HITO_META[hito.status];
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{hito.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(hito.startDate)} → {formatDate(hito.endDate)}</p>
        </div>
        <Badge label={meta.label} variant={meta.badge} />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Avance</span>
          <span className="text-xs font-semibold text-gray-600">{hito.progress}%</span>
        </div>
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-2 rounded-full transition-all duration-500 ${meta.bar}`} style={{ width: `${hito.progress}%` }} />
        </div>
        <input type="range" min="0" max="100" step="5" value={hito.progress}
          onChange={(e) => onProgressChange(hito.id, Number(e.target.value))}
          className="w-full h-1 appearance-none cursor-pointer accent-amber-500 mt-1" />
      </div>
    </div>
  );
};

// ── Fila de material/plano ────────────────────────────────────────────
const MaterialRow = ({ item }: { item: Material }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <Badge label={item.type} variant={item.type.toLowerCase()} />
    <span className="flex-1 text-sm text-gray-700 truncate">{item.name}</span>
    {item.quantity != null && <span className="text-xs text-gray-400 shrink-0">{item.quantity} {item.unit}</span>}
    <Badge label={item.status.replace('_', ' ')} variant={item.status.toLowerCase()} />
  </div>
);

// ── Formulario nuevo hito ─────────────────────────────────────────────
interface AddHitoFormProps { onAdd: (d: CreateHitoPayload) => void; onCancel: () => void; isLoading: boolean; }

const AddHitoForm = ({ onAdd, onCancel, isLoading }: AddHitoFormProps) => {
  const [form, setForm] = useState<CreateHitoPayload>({ name: '', startDate: '', endDate: '' });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim() && form.startDate && form.endDate) onAdd(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-3">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre del hito..." autoFocus
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-amber-400" />
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Inicio</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
            className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Fin estimado</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
            className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white outline-none" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={isLoading} fullWidth className="!bg-amber-500 hover:!bg-amber-600">Agregar hito</Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
};

// ── Vista principal ───────────────────────────────────────────────────
type Tab = 'hitos' | 'materiales' | 'planos';

const ConstruccionWorkspace = () => {
  const { activeProject }                   = useProject();
  const [hitos, setHitos]                   = useState<Hito[]>([]);
  const [materiales, setMateriales]         = useState<Material[]>([]);
  const [isLoading, setIsLoading]           = useState(true);
  const [showForm, setShowForm]             = useState(false);
  const [addingHito, setAddingHito]         = useState(false);
  const [activeTab, setActiveTab]           = useState<Tab>('hitos');

  useEffect(() => {
    if (!activeProject) return;
    (async () => {
      try {
        const [h, m] = await Promise.all([
          hitoService.getHitosByProject(activeProject.id),
          hitoService.getMaterialesByProject(activeProject.id),
        ]);
        setHitos(h); setMateriales(m);
      } finally { setIsLoading(false); }
    })();
  }, [activeProject]);

  const handleProgressChange = async (hitoId: string, progress: number) => {
    const status: HitoStatus = progress === 100 ? 'COMPLETADO' : progress > 0 ? 'EN_CURSO' : 'PENDIENTE';
    setHitos((prev) => prev.map((h) => h.id === hitoId ? { ...h, progress, status } : h));
    await hitoService.updateHitoProgress(hitoId, progress);
  };

  const handleAddHito = async (data: CreateHitoPayload) => {
    if (!activeProject) return;
    setAddingHito(true);
    try { setHitos((prev) => [...prev, await hitoService.createHito(activeProject.id, data)]); setShowForm(false); }
    finally { setAddingHito(false); }
  };

  if (isLoading) return <LoadingSpinner text="Cargando cronograma..." />;

  const avanceGeneral = hitos.length ? Math.round(hitos.reduce((a, h) => a + h.progress, 0) / hitos.length) : 0;
  const materialesList = materiales.filter((m) => m.type === 'MATERIAL');
  const planosList     = materiales.filter((m) => m.type === 'PLANO');

  const TABS: { id: Tab; label: string }[] = [
    { id: 'hitos',      label: `Hitos (${hitos.length})`           },
    { id: 'materiales', label: `Materiales (${materialesList.length})` },
    { id: 'planos',     label: `Planos (${planosList.length})`     },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-400 mb-0.5">Total hitos</p>
          <p className="text-2xl font-bold text-gray-800">{hitos.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-400 mb-0.5">Completados</p>
          <p className="text-2xl font-bold text-emerald-600">{hitos.filter((h) => h.status === 'COMPLETADO').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-400 mb-0.5">Avance general</p>
          <p className="text-2xl font-bold text-amber-600">{avanceGeneral}%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex items-center gap-4">
        <div className="flex-1 bg-gray-100 rounded-full h-2.5">
          <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${avanceGeneral}%` }} />
        </div>
        <span className="text-sm font-semibold text-gray-600 shrink-0">{avanceGeneral}% de obra</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              {tab.label}
            </button>
          ))}
          {activeTab === 'hitos' && (
            <div className="ml-auto px-4 flex items-center">
              <Button size="sm" onClick={() => setShowForm(true)} className="!bg-amber-500 hover:!bg-amber-600">+ Hito</Button>
            </div>
          )}
        </div>

        <div className="p-4">
          {activeTab === 'hitos' && (
            <div className="space-y-3">
              {showForm && <AddHitoForm onAdd={handleAddHito} onCancel={() => setShowForm(false)} isLoading={addingHito} />}
              {hitos.length === 0 && !showForm && <p className="text-center text-sm text-gray-300 py-10">Sin hitos registrados</p>}
              {hitos.map((hito) => <HitoCard key={hito.id} hito={hito} onProgressChange={handleProgressChange} />)}
            </div>
          )}
          {activeTab === 'materiales' && (
            <div>
              {materialesList.length === 0 && <p className="text-center text-sm text-gray-300 py-10">Sin materiales registrados</p>}
              {materialesList.map((m) => <MaterialRow key={m.id} item={m} />)}
            </div>
          )}
          {activeTab === 'planos' && (
            <div>
              {planosList.length === 0 && <p className="text-center text-sm text-gray-300 py-10">Sin planos registrados</p>}
              {planosList.map((p) => <MaterialRow key={p.id} item={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConstruccionWorkspace;
