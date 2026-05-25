import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

interface LoginForm { email: string; password: string; }
type FieldErrors = Partial<LoginForm>;

const LoginView = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]               = useState<LoginForm>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!form.email)    errs.email    = 'El correo es requerido';
    if (!form.password) errs.password = 'La contraseña es requerida';
    return errs;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearError();
    setFieldErrors({});
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    const result = await login(form.email, form.password);
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
          <p className="text-sm text-gray-500">Inicia sesión en tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input id="email" name="email" type="email" label="Correo electrónico"
              placeholder="demo@gp.com" value={form.email}
              onChange={handleChange} error={fieldErrors.email} autoComplete="email" />
            <Input id="password" name="password" type="password" label="Contraseña"
              placeholder="••••••••" value={form.password}
              onChange={handleChange} error={fieldErrors.password} autoComplete="current-password" />
            <Button type="submit" fullWidth loading={isLoading} className="mt-2">
              Iniciar sesión
            </Button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-5">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">Regístrate</Link>
          </p>
        </div>
        <p className="text-center text-[0.7rem] text-gray-400 mt-4">Demo: demo@gp.com / demo1234</p>
      </div>
    </div>
  );
};

export default LoginView;
