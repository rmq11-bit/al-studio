'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim()) return setError('البريد الإلكتروني مطلوب')
    if (!password) return setError('كلمة المرور مطلوبة')

    setLoading(true)
    const result = await signIn('credentials', {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    })

    if (result?.error) {
      setLoading(false)
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
    } else {
      // Hard navigation: forces the root layout to re-run auth() and give
      // SessionProvider a fresh session. A soft router.push() would leave
      // the root layout's cached null-session in place, causing useSession()
      // to return stale data in every client component until the next poll.
      window.location.href = '/auth/redirect'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-black text-[#C0A4A3]">
            الاستوديو
          </Link>
          <p className="text-gray-500 mt-2 text-sm">مرحباً بعودتك</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C0A4A3] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#A88887] transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ليس لديك حساب؟{' '}
          <Link href="/auth/register" className="text-[#C0A4A3] font-semibold hover:underline">
            سجل الآن
          </Link>
        </p>

      </div>
    </div>
  )
}
