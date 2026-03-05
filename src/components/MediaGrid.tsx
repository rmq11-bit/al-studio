'use client'

import { useState } from 'react'

interface MediaItem {
  id: string
  url: string
  type: string
  caption?: string | null
}

interface Props {
  media: MediaItem[]
  editable?: boolean
  onDelete?: (id: string) => void
}

export default function MediaGrid({ media, editable = false, onDelete }: Props) {
  const [selected, setSelected] = useState<MediaItem | null>(null)

  if (media.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-3">🖼️</div>
        <p className="text-lg font-medium">لا توجد صور بعد</p>
        {editable && <p className="text-sm mt-1">أضف صورك وفيديوهاتك لإثراء معرضك</p>}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {media.map((item) => (
          <div
            key={item.id}
            className="media-grid-item relative group rounded-xl overflow-hidden cursor-pointer bg-gray-100 aspect-square"
            onClick={() => setSelected(item)}
          >
            {item.type === 'VIDEO' ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                  <div className="text-4xl mb-2">▶️</div>
                  <p className="text-xs opacity-70">فيديو</p>
                </div>
              </div>
            ) : (
              <img
                src={item.url}
                alt={item.caption ?? ''}
                className="w-full h-full object-cover"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
              {item.caption && (
                <span className="text-white text-xs font-medium bg-black/50 px-2 py-0.5 rounded-lg truncate max-w-[80%]">
                  {item.caption}
                </span>
              )}
              {editable && onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item.id)
                  }}
                  className="bg-red-500 text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors text-sm shrink-0"
                  title="حذف"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-10 left-0 text-white/70 hover:text-white text-2xl font-light"
            >
              ✕ إغلاق
            </button>

            {selected.type === 'VIDEO' ? (
              <video
                src={selected.url}
                controls
                className="w-full max-h-[80vh] rounded-xl"
              />
            ) : (
              <img
                src={selected.url}
                alt={selected.caption ?? ''}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
            )}

            {selected.caption && (
              <p className="text-white/80 text-center mt-3 text-sm">{selected.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
