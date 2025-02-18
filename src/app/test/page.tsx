import { Metadata } from 'next'
import TestForm from '@/components/TestForm'

export const metadata: Metadata = {
  title: 'Тестирование - Система оценки качества стоматологической помощи',
  description: 'Система тестирования для оценки качества стоматологической помощи в психоневрологических интернатах',
}

export default function TestPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <TestForm />
      </div>
    </main>
  )
}
