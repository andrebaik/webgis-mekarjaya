import axios from 'axios'
import { storage } from '../lib/storage'
import type { Location, Category, VillageProfile, ApbdItem, VillagePeriod, AdminLoginResponse } from '../types'

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
})

adminApi.interceptors.request.use((config) => {
  const token = storage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      storage.clearAuth()
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export async function adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
  const { data } = await adminApi.post('/api/auth/login', { username, password })
  return data
}

export async function adminCreate<T = unknown>(url: string, body: object): Promise<T> {
  const { data } = await adminApi.post(url, body)
  return data
}

export async function adminUpdate<T = unknown>(url: string, body: object): Promise<T> {
  const { data } = await adminApi.put(url, body)
  return data
}

export async function adminDelete(url: string): Promise<{ message: string }> {
  const { data } = await adminApi.delete(url)
  return data
}

export async function adminUpload(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData()
  formData.append('image', file)
  const { data } = await adminApi.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export type {
  Location,
  Category,
  VillageProfile,
  ApbdItem,
  VillagePeriod,
}
