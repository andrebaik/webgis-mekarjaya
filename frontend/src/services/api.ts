import axios from 'axios'
import type { Location, Category, VillageProfile, DemographicRow, ApbdItem, VillagePeriod, Hamlet } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export async function fetchLocations(): Promise<Location[]> {
  const { data } = await api.get('/api/locations')
  return data
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get('/api/categories')
  return data
}

export async function fetchLocationBySlug(slug: string): Promise<Location> {
  const { data } = await api.get(`/api/locations/${slug}`)
  return data
}

export async function fetchProfile(): Promise<VillageProfile> {
  const { data } = await api.get('/api/profile')
  return data
}

export async function fetchDemographics(year?: number): Promise<DemographicRow[]> {
  const { data } = await api.get('/api/demographics', { params: year ? { year } : {} })
  return data
}

export async function fetchHamlets(): Promise<Hamlet[]> {
  const { data } = await api.get('/api/hamlets')
  return data
}

export async function fetchApbd(year?: number): Promise<ApbdItem[]> {
  const { data } = await api.get('/api/apbd', { params: year ? { year } : {} })
  return data
}

export async function fetchPeriods(): Promise<VillagePeriod[]> {
  const { data } = await api.get('/api/periods')
  return data
}

export default api
