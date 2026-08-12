import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'
import { scrollKeAtas } from '../../hooks/useSmoothScroll'

/**
 * Mengembalikan halaman ke puncak setiap kali pindah rute.
 *
 * React Router tidak mereset posisi scroll sendiri, jadi mengeklik tautan navbar
 * atau footer dari tengah halaman akan mendarat di tengah halaman berikutnya.
 *
 * Hanya berlaku untuk navigasi maju (PUSH/REPLACE). Pada POP — tombol back/forward
 * peramban — posisi dibiarkan apa adanya, karena kembali ke tempat terakhir dibaca
 * justru yang diharapkan pengguna di sana.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType === 'POP') return
    scrollKeAtas()
  }, [pathname, navigationType])

  return null
}
