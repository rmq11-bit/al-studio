import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | الاستوديو',
  description: 'تعرّف على كيفية جمع بيانات المستخدمين وحمايتها على منصة الاستوديو',
}

const sections = [
  {
    icon: '📋',
    title: 'البيانات التي نجمعها',
    items: [
      { label: 'الاسم الكامل', desc: 'لتعريف المستخدم في الملف الشخصي وعمليات التواصل.' },
      { label: 'البريد الإلكتروني', desc: 'لتسجيل الدخول والإشعارات المهمة المتعلقة بالحساب.' },
      { label: 'صورة الملف الشخصي', desc: 'اختيارية، تُعرض في الملف الشخصي لتسهيل التعرف على المستخدم.' },
      { label: 'معلومات المصور', desc: 'مثل التخصصات والسعر والموقع الجغرافي لعرضها في نتائج البحث.' },
      { label: 'الرسائل', desc: 'المحادثات بين العملاء والمصورين داخل المنصة لضمان استمرارية التواصل.' },
    ],
  },
  {
    icon: '⚙️',
    title: 'كيف نستخدم البيانات',
    items: [
      { label: 'تشغيل الخدمة', desc: 'لإنشاء الحسابات وإدارتها وعرض الملفات الشخصية في نتائج البحث.' },
      { label: 'التواصل', desc: 'لإرسال الإشعارات الضرورية المتعلقة بالحساب أو الطلبات.' },
      { label: 'تحسين المنصة', desc: 'لتحليل أنماط الاستخدام وتحسين تجربة المستخدم.' },
      { label: 'الأمن والحماية', desc: 'للكشف عن أي نشاط مشبوه وحماية حسابات المستخدمين.' },
    ],
  },
  {
    icon: '🚫',
    title: 'ما لا نفعله',
    items: [
      { label: 'لا نبيع البيانات', desc: 'لن نبيع أو نتاجر ببياناتك الشخصية مع أي جهة خارجية مهما كانت.' },
      { label: 'لا نشارك البيانات', desc: 'لن نشارك معلوماتك مع أطراف ثالثة إلا في حالات يقتضيها النظام القانوني.' },
      { label: 'لا للإعلانات المستهدفة', desc: 'لا نستخدم بياناتك لأغراض إعلانية أو تسويقية لأطراف خارجية.' },
    ],
  },
  {
    icon: '🔐',
    title: 'حماية البيانات',
    items: [
      { label: 'تشفير كلمات المرور', desc: 'تُخزَّن كلمات المرور مشفرة ولا يمكن لأحد الاطلاع عليها بصيغتها الأصلية.' },
      { label: 'اتصال آمن', desc: 'تستخدم المنصة بروتوكول HTTPS لتشفير جميع البيانات أثناء النقل.' },
      { label: 'قاعدة بيانات مؤمّنة', desc: 'تُخزَّن بياناتك في خوادم مؤمّنة مع صلاحيات وصول محدودة ومراقبة مستمرة.' },
    ],
  },
  {
    icon: '✅',
    title: 'حقوقك',
    items: [
      { label: 'الاطلاع على بياناتك', desc: 'يمكنك في أي وقت طلب نسخة من بياناتك المخزّنة لدينا.' },
      { label: 'التعديل', desc: 'يمكنك تحديث أو تصحيح بياناتك مباشرة من إعدادات ملفك الشخصي.' },
      { label: 'الحذف', desc: 'يمكنك طلب حذف حسابك وجميع بياناتك بالتواصل معنا.' },
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-[#C0A4A3]/10 text-[#C0A4A3] text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            سياسة الخصوصية
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-3">سياسة الخصوصية</h1>
          <p className="text-gray-400 text-sm">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-gray-500 mt-4 leading-relaxed">
            خصوصيتك أمانة في عنقنا. نوضّح هنا بشفافية تامة ما نجمعه من بيانات، وكيف نستخدمها، وما لن نفعله بها أبداً.
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
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <span className="text-[#C0A4A3] font-black mt-0.5 shrink-0">✓</span>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">{item.label}: </span>
                      <span className="text-sm text-gray-500 leading-relaxed">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Commitment banner */}
          <div className="bg-[#C0A4A3] rounded-2xl p-6 sm:p-8 text-white text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="font-bold text-lg mb-2">التزامنا تجاهك</h3>
            <p className="text-white/85 text-sm leading-relaxed max-w-lg mx-auto">
              بياناتك تُستخدم فقط لتشغيل الخدمة وتحسينها. لن تُباع، لن تُشارَك، ولن تُستخدم لأي غرض خارج ما يخدمك مباشرة.
            </p>
          </div>

          {/* Contact note */}
          <div className="bg-gray-100/60 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-600">
              لأي استفسار بخصوص خصوصيتك أو طلب حذف بياناتك، يمكنك{' '}
              <Link href="/contact" className="text-[#C0A4A3] font-semibold hover:underline">
                التواصل معنا مباشرة
              </Link>
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
