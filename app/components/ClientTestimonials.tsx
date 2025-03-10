'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getApprovedTestimonials } from '../services/testimonialService'
import { Testimonial } from '../services/testimonialService'
import TestimonialCard from './TestimonialCard'

export default function ClientTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    const loadTestimonials = async () => {
      const data = await getApprovedTestimonials()
      setTestimonials(data)
    }
    loadTestimonials()
  }, [])

  // Renderizar estrelas
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-xl ${
            i <= rating ? 'text-yellow-500' : 'text-gray-400'
          }`}
        >
          ★
        </span>
      )
    }
    return stars
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  }

  // Renderizar avatar baseado na avaliação
  const renderAvatar = (isPositive: boolean, name: string) => {
    // Avaliação positiva (3 ou mais estrelas)
    if (isPositive) {
      return (
        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </div>
      )
    } 
    // Avaliação negativa (1 ou 2 estrelas)
    else {
      return (
        <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2" />
          </svg>
        </div>
      )
    }
  }

  // Determinar se a avaliação é positiva baseado na nota
  const isPositiveRating = (rating: number) => rating >= 3;

  return (
    <section id="testimonials" className="py-20 bg-dark">
      <div className="container mx-auto px-4">
        <h2 className="section-title">O que nossos clientes dizem</h2>
        <p className="section-subtitle">
          Depoimentos de clientes satisfeitos com nossos serviços
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial) => {
            const isPositive = testimonial.isPositive ?? isPositiveRating(testimonial.rating);
            return (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                comment={testimonial.comment}
                rating={testimonial.rating}
                date={testimonial.date}
                foto={isPositive ? renderAvatar(isPositive, testimonial.name) : null}
              />
            );
          })}
        </div>
      </div>
    </section>
  )
} 