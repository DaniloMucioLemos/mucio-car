// Serviço para gerenciar depoimentos

// Interface para os depoimentos
export interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  date: string;
  foto?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  response?: string;
  responseDate?: string;
  isPositive?: boolean;
  vehicleModel?: string;
  service?: string;
}

// Simulação de banco de dados (substituir por banco real)
let testimonials: Testimonial[] = [];

// Funções exportadas individualmente
export const getApprovedTestimonials = async () => {
  return testimonials.filter(t => t.status === 'aprovado');
};

export const getTestimonials = async () => {
  return testimonials;
};

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'status' | 'date'>) => {
  const newTestimonial: Testimonial = {
    ...testimonial,
    id: Date.now().toString(),
    status: 'pendente',
    date: new Date().toLocaleDateString('pt-BR'),
    isPositive: testimonial.rating >= 3
  };
  testimonials.push(newTestimonial);
  return newTestimonial;
};

export const updateTestimonialStatus = async (id: string, status: Testimonial['status'], resposta?: string) => {
  const index = testimonials.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Depoimento não encontrado');
  
  testimonials[index] = {
    ...testimonials[index],
    status,
    response: resposta,
    responseDate: resposta ? new Date().toLocaleDateString('pt-BR') : undefined
  };
  return testimonials[index];
};

// Objeto do serviço (mantido para compatibilidade)
export const testimonialService = {
  getAllTestimonials: async () => testimonials,
  getApprovedTestimonials,
  getPendingTestimonials: async () => testimonials.filter(t => t.status === 'pendente'),
  addTestimonial,
  updateTestimonialStatus,
  clearData: () => {
    testimonials = [];
  }
}; 