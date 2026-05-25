interface LoadingSpinnerProps { text?: string; }

const LoadingSpinner = ({ text = 'Cargando...' }: LoadingSpinnerProps) => (
  <div className="flex flex-col items-center gap-3 py-16">
    <span className="w-8 h-8 border-[3px] border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
    {text && <p className="text-sm text-gray-400">{text}</p>}
  </div>
);

export default LoadingSpinner;
