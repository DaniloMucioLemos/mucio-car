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

    if (pathname === '/admin/login') {
      if (status === 'authenticated') {
        console.log('Usuário autenticado, redirecionando para dashboard');
        router.push('/admin/dashboard');
      }
      return;
    }

    if (status === 'unauthenticated') {
      console.log('Usuário não autenticado, redirecionando para login');
      router.push('/admin/login');
      return;
    }

    if (status === 'authenticated' && !session?.user?.role) {
      console.log('Usuário sem role definida');
      router.push('/admin/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      console.log('Usuário não é admin');
      router.push('/admin/login');
      return;
    }
  }, [status, session, router, pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  if (pathname !== '/admin/login' && status !== 'authenticated') {
    return null;
  }

  return <>{children}</>;
} 