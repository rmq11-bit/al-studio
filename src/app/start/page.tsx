import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'الاستوديو | اعثر على المصور المناسب لمناسبتك',
  description:
    'الاستوديو منصة تجمع بين المصورين المحترفين والعملاء في السعودية لطلبات التصوير للمناسبات والتصوير التجاري وتصوير المنتجات.',
}

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: '١',
    icon: '🔍',
    title: 'ابحث',
    desc: 'اختر التخصص والمدينة والسعر المناسب.',
  },
  {
    number: '٢',
    icon: '📩',
    title: 'أرسل طلبك',
    desc: 'صف احتياجك وموعد التصوير.',
  },
  {
    number: '٣',
    icon: '💬',
    title: 'ابدأ التواصل',
    desc: 'المصور يستلم الطلب ويتم الاتفاق مباشرة.',
  },
]

const clientBenefits = [
  { icon: '🔍', text: 'ابحث بسهولة عن المصور المناسب' },
  { icon: '🖼️', text: 'شاهد معرض الأعمال قبل التواصل' },
  { icon: '💬', text: 'تواصل مباشر مع المصور' },
]

const photographerBenefits = [
  { icon: '👤', text: 'أنشئ ملفك الشخصي' },
  { icon: '🎨', text: 'اعرض أعمالك' },
  { icon: '📥', text: 'استقبل طلبات من عملاء جدد' },
]

const features = [
  { icon: '📸', label: 'مصورون متخصصون' },
  { icon: '🖼️', label: 'معرض أعمال احترافي' },
  { icon: '💬', label: 'تواصل مباشر' },
  { icon: '🏢', label: 'مناسب للأفراد والشركات' },
  { icon: '⚡', label: 'تجربة سهلة وسريعة' },
  { icon: '🇸🇦', label: 'منصة سعودية 100%' },
]

const faqs = [
  {
    q: 'هل الدفع داخل المنصة؟',
    a: 'لا، الاتفاق يتم مباشرة بين العميل والمصور خارج المنصة بالطريقة التي يتفقان عليها.',
  },
  {
    q: 'هل التسجيل مجاني؟',
    a: 'نعم، يمكن إنشاء حساب والبدء باستخدام المنصة بسهولة. التسجيل للعملاء مجاني تماماً.',
  },
  {
    q: 'كيف أتواصل مع المصور؟',
    a: 'يمكنك إرسال طلب مباشرة من صفحة المصور، وسيتلقى الطلب ويتواصل معك فوراً عبر المنصة.',
  },
  {
    q: 'هل يمكنني مشاهدة أعمال المصور قبل التواصل؟',
    a: 'بالتأكيد. كل مصور لديه معرض أعمال كامل يمكنك الاطلاع عليه قبل اتخاذ أي قرار.',
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function StartPage() {
  return (
    <div className="min-h-screen">

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#C0A4A3]/8 via-white to-white py-24 sm:py-32 px-4">
        {/* Decorative blobs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#C0A4A3]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#C0A4A3]/6 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-[#C0A4A3]/10 text-[#C0A4A3] text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
            <span>📸</span>
            <span>منصة المصورين الأولى في المملكة</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-800 mb-6 leading-tight">
            اعثر على المصور المناسب
            <br />
            <span className="text-[#C0A4A3]">لمناسبتك خلال دقائق</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto">
            الاستوديو منصة تجمع بين المصورين المحترفين والعملاء في السعودية لطلبات التصوير
            للمناسبات والتصوير التجاري وتصوير المنتجات.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/browse"
              className="bg-[#C0A4A3] text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-[#A88887] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
            >
              ابحث عن مصور
            </Link>
            <Link
              href="/auth/register?role=photographer"
              className="border-2 border-[#C0A4A3] text-[#C0A4A3] px-10 py-4 rounded-2xl text-lg font-bold hover:bg-[#C0A4A3] hover:text-white transition-all w-full sm:w-auto"
            >
              سجل كمصور
            </Link>
          </div>

          {/* Social proof hint */}
          <p className="text-sm text-gray-400 mt-8">
            مصورون محترفون في الرياض، جدة، الدمام، وجميع مناطق المملكة
          </p>
        </div>
      </section>

      {/* ── 2. HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">كيف تعمل المنصة؟</h2>
            <p className="text-gray-400 text-sm">ثلاث خطوات بسيطة وتنتهي</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#C0A4A3]/30 transition-all text-center h-full">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#C0A4A3] text-white text-xs font-black mb-5">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 bg-[#C0A4A3]/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    {step.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
                </div>

                {/* Connector arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -left-3 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-gray-100 rounded-full items-center justify-center shadow-sm">
                    <span className="text-[#C0A4A3] text-xs font-black">←</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. BENEFITS ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">لماذا الاستوديو؟</h2>
            <p className="text-gray-400 text-sm">مزايا مصمّمة لكلا الطرفين</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Clients */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#C0A4A3]/10 rounded-xl flex items-center justify-center text-xl">
                  🙋
                </div>
                <h3 className="text-lg font-bold text-gray-800">للعملاء</h3>
              </div>
              <ul className="space-y-4">
                {clientBenefits.map((b) => (
                  <li key={b.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#C0A4A3]/10 rounded-lg flex items-center justify-center text-base shrink-0 mt-0.5">
                      {b.icon}
                    </div>
                    <span className="text-sm text-gray-600 font-medium leading-relaxed pt-1">
                      {b.text}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 text-[#C0A4A3] font-semibold text-sm hover:gap-3 transition-all"
                >
                  تصفح المصورين ←
                </Link>
              </div>
            </div>

            {/* Photographers */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#C0A4A3]/10 rounded-xl flex items-center justify-center text-xl">
                  📷
                </div>
                <h3 className="text-lg font-bold text-gray-800">للمصورين</h3>
              </div>
              <ul className="space-y-4">
                {photographerBenefits.map((b) => (
                  <li key={b.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#C0A4A3]/10 rounded-lg flex items-center justify-center text-base shrink-0 mt-0.5">
                      {b.icon}
                    </div>
                    <span className="text-sm text-gray-600 font-medium leading-relaxed pt-1">
                      {b.text}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/auth/register?role=photographer"
                  className="inline-flex items-center gap-2 text-[#C0A4A3] font-semibold text-sm hover:gap-3 transition-all"
                >
                  سجل كمصور ←
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. PLATFORM FEATURES ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">ما يميّز المنصة</h2>
            <p className="text-gray-400 text-sm">كل ما تحتاجه في مكان واحد</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.label}
                className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:border-[#C0A4A3]/40 hover:shadow-sm transition-all"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <p className="text-sm font-semibold text-gray-700 leading-snug">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PHOTOGRAPHER CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#C0A4A3]">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
            📷
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">هل أنت مصور؟</h2>
          <p className="text-white/85 leading-relaxed mb-10 max-w-xl mx-auto">
            أنشئ ملفك الشخصي وابدأ في الوصول إلى عملاء جدد. اعرض أعمالك، حدد أسعارك، واستقبل
            الطلبات مباشرة.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?role=photographer"
              className="bg-white text-[#C0A4A3] px-10 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-colors shadow-md"
            >
              ابدأ كمصور
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white/50 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:border-white hover:bg-white/10 transition-all"
            >
              عرض الأسعار
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">أسئلة شائعة</h2>
            <p className="text-gray-400 text-sm">إجابات على أكثر الأسئلة التي يطرحها المستخدمون</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-7"
              >
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#C0A4A3]/10 rounded-lg flex items-center justify-center text-[#C0A4A3] font-black text-sm shrink-0 mt-0.5">
                    ؟
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">{faq.q}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More questions nudge */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400">
              لديك سؤال آخر؟{' '}
              <Link href="/contact" className="text-[#C0A4A3] font-semibold hover:underline">
                تواصل معنا
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA strip ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">جاهز للبدء؟</h2>
          <p className="text-gray-400 text-sm mb-8">
            انضم إلى الاستوديو وابدأ تجربتك الآن — مجاناً
          </p>
          <Link
            href="/browse"
            className="bg-[#C0A4A3] text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-[#A88887] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-block"
          >
            ابحث عن مصور الآن
          </Link>
        </div>
      </section>

    </div>
  )
}
