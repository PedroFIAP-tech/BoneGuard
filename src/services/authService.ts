import * as SecureStore from 'expo-secure-store';
import { api } from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<{ token: string; pacienteId: number }> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    await SecureStore.setItemAsync('boneguard_token', res.data.token);
    await SecureStore.setItemAsync('boneguard_paciente_id', String(res.data.pacienteId));
    return { token: res.data.token, pacienteId: res.data.pacienteId };
  },

  async register(data: RegisterRequest): Promise<{ token: string; pacienteId: number }> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    await SecureStore.setItemAsync('boneguard_token', res.data.token);
    await SecureStore.setItemAsync('boneguard_paciente_id', String(res.data.pacienteId));
    return { token: res.data.token, pacienteId: res.data.pacienteId };
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('boneguard_token');
    await SecureStore.deleteItemAsync('boneguard_paciente_id');
  },

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync('boneguard_token');
  },

  async getPacienteId(): Promise<number | null> {
    const id = await SecureStore.getItemAsync('boneguard_paciente_id');
    return id ? Number(id) : null;
  },
};
