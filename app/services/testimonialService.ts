// Serviço para gerenciar depoimentos

// Interface para os depoimentos
export interface Testimonial {
  id: string;
  nome: string;
  texto: string;
  avaliacao: number;
  data: string;
  foto?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  resposta?: string;
}

// Simulação de banco de dados (substituir por banco real)
let testimonials: Testimonial[] = [];

export const testimonialService = {
  // Obter todos os depoimentos
  getAllTestimonials: async () => {
    return testimonials;
  },

  // Obter apenas depoimentos aprovados
  getApprovedTestimonials: async () => {
    return testimonials.filter(t => t.status === 'aprovado');
  },

  // Obter depoimentos pendentes
  getPendingTestimonials: async () => {
    return testimonials.filter(t => t.status === 'pendente');
  },

  // Adicionar novo depoimento
  addTestimonial: async (testimonial: Omit<Testimonial, 'id' | 'status' | 'data'>) => {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: Date.now().toString(),
      status: 'pendente',
      data: new Date().toLocaleDateString('pt-BR')
    };
    testimonials.push(newTestimonial);
    return newTestimonial;
  },

  // Atualizar status do depoimento
  updateTestimonialStatus: async (id: string, status: Testimonial['status'], resposta?: string) => {
    const index = testimonials.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Depoimento não encontrado');
    
    testimonials[index] = {
      ...testimonials[index],
      status,
      resposta
    };
    return testimonials[index];
  },

  // Limpar dados (apenas para desenvolvimento)
  clearData: () => {
    testimonials = [];
  }
}; 