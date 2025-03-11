import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciais inválidas');
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user || !user?.hashedPassword) {
            throw new Error('Usuário não encontrado');
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isCorrectPassword) {
            throw new Error('Senha incorreta');
          }

          if (user.role !== 'admin') {
            throw new Error('Acesso não autorizado');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error('Erro na autenticação:', error);
          throw new Error('Erro ao autenticar usuário');
        } finally {
          await prisma.$disconnect();
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}; 