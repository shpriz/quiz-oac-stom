const { PrismaClient } = require('@prisma/client')
const crypto = require('crypto')
const util = require('util')

const scrypt = util.promisify(crypto.scrypt)

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'mysql://quiz_user:quiz_password@db:3306/quiz_db'
    }
  }
})

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = await scrypt(password, salt, 64)
  return salt + ':' + derivedKey.toString('hex')
}

async function createAdmin() {
  try {
    const username = 'admin'
    const password = 'admin123'
    const hashedPassword = await hashPassword(password)

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
