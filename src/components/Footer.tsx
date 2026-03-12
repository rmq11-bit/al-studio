import Link from 'next/link'

const quickLinks = [
  { href: '/browse', label: 'تصفح المصورين' },
  { href: '/projects', label: 'المشاريع' },
]

const infoLinks = [
  { href: '/about', label: 'من نحن' },
  { href: '/how-it-works', label: 'كيف تعمل المنصة' },
  { href: '/terms', label: 'الشروط والأحكام' },
  { href: '/privacy', label: 'سياسة الخصوصية' },
  { href: '/contact', label: 'تواصل معنا' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <p className="text-2xl font-black text-[#C0A4A3] mb-3">الاستوديو</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              منصة تجمع المصورين المحترفين بعملائهم في المملكة العربية السعودية لتوثيق المناسبات والمشاريع التجارية وكل احتياجاتك التصويرية.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-4">روابط سريعة</p>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-400 hover:text-[#C0A4A3] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-4">معلومات</p>
            <ul className="space-y-2.5">
              {infoLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-400 hover:text-[#C0A4A3] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-300">
            © {new Date().getFullYear()} الاستوديو. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-xs text-gray-300 hover:text-[#C0A4A3] transition-colors">
              الشروط والأحكام
            </Link>
            <span className="text-gray-200">·</span>
            <Link href="/privacy" className="text-xs text-gray-300 hover:text-[#C0A4A3] transition-colors">
              سياسة الخصوصية
            </Link>
            <span className="text-gray-200">·</span>
            <Link href="/contact" className="text-xs text-gray-300 hover:text-[#C0A4A3] transition-colors">
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
