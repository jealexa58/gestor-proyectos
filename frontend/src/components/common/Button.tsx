import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:   'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800',
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
  ghost:     'text-gray-500 hover:bg-gray-100',
  danger:    'bg-red-50 text-red-600 hover:bg-red-100',
};

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  fullWidth?: boolean;
}

const Button = ({
  children, variant = 'primary', size = 'md',
  loading = false, fullWidth = false,
  disabled, className = '', ...rest
}: ButtonProps) => (
  <button
    disabled={disabled || loading}
    className={[
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
      'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98]',
      VARIANTS[variant], SIZES[size],
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ')}
    {...rest}
  >
    {loading
      ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      : children}
  </button>
);

export default Button;
