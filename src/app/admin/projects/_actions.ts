'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteProject(formData: FormData) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') return
  const projectId = formData.get('projectId') as string
  await prisma.projectPost.delete({ where: { id: projectId } })
  revalidatePath('/admin/projects')
}
