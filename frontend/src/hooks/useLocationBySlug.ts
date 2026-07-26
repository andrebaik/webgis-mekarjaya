import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import type { Location } from '../types'

const getLocationBySlug = async (slug: string): Promise<Location> => {
  const { data } = await api.get(`/api/locations/${slug}`)
  return data
}

export const useLocationBySlug = (slug: string) => {
  return useQuery<Location, Error>({
    queryKey: ['location', slug],
    queryFn: () => getLocationBySlug(slug),
    enabled: !!slug,
  })
}
