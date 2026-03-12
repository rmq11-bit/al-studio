import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import MessagingInbox from '@/components/MessagingInbox'

export const metadata = { title: 'الرسائل | الاستوديو' }

export default async function MessagesThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const userId = session?.user?.id
  if (!session || !userId) redirect('/auth/login')

  const { id } = await params
  return <MessagingInbox currentUserId={userId} initialConversationId={id} />
}
