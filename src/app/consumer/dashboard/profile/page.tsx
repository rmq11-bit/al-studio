'use client'

import { useState, useEffect } from 'react'

export default function ConsumerProfilePage() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        setName(data.name ?? '')
        setBio(data.bio ?? '')
        setAvatarUrl(data.avatarUrl ?? '')
        setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [])

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('يُسمح فقط بملفات الصور (JPG, PNG, WebP, GIF)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('حجم الصورة يجب ألا يتجاوز 5 ميغابايت')
      return
    }

    setUploadError('')
    // Instant local preview
    setAvatarPreview(URL.createObjectURL(file))
    setUploading(true)

    const form = new FormData()
    form.append('avatar', file)
    try {
      const res = await fetch('/api/upload-avatar', { method: 'POST', body: form })
      if (res.ok) {
        const { url } = await res.json()
        setAvatarUrl(url)
      } else {
        const d = await res.json()
        setUploadError(d.error || 'حدث خطأ أثناء رفع الصورة')
        setAvatarPreview('')
      }
    } catch {
      setUploadError('حدث خطأ في الشبكة')
      setAvatarPreview('')
    }
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!name.trim()) return setError('الاسم مطلوب')

    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim(),
          avatarUrl: avatarUrl || null,
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const d = await res.json()
        setError(d.error || 'حدث خطأ')
      }
    } catch {
      setError('حدث خطأ في الشبكة')
    }
    setLoading(false)
  }

  if (fetching) {
    return (
      <div className="animate-pulse space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">تعديل الملف الشخصي</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">
            ✅ تم حفظ التغييرات بنجاح
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-700 text-sm pb-3 border-b border-gray-100">المعلومات الأساسية</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              الاسم الكامل <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">نبذة تعريفية</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="أضف نبذة مختصرة عنك…"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C0A4A3] focus:ring-2 focus:ring-[#C0A4A3]/20 resize-none"
            />
          </div>

          {/* ── Avatar upload ──────────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الصورة الشخصية</label>

            {/* Preview */}
            {(avatarPreview || avatarUrl) && (
              <div className="mb-3">
                <img
                  src={avatarPreview || avatarUrl}
                  alt="معاينة الصورة الشخصية"
                  className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                />
                {uploading && (
                  <p className="text-xs text-[#C0A4A3] mt-1">جاري الرفع…</p>
                )}
              </div>
            )}

            <label
              className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <span>📷</span>
              <span>{uploading ? 'جاري الرفع…' : 'اختر صورة من الجهاز'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <p className="text-xs text-gray-400 mt-1.5">
              الصيغ المدعومة: JPG · PNG · WebP · GIF &nbsp;·&nbsp; الحد الأقصى: 5 ميغابايت
            </p>
            {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-[#C0A4A3] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#A88887] transition-colors disabled:opacity-60"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </form>
    </div>
  )
}
