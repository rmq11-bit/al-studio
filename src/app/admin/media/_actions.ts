'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteMedia(formData: FormData) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') return
  const mediaId = formData.get('mediaId') as string
  await prisma.media.delete({ where: { id: mediaId } })
  revalidatePath('/admin/media')
}
