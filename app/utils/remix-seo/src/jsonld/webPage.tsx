import type { ReviewedBy } from '../types/jsonld'

import { JsonLd, type JsonLdProps } from './jsonld'
import { setReviewedBy } from '../utils/schema/setReviewedBy'

export interface WebPageJsonLdProps extends JsonLdProps {
    keyOverride?: string
    id: string
    description?: string
    lastReviewed?: string
    reviewedBy?: ReviewedBy
}

function WebPageJsonLd({
    keyOverride,
    reviewedBy,
    ...rest
}: WebPageJsonLdProps) {
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
            type: 'WebPage',
            scriptKey: 'WebPage',
            ...data,
        })
    )
}

export { WebPageJsonLd }
