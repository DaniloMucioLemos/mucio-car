'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminLogin() {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Iniciando tentativa de login com email:', email);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      console.log('Resultado do login:', result);

      if (result?.error) {
        console.error('Erro no login:', result.error);
        if (result.error === 'Acesso não autorizado') {
          setError('Você não tem permissão para acessar esta área');
        } else {
          setError('Email ou senha inválidos');
        }
      } else if (result?.ok) {
        console.log('Login bem-sucedido, aguardando atualização da sessão...');
        // O redirecionamento será feito pelo layout quando a sessão for atualizada
      } else {
        console.error('Erro desconhecido no login');
        setError('Ocorreu um erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Ocorreu um erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Se estiver carregando a sessão, mostra o loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Verificando sessão...</div>
      </div>
    );
  }

  // Se já estiver autenticado como admin, mostra mensagem de redirecionamento
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Redirecionando para o painel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Área Administrativa
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              voltar para o site
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 