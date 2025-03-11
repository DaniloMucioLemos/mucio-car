import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';

const prisma = new PrismaClient();

// GET /api/appointments/[id] - Busca um agendamento específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: params.id,
      },
      include: {
        service: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    return NextResponse.json({ error: 'Erro ao buscar agendamento' }, { status: 500 });
  }
}

// PUT /api/appointments/[id] - Atualiza um agendamento específico
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const appointment = await prisma.appointment.update({
      where: {
        id: params.id,
      },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        status: data.status,
        notes: data.notes,
        serviceId: data.serviceId,
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json({ error: 'Erro ao atualizar agendamento' }, { status: 500 });
  }
}

// DELETE /api/appointments/[id] - Remove um agendamento específico
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    await prisma.appointment.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Agendamento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    return NextResponse.json({ error: 'Erro ao excluir agendamento' }, { status: 500 });
  }
} 