'use client'

import Link from 'next/link'

export default function PhotographerOnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 w-full max-w-md text-center">

        {/* Success icon */}
        <div className="text-6xl mb-5">🎉</div>

        {/* Title */}
        <h1 className="text-2xl font-black text-gray-800 mb-2">
          حسابك تم إنشاؤه بنجاح
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          أهلاً بك في الاستوديو — منصة المصورين المحترفين
        </p>

        {/* Subscription info card */}
        <div className="bg-[#C0A4A3]/10 rounded-2xl p-6 mb-6 border border-[#C0A4A3]/20 text-right">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl shrink-0">📢</span>
            <p className="text-gray-700 text-sm leading-relaxed">
              للظهور في البحث واستقبال الطلبات يجب تفعيل الاشتراك الشهري بقيمة{' '}
              <span className="font-black text-[#C0A4A3] text-base">49 ريال</span>.
            </p>
          </div>

          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-[#C0A4A3] font-bold">✓</span>
              الظهور في نتائج بحث العملاء
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#C0A4A3] font-bold">✓</span>
              استقبال الطلبات المباشرة
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#C0A4A3] font-bold">✓</span>
              تقديم عروض على مشاريع العملاء
            </li>
          </ul>
        </div>

        {/* Primary CTA → goes to pricing page */}
        <Link
          href="/pricing"
          className="block w-full bg-[#C0A4A3] text-white py-4 rounded-xl font-bold text-base hover:bg-[#A88887] transition-colors mb-3 shadow-sm text-center"
        >
          فعّل اشتراكك الآن
        </Link>

        {/* Skip link */}
        <Link
          href="/photographer/dashboard"
          className="block text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
        >
          متابعة بدون اشتراك ←
        </Link>
      </div>
    </div>
  )
}
