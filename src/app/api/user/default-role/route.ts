import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const VALID_ROLES = ['PHOTOGRAPHER', 'CONSUMER'] as const

/**
 * POST /api/user/default-role
 * Body: { role: "PHOTOGRAPHER" | "CONSUMER" }
 * Saves the caller's preferred dashboard. Auth required.
 */
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user?.id)
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  let role: string
  try {
    const body = await req.json()
    role = body.role
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 })
  }

  if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number]))
    return NextResponse.json({ error: 'الدور غير صالح' }, { status: 400 })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { defaultRole: role },
  })

  return NextResponse.json({ ok: true })
}
