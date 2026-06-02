import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const JAVA_API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://SEU_IP:8080';

export const api = axios.create({
  baseURL: JAVA_API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('boneguard_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // SecureStore indisponível — continua sem token
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await SecureStore.deleteItemAsync('boneguard_token');
        await SecureStore.deleteItemAsync('boneguard_paciente_id');
      } catch {
        // silencia
      }
    }
    return Promise.reject(error);
  }
);
