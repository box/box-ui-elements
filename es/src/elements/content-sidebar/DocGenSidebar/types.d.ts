export type DocGenTag = {
    tag_type: 'text' | 'arithmetic' | 'conditional' | 'for-loop' | 'table-loop' | 'image';
    tag_content: string;
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
