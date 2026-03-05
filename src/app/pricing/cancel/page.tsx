/**
 * /pricing/cancel
 *
 * Shown when the user cancels or the payment provider redirects here on cancellation.
 * For real Tap: configure this URL as the failure/cancel redirect in Tap Dashboard.
 */

import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">↩️</div>
        <h1 className="text-xl font-black text-gray-800 mb-2">تم إلغاء العملية</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          لم يُكمل الدفع ولم يُخصم أي مبلغ من حسابك. يمكنك الاشتراك في أي وقت.
        </p>
        <Link
          href="/pricing"
          className="block w-full bg-[#C0A4A3] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#A88887] transition-colors"
        >
          العودة للأسعار
        </Link>
        <Link
          href="/"
          className="block mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          الصفحة الرئيسية
        </Link>
      </div>
    </div>
  )
}
