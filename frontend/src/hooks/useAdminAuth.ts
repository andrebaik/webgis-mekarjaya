import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminLogin } from '../services/adminApi'
import { storage } from '../lib/storage'

export const useAdminAuth = () => {
  const queryClient = useQueryClient()

  const isAuthenticated = useQuery({
    queryKey: ['adminAuth'],
    queryFn: () => !!storage.getToken(),
    staleTime: Infinity,
  })

  const login = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      adminLogin(username, password),
    onSuccess: (data) => {
      storage.setToken(data.token)
      storage.setUsername(data.username)
      queryClient.setQueryData(['adminAuth'], true)
    },
  })

  const logout = () => {
    storage.clearAuth()
    queryClient.setQueryData(['adminAuth'], false)
    queryClient.clear()
  }

  return { isAuthenticated, login, logout }
}
