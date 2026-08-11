import { useQuery } from '@tanstack/react-query'
import { fetchPeriods } from '../services/api'
import type { VillagePeriod } from '../types'

export const usePeriods = () => {
  return useQuery<VillagePeriod[], Error>({
    queryKey: ['periods'],
    queryFn: fetchPeriods,
  })
}
