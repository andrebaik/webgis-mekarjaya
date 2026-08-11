import { useQuery } from '@tanstack/react-query'
import { fetchDemographics } from '../services/api'
import type { DemographicRow } from '../types'

export const useDemographics = (year?: number) => {
  return useQuery<DemographicRow[], Error>({
    queryKey: ['demographics', year ?? 'latest'],
    queryFn: () => fetchDemographics(year),
  })
}
