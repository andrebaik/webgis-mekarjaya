import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { GeoJsonObject } from 'geojson'
import type { Location } from '../../types'

interface MapBoundsUpdaterProps {
  boundary?: GeoJsonObject | null
  locations: Location[]
}

export function MapBoundsUpdater({ boundary, locations }: MapBoundsUpdaterProps) {
  const map = useMap()

  useEffect(() => {
    if (boundary) {
      try {
        const geoLayer = L.geoJSON(boundary)
        const bounds = geoLayer.getBounds()
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [30, 30] })
          return
        }
      } catch {
        // Fallback to locations
      }
    }

    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map((loc) => [loc.coordinates[1], loc.coordinates[0]])
      )
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] })
      }
    }
  }, [map, boundary, locations])

  return null
}
