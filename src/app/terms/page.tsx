import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'الشروط والأحكام | الاستوديو',
  description: 'اقرأ شروط وأحكام استخدام منصة الاستوديو',
}

const sections = [
  {
    icon: '🤝',
    title: 'دور المنصة',
    points: [
      'الاستوديو وسيط إلكتروني يربط العملاء بالمصورين المحترفين، ولا يُعدّ طرفاً في أي عقد أو اتفاق بينهما.',
      'لا تتحمل المنصة أي مسؤولية عن جودة الخدمة المقدمة من المصور أو التزام أي طرف بشروط الاتفاق.',
      'يقتصر دور الاستوديو على توفير بيئة آمنة للتواصل وعرض الملفات الشخصية.',
    ],
  },
  {
    icon: '💰',
    title: 'الاتفاقيات المالية',
    points: [
      'تتم جميع الاتفاقيات المالية بين العميل والمصور بشكل مباشر خارج المنصة، دون أي تدخل من الاستوديو.',
      'لا تتقاضى المنصة أي عمولة على الصفقات المبرمة بين العملاء والمصورين.',
      'الاشتراك الشهري للمصورين هو الرسوم الوحيدة التي تجمعها المنصة، وهو مقابل خدمة الظهور والوصول للعملاء.',
      'المنصة غير مسؤولة عن أي نزاعات مالية تنشأ بين الأطراف.',
    ],
  },
  {
    icon: '👤',
    title: 'مسؤولية المستخدم',
    points: [
      'يتحمل المستخدم كامل المسؤولية عن صحة ودقة المعلومات التي يقدمها عند التسجيل أو تعديل ملفه الشخصي.',
      'يُحظر نشر محتوى مضلل أو صور لا تعكس الجودة الفعلية للعمل.',
      'يلتزم المصور بتقديم خدمة تتطابق مع ما يعرضه في ملفه الشخصي.',
      'يحق للمنصة إيقاف أو حذف أي حساب يخالف هذه الشروط دون إشعار مسبق.',
    ],
  },
  {
    icon: '🔒',
    title: 'استخدام الخدمة',
    points: [
      'يجب أن يكون المستخدم قادراً قانونياً على إبرام العقود وفق الأنظمة السعودية.',
      'يُحظر استخدام المنصة لأي أغراض غير مشروعة أو مخالفة للأنظمة والتشريعات المعمول بها في المملكة العربية السعودية.',
      'يُحظر نشر أي محتوى مسيء أو مخالف للآداب العامة.',
      'المنصة غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة تنتج عن استخدام الخدمة.',
    ],
  },
  {
    icon: '🔄',
    title: 'تعديل الشروط',
    points: [
      'تحتفظ المنصة بحق تعديل هذه الشروط في أي وقت.',
      'سيتم إشعار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني المسجّل.',
      'الاستمرار في استخدام المنصة بعد نشر التعديلات يعني قبولك لها.',
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-[#C0A4A3]/10 text-[#C0A4A3] text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            الشروط والأحكام
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-3">الشروط والأحكام</h1>
          <p className="text-gray-400 text-sm">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-gray-500 mt-4 leading-relaxed">
            يُرجى قراءة هذه الشروط بعناية قبل استخدام منصة الاستوديو. باستخدامك للمنصة، فإنك توافق على الالتزام بهذه الشروط.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="py-12 px-4 pb-20">
        <div className="max-w-3xl mx-auto space-y-5">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#C0A4A3]/10 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {section.icon}
                </div>
                <h2 className="text-lg font-bold text-gray-800">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.points.map((point, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-500 leading-relaxed">
                    <span className="text-[#C0A4A3] font-bold mt-0.5 shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact note */}
          <div className="bg-[#C0A4A3]/5 border border-[#C0A4A3]/20 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-600">
              لأي استفسار بخصوص هذه الشروط، يمكنك{' '}
              <Link href="/contact" className="text-[#C0A4A3] font-semibold hover:underline">
                التواصل معنا
              </Link>
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
