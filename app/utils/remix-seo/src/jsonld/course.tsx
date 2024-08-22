import React from 'react'

import type { Provider } from '../types/jsonld'
import { setProvider } from '../utils/schema/setProvider'

import { JsonLd, type JsonLdProps } from './jsonld'

export interface CourseJsonLdProps extends JsonLdProps {
    courseName: string
    courseDesc: string
    provider: Provider
}

function CourseJsonLd({
    type = 'Course',
    keyOverride,
    courseName,
    courseDesc,
    provider,
    ...rest
}: CourseJsonLdProps) {
    const data = {
        name: courseName,
        description: courseDesc,
        provider: setProvider(provider),
        ...rest,
    }
    return (
        // <JsonLd
        //     type={type}
        //     keyOverride={keyOverride}
        //     {...data}
        //     scriptKey="course"
        // />
        JsonLd({
            type: type,
            scriptKey: 'course',
            ...data,
        })
    )
}

export { CourseJsonLd }
