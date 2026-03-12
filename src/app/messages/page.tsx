import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import MessagingInbox from '@/components/MessagingInbox'

export const metadata = { title: 'الرسائل | الاستوديو' }

export default async function MessagesPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!session || !userId) redirect('/auth/login')

  return <MessagingInbox currentUserId={userId} />
}
