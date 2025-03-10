'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getApprovedTestimonials } from '../services/testimonialService'
import { Testimonial } from '../models/Testimonial'
import TestimonialCard from './TestimonialCard'

export default function ClientTestimonials() {
  const [depoimentos, setDepoimentos] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setIsLoading(true);
        const loadedTestimonials = await getApprovedTestimonials();
        
        // Ordenar por data (mais recentes primeiro)
        const sortedTestimonials = [...loadedTestimonials].sort((a, b) => {
          // Converter datas no formato DD/MM/YYYY para objetos Date
          const [dayA, monthA, yearA] = a.date.split('/').map(Number);
          const [dayB, monthB, yearB] = b.date.split('/').map(Number);
          
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          
          return dateB.getTime() - dateA.getTime();
        });
        
        // Pegar apenas os 3 mais recentes
        const latestTestimonials = sortedTestimonials.slice(0, 3);
        setDepoimentos(latestTestimonials);
      } catch (error) {
        console.error('Erro ao carregar depoimentos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Carregar os depoimentos inicialmente
    loadTestimonials();
    
    // Configurar um intervalo para verificar novos depoimentos a cada 5 segundos
    const intervalId = setInterval(loadTestimonials, 5000);
    
    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section id="testimonials" className="py-16 bg-dark vintage-bg">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="section-title-center mb-12">O que nossos clientes dizem</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-gold-DEFAULT mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-light">Carregando depoimentos...</p>
          </div>
        ) : depoimentos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-light">Ainda não temos depoimentos. Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {depoimentos.map(depoimento => (
              <TestimonialCard key={depoimento.id} testimonial={depoimento} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
} 