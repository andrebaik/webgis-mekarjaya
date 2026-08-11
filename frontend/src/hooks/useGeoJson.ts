import { useEffect, useState } from 'react'
import type { GeoJsonObject } from 'geojson'

/**
 * Memuat file GeoJSON statis dari `public/`. File batas wilayah bersifat opsional —
 * kalau tidak ada, hook mengembalikan null dan pemanggil cukup tidak merender layer.
 */
export function useGeoJson(path: string): GeoJsonObject | null {
  const [data, setData] = useState<GeoJsonObject | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(path)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json) setData(json as GeoJsonObject)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [path])

  return data
}
