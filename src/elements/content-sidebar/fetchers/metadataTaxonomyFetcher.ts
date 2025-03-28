import { TreeQueryInput } from '@box/combobox-with-api';
import type API from '../../../api';
import type { MetadataOptionEntry } from '../../../common/types/metadata';

export const metadataTaxonomyFetcher = async (
    api: API,
    fileId: string,
    scope: string,
    templateKey: string,
    fieldKey: string,
    level: number,
    options: TreeQueryInput,
) => {
    const metadataOptions = await api
        .getMetadataAPI(false)
        .getMetadataOptions(fileId, scope, templateKey, fieldKey, level, options);
    const { marker = null } = options;

    return {
        options: metadataOptions.entries.map((metadataOption: MetadataOptionEntry) => ({
            value: metadataOption.id,
            displayValue: metadataOption.display_name,
            level: metadataOption.level,
            ancestors: metadataOption.ancestors?.map(ancestor => ({
                ...ancestor,
                displayName: ancestor.display_name,
            })),
            selectable: metadataOption.selectable,
        })),
        marker,
    };
};

type HydratedMetadataTaxonomyLevel = {
    level: number;
    levelName: string;
    description: string;
    levelValue: string;
    id: string;
};

export const metadataTaxonomyNodeAncestorsFetcher = async (
    api: API,
    fileID: string,
    scope: string,
    taxonomyKey: string,
    nodeID: string,
): Promise<HydratedMetadataTaxonomyLevel[]> => {
    const [metadataTaxonomy, metadataTaxonomyNode] = await Promise.all([
        api.getMetadataAPI(false).getMetadataTaxonomy(fileID, scope, taxonomyKey),
        api.getMetadataAPI(false).getMetadataTaxonomyNode(fileID, scope, taxonomyKey, nodeID, true),
    ]);

    if (!metadataTaxonomy?.levels) {
        return [];
    }
    // Create a hashmap of levels to easily hydrate with data from metadataTaxonomyNode
    const levelsMap = new Map();
    for (const item of metadataTaxonomy.levels) {
        const levelData = {
            level: item.level,
            levelName: item.displayName,
            description: item.description,
        };

        // If the level matches the metadataTaxonomyNode level, hydrate the level with the node data
        if (metadataTaxonomyNode.level === item.level) {
            levelsMap.set(item.level, {
                ...levelData,
                id: metadataTaxonomyNode.id,
                levelValue: metadataTaxonomyNode.displayName,
            });
            // If the level is not the metadataTaxonomyNode level, just add the level data
        } else {
            levelsMap.set(item.level, levelData);
        }
    }
    // Hydrate the levels with the ancestors data from the metadataTaxonomyNode
    if (metadataTaxonomyNode.ancestors?.length) {
        for (const ancestor of metadataTaxonomyNode.ancestors) {
            const levelData = levelsMap.get(ancestor.level);

            if (levelData) {
                levelsMap.set(ancestor.level, { ...levelData, levelValue: ancestor.displayName, id: ancestor.id });
            }
        }
    }

    // Filter out levels that were not hydrated by metadataTaxonomyNode
    const hydratedLevels = Array.from(levelsMap.values()).filter(level => !!level.id);

    // Return the hydrated levels as an array
    return hydratedLevels;
};
