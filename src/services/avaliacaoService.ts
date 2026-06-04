import { api } from './api';
import { Avaliacao, AvaliacaoRequest, HistoricoAvaliacao } from '../types';

export const avaliacaoService = {
  async criar(dados: AvaliacaoRequest): Promise<Avaliacao> {
    const res = await api.post<Avaliacao>('/avaliacoes', dados);
    return res.data;
  },

  async buscarPorId(id: number): Promise<Avaliacao> {
    const res = await api.get<Avaliacao>(`/avaliacoes/${id}`);
    return res.data;
  },

  async buscarHistorico(pacienteId: number): Promise<HistoricoAvaliacao> {
    const res = await api.get<HistoricoAvaliacao>(`/avaliacoes/paciente/${pacienteId}`);
    return res.data;
  },
};
