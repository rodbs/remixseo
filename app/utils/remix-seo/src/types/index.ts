import { type AppLoadContext } from '@remix-run/cloudflare'

export type SitemapEntry = {
    route: string
    lastmod?: string
    changefreq?:
        | 'always'
        | 'hourly'
        | 'daily'
        | 'weekly'
        | 'monthly'
        | 'yearly'
        | 'never'
    priority?: 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0
}

export type SEOHandle = {
    getSitemapEntries?: ({
        request,
        context,
    }: {
        request: Request
        context: AppLoadContext
    }) =>
        | Promise<Array<SitemapEntry | null> | null>
        | Array<SitemapEntry | null>
        | null
}

export type SEOOptions = {
    siteUrl: string
    headers?: HeadersInit
}

export type RobotsPolicy = {
    type: 'allow' | 'disallow' | 'sitemap' | 'crawlDelay' | 'userAgent'
    value: string
}

export type RobotsConfig = {
    appendOnDefaultPolicies?: boolean
    headers?: HeadersInit
}
