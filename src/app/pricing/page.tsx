'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const features = [
  { icon: '🔍', text: 'الظهور في نتائج البحث' },
  { icon: '📩', text: 'استقبال الطلبات المباشرة' },
  { icon: '💼', text: 'تقديم عروض على المشاريع' },
  { icon: '📊', text: 'لوحة تحكم احترافية' },
  { icon: '📈', text: 'إحصائيات الأداء' },
  { icon: '🎧', text: 'دعم فني' },
]

function PricingPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requiresSubscription = searchParams.get('reason') === 'required'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubscribe() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/subscription/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'photographer_monthly' }),
      })
      if (res.status === 401) {
        // Not logged in — redirect to login, come back to pricing after
        router.push('/auth/login?callbackUrl=/pricing')
        return
      }
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'حدث خطأ. حاول مرة أخرى.')
        return
      }
      // Redirect to provider checkout URL (mock → /pricing/success, real → Tap hosted page)
      window.location.href = data.redirectUrl
    } catch {
      setError('تعذّر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-lg mx-auto">

        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-800 mb-3">الأسعار</h1>
          <p className="text-gray-500">باقة واحدة. بدون رسوم خفية. ابدأ فوراً.</p>
        </div>

        {/* Subscription required alert — shown when redirected from a gated page */}
        {requiresSubscription && (
          <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-5 py-4 text-sm font-medium">
            <span className="text-lg shrink-0">🔒</span>
            <span>تحتاج اشتراك نشط لاستخدام هذه الميزة</span>
          </div>
        )}

        {/* Pricing card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Card header with price */}
          <div className="bg-[#C0A4A3] px-8 py-10 text-center text-white">
            <p className="text-sm font-semibold tracking-wide mb-4 opacity-90">باقة المصورين</p>
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-6xl font-black tracking-tight">49</span>
              <span className="text-2xl font-bold opacity-90">ريال</span>
            </div>
            <p className="text-sm opacity-70 mt-1">شهرياً • بدون عقد</p>
          </div>

          {/* Psychological value section */}
          <div className="bg-[#C0A4A3]/10 border-b border-[#C0A4A3]/20 px-8 py-6 text-center">
            <p className="text-gray-800 font-black text-base leading-snug mb-3">
              استثمر{' '}
              <span className="text-[#C0A4A3]">49 ريال</span>
              {' '}... واحصل على عملاء طوال الشهر
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              مشروع واحد فقط بقيمة{' '}
              <span className="font-black text-gray-700">500 ريال</span>
              {' '}يغطي اشتراكك{' '}
              <span className="font-black text-[#C0A4A3] text-base">10×</span>
              .{' '}
              <br className="hidden sm:block" />
              كل عميل إضافي هو ربح صافٍ لك.
            </p>
          </div>

          {/* Scarcity section */}
          <div className="border-b border-gray-100 px-8 py-6 text-center">
            <div className="inline-block mb-3">
              <p className="text-gray-700 font-bold text-sm mb-1.5">عدد محدود لكل مدينة</p>
              <div className="h-0.5 w-10 bg-[#C0A4A3] rounded-full mx-auto" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
              نقبل عدد محدود من المصورين في كل مدينة لضمان جودة الطلبات وعدم تشبع السوق.{' '}
              بمجرد اكتمال العدد، يتم إغلاق التسجيل مؤقتاً.
            </p>
          </div>

          {/* Features list */}
          <div className="px-8 py-8">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-5">
              ما يشمله الاشتراك
            </p>
            <ul className="space-y-4 mb-8">
              {features.map((f) => (
                <li key={f.text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C0A4A3]/10 flex items-center justify-center shrink-0">
                    <span className="text-base">{f.icon}</span>
                  </div>
                  <span className="text-gray-700 text-sm font-medium flex-1">{f.text}</span>
                  <span className="text-[#C0A4A3] font-black text-lg shrink-0">✓</span>
                </li>
              ))}
            </ul>

            {/* CTA button */}
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-[#C0A4A3] text-white py-4 rounded-xl font-bold text-base hover:bg-[#A88887] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'جارٍ التحميل...' : 'ابدأ الاشتراك الآن'}
            </button>

            {error && (
              <p className="text-center text-xs text-red-500 mt-3">{error}</p>
            )}

            <p className="text-center text-xs text-gray-400 mt-4">
              بإمكانك الإلغاء في أي وقت
            </p>
          </div>
        </div>

        {/* FAQ / bottom note */}
        <div className="mt-10 text-center space-y-2">
          <p className="text-sm text-gray-500">
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login" className="text-[#C0A4A3] font-semibold hover:underline">
              سجل دخولك
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            جديد في المنصة؟{' '}
            <Link href="/auth/register?role=photographer" className="text-[#C0A4A3] font-semibold hover:underline">
              أنشئ حسابك مجاناً
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}

// Suspense wrapper required because useSearchParams() is called inside PricingPageInner
export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C0A4A3] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PricingPageInner />
    </Suspense>
  )
}
