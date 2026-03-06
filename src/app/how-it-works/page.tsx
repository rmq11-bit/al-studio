import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'كيف تعمل المنصة | الاستوديو',
  description: 'تعرّف على آلية عمل منصة الاستوديو وكيف توصّل العملاء بالمصورين المحترفين',
}

const steps = [
  {
    number: '١',
    icon: '🔍',
    title: 'العميل يبحث عن مصور',
    desc: 'تصفّح قائمة المصورين المحترفين وفلترها حسب التخصص والموقع والسعر. شاهد معرض أعمال كل مصور واطّلع على تقويم توفره قبل التواصل.',
    role: 'عميل',
  },
  {
    number: '٢',
    icon: '📩',
    title: 'يرسل طلباً مباشراً أو ينشر مشروعاً',
    desc: 'للمشاريع المحددة: أرسل طلباً مباشراً للمصور المفضّل لديك بتفاصيل الموعد والمدة. أو انشر مشروعك العام وانتظر عروض المصورين المختلفين.',
    role: 'عميل',
  },
  {
    number: '٣',
    icon: '💬',
    title: 'المصور يرد ويتواصل',
    desc: 'يتلقى المصور طلبك ويستطيع الرد عبر نظام الرسائل المدمج في المنصة. يمكن تبادل التفاصيل وتوضيح المتطلبات قبل الاتفاق النهائي.',
    role: 'مصور',
  },
  {
    number: '٤',
    icon: '🤝',
    title: 'يتم الاتفاق خارج المنصة',
    desc: 'بعد التواصل الأولي، يتفق الطرفان على التفاصيل المالية وطريقة الدفع بشكل مباشر خارج المنصة. الاستوديو وسيط شفاف لا يتدخل في الاتفاقيات المالية.',
    role: 'الطرفان',
  },
]

const faqs = [
  {
    q: 'هل المنصة مجانية للعملاء؟',
    a: 'نعم، التسجيل والبحث والتواصل مجاني تماماً للعملاء. الاشتراك المدفوع مخصص للمصورين فقط.',
  },
  {
    q: 'كيف أضمن جودة المصور؟',
    a: 'كل مصور يرفع معرض أعماله الحقيقية عند التسجيل. يمكنك مشاهدة الأعمال وقراءة التخصصات قبل أي قرار.',
  },
  {
    q: 'هل الدفع يتم عبر المنصة؟',
    a: 'لا. الاتفاق المالي يتم مباشرة بين العميل والمصور خارج المنصة بالطريقة التي يتفقان عليها.',
  },
  {
    q: 'ماذا لو لم أجد مصوراً مناسباً؟',
    a: 'يمكنك نشر مشروعك في قسم "المشاريع" وسيتقدم إليك المصورون المناسبون بعروضهم.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-[#C0A4A3]/10 text-[#C0A4A3] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            كيف تعمل المنصة
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-4">
            أربع خطوات بسيطة
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            صمّمنا الاستوديو ليكون بسيطاً وشفافاً — من البحث حتى الاتفاق النهائي
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-5">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start"
              >
                {/* Step number + icon */}
                <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-2 shrink-0">
                  <div className="w-14 h-14 bg-[#C0A4A3]/10 rounded-2xl flex items-center justify-center text-3xl">
                    {step.icon}
                  </div>
                  <div className="text-[#C0A4A3] text-xs font-bold">الخطوة {step.number}</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-medium">
                      {step.role}
                    </span>
                  </div>
                  <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
                </div>

                {/* Connector arrow (not on last) */}
                {index < steps.length - 1 && (
                  <div className="hidden sm:flex absolute" />
                )}
              </div>
            ))}
          </div>

          {/* Arrow between steps — decorative */}
          <div className="flex justify-center my-2 text-[#C0A4A3]/30 text-2xl select-none">↓</div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-4 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">أسئلة شائعة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <h4 className="font-bold text-gray-800 mb-2 text-sm">{faq.q}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#C0A4A3]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">ابدأ الآن</h2>
          <p className="text-white/80 text-sm mb-8">
            التسجيل مجاني للعملاء — ابحث عن مصور الآن
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/browse"
              className="bg-white text-[#C0A4A3] px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              تصفح المصورين
            </Link>
            <Link
              href="/auth/register?role=photographer"
              className="border-2 border-white/50 text-white px-8 py-3.5 rounded-xl font-bold hover:border-white transition-colors"
            >
              سجل كمصور
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
