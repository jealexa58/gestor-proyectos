import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

interface RegisterForm { name: string; email: string; password: string; confirm: string; }
type FieldErrors = Partial<RegisterForm>;

const RegisterView = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]               = useState<RegisterForm>({ name: '', email: '', password: '', confirm: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!form.name)                    errs.name     = 'El nombre es requerido';
    if (!form.email)                   errs.email    = 'El correo es requerido';
    if (form.password.length < 6)      errs.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirm) errs.confirm = 'Las contraseñas no coinciden';
    return errs;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearError(); setFieldErrors({});
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    const result = await register({ name: form.name, email: form.email, password: form.password });
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-7 bg-indigo-600 rounded-full" />
            <span className="text-xl font-bold text-gray-900">GestorPro</span>
          </div>
          <p className="text-sm text-gray-500">Crea tu cuenta gratis</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input id="name" name="name" label="Nombre completo" placeholder="Ana García"
              value={form.name} onChange={handleChange} error={fieldErrors.name} />
            <Input id="email" name="email" type="email" label="Correo electrónico" placeholder="ana@empresa.com"
              value={form.email} onChange={handleChange} error={fieldErrors.email} />
            <Input id="password" name="password" type="password" label="Contraseña" placeholder="Mínimo 6 caracteres"
              value={form.password} onChange={handleChange} error={fieldErrors.password} />
            <Input id="confirm" name="confirm" type="password" label="Confirmar contraseña" placeholder="••••••••"
              value={form.confirm} onChange={handleChange} error={fieldErrors.confirm} />
            <Button type="submit" fullWidth loading={isLoading} className="mt-2">Crear cuenta</Button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-5">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
