import api from './api';
import type { AuthResponse, User } from '../types';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const _delay = (ms = 500): Promise<void> => new Promise((r) => setTimeout(r, ms));

interface MockUser extends User { password: string; }

const _users: MockUser[] = [
  { id: '1', name: 'Demo User', email: 'demo@gp.com', password: 'demo1234' },
];

const _buildResponse = (user: MockUser): AuthResponse => ({
  user: { id: user.id, name: user.name, email: user.email },
  token: `mock-jwt-${user.id}-${Date.now()}`,
});

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCKS) {
      await _delay();
      const found = _users.find((u) => u.email === email && u.password === password);
      if (!found) throw { response: { data: { message: 'Credenciales inválidas' } } };
      return _buildResponse(found);
    }
    return api.post<AuthResponse, AuthResponse>('/auth/login', { email, password });
  },

  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    if (USE_MOCKS) {
      await _delay();
      if (_users.find((u) => u.email === data.email))
        throw { response: { data: { message: 'El correo ya está registrado' } } };
      const newUser: MockUser = { id: String(_users.length + 1), ...data };
      _users.push(newUser);
      return _buildResponse(newUser);
    }
    return api.post<AuthResponse, AuthResponse>('/auth/register', data);
  },
};
