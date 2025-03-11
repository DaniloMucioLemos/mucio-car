import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Iniciando criação do usuário admin...')
    
    const hashedPassword = await hash('admin123', 12)
    console.log('Senha criptografada gerada')
    
    console.log('Verificando se já existe um usuário admin...')
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@muciocar.com.br' }
    })
    
    if (existingUser) {
      console.log('Usuário admin já existe, atualizando senha...')
    } else {
      console.log('Usuário admin não encontrado, criando novo...')
    }
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@muciocar.com.br' },
      update: {
        hashedPassword,
        role: 'admin'
      },
      create: {
        email: 'admin@muciocar.com.br',
        name: 'Administrador',
        hashedPassword,
        role: 'admin'
      },
    })

    console.log('Operação concluída com sucesso:')
    console.log({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    })
  } catch (error) {
    console.error('Erro durante a criação/atualização do admin:')
    console.error(error)
    throw error
  }
}

main()
  .then(async () => {
    console.log('Script finalizado com sucesso')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Erro na execução do script:')
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 