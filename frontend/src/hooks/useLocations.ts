import { useQuery } from '@tanstack/react-query'
import { fetchLocations } from '../services/api'
import type { Location } from '../types'

export const useLocations = () => {
  return useQuery<Location[], Error>({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  })
}
