import { WebSiteJsonLdProps } from './jsonld/webSite'
import { WebPageJsonLdProps } from './jsonld/webPage'
import { Course } from './../../../db/schema/schema'
import { CarouselJsonLdProps } from './jsonld/carousel'
import { BreadCrumbJsonLdProps } from './jsonld/breadcrumb'
import { json } from 'stream/consumers'

export { generateSitemap } from './sitemap'
export { generateRobotsTxt } from './robotstxt'
export type { SEOHandle } from './types'

export {
    OrganizationJsonLd,
    type OrganizationJsonLdProps,
} from './jsonld/organization'

export {
    BreadCrumbJsonLd,
    type BreadCrumbJsonLdProps,
} from './jsonld/breadcrumb'

export { CarouselJsonLd, type CarouselJsonLdProps } from './jsonld/carousel'
export { CourseJsonLd, type CourseJsonLdProps } from './jsonld/course'
export { WebPageJsonLd, type WebPageJsonLdProps } from './jsonld/webPage'
export { WebSiteJsonLd, type WebSiteJsonLdProps } from './jsonld/webSite'
