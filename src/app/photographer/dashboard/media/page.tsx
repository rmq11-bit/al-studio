'use client'

import { useState, useEffect, useRef } from 'react'
import MediaGrid from '@/components/MediaGrid'

interface MediaItem {
  id: string
  url: string
  type: string
  caption?: string | null
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE')
  const [tab, setTab] = useState<'upload' | 'url'>('url')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => {
        // We need a separate endpoint or use the profile's media
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Fetch media via profile
    loadMedia()
  }, [])

  async function loadMedia() {
    setLoading(true)
    try {
      const res = await fetch('/api/profile')
      const data = await res.json()
      // Actually we need a separate media fetch — let's get it from the photographer profile
      // Since profile doesn't return media, let's use a workaround
      // We'll add a media-list endpoint or fetch differently
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  async function fetchMedia() {
    setLoading(true)
    try {
      // Use a simple approach: fetch from public photographer profile
      const res = await fetch('/api/my-media')
      if (res.ok) {
        const data = await res.json()
        setMedia(data)
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!urlInput.trim()) return setError('الرابط مطلوب')

    setUploading(true)
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim(), type: mediaType, caption: caption || null }),
      })
      if (res.ok) {
        const item = await res.json()
        setMedia((prev) => [item, ...prev])
        setUrlInput('')
        setCaption('')
        setSuccess('تم إضافة الصورة بنجاح')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const d = await res.json()
        setError(d.error || 'حدث خطأ')
      }
    } catch {
      setError('حدث خطأ في الشبكة')
    }
    setUploading(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    if (caption) formData.append('caption', caption)

    setUploading(true)
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const item = await res.json()
        setMedia((prev) => [item, ...prev])
        setCaption('')
        if (fileRef.current) fileRef.current.value = ''
        setSuccess('تم رفع الملف بنجاح')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const d = await res.json()
        setError(d.error || 'حدث خطأ في الرفع')
      }
    } catch {
      setError('حدث خطأ في الشبكة')
    }
    setUploading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return
    const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMedia((prev) => prev.filter((m) => m.id !== id))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">إدارة المعرض</h1>

      {/* Add media form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-700 mb-4">إضافة صورة أو فيديو</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">
            ✅ {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('url')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'url' ? 'bg-[#C0A4A3] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            رابط URL
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'upload' ? 'bg-[#C0A4A3] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            رفع ملف
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">النوع</label>
          <div className="flex gap-2">
            {(['IMAGE', 'VIDEO'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMediaType(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  mediaType === t ? 'bg-[#C0A4A3]/20 text-[#C0A4A3] border-2 border-[#C0A4A3]' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {t === 'IMAGE' ? '🖼️ صورة' : '🎬 فيديو'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">وصف (اختياري)</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="وصف للصورة أو الفيديو..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20"
          />
        </div>

        {tab === 'url' ? (
          <form onSubmit={handleUrlSubmit} className="flex gap-3">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20"
            />
            <button
              type="submit"
              disabled={uploading}
              className="bg-[#C0A4A3] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A88887] transition-colors disabled:opacity-60 shrink-0"
            >
              {uploading ? 'جاري...' : 'إضافة'}
            </button>
          </form>
        ) : (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full border border-dashed border-gray-300 rounded-xl px-4 py-6 text-sm text-gray-500 cursor-pointer hover:border-[#C0A4A3] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#C0A4A3] file:text-white file:text-sm file:font-semibold hover:file:bg-[#A88887]"
            />
            {uploading && <p className="text-sm text-[#C0A4A3] mt-2">جاري الرفع...</p>}
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-700 mb-4">
          معرضك ({media.length} عنصر)
        </h2>
        {loading ? (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <MediaGrid media={media} editable onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}
