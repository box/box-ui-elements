// our apis are in camel case
export type DocGenTag = {
    /* eslint-disable-next-line camelcase */
    json_paths: Array<string>;
    /* eslint-disable-next-line camelcase */
    tag_content: string;
    /* eslint-disable-next-line camelcase */
    tag_type: 'text' | 'arithmetic' | 'conditional' | 'for-loop' | 'table-loop' | 'image';
};

export type DocGenTemplateTagsResponse = {
    data: DocGenTag[];
    pagination: {
        previousMarker?: string;
        nextMarker?: string;
    };
};

export interface JsonData {
    [key: string]: JsonData | string[];
}
