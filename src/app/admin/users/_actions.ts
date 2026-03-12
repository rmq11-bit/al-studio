'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function banUser(formData: FormData) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') return
  const userId = formData.get('userId') as string
  const ban = formData.get('ban') === 'true'
  await prisma.user.update({ where: { id: userId }, data: { isBanned: ban } })
  revalidatePath('/admin/users')
}

export async function deleteUser(formData: FormData) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') return
  const userId = formData.get('userId') as string
  const selfId = session?.user?.id
  if (userId === selfId) return
  await prisma.user.delete({ where: { id: userId } })
  revalidatePath('/admin/users')
}
