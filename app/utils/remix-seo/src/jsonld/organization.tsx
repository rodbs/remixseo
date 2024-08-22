import React from 'react'

import type {
    Address,
    OrganizationCategory,
    ContactPoint,
} from '../types/jsonld'
import { JsonLd, type JsonLdProps } from './jsonld'
import { setAddress } from '../utils/schema/setAddress'
import { setContactPoints } from '../utils/schema/setContactPoints'

export interface OrganizationJsonLdProps extends JsonLdProps {
    type?: OrganizationCategory
    id?: string
    name: string
    logo?: string
    url: string
    legalName?: string
    sameAs?: string[]
    address?: Address | Address[]
    /**
     * @deprecated please use contactPoint instead. contactPoints will continue to work until next major release.
     */
    contactPoints?: ContactPoint[]
    contactPoint?: ContactPoint[]
}

function OrganizationJsonLd({
    type = 'Organization',
    // keyOverride,
    address,
    contactPoint,
    ...rest
}: OrganizationJsonLdProps) {
    const data = {
        ...rest,
        address: setAddress(address),
        contactPoint: setContactPoints(contactPoint),
    }
    return JsonLd({
        type: type,
        scriptKey: 'organization',
        ...data,
    })
}

export { OrganizationJsonLd }

// JsonLd( {type={type},
//     {...data},
//     scriptKey="organization"} )
