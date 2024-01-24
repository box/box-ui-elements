export type DocGenTag = {
    jsonPaths: Array<string>;
    tagContent: string;
    tagType: 'text' | 'arithmetic' | 'conditional' | 'for-loop' | 'table-loop' | 'image';
};

export type DocGenTemplateTagsResponse = {
    data: DocGenTag[];
    pagination: {
        previousMarker?: string;
        nextMarker?: string;
    };
};
