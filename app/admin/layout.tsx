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
        // Se estiver na página de login
        if (pathname === '/admin/login') {
          if (status === 'authenticated' && session?.user?.role === 'admin') {
            console.log('Usuário admin autenticado na página de login, redirecionando para dashboard');
            await router.replace('/admin/dashboard');
            return;
          }
          return;
        }

        // Se não estiver na página de login
        if (status === 'unauthenticated') {
          console.log('Usuário não autenticado, redirecionando para login');
          await router.replace('/admin/login');
          return;
        }

        if (status === 'authenticated') {
          if (!session?.user?.role || session.user.role !== 'admin') {
            console.log('Usuário autenticado mas não é admin');
            await router.replace('/admin/login');
            return;
          }
        }
      } catch (error) {
        console.error('Erro durante redirecionamento:', error);
      } finally {
        console.log('Finalizando handleRedirect');
        setIsRedirecting(false);
      }
    };

    handleRedirect();
  }, [status, session, router, pathname, isRedirecting]);

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