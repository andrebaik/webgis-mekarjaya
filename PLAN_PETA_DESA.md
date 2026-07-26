# Plan: Custom Peta Desa Mekarjaya (Boundary Overlay + Locked Map)

## Prerequisites

Buat file GeoJSON manual via [geojson.io](https://geojson.io):

1. Buka `geojson.io`
2. Zoom ke area Desa Mekarjaya (sekitar `-7.24, 107.857`)
3. Klik titik-titik buat nge-trace batas desa (minimum 3 titik, idealnya 20-50 titik buat polygon yang smooth)
4. **Pastikan polygon ditutup** (titik terakhir = titik pertama)
5. Export: klik menu `...` → `Save as GeoJSON`
6. Simpan di `D:\webgis-mekarjaya\frontend\public\batas-mekarjaya.geojson`

## Files to Modify

### 1. `frontend/src/pages/MapPage.tsx`

- Fetch `/batas-mekarjaya.geojson` on mount (use `fetch` + `useState`)
- Import `GeoJSON` from `react-leaflet`
- Add Leaflet `<GeoJSON>` layer dengan:
  - Stroke (garis batas): warna primary (`#C2410C`), weight 2, opacity 0.8
  - Fill (shading): warna primary, `fillOpacity` 0.08 (light shading)
- Set `maxBounds` di `<MapContainer>` berdasarkan polygon bounds
- Set `minZoom={14}` `maxZoom={18}`

### 2. `frontend/public/batas-mekarjaya.geojson`

- User creates this manually via geojson.io

### 3. `frontend/package.json`

- Mungkin perlu `@types/geojson` kalo TypeScript protes (cek dulu)

## Implementation Detail (MapPage.tsx)

```tsx
import { GeoJSON } from 'react-leaflet'
import type { Feature } from 'geojson'

// state
const [boundary, setBoundary] = useState<Feature | null>(null)

// fetch
useEffect(() => {
  fetch('/batas-mekarjaya.geojson')
    .then(r => r.json())
    .then(setBoundary)
}, [])

// di dalam <MapContainer>
{boundary && (
  <GeoJSON
    data={boundary}
    style={{
      color: '#C2410C',
      weight: 2,
      opacity: 0.8,
      fillColor: '#C2410C',
      fillOpacity: 0.08,
    }}
  />
)}

// MapContainer props
const coords = boundary?.geometry.coordinates[0].map(
  ([lng, lat]: [number, number]) => [lat, lng]
) as [number, number][]

<MapContainer
  center={[-7.24, 107.8572]}
  maxBounds={coords ? L.latLngBounds(coords).pad(0.1) : undefined}
  minZoom={14}
  maxZoom={18}
>
```

## UX Flow

```
Peta buka → zoom ke area Desa Mekarjaya
          → Garis batas desa (terracotta) keliatan
          → Area di dalamnya semi-shading
          → User gabisa pan/zoom keluar dari desa
          → Zoom range: 14-18
```

## File Structure (setelah selesai)

```
frontend/public/
  batas-mekarjaya.geojson  ← user creates this
  images/
  favicon.svg
  icons.svg
```

## Steps

1. User buat GeoJSON di geojson.io dan simpan ke `public/batas-mekarjaya.geojson`
2. User kabari → langsung implement semua perubahan
3. Build verify
