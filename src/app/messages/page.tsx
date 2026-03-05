import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import MessagingInbox from '@/components/MessagingInbox'

export const metadata = { title: 'الرسائل | الاستوديو' }

export default async function MessagesPage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  return <MessagingInbox currentUserId={session.user.id} />
}
