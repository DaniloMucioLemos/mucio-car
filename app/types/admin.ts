export interface Agendamento {
  id: string;
  cliente: string;
  telefone: string;
  email: string;
  servico: string;
  data: string;
  horario: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
  fotos?: string[];
  observacoes?: string;
}

export interface FotoGaleria {
  src: string;
  alt: string;
  category: string;
}

export interface LoginCredentials {
  usuario: string;
  senha: string;
} 