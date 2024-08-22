import type { ReviewedBy } from '../types/jsonld'

import { JsonLd, type JsonLdProps } from './jsonld'
import { setReviewedBy } from '../utils/schema/setReviewedBy'

export interface WebSiteJsonLdProps extends JsonLdProps {
    keyOverride?: string
    id: string
    description?: string
    lastReviewed?: string
    reviewedBy?: ReviewedBy
}

function WebSiteJsonLd({
    keyOverride,
    reviewedBy,
    ...rest
}: WebSiteJsonLdProps) {
    const data = {
        ...rest,
        reviewedBy: setReviewedBy(reviewedBy),
    }
    return (
        // <JsonLd
        //   keyOverride={keyOverride}
        //   {...data}
        //   type="WebPage"
        //   scriptKey="WebPage"
        // />
        JsonLd({
            type: 'WebSite',
            scriptKey: 'WebSite',
            ...data,
        })
    )
}

export { WebSiteJsonLd }
