import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin, Phone, Mail } from 'lucide-react'
import ScrollExpand from '../ui/scroll-expand'
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
  const reduceMotion = useReducedMotion()
  const desc = profile.description_id

  const kontak = [
    profile.address && { icon: MapPin, label: t('village.address'), value: profile.address },
    profile.phone && { icon: Phone, label: t('village.phone'), value: profile.phone },
    profile.email && { icon: Mail, label: t('village.email'), value: profile.email },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[]

  const fotoAlt = t('village.photo_alt', { name: profile.name_id })

  return (
    <>
    <section
      id="gambaran-umum"
      className="pt-14 pb-16 md:pt-20 md:pb-20 scroll-mt-32"
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

      </div>
    </section>

    {/* Foto desa dengan bingkai yang memuai mengikuti scroll, tapi DIBATASI:
        tetap di dalam kontainer max-w-7xl dan panggungnya hanya 62% tinggi layar.
        Halaman ini masih punya enam seksi di bawahnya, jadi media yang memenuhi
        layar membuat pengunjung kehilangan konteks sekitarnya. */}
    {profile.image_url && (
      reduceMotion ? (
        // Jalur pengurangan gerak: foto biasa. ScrollExpand tetap memuai walau
        // smoothing dimatikan, dan lintasannya memakan ~2 layar scroll — kalau
        // sekadar dinonaktifkan, yang tersisa adalah ruang kosong sepanjang itu.
        <figure className="border-y border-border/60 bg-muted">
          <img
            src={profile.image_url}
            alt={fotoAlt}
            loading="lazy"
            decoding="async"
            className="w-full aspect-[16/7] object-cover"
          />
        </figure>
      ) : (
        <div className="px-4 sm:px-6 lg:px-8">
          {/* JANGAN tambahkan overflow-hidden di sini. Panggung di dalam
              ScrollExpand memakai position:sticky, dan leluhur ber-overflow
              selain visible membatalkannya — akibatnya foto ikut naik sambil
              memuai dan sudah keluar layar sebelum terbuka penuh.
              Sudut membulat sudah ditangani clip-path komponen (endRadius). */}
          <div className="max-w-7xl mx-auto">
            <ScrollExpand
              src={profile.image_url}
              alt={fotoAlt}
              useWindowScroll
              // Panggung 62% tinggi layar, bukan 100%: inilah yang menahannya
              // dari full-bleed sekaligus memangkas panjang scroll.
              stageVh={62}
              // Lintasan memuai + jeda tahan setelah terbuka penuh. Dengan
              // panggung 62% layar, 1,1 + 0,25 = 1,35 panggung setara ~0,84 layar
              // scroll: cukup untuk membuka penuh lalu tertahan sejenak, tanpa
              // memakan ruang seperti bawaannya (2,55 layar).
              scrollDistance={1.1}
              holdDistance={0.25}
              // Bingkai istirahat dibuat besar; di panggung yang sudah dipendekkan,
              // 42x58 bawaan menyisakan foto sekecil kartu nama.
              startWidth={70}
              startHeight={74}
              // Sudut tetap membulat saat memuai penuh, senada kartu lain di halaman.
              startRadius={24}
              endRadius={24}
              mediaZoom={1.18}
              // Tanpa judul maupun konten overlay, jadi scrim penggelap tidak ada
              // gunanya selain menggelapkan foto desanya sendiri.
              overlayScrim={0}
            />
          </div>
        </div>
      )
    )}
    </>
  )
}
