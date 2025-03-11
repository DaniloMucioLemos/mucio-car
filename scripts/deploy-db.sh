#!/bin/bash

# Verifica se a DATABASE_URL foi fornecida
if [ -z "$1" ]; then
    echo "Por favor, forneça a DATABASE_URL como argumento"
    echo "Uso: ./deploy-db.sh 'postgres://sua-url-do-banco'"
    exit 1
fi

# Exporta a DATABASE_URL temporariamente
export DATABASE_URL="$1"

# Executa as migrações do Prisma
echo "Executando migrações do banco de dados..."
npx prisma migrate deploy

# Gera o cliente Prisma
echo "Gerando cliente Prisma..."
npx prisma generate

# Cria o usuário admin
echo "Criando usuário admin..."
npx tsx scripts/create-admin.ts 