import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'من نحن | الاستوديو',
  description: 'تعرّف على منصة الاستوديو ورسالتها في ربط المصورين المحترفين بالعملاء في المملكة العربية السعودية',
}

const values = [
  {
    icon: '🤝',
    title: 'الثقة والشفافية',
    desc: 'نؤمن بأن العلاقة بين المصور والعميل تبنى على أساس الوضوح والأمانة. كل ملف شخصي موثّق وكل سعر ظاهر.',
  },
  {
    icon: '🏆',
    title: 'الاحترافية',
    desc: 'نستقبل المصورين المحترفين فقط ممن لديهم أعمال حقيقية تُثبت مستواهم، لضمان جودة الخدمة لكل عميل.',
  },
  {
    icon: '⚡',
    title: 'السهولة والسرعة',
    desc: 'صمّمنا المنصة لتكون بسيطة بلا تعقيد. ابحث، تواصل، وأنجز — كل ذلك في خطوات قليلة.',
  },
  {
    icon: '🇸🇦',
    title: 'محلية بالكامل',
    desc: 'الاستوديو منصة سعودية تفهم السوق المحلي واحتياجاته، من مناسبات الأفراح إلى التصوير التجاري الاحترافي.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-[#C0A4A3]/10 text-[#C0A4A3] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            من نحن
          </div>
          <h1 className="text-5xl font-black text-gray-800 mb-6 leading-tight">
            الاستوديو
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            منصة سعودية متخصصة تجمع المصورين المحترفين بالعملاء الباحثين عن خدمات تصوير عالية الجودة — سواء كانت مناسبات شخصية، أو تصوير تجاري، أو محتوى رقمي.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">رسالتنا</h2>
            <p className="text-gray-500 leading-loose text-base mb-4">
              نؤمن بأن كل لحظة تستحق أن تُوثَّق باحترافية. ولأن الحصول على مصور موثوق لم يكن دائماً أمراً سهلاً، أسّسنا <span className="text-[#C0A4A3] font-semibold">الاستوديو</span> لنجعل هذه العملية شفافة وسريعة ومريحة للجميع.
            </p>
            <p className="text-gray-500 leading-loose text-base mb-4">
              نربط العملاء في المملكة العربية السعودية بمصورين محترفين متخصصين في الأفراح والمناسبات، والتصوير التجاري وUGC، وعروض الشركات والحكومات، والتصوير السينمائي والجوي — وكل ما بينها.
            </p>
            <p className="text-gray-500 leading-loose text-base">
              نحن لسنا وكالة تصوير، بل وسيط موثوق يضمن سهولة التواصل وشفافية المعلومات، بينما تتم الاتفاقيات المالية بشكل مباشر بين الطرفين.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-4 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">قيمنا</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-4"
              >
                <div className="w-12 h-12 bg-[#C0A4A3]/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1.5">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#C0A4A3]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">جاهز للانطلاق؟</h2>
          <p className="text-white/80 text-sm mb-8">
            تصفح مصورينا المحترفين وابدأ مشروعك اليوم
          </p>
          <Link
            href="/browse"
            className="bg-white text-[#C0A4A3] px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors inline-block"
          >
            تصفح المصورين
          </Link>
        </div>
      </section>

    </div>
  )
}
