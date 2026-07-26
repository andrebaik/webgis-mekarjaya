import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  id: { translation: {
    common: { loading: 'Memuat...', error: 'Terjadi kesalahan' },
    nav: { home: 'Beranda', map: 'Peta', about: 'Tentang' },
    hero: {
      title: 'Selamat Datang di WebGIS\nDesa Mekarjaya',
      subtitle: 'Jelajahi keindahan alam, budaya, dan potensi Desa Mekarjaya melalui peta interaktif',
      cta: 'Lihat Peta Interaktif',
    },
    stats: { title: 'Statistik Desa', locations: 'Jumlah Lokasi', categories: 'Jumlah Kategori', coverage: 'Cakupan Wilayah' },
    featured: { title: 'Lokasi Unggulan', view_all: 'Lihat Semua Lokasi', empty: 'Belum ada lokasi unggulan' },
    map: {
      title: 'Peta Interaktif',
      all: 'Semua Kategori',
      view_details: 'Lihat Detail',
      search: 'Cari lokasi...',
      no_results: 'Tidak ada lokasi ditemukan',
      category: 'Kategori',
    },
    location: {
      not_found: 'Lokasi tidak ditemukan',
      description: 'Deskripsi',
      category_not_found: 'Kategori tidak ditemukan',
      back: 'Kembali',
      back_to_map: 'Kembali ke Peta',
      images: 'Galeri',
      coordinates: 'Koordinat',
    },
    category: {
      sekolah: 'Sekolah', puskesmas: 'Puskesmas', desa: 'Kantor Desa',
      ibadah: 'Tempat Ibadah', wisata: 'Wisata', umkm: 'UMKM',
      lapangan: 'Lapangan', jembatan: 'Jembatan', sungai: 'Sungai',
      pasar: 'Pasar', perkebunan: 'Perkebunan',
    },
    footer: {
      title: 'WebGIS Desa Mekarjaya',
      desc: 'Sistem Informasi Geografis untuk memetakan potensi dan fasilitas Desa Mekarjaya, Kecamatan Cikajang, Kabupaten Garut.',
      copyright: 'Hak Cipta © 2026 Desa Mekarjaya. Seluruh hak dilindungi.',
    },
  }},
  su: { translation: {
    common: { loading: 'Nuju...', error: 'Aya kasalahan' },
    nav: { home: 'Tepas', map: 'Peta', about: 'Ngeunaan' },
    hero: {
      title: 'Wilujeng Sumping di WebGIS\nDésa Mekarjaya',
      subtitle: 'Jelajah kaéndahan alam, budaya, sareng poténsi Désa Mekarjaya ngaliwatan peta interaktif',
      cta: 'Tingali Peta Interaktif',
    },
    stats: { title: 'Statistik Désa', locations: 'Jumlah Lokasi', categories: 'Jumlah Kategori', coverage: 'Cakupan Wewengkon' },
    featured: { title: 'Lokasi Pilihan', view_all: 'Tingali Sadaya', empty: 'Teu acan aya lokasi pilihan' },
    map: {
      title: 'Peta Interaktif',
      all: 'Sadaya Kategori',
      view_details: 'Tingali Rincian',
      search: 'Pilarian lokasi...',
      no_results: 'Teu aya lokasi kapendak',
      category: 'Kategori',
    },
    location: {
      not_found: 'Lokasi teu kapendak',
      description: 'Katerangan',
      category_not_found: 'Kategori teu kapendak',
      back: 'Balik',
      back_to_map: 'Balik ka Peta',
      images: 'Galéri',
      coordinates: 'Koordinat',
    },
    category: {
      sekolah: 'Sakola', puskesmas: 'Puskesmas', desa: 'Kantor Désa',
      ibadah: 'Tempat Ibadah', wisata: 'Wisata', umkm: 'UMKM',
      lapangan: 'Lapangan', jembatan: 'Jambatan', sungai: 'Walungan',
      pasar: 'Pasar', perkebunan: 'Perkebunan',
    },
    footer: {
      title: 'WebGIS Désa Mekarjaya',
      desc: 'Sistem Informasi Géografis pikeun mametakeun poténsi sareng fasilitas Désa Mekarjaya, Kacamatan Cikajang, Kabupatén Garut.',
      copyright: 'Hak Cipta © 2026 Désa Mekarjaya. Sadaya hak ditangtayungan.',
    },
  }},
  en: { translation: {
    common: { loading: 'Loading...', error: 'An error occurred' },
    nav: { home: 'Home', map: 'Map', about: 'About' },
    hero: {
      title: 'Welcome to WebGIS\nMekarjaya Village',
      subtitle: 'Explore the natural beauty, culture, and potential of Mekarjaya Village through an interactive map',
      cta: 'View Interactive Map',
    },
    stats: { title: 'Village Statistics', locations: 'Total Locations', categories: 'Total Categories', coverage: 'Area Coverage' },
    featured: { title: 'Featured Locations', view_all: 'View All Locations', empty: 'No featured locations yet' },
    map: {
      title: 'Interactive Map',
      all: 'All Categories',
      view_details: 'View Details',
      search: 'Search locations...',
      no_results: 'No locations found',
      category: 'Category',
    },
    location: {
      not_found: 'Location not found',
      description: 'Description',
      category_not_found: 'Category not found',
      back: 'Back',
      back_to_map: 'Back to Map',
      images: 'Gallery',
      coordinates: 'Coordinates',
    },
    category: {
      sekolah: 'School', puskesmas: 'Health Center', desa: 'Village Office',
      ibadah: 'Place of Worship', wisata: 'Tourism', umkm: 'MSME',
      lapangan: 'Field', jembatan: 'Bridge', sungai: 'River',
      pasar: 'Market', perkebunan: 'Plantation',
    },
    footer: {
      title: 'WebGIS Mekarjaya Village',
      desc: 'A Geographic Information System mapping the potential and facilities of Mekarjaya Village, Cikajang District, Garut Regency.',
      copyright: '© 2026 Mekarjaya Village. All rights reserved.',
    },
  }},
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'id',
  fallbackLng: 'id',
  interpolation: { escapeValue: false },
})

export default i18n
