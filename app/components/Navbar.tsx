'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [logoVisible, setLogoVisible] = useState(true);
  const [isHomePage, setIsHomePage] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Determinar o tamanho da logo com base na página atual
  const logoSize = pathname === '/agendamento' 
    ? 'small' 
    : pathname.startsWith('/admin') 
      ? 'admin' 
      : 'large';

  useEffect(() => {
    setIsHomePage(pathname === '/');

    const handleScroll = () => {
      // Usar requestAnimationFrame para limitar as atualizações de estado durante o scroll
      requestAnimationFrame(() => {
        const offset = window.scrollY;
        if (offset > 50) {
          if (!scrolled) setScrolled(true);
        } else {
          if (scrolled) setScrolled(false);
        }
        
        // Controla a visibilidade da logo com base na posição de rolagem
        if (offset > 400) {
          if (logoVisible) setLogoVisible(false);
        } else {
          if (!logoVisible) setLogoVisible(true);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, scrolled, logoVisible]);

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    } else {
      window.location.href = `/#${sectionId}`;
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 vintage-header ${
          scrolled ? 'py-4 shadow-lg' : 'py-5'
        }`}
      >
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-center items-center h-16">
            <Link href="/" className="text-center group cursor-pointer">
              <h1 className="text-yellow-500 text-2xl font-bold font-serif transition-all duration-300 group-hover:opacity-70">MUCIO CAR</h1>
              <p className="text-light text-sm transition-all duration-300 group-hover:opacity-70">ESTÉTICA AUTOMOTIVA</p>
            </Link>
          </div>
          
          <div className="flex justify-end items-center h-16 absolute top-0 right-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className={`relative group py-2 ${pathname === '/' ? 'text-yellow-500' : 'text-white'}`}>
                <span>Início</span>
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full ${pathname === '/' ? 'w-full' : ''}`}></span>
              </Link>
              <button onClick={() => scrollToSection('services')} className="relative group py-2 text-white">
                <span>Serviços</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <Link href="/galeria" className={`relative group py-2 ${pathname === '/galeria' ? 'text-yellow-500' : 'text-white'}`}>
                <span>Galeria</span>
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full ${pathname === '/galeria' ? 'w-full' : ''}`}></span>
              </Link>
              <button onClick={() => scrollToSection('contact')} className="relative group py-2 text-white">
                <span>Contato</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <Link 
                href="/agendamento" 
                className={`px-4 py-2 rounded-md border border-yellow-500 transition-all duration-300 ${
                  pathname === '/agendamento' 
                    ? 'bg-yellow-500 text-dark font-medium' 
                    : 'text-yellow-500 hover:bg-yellow-500 hover:text-dark'
                }`}
              >
                Agendar
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-dark/98 backdrop-blur-md transition-all duration-500 ease-in-out z-[100] ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Close Button */}
        <button 
          className="absolute top-6 right-6 text-white focus:outline-none z-[101] p-2 rounded-full hover:bg-white/10 transition-colors duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Fechar menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Menu Content */}
        <div className="container mx-auto px-6 h-full flex flex-col justify-center">
          <div className="flex flex-col space-y-8">
            <Link 
              href="/" 
              className={`relative group py-3 text-xl ${pathname === '/' ? 'text-yellow-500' : 'text-white'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Início</span>
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full ${pathname === '/' ? 'w-full' : ''}`}></span>
            </Link>
            <button 
              onClick={() => scrollToSection('services')} 
              className="relative group py-3 text-white text-left text-xl"
            >
              <span>Serviços</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <Link 
              href="/galeria" 
              className={`relative group py-3 text-xl ${pathname === '/galeria' ? 'text-yellow-500' : 'text-white'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Galeria</span>
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full ${pathname === '/galeria' ? 'w-full' : ''}`}></span>
            </Link>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="relative group py-3 text-white text-left text-xl"
            >
              <span>Contato</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <div className="mt-8">
              <Link 
                href="/agendamento" 
                className={`block w-full px-8 py-4 rounded-lg border-2 border-yellow-500 transition-all duration-300 text-center text-xl font-medium shadow-lg shadow-yellow-500/20 ${
                  pathname === '/agendamento' 
                    ? 'bg-yellow-500 text-dark' 
                    : 'text-yellow-500 hover:bg-yellow-500 hover:text-dark hover:shadow-yellow-500/30'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Agendar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 