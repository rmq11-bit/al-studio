import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { auth } from '@/auth'
import SessionProvider from '@/components/SessionProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'الاستوديو | منصة المصورين',
  description: 'منصة تجمع بين المصورين المحترفين والعملاء في المملكة العربية السعودية',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-[family-name:var(--font-cairo)] bg-white text-gray-900 min-h-screen antialiased flex flex-col">
        <SessionProvider session={session}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
