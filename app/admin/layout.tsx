'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    console.log('AdminLayout - Status:', status);
    console.log('AdminLayout - Session:', session);
    console.log('AdminLayout - Pathname:', pathname);
    console.log('AdminLayout - IsRedirecting:', isRedirecting);

    // Se ainda está carregando ou já está redirecionando, não faz nada
    if (status === 'loading' || isRedirecting) {
      console.log('Status carregando ou já redirecionando, aguardando...');
      return;
    }

    const handleRedirect = async () => {
      console.log('Iniciando handleRedirect');
      setIsRedirecting(true);

      try {
        // Se estiver autenticado como admin
        if (status === 'authenticated' && session?.user?.role === 'admin') {
          // Se estiver na página de login, redireciona para o dashboard
          if (pathname === '/admin/login') {
            console.log('Usuário admin na página de login, redirecionando para dashboard');
            window.location.href = '/admin/dashboard';
            return;
          }
          // Se estiver em qualquer outra página, permite o acesso
          return;
        }

        // Se não estiver autenticado ou não for admin
        if (pathname !== '/admin/login') {
          console.log('Usuário não autorizado, redirecionando para login');
          window.location.href = '/admin/login';
          return;
        }
      } catch (error) {
        console.error('Erro durante redirecionamento:', error);
        // Em caso de erro, força o redirecionamento para o login
        if (pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      } finally {
        console.log('Finalizando handleRedirect');
        setIsRedirecting(false);
      }
    };

    handleRedirect();
  }, [status, session, pathname]);

  // Mostra loading durante carregamento ou redirecionamento
  if (status === 'loading' || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">
          {isRedirecting ? 'Redirecionando...' : 'Carregando...'}
        </div>
      </div>
    );
  }

  // Se não estiver na página de login e não estiver autenticado como admin, não renderiza nada
  if (pathname !== '/admin/login' && (!session?.user?.role || session.user.role !== 'admin')) {
    return null;
  }

  // Renderiza o conteúdo normalmente
  return <>{children}</>;
} 