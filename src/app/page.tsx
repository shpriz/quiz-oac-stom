import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <div className="text-center space-y-8 p-8 rounded-lg bg-white shadow-xl max-w-2xl mx-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Добро пожаловать в систему тестирования
        </h1>
        <p className="text-xl text-gray-600 mt-4">
          Система оценки качества стоматологической помощи в психоневрологических интернатах
        </p>
        <div className="mt-8 space-y-4">
          <Link 
            href="/test"
            className="block w-full px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Начать тестирование
          </Link>
          <Link 
            href="/admin"
            className="block w-full px-6 py-3 text-lg font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Вход для администратора
          </Link>
        </div>
      </div>
    </main>
  )
}
