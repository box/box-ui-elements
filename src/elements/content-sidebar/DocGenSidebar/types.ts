// our apis are in snake case
export type DocGenTag = {
    /* eslint-disable-next-line camelcase */
    tag_type: 'text' | 'arithmetic' | 'conditional' | 'for-loop' | 'table-loop' | 'image';
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
