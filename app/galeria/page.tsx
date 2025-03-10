'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import ImageCarousel from '../components/ImageCarousel';

export default function Galeria() {
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'polimento', name: 'Polimento' },
    { id: 'vitrificacao', name: 'Vitrificação' },
    { id: 'restauracao', name: 'Restauração' },
    { id: 'detalhamento', name: 'Detalhamento' }
  ];

  const images = [
    {
      src: "/images/cars/classic-car-1.jpg",
      alt: "Carro clássico restaurado",
      category: "restauracao"
    },
    {
      src: "/images/cars/classic-car-2.jpg",
      alt: "Detalhes da restauração",
      category: "restauracao"
    },
    {
      src: "/images/cars/classic-car-3.jpg",
      alt: "Interior restaurado",
      category: "detalhamento"
    },
    {
      src: "/images/cars/classic-car-4.jpg",
      alt: "Pintura restaurada",
      category: "polimento"
    },
    {
      src: "/images/cars/classic-car-5.jpg",
      alt: "Detalhes do motor",
      category: "detalhamento"
    },
    {
      src: "/images/cars/classic-car-6.jpg",
      alt: "Acabamento interno",
      category: "detalhamento"
    },
    {
      src: "/images/cars/classic-car-7.jpg",
      alt: "Vitrificação completa",
      category: "vitrificacao"
    },
    {
      src: "/images/cars/classic-car-8.jpg",
      alt: "Polimento profissional",
      category: "polimento"
    }
  ];

  const filteredImages = selectedCategory === 'todos' 
    ? images 
    : images.filter(image => image.category === selectedCategory);

  return (
    <div className="min-h-screen bg-dark text-light">
      <Logo visible={true} size="large" />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1583&auto=format&fit=crop)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif">
            Nossa <span className="text-yellow-500">Galeria</span>
          </h1>
          <p className="text-xl text-light max-w-3xl mx-auto">
            Conheça alguns dos nossos trabalhos mais recentes e veja a qualidade 
            que oferecemos em cada serviço.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-dark-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-yellow-500 text-dark font-bold'
                    : 'bg-dark text-light hover:bg-yellow-500/20'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image, index) => (
              <div key={index} className="group relative h-[300px] rounded-sm overflow-hidden vintage-border">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 vintage-button">
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-16 bg-dark-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-serif">
            Nossos <span className="text-yellow-500">Trabalhos</span>
          </h2>
          <ImageCarousel images={images} />
        </div>
      </section>
    </div>
  );
} 