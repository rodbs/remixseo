import { JsonLd, type JsonLdProps } from './jsonld'

import { CourseJsonLd, type CourseJsonLdProps } from '../index'
import type { Review, AggregateRating } from '../types/jsonld'
import { setReviews } from '../utils/schema/setReviews'
import { setAuthor } from '../utils/schema/setAuthor'
import { setNutrition } from '../utils/schema/setNutrition'
import { setAggregateRating } from '../utils/schema/setAggregateRating'
import { setVideo } from '../utils/schema/setVideo'
import { setInstruction } from '../utils/schema/setInstruction'
import { setProvider } from '../utils/schema/setProvider'

type Director = {
    name: string
}

interface DefaultDataProps {
    url: string
}

interface ExtendedCourseJsonLdProps
    extends DefaultDataProps,
        CourseJsonLdProps {}

interface ExtendedRecipeJsonLdProps
    extends DefaultDataProps,
        RecipeJsonLdProps {}

export interface MovieJsonLdProps {
    name: string
    url: string
    image: string
    dateCreated?: string
    director?: Director | Director[]
    review?: Review
    aggregateRating?: AggregateRating
}

export interface CustomJsonLdProps {
    position?: number
    name: string
    type: string
}

export interface CarouselJsonLdProps extends JsonLdProps {
    ofType: 'default' | 'movie' | 'recipe' | 'course' | 'custom'
    data:
        | any
        | DefaultDataProps[]
        | MovieJsonLdProps[]
        | ExtendedCourseJsonLdProps[]
        | ExtendedRecipeJsonLdProps[]
        | CustomJsonLdProps[]
}

function CarouselJsonLd({
    type = 'Carousel',
    keyOverride,
    ofType,
    data,
    ...rest
}: CarouselJsonLdProps) {
    function generateList(
        data: CarouselJsonLdProps['data'],
        ofType: CarouselJsonLdProps['ofType']
    ) {
        switch (ofType) {
            case 'default':
                return (data as DefaultDataProps[]).map((item, index) => ({
                    '@type': 'ListItem',
                    position: `${index + 1}`,
                    url: item.url,
                }))

            case 'course':
                return (data as ExtendedCourseJsonLdProps[]).map(
                    (
                        { courseName, courseDesc, url, provider, ...rest },
                        index
                    ) => ({
                        '@type': 'ListItem',
                        position: `${index + 1}`,
                        item: {
                            '@context': 'https://schema.org',
                            '@type': 'Course',
                            url: url,
                            name: courseName,
                            description: courseDesc,
                            provider: setProvider(provider),
                            ...rest,
                        },
                    })
                )

            case 'movie':
                return (data as MovieJsonLdProps[]).map((item, index) => ({
                    '@type': 'ListItem',
                    position: `${index + 1}`,
                    item: {
                        '@context': 'https://schema.org',
                        '@type': 'Movie',
                        name: item.name,
                        url: item.url,
                        image: item.image,
                        dateCreated: item.dateCreated,
                        director: item.director
                            ? Array.isArray(item.director)
                                ? item.director.map((director) => ({
                                      '@type': 'Person',
                                      name: director.name,
                                  }))
                                : {
                                      '@type': 'Person',
                                      name: item.director.name,
                                  }
                            : undefined,
                        review: setReviews(item.review),
                    },
                }))

            case 'recipe':
                return (data as ExtendedRecipeJsonLdProps[]).map(
                    (
                        {
                            authorName,
                            images,
                            yields,
                            category,
                            calories,
                            aggregateRating,
                            video,
                            ingredients,
                            instructions,
                            cuisine,
                            ...rest
                        },
                        index
                    ) => ({
                        '@type': 'ListItem',
                        position: `${index + 1}`,
                        item: {
                            '@context': 'https://schema.org',
                            '@type': 'Recipe',
                            ...rest,
                            author: setAuthor(authorName),
                            image: images,
                            recipeYield: yields,
                            recipeCategory: category,
                            recipeCuisine: cuisine,
                            nutrition: setNutrition(calories),
                            aggregateRating:
                                setAggregateRating(aggregateRating),
                            video: setVideo(video),
                            recipeIngredient: ingredients,
                            recipeInstructions:
                                instructions.map(setInstruction),
                        },
                    })
                )

            case 'custom':
                return (data as CustomJsonLdProps[]).map((item, index) => ({
                    '@type': 'ListItem',
                    position: item.position ?? index + 1,
                    item: {
                        '@type': item.type,
                        name: item.name,
                    },
                }))
            // case 'custom':
            //     return (data as DefaultDataProps[]).map(
            //         ({ ...rest }, index) => ({
            //             '@type': 'ListItem',
            //             position: `${index + 1}`,
            //             item: { ...rest },
            //         })
            //     )
        }
    }

    const jsonLdData = {
        '@type': 'ItemList',
        ...rest,
        itemListElement: generateList(data, ofType),
        ...rest,
    }

    return (
        // <JsonLd
        //     type={type}
        //     keyOverride={keyOverride}
        //     {...jsonLdData}
        //     scriptKey="Carousel"
        // />
        JsonLd({
            type: type,
            scriptKey: 'Carousel',
            ...jsonLdData,
        })
    )
}

export { CarouselJsonLd }
