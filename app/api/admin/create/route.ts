import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST() {
  const email = "admin@muciocar.com";
  const password = "admin123"; // Você deve alterar esta senha após o primeiro login

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Usuário administrador já existe!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name: "Administrador",
        hashedPassword,
        role: "admin",
      },
    });

    return NextResponse.json(
      {
        message: "Usuário administrador criado com sucesso!",
        email,
        password,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar usuário administrador:", error);
    return NextResponse.json(
      { message: "Erro ao criar usuário administrador" },
      { status: 500 }
    );
  }
} 