import { useQuery } from '@tanstack/react-query'
import { fetchApbd } from '../services/api'
import type { ApbdItem } from '../types'

export const useApbd = (year?: number) => {
  return useQuery<ApbdItem[], Error>({
    queryKey: ['apbd', year ?? 'latest'],
    queryFn: () => fetchApbd(year),
  })
}
