import type { PaginationQueryInput } from '@box/metadata-editor';
import type API from '../../../api';
import type { MetadataOptionEntry } from '../../../common/types/metadata';

export const metadataTaxonomyFetcher = async (
    api: API,
    fileId: string,
    scope: string,
    templateKey: string,
    fieldKey: string,
    level: number,
    options: PaginationQueryInput,
) => {
    const metadataOptions = await api
        .getMetadataAPI(false)
        .getMetadataOptions(fileId, scope, templateKey, fieldKey, level, options);
    const { marker = null } = options;

    return {
        options: metadataOptions.entries.map((metadataOption: MetadataOptionEntry) => ({
            value: metadataOption.id,
            displayValue: metadataOption.displayName,
        })),
        marker,
    };
};

export const metadataTaxonomyNodeAncestorsFetcher = async (
    api: API,
    scope: string,
    taxonomyKey: string,
    nodeID: string,
) => {
    const [metadataTaxonomyLevels, metadataTaxonomyNode] = await Promise.all([
        api.getMetadataAPI(false).getMetadataTaxonomyLevels(scope, taxonomyKey),
        api.getMetadataAPI(false).getMetadataTaxonomyNode(scope, taxonomyKey, nodeID, true),
    ]);

    // Create a hashmap of levels to easily hydrate with data from metadataTaxonomyNode
    const levelsMap = new Map();
    for (const item of metadataTaxonomyLevels.levels) {
        const levelData = {
            level: item.level,
            levelName: item.displayName,
            description: item.description,
        };

        if (metadataTaxonomyNode.level === item.level) {
            levelsMap.set(item.level, {
                ...levelData,
                id: metadataTaxonomyNode.id,
                levelValue: metadataTaxonomyNode.displayName,
            });
        } else {
            levelsMap.set(item.level, levelData);
        }
    }

    if (metadataTaxonomyNode.ancestors?.length) {
        for (const ancestor of metadataTaxonomyNode.ancestors) {
            const levelData = levelsMap.get(ancestor.level);

            if (levelData) {
                levelsMap.set(ancestor.level, { ...levelData, levelValue: ancestor.displayName, id: ancestor.id });
            }
        }
    }

    return Array.from(levelsMap.values());
};
