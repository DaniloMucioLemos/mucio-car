import { Testimonial } from '../models/Testimonial';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export default function TestimonialCard({ testimonial, className = '' }: TestimonialCardProps) {
  // Renderizar avatar baseado na avaliação
  const renderAvatar = () => {
    const isPositive = testimonial.rating >= 3;
    
    if (isPositive) {
      return (
        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </div>
      )
    } else {
      return (
        <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2" />
          </svg>
        </div>
      )
    }
  }

  return (
    <div className={`vintage-card hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-center mb-4">
        {renderAvatar()}
        <div className="ml-4">
          <h3 className="font-bold text-lg text-gold-DEFAULT">{testimonial.name || 'Cliente'}</h3>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      
      {(testimonial.vehicleModel || testimonial.service) && (
        <div className="mb-3 text-sm">
          {testimonial.vehicleModel && (
            <p className="text-gold-light">
              <span className="font-semibold">Veículo:</span> {testimonial.vehicleModel}
            </p>
          )}
          {testimonial.service && (
            <p className="text-gold-light">
              <span className="font-semibold">Serviço:</span> {testimonial.service}
            </p>
          )}
        </div>
      )}
      
      <p className="text-light mb-2">{testimonial.comment}</p>
      <p className="text-sm text-gray-400 mb-4">{testimonial.date}</p>
    </div>
  );
} 