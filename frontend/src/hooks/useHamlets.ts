import { useQuery } from '@tanstack/react-query'
import { fetchHamlets } from '../services/api'
import type { Hamlet } from '../types'

export const useHamlets = () => {
  return useQuery<Hamlet[], Error>({
    queryKey: ['hamlets'],
    queryFn: fetchHamlets,
  })
}
