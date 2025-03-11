#!/bin/bash

# Verifica se a DATABASE_URL foi fornecida
if [ -z "$1" ]; then
    echo "Por favor, forneça a DATABASE_URL como argumento"
    echo "Uso: ./create-admin-prod.sh 'postgres://sua-url-do-banco'"
    exit 1
fi

# Exporta a DATABASE_URL temporariamente
export DATABASE_URL="$1"

# Executa o script com a DATABASE_URL de produção
echo "Executando script com DATABASE_URL de produção..."
npx tsx scripts/create-admin.ts 

./scripts/deploy-db.sh 'postgresql://neondb_owner:npg_VgNeME4j9AQO@ep-mute-scene-a8h6ekc7-pooler.eastus2.azure.neon.tech/neondb?sslmode=require' 