import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

// ── Server Actions ───────────────────────────────────────────────────────────

async function banUser(formData: FormData) {
  'use server'
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') return
  const userId = formData.get('userId') as string
  const ban = formData.get('ban') === 'true'
  await prisma.user.update({ where: { id: userId }, data: { isBanned: ban } })
  revalidatePath('/admin/users')
}

async function deleteUser(formData: FormData) {
  'use server'
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') return
  const userId = formData.get('userId') as string
  const selfId = session?.user?.id
  // Prevent self-deletion
  if (userId === selfId) return
  await prisma.user.delete({ where: { id: userId } })
  revalidatePath('/admin/users')
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminUsersPage() {
  const session = await requireAdmin()
  const selfId = session.user?.id

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true,
      _count: {
        select: {
          sentMessages: true,
          consumerProjects: true,
        },
      },
    },
  })

  const roleBadge: Record<string, string> = {
    PHOTOGRAPHER: 'bg-purple-900/60 text-purple-300 border-purple-700',
    CONSUMER:     'bg-green-900/60 text-green-300 border-green-700',
    ADMIN:        'bg-indigo-900/60 text-indigo-300 border-indigo-700',
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Users</h1>
        <p className="text-gray-500 text-sm">{users.length} registered accounts</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">User</th>
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Role</th>
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Messages</th>
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => {
                const isSelf = user.id === selfId
                const isAdminUser = user.role === 'ADMIN'
                return (
                  <tr key={user.id} className="hover:bg-gray-800/40 transition-colors">
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-xs font-bold shrink-0">
                          {user.name[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate max-w-[160px]">
                            {user.name}
                            {isSelf && <span className="ml-2 text-[10px] text-indigo-400 font-bold">(you)</span>}
                          </p>
                          <p className="text-gray-500 text-xs truncate max-w-[160px]">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${roleBadge[user.role] ?? 'bg-gray-800 text-gray-300 border-gray-700'}`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {user.isBanned ? (
                        <span className="px-2 py-0.5 rounded-md text-xs font-semibold border bg-red-900/60 text-red-300 border-red-700">
                          Banned
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-xs font-semibold border bg-emerald-900/60 text-emerald-300 border-emerald-700">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                      {user.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Messages */}
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {user._count.sentMessages}
                    </td>

                    {/* Actions — disabled for self and other admins */}
                    <td className="px-5 py-4">
                      {!isSelf && !isAdminUser ? (
                        <div className="flex items-center gap-2">
                          {/* Ban / Unban */}
                          <form action={banUser}>
                            <input type="hidden" name="userId" value={user.id} />
                            <input type="hidden" name="ban" value={user.isBanned ? 'false' : 'true'} />
                            <button
                              type="submit"
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                user.isBanned
                                  ? 'bg-emerald-800 text-emerald-200 hover:bg-emerald-700'
                                  : 'bg-yellow-800 text-yellow-200 hover:bg-yellow-700'
                              }`}
                            >
                              {user.isBanned ? 'Unban' : 'Ban'}
                            </button>
                          </form>

                          {/* Delete */}
                          <form action={deleteUser}>
                            <input type="hidden" name="userId" value={user.id} />
                            <button
                              type="submit"
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900 text-red-300 hover:bg-red-800 transition-colors"
                              onClick={(e) => {
                                if (!confirm(`Delete ${user.name}? This cannot be undone.`)) e.preventDefault()
                              }}
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-gray-700 text-xs italic">
                          {isSelf ? 'you' : 'protected'}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-16 text-gray-600">No users found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
