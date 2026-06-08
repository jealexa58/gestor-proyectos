import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

interface FormState { name: string; email: string; password: string; }
type FieldErrors = Partial<FormState>;

const INITIAL_FORM_STATE: FormState = { name: '', email: '', password: '' };

const RegisterView = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]               = useState<FormState>(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError]       = useState<string | null>(null);
  const [isLoading, setIsLoading]     = useState(false);

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!form.name.trim()) {
      errors.name = 'El nombre es requerido';
    }
    if (!form.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'El correo electrónico no es válido';
    }
    if (!form.password.trim()) {
      errors.password = 'La contraseña es requerida';
    } else if (form.password.trim().length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    return errors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldErrors({}); // Clear errors on change
    setApiError(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await register(form);
      navigate('/dashboard'); // Redirect to dashboard on successful registration
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Error al registrar. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Crea tu cuenta</h2>
        {apiError && (
          <div className="bg-red-50 border border-red-100 text-sm text-red-600 px-4 py-2.5 rounded-lg">{apiError}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input id="name" name="name" type="text" label="Nombre completo" placeholder="Juan Pérez"
            value={form.name} onChange={handleChange} error={fieldErrors.name} />
          <Input id="email" name="email" type="email" label="Correo electrónico" placeholder="tu@ejemplo.com"
            value={form.email} onChange={handleChange} error={fieldErrors.email} />
          <Input id="password" name="password" type="password" label="Contraseña" placeholder="********"
            value={form.password} onChange={handleChange} error={fieldErrors.password} />
          <Button type="submit" loading={isLoading} fullWidth>Regístrate →</Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta? <Link to="/login" className="font-semibold text-slate-700 hover:text-slate-900">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterView;