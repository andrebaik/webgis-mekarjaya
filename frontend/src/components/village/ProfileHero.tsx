import { MapPin, Phone, Mail, Landmark } from 'lucide-react'
import type { VillageProfile } from '../../types'

interface ProfileHeroProps {
  profile: VillageProfile
}

export function ProfileHero({ profile }: ProfileHeroProps) {
  const name = profile.name_id
  const desc = profile.description_id

  return (
    <section id="gambaran-umum" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 scroll-mt-32">
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 md:p-12 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider mb-6">
          <Landmark className="w-3.5 h-3.5 text-neutral-900" />
          {name}
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight leading-tight mb-6">
          {name}
        </h1>
        {desc && (
          <p className="text-sm sm:text-base text-neutral-500 max-w-3xl mb-8 leading-relaxed font-normal">
            {desc}
          </p>
        )}
        <div className="flex flex-wrap gap-3 text-xs text-neutral-600 font-medium">
          {profile.address && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200/80">
              <MapPin className="w-4 h-4 text-neutral-900" /> {profile.address}
            </span>
          )}
          {profile.phone && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200/80">
              <Phone className="w-4 h-4 text-neutral-900" /> {profile.phone}
            </span>
          )}
          {profile.email && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200/80">
              <Mail className="w-4 h-4 text-neutral-900" /> {profile.email}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
