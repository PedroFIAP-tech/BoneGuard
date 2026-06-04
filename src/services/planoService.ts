import { api } from './api';
import { PlanoSaude } from '../types';

export const planoService = {
  async buscarPorPaciente(pacienteId: number): Promise<PlanoSaude[]> {
    const res = await api.get<PlanoSaude[]>(`/planos/paciente/${pacienteId}`);
    return res.data;
  },

  async gerarPlanos(avaliacaoId: number): Promise<PlanoSaude[]> {
    const res = await api.post<PlanoSaude[]>(`/planos/gerar/${avaliacaoId}`);
    return res.data;
  },
};
