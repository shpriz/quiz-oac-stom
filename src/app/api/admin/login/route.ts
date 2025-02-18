import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import util from 'util'

const scrypt = util.promisify(crypto.scrypt)

const prisma = new PrismaClient()

async function verifyPassword(password: string, hashedPassword: string) {
  const [salt, key] = hashedPassword.split(':')
  const derivedKey = await scrypt(password, salt, 64)
  return key === derivedKey.toString('hex')
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
