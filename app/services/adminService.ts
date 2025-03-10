import { Agendamento } from '../types/admin';

// Simulação de banco de dados (substituir por banco real)
let agendamentos: Agendamento[] = [];
let fotosGaleria: { src: string; alt: string; category: string }[] = [];

export const adminService = {
  // Autenticação
  login: async (usuario: string, senha: string) => {
    // Implementar autenticação real aqui
    if (usuario === 'admin' && senha === 'admin123') {
      return { token: 'dummy_token' };
    }
    throw new Error('Credenciais inválidas');
  },

  // Agendamentos
  getAgendamentos: async () => {
    return agendamentos;
  },

  updateAgendamento: async (id: string, dados: Partial<Agendamento>) => {
    const index = agendamentos.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Agendamento não encontrado');
    
    agendamentos[index] = { ...agendamentos[index], ...dados };
    return agendamentos[index];
  },

  // Fotos
  uploadFotos: async (agendamentoId: string, files: File[]) => {
    // Simular upload de arquivos
    const novasFotos = files.map(file => ({
      src: URL.createObjectURL(file),
      alt: `Foto do serviço ${agendamentoId}`,
      category: 'servicos'
    }));

    // Adicionar fotos à galeria
    fotosGaleria = [...novasFotos, ...fotosGaleria].slice(0, 8); // Manter apenas as 8 mais recentes

    // Atualizar agendamento com as fotos
    const agendamento = agendamentos.find(a => a.id === agendamentoId);
    if (agendamento) {
      agendamento.fotos = novasFotos.map(f => f.src);
    }

    return novasFotos;
  },

  getFotosGaleria: async () => {
    return fotosGaleria;
  },

  // Limpar dados (apenas para desenvolvimento)
  clearData: () => {
    agendamentos = [];
    fotosGaleria = [];
  }
}; 