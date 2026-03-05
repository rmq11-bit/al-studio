'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const ROLES = [
  {
    key: 'PHOTOGRAPHER' as const,
    icon: '📷',
    label: 'مصور',
    desc: 'أدر ملفك الشخصي، استقبل الطلبات، وقدّم عروضك',
    dashboard: '/photographer/dashboard',
  },
  {
    key: 'CONSUMER' as const,
    icon: '👤',
    label: 'عميل',
    desc: 'ابحث عن مصورين، أنشئ مشاريع، وأدر طلباتك',
    dashboard: '/consumer/dashboard',
  },
]

export default function ChooseRolePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  // Redirect to login if unauthenticated once loading is done
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#C0A4A3] border-t-transparent rounded-full" />
      </div>
    )
  }

  const userRole = (session?.user as any)?.role as string | undefined

  async function selectRole(role: string, dashboard: string) {
    setLoading(role)
    setError('')
    try {
      const res = await fetch('/api/user/default-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'حدث خطأ. حاول مرة أخرى.')
        setLoading(null)
        return
      }
      router.push(dashboard)
    } catch {
      setError('تعذّر الاتصال بالخادم.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-[#C0A4A3] block mb-4">
            الاستوديو
          </Link>
          <h1 className="text-xl font-black text-gray-800 mb-1">
            مرحباً، {session?.user?.name} 👋
          </h1>
          <p className="text-gray-400 text-sm">كيف تريد المتابعة؟</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Role cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {ROLES.map(({ key, icon, label, desc, dashboard }) => {
            const isMyRole = key === userRole
            const isLoading = loading === key

            return (
              <button
                key={key}
                onClick={() => isMyRole ? selectRole(key, dashboard) : undefined}
                disabled={!isMyRole || loading !== null}
                className={`relative p-5 rounded-2xl border-2 text-center transition-all ${
                  isMyRole
                    ? 'border-[#C0A4A3] bg-[#C0A4A3]/5 hover:bg-[#C0A4A3]/10'
                    : 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                } disabled:cursor-not-allowed`}
              >
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-bold text-sm text-gray-800 mb-1">{label}</div>
                <div className="text-[11px] text-gray-400 leading-tight">{desc}</div>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
                    <div className="animate-spin w-5 h-5 border-2 border-[#C0A4A3] border-t-transparent rounded-full" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <p className="text-center text-xs text-gray-400">
          يتم حفظ اختيارك وتطبيقه في كل مرة تسجل دخولك
        </p>
      </div>
    </div>
  )
}
