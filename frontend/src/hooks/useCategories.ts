import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import type { Category } from '../types'

export interface CategoryWithCount extends Category {
  location_count?: number
}

const getCategories = async (): Promise<CategoryWithCount[]> => {
  const { data } = await api.get('/api/categories')
  return data
}

export const useCategories = () => {
  return useQuery<CategoryWithCount[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
}
