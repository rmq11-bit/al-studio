import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

// ── Server Action ────────────────────────────────────────────────────────────

async function deleteMedia(formData: FormData) {
  'use server'
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') return
  const mediaId = formData.get('mediaId') as string
  await prisma.media.delete({ where: { id: mediaId } })
  revalidatePath('/admin/media')
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminMediaPage() {
  await requireAdmin()

  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      url: true,
      type: true,
      caption: true,
      createdAt: true,
      photographer: {
        select: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Media</h1>
        <p className="text-gray-500 text-sm">{media.length} uploaded files (latest 200)</p>
      </div>

      {media.length === 0 && (
        <div className="text-center py-20 text-gray-600">No media found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {media.map((item) => {
          const isVideo = item.type === 'VIDEO'
          const uploaderName = item.photographer.user.name
          const uploaderEmail = item.photographer.user.email

          return (
            <div
              key={item.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col"
            >
              {/* Preview */}
              <div className="aspect-square bg-gray-800 relative flex items-center justify-center overflow-hidden">
                {isVideo ? (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <span className="text-4xl">🎬</span>
                    <span className="text-xs font-medium">Video</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.caption ?? 'media'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )}
              </div>

              {/* Info + action */}
              <div className="p-3 flex flex-col gap-2 flex-1">
                {/* Uploader */}
                <div>
                  <p className="text-white text-xs font-semibold truncate">{uploaderName}</p>
                  <p className="text-gray-500 text-[10px] truncate">{uploaderEmail}</p>
                </div>

                {/* Caption */}
                {item.caption && (
                  <p className="text-gray-400 text-xs italic truncate">"{item.caption}"</p>
                )}

                {/* Date + type */}
                <div className="flex items-center gap-2 mt-auto">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                    isVideo
                      ? 'bg-blue-900/50 text-blue-300 border-blue-800'
                      : 'bg-pink-900/50 text-pink-300 border-pink-800'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-gray-600 text-[10px] ml-auto">
                    {item.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Delete */}
                <form action={deleteMedia}>
                  <input type="hidden" name="mediaId" value={item.id} />
                  <button
                    type="submit"
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900 text-red-300 hover:bg-red-800 transition-colors"
                    onClick={(e) => {
                      if (!confirm('Delete this media item? This cannot be undone.')) e.preventDefault()
                    }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
