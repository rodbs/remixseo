// import { generateRobotsTxt } from '@nasa-gcn/remix-seo'
import { generateRobotsTxt } from '#app/utils/remix-seo/src'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { getDomainUrl } from '#app/utils/misc'

export function loader({ request }: LoaderFunctionArgs) {
    return generateRobotsTxt([
        { type: 'sitemap', value: `${getDomainUrl(request)}/sitemap.xml` },
    ])
}
