import Link from 'next/link'
import { SPECIALTY_LABELS, parseSpecialties } from '@/lib/specialties'

interface Props {
  photographer: {
    id: string
    userId: string
    hourlyRate: number | null
    specialties: string | null
    location?: string | null
    user: {
      id: string
      name: string | null
      avatarUrl?: string | null
      bio?: string | null
    }
    media: { id: string; url: string; type: string }[]
  }
}

export default function PhotographerCard({ photographer }: Props) {
  const specialties = parseSpecialties(photographer.specialties)
  const coverImage = photographer.media?.[0]?.url

  return (
    <Link href={`/photographer/${photographer.userId}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Cover */}
        <div className="h-52 bg-gray-100 relative overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={photographer.user.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl text-gray-200">
              📸
            </div>
          )}
          {/* Rate badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl text-xs font-bold text-[#C0A4A3] shadow-sm">
            {(photographer.hourlyRate ?? 0).toLocaleString('ar-SA')} ريال/ساعة
          </div>
          {/* Gallery count */}
          {photographer.media.length > 0 && (
            <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-0.5 rounded-lg text-xs">
              {photographer.media.length} صورة
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            {photographer.user.avatarUrl ? (
              <img
                src={photographer.user.avatarUrl}
                alt={photographer.user.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-[#C0A4A3]/20"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#C0A4A3] flex items-center justify-center text-white font-bold">
                {(photographer.user.name ?? '؟')[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 truncate">{photographer.user.name ?? ''}</p>
              {photographer.location && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span>📍</span>
                  <span>{photographer.location}</span>
                </p>
              )}
            </div>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5">
            {specialties.slice(0, 2).map((s) => (
              <span
                key={s}
                className="bg-[#C0A4A3]/10 text-[#C0A4A3] px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {SPECIALTY_LABELS[s] ?? s}
              </span>
            ))}
            {specialties.length > 2 && (
              <span className="bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full text-xs">
                +{specialties.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
