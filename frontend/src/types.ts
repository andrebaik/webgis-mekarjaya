export interface Category {
  id: number
  slug: string
  name_id: string
  name_su: string
  name_en: string
  icon: string
}

export interface Location {
  id: number
  slug: string
  category_id: number
  name_id: string
  name_su: string
  name_en: string
  description_id: string
  description_su: string
  description_en: string
  coordinates: number[]
  images: string[]
  featured: boolean
  category_slug?: string
  category_name_id?: string
}

export interface CategoryWithCount extends Category {
  location_count?: number
}
