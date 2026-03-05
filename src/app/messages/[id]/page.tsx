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
  if (!session) redirect('/auth/login')

  const { id } = await params
  return <MessagingInbox currentUserId={session.user.id} initialConversationId={id} />
}
