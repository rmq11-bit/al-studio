'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function RegisterForm() {
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') === 'photographer' ? 'PHOTOGRAPHER' : 'CONSUMER'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState(initialRole)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim()) return setError('الاسم مطلوب')
    if (!email.trim()) return setError('البريد الإلكتروني مطلوب')
    if (!password || password.length < 6) return setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    if (password !== confirmPassword) return setError('كلمتا المرور غير متطابقتين')

    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.toLowerCase().trim(), password, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'حدث خطأ في التسجيل')
        setLoading(false)
        return
      }

      // Auto login
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('تم التسجيل بنجاح، يرجى تسجيل الدخول')
        window.location.href = '/auth/login'
      } else {
        // Hard navigation so the root layout re-runs auth() and SessionProvider
        // receives a fresh session. router.push() is a soft navigation that
        // leaves the root layout cached with session=null. router.refresh()
        // on top of push() races with the navigation and is unreliable.
        const dashboard = role === 'PHOTOGRAPHER' ? '/photographer/dashboard' : '/consumer/dashboard'
        window.location.href = dashboard
      }
    } catch {
      setError('حدث خطأ في الشبكة')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-black text-[#C0A4A3]">
            الاستوديو
          </Link>
          <p className="text-gray-500 mt-2 text-sm">إنشاء حساب جديد</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole('PHOTOGRAPHER')}
            className={`p-4 rounded-2xl border-2 text-center transition-all ${
              role === 'PHOTOGRAPHER'
                ? 'border-[#C0A4A3] bg-[#C0A4A3]/5 text-[#C0A4A3]'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">📷</div>
            <div className="font-bold text-sm">مصور</div>
          </button>
          <button
            type="button"
            onClick={() => setRole('CONSUMER')}
            className={`p-4 rounded-2xl border-2 text-center transition-all ${
              role === 'CONSUMER'
                ? 'border-[#C0A4A3] bg-[#C0A4A3]/5 text-[#C0A4A3]'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">👤</div>
            <div className="font-bold text-sm">عميل</div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم الكامل</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك الكامل"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 أحرف على الأقل"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد كتابة كلمة المرور"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C0A4A3] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#A88887] transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          لديك حساب بالفعل؟{' '}
          <Link href="/auth/login" className="text-[#C0A4A3] font-semibold hover:underline">
            سجل دخولك
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">تحميل...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
