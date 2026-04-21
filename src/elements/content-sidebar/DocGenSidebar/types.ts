// our apis are in snake case
export type DocGenTag = {
    /* eslint-disable-next-line camelcase */
    tag_type:
        | 'text'
        | 'arithmetic'
        | 'conditional'
        | 'for-loop'
        | 'table-loop'
        | 'image'
        | 'checkbox'
        | 'radiobutton'
        | 'dropdown';
    /* eslint-disable-next-line camelcase */
    tag_content: string;
    /* eslint-disable-next-line camelcase */
    json_paths: Array<string>;
};

export type DocGenTemplateTagsResponse = {
    data?: DocGenTag[];
    message?: string;
    pagination?: {
        previousMarker?: string;
        nextMarker?: string;
    };
};

export interface JsonPathsMap {
    [key: string]: JsonPathsMap | {};
}

/** PDF template control tags that render in their own sidebar section. */
export const PDF_FIELD_TAG_TYPES = ['checkbox', 'radiobutton', 'dropdown'] as const;

export function isPdfFormFieldTagType(tagType: DocGenTag['tag_type']): boolean {
    return (PDF_FIELD_TAG_TYPES as readonly DocGenTag['tag_type'][]).includes(tagType);
}
