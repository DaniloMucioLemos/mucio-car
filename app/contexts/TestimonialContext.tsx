'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Testimonial } from '../models/Testimonial';
import { getTestimonials, addTestimonial as addTestimonialService } from '../services/testimonialService';

interface TestimonialContextType {
  testimonials: Testimonial[];
  loading: boolean;
  addTestimonial: (name: string, rating: number, comment: string, vehicleModel?: string, service?: string) => Promise<Testimonial>;
  refreshTestimonials: () => Promise<void>;
}

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export function TestimonialProvider({ children }: { children: ReactNode }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const loadedTestimonials = await getTestimonials();
      setTestimonials(loadedTestimonials);
    } catch (error) {
      console.error('Erro ao carregar depoimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Função auto-executável para usar async/await
    (async () => {
      await loadTestimonials();
    })();

    // Configurar um intervalo para verificar novos depoimentos a cada 5 segundos
    const intervalId = setInterval(async () => {
      await loadTestimonials();
    }, 5000);

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  const addTestimonial = async (name: string, rating: number, comment: string, vehicleModel?: string, service?: string) => {
    const newTestimonial = await addTestimonialService(name, rating, comment, vehicleModel, service);
    
    // Atualiza o estado local com o novo depoimento
    setTestimonials(prevTestimonials => [newTestimonial, ...prevTestimonials]);
    
    return newTestimonial;
  };

  const refreshTestimonials = async () => {
    await loadTestimonials();
  };

  return (
    <TestimonialContext.Provider value={{ testimonials, loading, addTestimonial, refreshTestimonials }}>
      {children}
    </TestimonialContext.Provider>
  );
}

export function useTestimonials() {
  const context = useContext(TestimonialContext);
  if (context === undefined) {
    throw new Error('useTestimonials deve ser usado dentro de um TestimonialProvider');
  }
  return context;
} 