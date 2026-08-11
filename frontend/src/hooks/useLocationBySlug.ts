import { useQuery } from '@tanstack/react-query'
import { fetchLocationBySlug } from '../services/api'
import type { Location } from '../types'

export const useLocationBySlug = (slug: string) => {
  return useQuery<Location, Error>({
    queryKey: ['location', slug],
    queryFn: () => fetchLocationBySlug(slug),
    enabled: !!slug,
  })
}
