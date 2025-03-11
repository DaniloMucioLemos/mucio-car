"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const createAdmin = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar usuário administrador");
      }

      setMessage(
        `Usuário administrador criado com sucesso!\nEmail: ${data.email}\nSenha: ${data.password}\nPor favor, anote estas credenciais e altere a senha após o primeiro login.`
      );

      setTimeout(() => {
        router.push("/admin/login");
      }, 5000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Configuração Inicial
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Crie o usuário administrador para começar
          </p>
        </div>

        {message && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-green-700 whitespace-pre-line">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div>
          <button
            onClick={createAdmin}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Criando..." : "Criar Usuário Administrador"}
          </button>
        </div>
      </div>
    </div>
  );
} 