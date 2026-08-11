import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail } from 'lucide-react'
import type { VillageProfile } from '../../types'

interface ProfileHeroProps {
  profile: VillageProfile
}

/**
 * Hero halaman profil. Sengaja tanpa foto latar — foto adalah tanda khas hero
 * beranda; halaman dalam memakai hero tipografi murni supaya keduanya sekeluarga
 * tapi tidak terasa mengulang gambar yang sama persis.
 */
export function ProfileHero({ profile }: ProfileHeroProps) {
  const { t } = useTranslation()
  const desc = profile.description_id

  const kontak = [
    profile.address && { icon: MapPin, label: t('village.address'), value: profile.address },
    profile.phone && { icon: Phone, label: t('village.phone'), value: profile.phone },
    profile.email && { icon: Mail, label: t('village.email'), value: profile.email },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[]

  return (
    <section
      id="gambaran-umum"
      className="border-b border-border/60 pt-14 pb-16 md:pt-20 md:pb-20 scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="w-8 h-px bg-primary" />
          <span className="eyebrow">{t('village.hero_eyebrow')}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-display-sm text-foreground mb-7"
        >
          {profile.name_id}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="lg:col-span-7 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl"
          >
            {desc || t('village.hero_subtitle')}
          </motion.p>

          {kontak.length > 0 && (
            <motion.dl
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="lg:col-span-5 lg:justify-self-end w-full max-w-sm divide-y divide-border/60 border-y border-border/60"
            >
              {kontak.map((item) => (
                <div key={item.label} className="flex items-start gap-3 py-3">
                  <item.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="text-sm font-medium text-foreground break-words">{item.value}</dd>
                  </div>
                </div>
              ))}
            </motion.dl>
          )}
        </div>

        {/* Foto desa dari kolom image_url. Dipasang sebagai pita lebar di bawah teks,
            bukan foto latar seperti hero beranda — supaya kedua hero tetap terbedakan
            dan teksnya tidak perlu scrim untuk menjaga kontras. */}
        {profile.image_url && (
          <motion.figure
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-12 rounded-3xl overflow-hidden border border-border bg-muted"
          >
            <img
              src={profile.image_url}
              alt={t('village.photo_alt', { name: profile.name_id })}
              loading="lazy"
              decoding="async"
              // aspect-ratio menahan ruangnya sebelum gambar termuat, supaya tidak
              // terjadi lompatan tata letak (CLS) saat foto akhirnya masuk.
              className="w-full aspect-[16/7] object-cover"
            />
          </motion.figure>
        )}
      </div>
    </section>
  )
}
