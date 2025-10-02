import { TreeQueryInput, TreeOptionType, FetcherResponse } from '@box/combobox-with-api';
export declare const metadataTaxonomyFetcher: (api: API, fileId: string, scope: string, templateKey: string, fieldKey: string, level: number, options: TreeQueryInput) => Promise<FetcherResponse<TreeOptionType>>;
type HydratedMetadataTaxonomyLevel = {
    level: number;
    levelName: string;
    description: string;
    levelValue: string;
    id: string;
};
export declare const metadataTaxonomyNodeAncestorsFetcher: (api: API, fileID: string, scope: string, taxonomyKey: string, nodeID: string) => Promise<HydratedMetadataTaxonomyLevel[]>;
export {};
