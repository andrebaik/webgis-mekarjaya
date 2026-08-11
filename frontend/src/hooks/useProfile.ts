import { useQuery } from '@tanstack/react-query'
import { fetchProfile } from '../services/api'
import type { VillageProfile } from '../types'

export const useProfile = () => {
  return useQuery<VillageProfile, Error>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  })
}
