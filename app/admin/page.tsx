'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import TestimonialCard from '../components/TestimonialCard';
import { testimonialService, Testimonial } from '../services/testimonialService';

interface Agendamento {
  id: string;
  cliente: string;
  telefone: string;
  email: string;
  servico: string;
  data: string;
  horario: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
  fotos?: string[];
  observacoes?: string;
}

// Dados iniciais de exemplo
const agendamentosIniciais: Agendamento[] = [
  {
    id: '1',
    cliente: 'João Silva',
    telefone: '(16) 99999-9999',
    email: 'joao@email.com',
    servico: 'Polimento',
    data: '2024-03-20',
    horario: '09:00',
    status: 'pendente',
    observacoes: 'Carro preto, modelo 2020'
  },
  {
    id: '2',
    cliente: 'Maria Santos',
    telefone: '(16) 98888-8888',
    email: 'maria@email.com',
    servico: 'Lavagem Premium',
    data: '2024-03-21',
    horario: '14:00',
    status: 'em_andamento',
    observacoes: 'SUV branca, modelo 2022'
  },
  {
    id: '3',
    cliente: 'Pedro Oliveira',
    telefone: '(16) 97777-7777',
    email: 'pedro@email.com',
    servico: 'Higienização Interna',
    data: '2024-03-22',
    horario: '10:00',
    status: 'concluido',
    fotos: ['/images/cars/classic-car-1.jpg'],
    observacoes: 'Carro vermelho, modelo 2019'
  }
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');

  // Simulação de autenticação (substituir por autenticação real)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      setIsAuthenticated(!!token);
      if (!!token) {
        setAgendamentos(agendamentosIniciais);
        loadTestimonials();
      }
    };
    checkAuth();
  }, []);

  const loadTestimonials = async () => {
    const data = await testimonialService.getAllTestimonials();
    setTestimonials(data);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_token', 'dummy_token');
    setIsAuthenticated(true);
    setAgendamentos(agendamentosIniciais);
    loadTestimonials();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setAgendamentos([]);
    setTestimonials([]);
  };

  const handleStatusChange = async (agendamento: Agendamento, novoStatus: Agendamento['status']) => {
    const updatedAgendamentos = agendamentos.map(a => 
      a.id === agendamento.id ? { ...a, status: novoStatus } : a
    );
    setAgendamentos(updatedAgendamentos);
  };

  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFotos(files);
    }
  };

  const handleSubmitFotos = async () => {
    if (selectedAgendamento && selectedAgendamento.status === 'concluido') {
      const novasFotos = fotos.map(file => URL.createObjectURL(file));
      const updatedAgendamentos = agendamentos.map(a => 
        a.id === selectedAgendamento.id 
          ? { ...a, fotos: [...(a.fotos || []), ...novasFotos] }
          : a
      );
      setAgendamentos(updatedAgendamentos);
      setShowUploadModal(false);
      setFotos([]);
    }
  };

  const handleCancelAgendamento = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento);
    setShowCancelModal(true);
  };

  const handleSubmitCancel = async () => {
    if (selectedAgendamento) {
      // Simular envio de notificações
      console.log(`Enviando SMS para ${selectedAgendamento.telefone}`);
      console.log(`Enviando email para ${selectedAgendamento.email}`);
      
      const updatedAgendamentos = agendamentos.map(a => 
        a.id === selectedAgendamento.id 
          ? { ...a, status: 'cancelado' as const, observacoes: `${a.observacoes}\nMotivo do cancelamento: ${cancelReason}` }
          : a
      );
      setAgendamentos(updatedAgendamentos);
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedAgendamento(null);
    }
  };

  const handleApproveTestimonial = async (testimonial: Testimonial) => {
    await testimonialService.updateTestimonialStatus(testimonial.id, 'aprovado');
    loadTestimonials();
  };

  const handleRejectTestimonial = async (testimonial: Testimonial) => {
    await testimonialService.updateTestimonialStatus(testimonial.id, 'rejeitado');
    loadTestimonials();
  };

  const handleRespondTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowResponseModal(true);
  };

  const handleSubmitResponse = async () => {
    if (selectedTestimonial) {
      await testimonialService.updateTestimonialStatus(selectedTestimonial.id, 'aprovado', responseText);
      setShowResponseModal(false);
      setResponseText('');
      setSelectedTestimonial(null);
      loadTestimonials();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="vintage-card p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">Acesso Administrativo</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Usuário</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            <button type="submit" className="w-full vintage-button">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <button onClick={handleLogout} className="vintage-button-secondary">
            Sair
          </button>
        </div>

        {/* Lista de Agendamentos */}
        <div className="bg-dark-light rounded-sm p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Agendamentos</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3">Cliente</th>
                  <th className="text-left py-3">Serviço</th>
                  <th className="text-left py-3">Data</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos.map((agendamento) => (
                  <tr key={agendamento.id} className="border-b border-gray-700">
                    <td className="py-3">{agendamento.cliente}</td>
                    <td className="py-3">{agendamento.servico}</td>
                    <td className="py-3">{agendamento.data} às {agendamento.horario}</td>
                    <td className="py-3">
                      <select
                        value={agendamento.status}
                        onChange={(e) => handleStatusChange(agendamento, e.target.value as Agendamento['status'])}
                        className="bg-dark border border-gray-700 rounded-sm px-2 py-1"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluido">Concluído</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td className="py-3">
                      {agendamento.status === 'concluido' && (
                        <button
                          onClick={() => {
                            setSelectedAgendamento(agendamento);
                            setShowUploadModal(true);
                          }}
                          className="vintage-button-secondary mr-2"
                        >
                          Upload Fotos
                        </button>
                      )}
                      {agendamento.status !== 'cancelado' && agendamento.status !== 'concluido' && (
                        <button
                          onClick={() => handleCancelAgendamento(agendamento)}
                          className="vintage-button-secondary mr-2"
                        >
                          Cancelar
                        </button>
                      )}
                      <button className="vintage-button">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Seção de Depoimentos */}
        <div className="bg-dark-light rounded-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Depoimentos Pendentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials
              .filter(t => t.status === 'pendente')
              .map((testimonial) => (
                <div key={testimonial.id} className="relative">
                  <TestimonialCard
                    name={testimonial.name}
                    comment={testimonial.comment}
                    rating={testimonial.rating}
                    date={testimonial.date}
                    foto={testimonial.isPositive ? renderAvatar(testimonial.isPositive, testimonial.name) : null}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleApproveTestimonial(testimonial)}
                      className="vintage-button-secondary text-sm"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleRejectTestimonial(testimonial)}
                      className="vintage-button-secondary text-sm"
                    >
                      Rejeitar
                    </button>
                    <button
                      onClick={() => handleRespondTestimonial(testimonial)}
                      className="vintage-button text-sm"
                    >
                      Responder
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Modal de Upload de Fotos */}
      {showUploadModal && selectedAgendamento?.status === 'concluido' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-light p-6 rounded-sm max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Upload de Fotos</h2>
            <div className="space-y-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFotoUpload}
                className="w-full"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="vintage-button-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitFotos}
                  className="vintage-button"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-light p-6 rounded-sm max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Cancelar Agendamento</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Motivo do Cancelamento</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-sm focus:outline-none focus:border-yellow-500"
                  rows={4}
                  placeholder="Digite o motivo do cancelamento..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                    setSelectedAgendamento(null);
                  }}
                  className="vintage-button-secondary"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmitCancel}
                  className="vintage-button"
                  disabled={!cancelReason.trim()}
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resposta ao Depoimento */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-light p-6 rounded-sm max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Responder Depoimento</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sua Resposta</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-sm focus:outline-none focus:border-yellow-500"
                  rows={4}
                  placeholder="Digite sua resposta ao depoimento..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseText('');
                    setSelectedTestimonial(null);
                  }}
                  className="vintage-button-secondary"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmitResponse}
                  className="vintage-button"
                  disabled={!responseText.trim()}
                >
                  Enviar Resposta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 