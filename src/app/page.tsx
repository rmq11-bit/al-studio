import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { effectiveSubscriptionWhere } from '@/lib/subscription/isEffectiveSubscriptionActive'

export default async function HomePage() {
  const photographerCount = await prisma.photographerProfile.count({ where: effectiveSubscriptionWhere() })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#C0A4A3]/5 via-white to-white py-28 px-4">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#C0A4A3]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#C0A4A3]/5 rounded-full blur-2xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block bg-[#C0A4A3]/10 text-[#C0A4A3] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            منصة المصورين الأولى في المملكة
          </div>
          <h1 className="text-8xl sm:text-9xl font-black text-[#C0A4A3] mb-5 leading-none">
            الاستوديو
          </h1>
          <p className="text-xl text-gray-600 mb-3 font-medium">
            منصة تجمع بين المصورين المحترفين والعملاء
          </p>
          <p className="text-gray-400 mb-12 text-sm">
            {photographerCount.toLocaleString('ar-SA')}+ مصور محترف جاهز لخدمتك
          </p>

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
            <Link
              href="/auth/register?role=consumer"
              className="border-2 border-gray-200 text-gray-600 px-10 py-4 rounded-2xl text-lg font-bold hover:border-[#C0A4A3] hover:text-[#C0A4A3] transition-all w-full sm:w-auto"
            >
              سجل كعميل
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            كيف يعمل الاستوديو؟
          </h2>
          <p className="text-center text-gray-400 mb-12 text-sm">خطوات بسيطة للحصول على أفضل مصور</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍',
                step: '١',
                title: 'تصفح المصورين',
                desc: 'ابحث عن مصور متخصص حسب التخصص والميزانية والموقع الجغرافي. شاهد معرض أعمالهم وتقاويم توفرهم.',
              },
              {
                icon: '📋',
                step: '٢',
                title: 'أنشئ مشروعك',
                desc: 'انشر مشروعك بالتفاصيل وانتظر عروض المصورين مع أسعارهم المقترحة. اختر الأنسب لك.',
              },
              {
                icon: '💬',
                step: '٣',
                title: 'تواصل وأنجز',
                desc: 'تحدث مع المصور مباشرة، أرسل طلبك الخاص بتاريخ محدد، ووثّق مناسباتك باحترافية.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
              >
                <div className="w-14 h-14 bg-[#C0A4A3]/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-[#C0A4A3] text-xs font-bold mb-2">الخطوة {item.step}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            تخصصاتنا
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'افراح ومناسبات', icon: '💍' },
              { label: 'ايفنتات تجارية', icon: '🎪' },
              { label: 'عروض حكومية', icon: '🏛️' },
              { label: 'تصوير تجاري وUGC', icon: '👗' },
              { label: 'تصوير سينمائي', icon: '🎬' },
              { label: 'تصوير جوال', icon: '📱' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:border-[#C0A4A3] hover:shadow-sm transition-all cursor-default"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-xs font-semibold text-gray-600 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#C0A4A3]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">جاهز للبدء؟</h2>
          <p className="text-white/80 mb-8">
            انضم إلى منصة الاستوديو وابدأ رحلتك مع المصورين المحترفين
          </p>
          <Link
            href="/browse"
            className="bg-white text-[#C0A4A3] px-10 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-colors inline-block"
          >
            ابدأ الآن
          </Link>
        </div>
      </section>
    </div>
  )
}
