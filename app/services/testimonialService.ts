// Serviço para gerenciar depoimentos

import { Testimonial, createTestimonial } from '../models/Testimonial';

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

// Array simulando um banco de dados
let testimonials: Testimonial[] = [];

// Função para obter todos os depoimentos
export const getTestimonials = async (): Promise<Testimonial[]> => {
  return testimonials;
};

// Função para obter apenas os depoimentos aprovados
export const getApprovedTestimonials = async (): Promise<Testimonial[]> => {
  return testimonials.filter(t => t.status === 'aprovado');
};

// Função para adicionar um novo depoimento
export const addTestimonial = async (name: string, rating: number, comment: string, vehicleModel?: string, service?: string): Promise<Testimonial> => {
  const newTestimonial = createTestimonial(name, rating, comment, vehicleModel, service);
  testimonials = [newTestimonial, ...testimonials];
  return newTestimonial;
};

// Função para obter depoimentos pendentes
export const getPendingTestimonials = async (): Promise<Testimonial[]> => {
  return testimonials.filter(t => t.status === 'pendente');
};

// Função para atualizar o status de um depoimento
export const updateTestimonialStatus = async (id: string, status: Testimonial['status'], resposta?: string): Promise<Testimonial> => {
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
  getPendingTestimonials,
  addTestimonial,
  updateTestimonialStatus,
  clearData: () => {
    testimonials = [];
  }
}; 