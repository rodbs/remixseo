import type { ServerBuild } from '@remix-run/server-runtime'
import { type SEOOptions } from '../types'
import { getSitemapXml } from './utils'
import { type AppLoadContext } from '@remix-run/cloudflare'

export async function generateSitemap(
    { request, context }: { request: Request; context: AppLoadContext },
    routes: ServerBuild['routes'],
    options: SEOOptions
) {
    const { siteUrl, headers } = options
    const sitemap = await getSitemapXml({ request, context }, routes, {
        siteUrl,
    })
    const bytes = new TextEncoder().encode(sitemap).byteLength

    return new Response(sitemap, {
        headers: {
            ...headers,
            'Content-Type': 'application/xml',
            'Content-Length': String(bytes),
        },
    })
}
