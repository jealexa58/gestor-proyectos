const VARIANTS: Record<string, string> = {
  default:      'bg-gray-100 text-gray-600',
  software:     'bg-indigo-50 text-indigo-700',
  construccion: 'bg-amber-50 text-amber-700',
  done:         'bg-emerald-50 text-emerald-700',
  in_progress:  'bg-blue-50 text-blue-700',
  todo:         'bg-gray-100 text-gray-600',
  backlog:      'bg-slate-100 text-slate-600',
  blocked:      'bg-red-50 text-red-700',
  bug:          'bg-red-50 text-red-700',
  feature:      'bg-indigo-50 text-indigo-700',
  task:         'bg-gray-100 text-gray-600',
  high:         'bg-red-50 text-red-600',
  medium:       'bg-yellow-50 text-yellow-700',
  low:          'bg-gray-100 text-gray-500',
  completado:   'bg-emerald-50 text-emerald-700',
  en_curso:     'bg-blue-50 text-blue-700',
  pendiente:    'bg-gray-100 text-gray-600',
  recibido:     'bg-emerald-50 text-emerald-700',
  en_camino:    'bg-blue-50 text-blue-700',
  solicitado:   'bg-gray-100 text-gray-600',
  material:     'bg-stone-100 text-stone-600',
  plano:        'bg-amber-50 text-amber-700',
};

type Size = 'sm' | 'md';
const SIZES: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-[0.7rem]',
  md: 'px-3 py-1 text-xs',
};

interface BadgeProps {
  label:    string;
  variant?: string;
  size?:    Size;
}

const Badge = ({ label, variant = 'default', size = 'sm' }: BadgeProps) => (
  <span className={`inline-flex items-center rounded-full font-medium ${VARIANTS[variant] ?? VARIANTS.default} ${SIZES[size]}`}>
    {label}
  </span>
);

export default Badge;
