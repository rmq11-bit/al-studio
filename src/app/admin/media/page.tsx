'use client'

import { useEffect, useState, useTransition } from 'react'
import { deleteMedia } from './_actions'

interface MediaItem {
  id: string
  url: string
  type: string
  caption: string | null
  createdAt: string
  photographer: {
    user: { name: string; email: string }
  }
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  async function loadMedia() {
    setLoading(true)
    const res = await fetch('/api/admin/media')
    if (res.ok) setMedia(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    loadMedia()
  }, [])

  function handleDelete(item: MediaItem) {
    if (!confirm('Delete this media item? This cannot be undone.')) return
    const fd = new FormData()
    fd.set('mediaId', item.id)
    startTransition(async () => {
      await deleteMedia(fd)
      await loadMedia()
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Media</h1>
        <p className="text-gray-500 text-sm">{loading ? '…' : `${media.length} uploaded files (latest 200)`}</p>
      </div>

      {loading && (
        <div className="text-center py-20 text-gray-600">Loading…</div>
      )}

      {!loading && media.length === 0 && (
        <div className="text-center py-20 text-gray-600">No media found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {media.map((item) => {
          const isVideo = item.type === 'VIDEO'

          return (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
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
                <div>
                  <p className="text-white text-xs font-semibold truncate">{item.photographer.user.name}</p>
                  <p className="text-gray-500 text-[10px] truncate">{item.photographer.user.email}</p>
                </div>

                {item.caption && (
                  <p className="text-gray-400 text-xs italic truncate">&quot;{item.caption}&quot;</p>
                )}

                <div className="flex items-center gap-2 mt-auto">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                    isVideo
                      ? 'bg-blue-900/50 text-blue-300 border-blue-800'
                      : 'bg-pink-900/50 text-pink-300 border-pink-800'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-gray-600 text-[10px] ml-auto">
                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(item)}
                  disabled={isPending}
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900 text-red-300 hover:bg-red-800 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
