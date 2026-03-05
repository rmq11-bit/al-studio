/**
 * /pricing/failed
 *
 * Shown when the payment provider redirects here after a failed / cancelled payment.
 * For Tap: configure this URL as the "fail" redirect in the Tap Dashboard.
 */

import Link from 'next/link'

export default function FailedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-xl font-black text-gray-800 mb-2">لم تتم عملية الدفع</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          يبدو أن العملية لم تكتمل أو تم إلغاؤها. لم يُخصم أي مبلغ من حسابك.
        </p>
        <Link
          href="/pricing"
          className="block w-full bg-[#C0A4A3] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#A88887] transition-colors"
        >
          حاول مرة أخرى
        </Link>
        <Link
          href="/"
          className="block mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  )
}
