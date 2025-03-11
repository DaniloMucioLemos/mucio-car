const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "admin@muciocar.com";
  const password = "admin123"; // Você deve alterar esta senha após o primeiro login

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("Usuário administrador já existe!");
      return;
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

    console.log("Usuário administrador criado com sucesso!");
    console.log("Email:", email);
    console.log("Senha:", password);
    console.log("Por favor, altere a senha após o primeiro login.");
  } catch (error) {
    console.error("Erro ao criar usuário administrador:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 