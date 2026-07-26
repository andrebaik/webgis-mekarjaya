import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import type { Location } from '../types'

const getLocations = async (): Promise<Location[]> => {
  const { data } = await api.get('/api/locations')
  return data
}

export const useLocations = () => {
  return useQuery<Location[], Error>({
    queryKey: ['locations'],
    queryFn: getLocations,
  })
}
