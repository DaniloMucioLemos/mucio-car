import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';

const prisma = new PrismaClient();

// GET /api/services/[id] - Busca um serviço específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const service = await prisma.service.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar serviço' },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Atualiza um serviço específico
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const service = await prisma.service.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        active: data.active,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar serviço' },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Remove um serviço específico
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await prisma.service.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao remover serviço' },
      { status: 500 }
    );
  }
} 