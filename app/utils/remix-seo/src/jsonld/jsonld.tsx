import toJson from '../utils/toJson'

export interface JsonLdProps {
    type?: string
    scriptId?: string
    dataArray?: any[]
    [key: string]: any
}

function JsonLd({
    type = 'Thing',
    // keyOverride,
    scriptKey,
    // scriptId = undefined,
    dataArray,
    ...rest
}: JsonLdProps & { scriptKey: string }) {
    const JsonLdScript = {
        'script:ld+json': toJson(
            type,
            dataArray === undefined ? { ...rest } : dataArray
        ),
    }

    return JsonLdScript
}

export { JsonLd }
