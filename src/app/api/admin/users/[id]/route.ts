/**
 * Admin user management API
 * PATCH /api/admin/users/:id  { action: 'ban' | 'unban' }
 * DELETE /api/admin/users/:id
 */
import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

async function guardAdmin() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const forbidden = await guardAdmin()
  if (forbidden) return forbidden

  const { action } = await req.json()
  if (!['ban', 'unban'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { isBanned: action === 'ban' },
    select: { id: true, isBanned: true },
  })

  return NextResponse.json(user)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const forbidden = await guardAdmin()
  if (forbidden) return forbidden

  // Prevent self-deletion
  const session = await auth()
  if (session?.user?.id === params.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  // Prevent deleting other admins via API
  const target = await prisma.user.findUnique({ where: { id: params.id }, select: { role: true } })
  if (target?.role === 'ADMIN') {
    return NextResponse.json({ error: 'Cannot delete admin accounts' }, { status: 400 })
  }

  await prisma.user.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
