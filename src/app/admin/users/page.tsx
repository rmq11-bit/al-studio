'use client'

import { useEffect, useState, useTransition } from 'react'
import { banUser, deleteUser } from './_actions'

// ── Types ─────────────────────────────────────────────────────────────────────

interface User {
  id: string
  name: string
  email: string
  role: string
  isBanned: boolean
  createdAt: string
  _count: { sentMessages: number; consumerProjects: number }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selfId, setSelfId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  async function loadUsers() {
    const res = await fetch('/api/admin/users')
    if (res.ok) {
      const data = await res.json()
      setUsers(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
    // Get current user id from session endpoint
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((s) => setSelfId(s?.user?.id ?? null))
  }, [])

  function handleBan(user: User) {
    const msg = user.isBanned
      ? `Unban ${user.name}?`
      : `Ban ${user.name}? They will not be able to log in.`
    if (!confirm(msg)) return
    const fd = new FormData()
    fd.set('userId', user.id)
    fd.set('ban', user.isBanned ? 'false' : 'true')
    startTransition(async () => {
      await banUser(fd)
      await loadUsers()
    })
  }

  function handleDelete(user: User) {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return
    const fd = new FormData()
    fd.set('userId', user.id)
    startTransition(async () => {
      await deleteUser(fd)
      await loadUsers()
    })
  }

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
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-600">Loading…</td>
                </tr>
              ) : (
                users.map((user) => {
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
                        {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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
                            <button
                              onClick={() => handleBan(user)}
                              disabled={isPending}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                                user.isBanned
                                  ? 'bg-emerald-800 text-emerald-200 hover:bg-emerald-700'
                                  : 'bg-yellow-800 text-yellow-200 hover:bg-yellow-700'
                              }`}
                            >
                              {user.isBanned ? 'Unban' : 'Ban'}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(user)}
                              disabled={isPending}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900 text-red-300 hover:bg-red-800 transition-colors disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-700 text-xs italic">
                            {isSelf ? 'you' : 'protected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>

          {!loading && users.length === 0 && (
            <div className="text-center py-16 text-gray-600">No users found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
