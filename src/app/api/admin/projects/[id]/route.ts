/**
 * Admin project management API
 * DELETE /api/admin/projects/:id
 */
import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  await prisma.projectPost.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
