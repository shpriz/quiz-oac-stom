const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'mysql://quiz_user:quiz_password@db:3306/quiz_db'
    }
  }
})

async function createAdmin() {
  try {
    const username = 'admin'
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await prisma.admin.upsert({
      where: { username },
      update: {
        password: hashedPassword
      },
      create: {
        username,
        password: hashedPassword
      }
    })

    console.log('Admin user created successfully:', {
      username: admin.username,
      id: admin.id
    })
  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
