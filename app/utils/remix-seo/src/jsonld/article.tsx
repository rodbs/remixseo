import React from 'react'

import { JsonLd, type JsonLdProps } from './jsonld'
import { setAuthor } from '../utils/schema/setAuthor'
import { setPublisher } from '../utils/schema/setPublisher'
import type { ArticleAuthor } from '../types/jsonld'

export interface ArticleJsonLdProps extends JsonLdProps {
    type?: 'Article' | 'BlogPosting' | 'NewsArticle' | 'Blog'
    url: string
    title: string
    images: ReadonlyArray<string>
    datePublished: string
    dateModified?: string
    authorName: string | string[] | ArticleAuthor | ArticleAuthor[]
    description: string
    publisherName?: string
    publisherLogo?: string
    isAccessibleForFree?: boolean
}

function ArticleJsonLd({
    type = 'Article',
    keyOverride,
    url,
    title,
    images,
    datePublished,
    dateModified,
    authorName,
    publisherName = undefined,
    publisherLogo = undefined,
    description,
    isAccessibleForFree,
    ...rest
}: ArticleJsonLdProps) {
    const data = {
        datePublished,
        description,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        headline: title,
        image: images,
        dateModified: dateModified || datePublished,
        author: setAuthor(authorName),
        publisher: setPublisher(publisherName, publisherLogo),
        isAccessibleForFree: isAccessibleForFree,
        ...rest,
    }
    return (
        // <JsonLd
        //     type={type}
        //     keyOverride={keyOverride}
        //     {...data}
        //     scriptKey="article"
        // />
        JsonLd({
            type: type,
            scriptKey: 'article',
            ...data,
        })
    )
}

export default ArticleJsonLd
