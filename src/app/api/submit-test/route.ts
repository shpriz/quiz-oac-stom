import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Create user if doesn't exist
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
    })

    // Calculate result based on test number and score
    let result = ''
    const score = data.score

    if (data.testNumber === 1) {
      if (score >= 13 && score <= 23) {
        result = 'высокий уровень ухода за полостью рта у жителей психоневрологических интернатов'
      } else if (score >= 24 && score <= 34) {
        result = 'удовлетворительный уровень ухода за полостью рта у жителей психоневрологических интернатов'
      } else if (score >= 35 && score <= 45) {
        result = 'неудовлетворительный уровень ухода за полостью рта у жителей психоневрологических интернатов'
      } else if (score >= 46) {
        result = 'низкий уровень ухода за полостью рта у жителей психоневрологических интернатов'
      }
    } else if (data.testNumber === 2) {
      if (score >= 10 && score <= 18) {
        result = 'высокий уровень оказания стоматологической помощи жителям психоневрологических интернатов'
      } else if (score >= 19 && score <= 28) {
        result = 'удовлетворительный уровень оказания стоматологической помощи жителям психоневрологических интернатов'
      } else if (score >= 29 && score <= 35) {
        result = 'неудовлетворительный уровень оказания стоматологической помощи жителям психоневрологических интернатов'
      } else if (score >= 36) {
        result = 'низкий уровень оказания стоматологической помощи жителям психоневрологических интернатов'
      }
    } else if (data.testNumber === 3) {
      if (score >= 8 && score <= 15) {
        result = 'большинство жителей психоневрологических интернатов ведут здоровый образ жизни или близкий к нему'
      } else if (score >= 16 && score <= 23) {
        result = 'меньшинство жителей психоневрологических интернатов ведут здоровый образ жизни или близкий к нему'
      } else if (score >= 24) {
        result = 'жители психоневрологических интернатов не ведут здоровый образ жизни или близкий к нему'
      }
    } else if (data.testNumber === 4) {
      if (score >= 4 && score <= 8) {
        result = 'высокий уровень ухода за полостью рта у лиц, находящихся в отделении милосердия'
      } else if (score >= 9 && score <= 13) {
        result = 'удовлетворительный уровень ухода за полостью рта у лиц, находящихся в отделении милосердия'
      } else if (score >= 14) {
        result = 'низкий уровень ухода за полостью рта у лиц, находящихся в отделении милосердия'
      }
    }

    // Save test result
    const testResult = await prisma.testResult.create({
      data: {
        userId: user.id,
        testNumber: data.testNumber,
        answers: data.answers,
        score: data.score,
        result,
      },
    })

    return NextResponse.json({ success: true, testResult })
  } catch (error) {
    console.error('Error saving test result:', error)
    return NextResponse.json(
      { error: 'Failed to save test result' },
      { status: 500 }
    )
  }
}
