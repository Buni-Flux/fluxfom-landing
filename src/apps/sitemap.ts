import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fluxfom.com'

  const routes = [
    '',
    '/services',
    '/services/brand-strategy',
    '/services/brand-identity',
    '/services/marketing-strategy',
    '/services/ui-ux-design',
    '/services/website-design',
    '/services/motion-design',
    '/services/creative-production',
    '/services/digital-marketing',
    '/how-it-works',
    '/industries',
    '/industries/startups',
    '/industries/smes',
    '/industries/creators',
    '/industries/fintech',
    '/industries/healthcare',
    '/industries/e-commerce',
    '/industries/ngos',
    '/work',
    '/work/case-studies',
    '/insights',
    '/pricing',
    '/about',
    '/contact',
    '/start',
    '/login',
    '/privacy',
    '/privacy/terms',
    '/privacy/cookie-policy',
    '/privacy/data-processing',
  ]

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}