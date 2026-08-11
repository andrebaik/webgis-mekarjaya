import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import type { Location, Category } from '../types'

export function useMapFilter(
  locations: Location[] | undefined,
  categories: Category[] | undefined
) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [activeMarker, setActiveMarker] = useState<number | null>(null)

  const categoryFilter = searchParams.get('category') || ''

  const categoryMap = useMemo(() => {
    const map = new Map<number, Category>()
    categories?.forEach((c) => map.set(c.id, c))
    return map
  }, [categories])

  const categoryLocations = useMemo(() => {
    if (!locations) return []
    if (!categoryFilter) return locations
    const cat = categories?.find((c) => c.slug === categoryFilter)
    if (!cat) return locations
    return locations.filter((loc) => loc.category_id === cat.id)
  }, [locations, categoryFilter, categories])

  const filteredLocations = useMemo(() => {
    if (!search.trim()) return categoryLocations
    const q = search.toLowerCase()
    return categoryLocations.filter((loc) => {
      const name = loc.name_id.toLowerCase()
      const desc = (loc.description_id ?? '').toLowerCase()
      return name.includes(q) || desc.includes(q)
    })
  }, [categoryLocations, search])

  const setCategoryFilter = (slug: string) => {
    if (slug === categoryFilter) {
      setSearchParams({})
    } else {
      setSearchParams({ category: slug })
    }
  }

  const clearCategory = () => setSearchParams({})

  return {
    categoryFilter,
    categoryMap,
    categoryLocations,
    filteredLocations,
    search,
    setSearch,
    activeMarker,
    setActiveMarker,
    setCategoryFilter,
    clearCategory,
  }
}
