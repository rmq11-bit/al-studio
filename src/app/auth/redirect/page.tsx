/**
 * /auth/redirect — server-side post-login router.
 *
 * Called immediately after every login. Reads the user's saved defaultRole
 * from the DB and jumps to the correct dashboard. If none is saved yet,
 * sends the user to /choose-role to pick once.
 */
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

const DASHBOARD: Record<string, string> = {
  PHOTOGRAPHER: '/photographer/dashboard',
  CONSUMER: '/consumer/dashboard',
}

export default async function AuthRedirectPage() {
  const session = await auth()
  if (!session || !session.user?.id) redirect('/auth/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { defaultRole: true },
  })

  const target = user?.defaultRole ? DASHBOARD[user.defaultRole] : null
  if (target) redirect(target)

  // No defaultRole saved yet → show the chooser once
  redirect('/choose-role')
}
