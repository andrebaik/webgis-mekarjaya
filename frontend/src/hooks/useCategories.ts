import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '../services/api'
import type { Category } from '../types'

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })
}
