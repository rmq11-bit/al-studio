import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'تواصل معنا | الاستوديو',
  description: 'تواصل مع فريق الاستوديو لأي استفسار أو ملاحظة',
}

const topics = [
  { icon: '🐛', label: 'الإبلاغ عن خطأ تقني' },
  { icon: '💡', label: 'اقتراح ميزة جديدة' },
  { icon: '🤝', label: 'الشراكات والتعاون' },
  { icon: '⚖️', label: 'استفسارات قانونية أو الخصوصية' },
  { icon: '🗑️', label: 'طلب حذف حساب أو بيانات' },
  { icon: '❓', label: 'أي استفسار آخر' },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block bg-[#C0A4A3]/10 text-[#C0A4A3] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            تواصل معنا
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-4">نسعد بسماعك</h1>
          <p className="text-gray-500 leading-relaxed">
            سواء كان لديك سؤال، ملاحظة، أو فكرة تريد مشاركتها — فريقنا هنا ومسرور بالاستماع إليك والرد في أقرب وقت ممكن.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Email card */}
            <div className="sm:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-[#C0A4A3]/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
                ✉️
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">راسلنا عبر البريد الإلكتروني</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                أرسل لنا رسالتك وسنرد عليك خلال يوم عمل واحد بإذن الله
              </p>
              <a
                href="mailto:hello@al-studio.sa"
                className="inline-flex items-center gap-2 bg-[#C0A4A3] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#A88887] transition-colors text-sm"
              >
                <span>hello@al-studio.sa</span>
              </a>
              <p className="text-xs text-gray-400 mt-4">
                نوقت الرد المعتاد: خلال 24 ساعة في أيام العمل
              </p>
            </div>

            {/* Topics */}
            <div className="sm:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h3 className="font-bold text-gray-800 mb-5">يمكنك التواصل بخصوص</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topics.map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl"
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span className="text-sm text-gray-600 font-medium">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links to help pages */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">قبل التواصل</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                قد تجد إجابتك في أحد هذه الصفحات:
              </p>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-sm text-[#C0A4A3] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>←</span> كيف تعمل المنصة؟
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-[#C0A4A3] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>←</span> الشروط والأحكام
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-[#C0A4A3] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>←</span> سياسة الخصوصية
                  </Link>
                </li>
              </ul>
            </div>

            {/* Response promise */}
            <div className="bg-[#C0A4A3]/5 border border-[#C0A4A3]/20 rounded-2xl p-6 flex flex-col justify-center">
              <div className="text-3xl mb-3">🙏</div>
              <h3 className="font-bold text-gray-800 mb-2">وعدنا لك</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                كل ملاحظة تصلنا تُقرأ بعناية. رأيك يساعدنا على تحسين المنصة يوماً بعد يوم لتكون الأفضل لك وللمصورين.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
