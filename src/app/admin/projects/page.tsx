import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

// ── Server Action ────────────────────────────────────────────────────────────

async function deleteProject(formData: FormData) {
  'use server'
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') return
  const projectId = formData.get('projectId') as string
  await prisma.projectPost.delete({ where: { id: projectId } })
  revalidatePath('/admin/projects')
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminProjectsPage() {
  await requireAdmin()

  const projects = await prisma.projectPost.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      hours: true,
      status: true,
      createdAt: true,
      consumer: {
        select: { name: true, email: true },
      },
      _count: {
        select: { bids: true },
      },
    },
  })

  const statusBadge: Record<string, string> = {
    OPEN:   'bg-emerald-900/60 text-emerald-300 border-emerald-700',
    CLOSED: 'bg-gray-800 text-gray-400 border-gray-700',
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Projects</h1>
        <p className="text-gray-500 text-sm">{projects.length} project posts</p>
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
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-800/40 transition-colors">

                  {/* Project title + excerpt */}
                  <td className="px-5 py-4 max-w-[220px]">
                    <p className="text-white font-medium truncate">{project.title}</p>
                    <p className="text-gray-500 text-xs truncate mt-0.5">{project.description}</p>
                  </td>

                  {/* Client */}
                  <td className="px-5 py-4">
                    <p className="text-gray-300 font-medium text-xs">{project.consumer.name}</p>
                    <p className="text-gray-600 text-[10px] truncate max-w-[140px]">{project.consumer.email}</p>
                  </td>

                  {/* Hours */}
                  <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                    {project.hours}h
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${statusBadge[project.status] ?? 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {project.status}
                    </span>
                  </td>

                  {/* Bids count */}
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {project._count.bids}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                    {project.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>

                  {/* Delete */}
                  <td className="px-5 py-4">
                    <form action={deleteProject}>
                      <input type="hidden" name="projectId" value={project.id} />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900 text-red-300 hover:bg-red-800 transition-colors"
                        onClick={(e) => {
                          if (!confirm(`Delete "${project.title}"? This will also delete all bids. Cannot be undone.`)) {
                            e.preventDefault()
                          }
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {projects.length === 0 && (
            <div className="text-center py-16 text-gray-600">No projects found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
