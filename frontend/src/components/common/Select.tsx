import { SelectHTMLAttributes } from 'react';

interface SelectOption { value: string; label: string; }

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?:       string;
  error?:       string;
  options?:     SelectOption[];
  placeholder?: string;
}

const Select = ({ label, error, id, options = [], placeholder, className = '', ...props }: SelectProps) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && (
      <label htmlFor={id} className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </label>
    )}
    <select
      id={id}
      className={[
        'px-3 py-2 rounded-lg border bg-white text-sm text-gray-900',
        'outline-none transition cursor-pointer appearance-none',
        'focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
        error ? 'border-red-400' : 'border-gray-200',
      ].join(' ')}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export default Select;
