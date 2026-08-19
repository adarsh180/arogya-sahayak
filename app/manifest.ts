import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arogya Sahayak',
    short_name: 'Arogya',
    description: 'Evidence-aware health information and medical learning support.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f4ed',
    theme_color: '#14342d',
    icons: [{ src: '/arogya-mark.png', sizes: '2048x2048', type: 'image/png' }]
  }
}
