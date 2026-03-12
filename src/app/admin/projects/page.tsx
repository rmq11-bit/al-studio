'use client'

import { useEffect, useState, useTransition } from 'react'
import { deleteProject } from './_actions'

interface Project {
  id: string
  title: string
  description: string
  hours: number
  status: string
  createdAt: string
  consumer: { name: string; email: string }
  _count: { bids: number }
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  async function loadProjects() {
    setLoading(true)
    const res = await fetch('/api/admin/projects')
    if (res.ok) setProjects(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    loadProjects()
  }, [])

  function handleDelete(project: Project) {
    if (!confirm(`Delete "${project.title}"? This will also delete all bids. Cannot be undone.`)) return
    const fd = new FormData()
    fd.set('projectId', project.id)
    startTransition(async () => {
      await deleteProject(fd)
      await loadProjects()
    })
  }

  const statusBadge: Record<string, string> = {
    OPEN: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
    CLOSED: 'bg-gray-800 text-gray-400 border-gray-700',
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Projects</h1>
        <p className="text-gray-500 text-sm">{loading ? '…' : `${projects.length} project posts`}</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Project</th>
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Client</th>
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Hours</th>
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Bids</th>
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5 text-gray-500 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-600">Loading…</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-4 max-w-[220px]">
                      <p className="text-white font-medium truncate">{project.title}</p>
                      <p className="text-gray-500 text-xs truncate mt-0.5">{project.description}</p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-gray-300 font-medium text-xs">{project.consumer.name}</p>
                      <p className="text-gray-600 text-[10px] truncate max-w-[140px]">{project.consumer.email}</p>
                    </td>

                    <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                      {project.hours}h
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${statusBadge[project.status] ?? 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        {project.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {project._count.bids}
                    </td>

                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(project.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(project)}
                        disabled={isPending}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900 text-red-300 hover:bg-red-800 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && projects.length === 0 && (
            <div className="text-center py-16 text-gray-600">No projects found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
