'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import quizData from '@/data/quiz-data.json'

const userSchema = z.object({
  firstName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  lastName: z.string().min(2, 'Фамилия должна содержать минимум 2 символа'),
})

type UserFormData = z.infer<typeof userSchema>

export default function TestForm() {
  const [step, setStep] = useState<'user-info' | 'test' | 'complete'>('user-info')
  const [currentTest, setCurrentTest] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [userInfo, setUserInfo] = useState<UserFormData | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  const onUserSubmit = async (data: UserFormData) => {
    setUserInfo(data)
    setStep('test')
  }

  const handleAnswerSelect = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }))
  }

  const handleTestSubmit = async () => {
    if (!userInfo) return

    const testData = {
      ...userInfo,
      testNumber: currentTest + 1,
      answers,
      score: Object.values(answers).reduce((a, b) => a + b, 0),
    }

    try {
      const response = await fetch('/api/submit-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      })

      if (response.ok) {
        setStep('complete')
      }
    } catch (error) {
      console.error('Error submitting test:', error)
    }
  }

  if (step === 'user-info') {
    return (
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Введите ваши данные</h2>
        <form onSubmit={handleSubmit(onUserSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имя
            </label>
            <input
              {...register('firstName')}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Фамилия
            </label>
            <input
              {...register('lastName')}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Начать тестирование
          </button>
        </form>
      </div>
    )
  }

  if (step === 'test') {
    const currentQuestions = quizData[currentTest].questions
    const isLastQuestion = currentTest === quizData.length - 1

    return (
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6">{quizData[currentTest].title}</h2>
        <div className="space-y-6">
          {currentQuestions.map((question, index) => (
            <div key={question.id} className="p-4 border rounded-lg">
              <p className="font-medium mb-4">
                {index + 1}. {question.text}
              </p>
              <div className="space-y-2">
                {question.answers.map((answer, answerIndex) => (
                  <label
                    key={answerIndex}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={question.scores[answerIndex]}
                      checked={answers[question.id] === question.scores[answerIndex]}
                      onChange={() => handleAnswerSelect(question.id, question.scores[answerIndex])}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>{answer}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          {isLastQuestion ? (
            <button
              onClick={handleTestSubmit}
              className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Завершить тест
            </button>
          ) : (
            <button
              onClick={() => setCurrentTest(prev => prev + 1)}
              className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Следующий раздел
            </button>
          )}
        </div>
      </div>
    )
  }

  if (step === 'complete') {
    return (
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Спасибо за прохождение теста!</h2>
        <p className="text-gray-600 mb-8">Ваши ответы были успешно сохранены.</p>
        <a
          href="/"
          className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Вернуться на главную
        </a>
      </div>
    )
  }

  return null
}
