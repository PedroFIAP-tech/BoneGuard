import { api } from './api';
import { Paciente } from '../types';

export const pacienteService = {
  async buscarPorId(id: number): Promise<Paciente> {
    const res = await api.get<Paciente>(`/pacientes/${id}`);
    return res.data;
  },

  async atualizar(id: number, dados: Partial<Paciente>): Promise<Paciente> {
    const res = await api.put<Paciente>(`/pacientes/${id}`, dados);
    return res.data;
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/pacientes/${id}`);
  },
};
