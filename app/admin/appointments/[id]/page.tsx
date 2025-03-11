'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Appointment {
  id: string;
  date: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  status: string;
  notes: string;
  service: Service;
}

export default function AppointmentDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchAppointment();
    }
  }, [status, router, params.id]);

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setAppointment(data);
      } else {
        setError('Agendamento não encontrado');
      }
    } catch (error) {
      setError('Erro ao carregar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchAppointment();
      } else {
        setError('Erro ao atualizar status');
      }
    } catch (error) {
      setError('Erro ao atualizar status');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) {
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/appointments');
      } else {
        setError('Erro ao excluir agendamento');
      }
    } catch (error) {
      setError('Erro ao excluir agendamento');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error || 'Agendamento não encontrado'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin/appointments" className="text-gray-500 hover:text-gray-700">
                  ← Voltar para Agendamentos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Detalhes do Agendamento</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Informações do agendamento e opções de gerenciamento.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Nome do Cliente</dt>
                      <dd className="mt-1 text-sm text-gray-900">{appointment.clientName}</dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{appointment.clientEmail}</dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{appointment.clientPhone}</dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Serviço</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {appointment.service.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(appointment.service.price)}
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Data e Hora</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(appointment.date).toLocaleString('pt-BR')}
                      </dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="pending">Pendente</option>
                          <option value="confirmed">Confirmado</option>
                          <option value="completed">Concluído</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </dd>
                    </div>

                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Observações</dt>
                      <dd className="mt-1 text-sm text-gray-900">{appointment.notes || 'Nenhuma observação'}</dd>
                    </div>
                  </dl>

                  {error && (
                    <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={handleDelete}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 