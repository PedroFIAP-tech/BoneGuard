import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { authService } from '../services/authService';
import { pacienteService } from '../services/pacienteService';
import { Paciente, RegisterRequest } from '../types';

interface AuthContextData {
  paciente: Paciente | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (dados: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  setPaciente: (paciente: Paciente) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [paciente, setPacienteState] = useState<Paciente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await authService.getToken();
        const pacienteId = await authService.getPacienteId();
        if (!token || !pacienteId) {
          router.replace('/(auth)/login');
          return;
        }
        const p = await pacienteService.buscarPorId(pacienteId);
        setPacienteState(p);
      } catch {
        await authService.logout();
        router.replace('/(auth)/login');
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email: string, senha: string) => {
    const { pacienteId } = await authService.login({ email, senha });
    const p = await pacienteService.buscarPorId(pacienteId);
    setPacienteState(p);
    router.replace('/(tabs)/');
  };

  const register = async (dados: RegisterRequest) => {
    const { pacienteId } = await authService.register(dados);
    const p = await pacienteService.buscarPorId(pacienteId);
    setPacienteState(p);
    router.replace('/(tabs)/');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // garante navegação mesmo se storage falhar
    } finally {
      setPacienteState(null);
      router.replace('/(auth)/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        paciente,
        isLoading,
        isAuthenticated: !!paciente,
        login,
        register,
        logout,
        setPaciente: setPacienteState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
