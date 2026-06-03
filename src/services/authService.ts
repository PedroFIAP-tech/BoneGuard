import { storage } from '../utils/storage';
import { api } from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<{ token: string; pacienteId: number }> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    await storage.setItem('boneguard_token', res.data.token);
    await storage.setItem('boneguard_paciente_id', String(res.data.pacienteId));
    return { token: res.data.token, pacienteId: res.data.pacienteId };
  },

  async register(data: RegisterRequest): Promise<{ token: string; pacienteId: number }> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    await storage.setItem('boneguard_token', res.data.token);
    await storage.setItem('boneguard_paciente_id', String(res.data.pacienteId));
    return { token: res.data.token, pacienteId: res.data.pacienteId };
  },

  async logout(): Promise<void> {
    await storage.deleteItem('boneguard_token');
    await storage.deleteItem('boneguard_paciente_id');
  },

  async getToken(): Promise<string | null> {
    return storage.getItem('boneguard_token');
  },

  async getPacienteId(): Promise<number | null> {
    const id = await storage.getItem('boneguard_paciente_id');
    return id ? Number(id) : null;
  },
};
