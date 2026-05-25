import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, id, className = '', ...props }: InputProps) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && (
      <label htmlFor={id} className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </label>
    )}
    <input
      id={id}
      className={[
        'px-3 py-2 rounded-lg border bg-white text-sm text-gray-900',
        'placeholder:text-gray-400 outline-none transition',
        'focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
        error ? 'border-red-400 focus:ring-red-400' : 'border-gray-200',
      ].join(' ')}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export default Input;
