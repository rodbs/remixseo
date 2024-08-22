import React from 'react'

import type { ItemListElements } from '../types/jsonld'
import { setItemListElements } from '../utils/schema/setItemListElements'

import { JsonLd, type JsonLdProps } from './jsonld'

export interface BreadCrumbJsonLdProps extends JsonLdProps {
    itemListElements: ItemListElements[]
}

function BreadCrumbJsonLd({
    type = 'BreadcrumbList',
    keyOverride,
    itemListElements,
    ...rest
}: BreadCrumbJsonLdProps) {
    const data = {
        ...rest,
        itemListElement: setItemListElements(itemListElements),
    }

    return (
        // <JsonLd
        //     type={type}
        //     keyOverride={keyOverride}
        //     {...data}
        //     scriptKey="breadcrumb"
        // />
        JsonLd({
            type: type,
            scriptKey: 'breadcrumb',
            ...data,
        })
    )
}

export { BreadCrumbJsonLd }
