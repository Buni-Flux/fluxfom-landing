import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fluxfom.com'

  const routes = [
    '',
    '/services',
    '/how-it-works',
    '/projects',
    '/about',
    '/terms',
    '/start',
    '/reset-password',
  ]

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}