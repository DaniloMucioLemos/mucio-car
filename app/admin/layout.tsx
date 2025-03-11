'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    console.log('AdminLayout - Status:', status);
    console.log('AdminLayout - Session:', session);
    console.log('AdminLayout - Pathname:', pathname);

    // Se estiver na página de login
    if (pathname === '/admin/login') {
      if (status === 'authenticated' && session?.user?.role === 'admin') {
        console.log('Usuário admin autenticado na página de login, redirecionando para dashboard');
        router.push('/admin/dashboard');
      }
      return;
    }

    // Se não estiver na página de login
    if (status === 'unauthenticated') {
      console.log('Usuário não autenticado, redirecionando para login');
      router.push('/admin/login');
      return;
    }

    if (status === 'authenticated') {
      if (!session?.user?.role) {
        console.log('Usuário autenticado mas sem role definida');
        router.push('/admin/login');
        return;
      }

      if (session.user.role !== 'admin') {
        console.log('Usuário autenticado mas não é admin');
        router.push('/admin/login');
        return;
      }

      console.log('Usuário admin autenticado com sucesso');
    }
  }, [status, session, router, pathname]);

  // Mostra loading apenas se estiver carregando e não estiver na página de login
  if (status === 'loading' && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
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