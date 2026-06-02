export interface AuthResponse {
  token: string;
  email: string;
  pacienteId: number;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  email: string;
  senha: string;
  nome: string;
  idade: number;
  sexo: 'M' | 'F';
  peso: number;
  historicoFamiliar: boolean;
  nivelAtividade: 'SEDENTARIO' | 'MODERADO' | 'ATIVO';
  alimentacaoCalcio: boolean;
}

export interface Paciente {
  id: number;
  nome: string;
  idade: number;
  sexo: 'M' | 'F';
  peso: number;
  historicoFamiliar: boolean;
  nivelAtividade: 'SEDENTARIO' | 'MODERADO' | 'ATIVO';
  alimentacaoCalcio: boolean;
  dataCadastro: string;
}

export interface AvaliacaoRequest {
  pacienteId: number;
  scoreRisco: number;
}

export interface Avaliacao {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  scoreRisco: number;
  classificacao: 'BAIXO' | 'MODERADO' | 'ALTO';
  dataAvaliacao: string;
  planoGerado: boolean;
}

export interface HistoricoAvaliacao {
  pacienteId: number;
  totalAvaliacoes: number;
  tendencia: 'MELHORA' | 'PIORA' | 'ESTAVEL' | 'SEM_HISTORICO';
  avaliacoes: Avaliacao[];
}

export interface PlanoSaude {
  id: number;
  avaliacaoId: number;
  categoria: 'EXERCICIO' | 'NUTRICAO';
  descricao: string;
  ativo: boolean;
  dataCriacao: string;
}
