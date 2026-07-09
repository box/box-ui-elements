import { TreeQueryInput, TreeOptionType, FetcherResponse, type Level } from '@box/combobox-with-api';
import type {
    FetchParams,
    FetchResponse,
    SearchParams,
    TaxonomyAncestor,
    TaxonomyItemsService,
    TaxonomyNode,
    TaxonomySearchResult,
} from '@box/metadata-taxonomy-picker';
import type { CreateTaxonomyItemsService } from '@box/metadata-editor/lib/components/metadata-editor-fields/components/metadata-taxonomy-field/types.js';
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
): Promise<FetcherResponse<TreeOptionType>> => {
    const metadataOptions = await api
        .getMetadataAPI(false)
        .getMetadataOptions(fileId, scope, templateKey, fieldKey, level, options);
    const { marker = null } = options;

    return {
        options: metadataOptions.entries.map((metadataOption: MetadataOptionEntry) => ({
            value: metadataOption.id,
            displayValue: metadataOption.display_name || metadataOption.displayName,
            level: metadataOption.level,
            parentId: metadataOption.parentId,
            nodePath: metadataOption.nodePath,
            deprecated: metadataOption.deprecated,
            ancestors: metadataOption.ancestors?.map(({ display_name, displayName, ...rest }) => ({
                ...rest,
                displayName: display_name || displayName,
            })),
            selectable: metadataOption.selectable,
        })),
        marker,
        ...(metadataOptions.total_result_count !== undefined && {
            totalResultCount: metadataOptions.total_result_count,
        }),
        ...(metadataOptions.limit !== undefined && { limit: metadataOptions.limit }),
    } as FetcherResponse<TreeOptionType>;
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
            levelName: item.displayName || item.display_name,
            description: item.description,
        };

        // If the level matches the metadataTaxonomyNode level, hydrate the level with the node data
        if (metadataTaxonomyNode.level === item.level) {
            levelsMap.set(item.level, {
                ...levelData,
                id: metadataTaxonomyNode.id,
                levelValue: metadataTaxonomyNode.displayName || metadataTaxonomyNode.display_name,
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
                levelsMap.set(ancestor.level, {
                    ...levelData,
                    levelValue: ancestor.displayName || ancestor.display_name,
                    id: ancestor.id,
                });
            }
        }
    }

    // Filter out levels that were not hydrated by metadataTaxonomyNode
    const hydratedLevels = Array.from(levelsMap.values()).filter(level => !!level.id);

    // Return the hydrated levels as an array
    return hydratedLevels;
};

// Upstream sources mix snake_case (/options) and camelCase (taxonomy-node), so read both.
const getDisplayName = (option: MetadataOptionEntry): string => option.display_name || option.displayName || '';

const mapAncestors = (ancestors: MetadataOptionEntry['ancestors']): TaxonomyAncestor[] => {
    const list = ancestors ?? [];
    // Bare-string ancestor ids lack the data needed to render a breadcrumb.
    return list
        .filter(ancestor => !!ancestor && typeof ancestor === 'object')
        .map(ancestor => ({
            id: ancestor.id,
            displayName: ancestor.display_name || ancestor.displayName || '',
            level: Number(ancestor.level),
        }));
};

// Prefers backend `has_children`; falls back to depth. `forceLeaf` disables drill-down.
const getHasChildren = (option: MetadataOptionEntry, maxLevel?: number, forceLeaf?: boolean): boolean => {
    if (forceLeaf) {
        return false;
    }
    if (typeof option.has_children === 'boolean') {
        return option.has_children;
    }
    if (typeof option.hasChildren === 'boolean') {
        return option.hasChildren;
    }
    return maxLevel != null ? Number(option.level) < maxLevel : false;
};

// Always producing `ancestors` lets one mapper satisfy both browse (optional) and search (required).
const mapOption = (
    option: MetadataOptionEntry,
    maxLevel?: number,
    forceLeaf?: boolean,
): TaxonomyNode & TaxonomySearchResult => ({
    id: option.id,
    displayName: getDisplayName(option),
    level: Number(option.level),
    selectable: !!option.selectable,
    hasChildren: getHasChildren(option, maxLevel, forceLeaf),
    ancestors: mapAncestors(option.ancestors),
});

const getMaxLevel = (levels?: Level[]): number | undefined =>
    levels && levels.length > 0 ? Math.max(...levels.map(({ level }) => level)) : undefined;

export type TaxonomyFieldConfig = {
    levels?: Level[];
    selectableLevels?: number[];
};

/**
 * Factory for the `MetadataTaxonomyPicker` in `@box/metadata-editor`.
 *
 * `/options` returns a flat list unless scoped by `level` (+ `ancestor` for drill-down):
 * - Single-level picker (`selectableLevels.length === 1`): loads that level directly, every node is a leaf.
 * - Multi-level picker: starts at level 1, drills via `parentLevel + 1` with `ancestor=<parentId>`.
 */
export const createTaxonomyItemsService =
    (
        api: API,
        fileId: string,
        resolveField?: (templateKey: string, fieldKey: string) => TaxonomyFieldConfig | undefined,
    ): CreateTaxonomyItemsService =>
    ({ scope, templateKey, fieldKey }): TaxonomyItemsService => {
        const fieldConfig = resolveField?.(templateKey, fieldKey);
        const maxLevel = getMaxLevel(fieldConfig?.levels);
        const selectableLevels = fieldConfig?.selectableLevels;
        const singleSelectableLevel =
            selectableLevels && selectableLevels.length === 1 ? Number(selectableLevels[0]) : undefined;
        const isSingleLevelPickerMode = singleSelectableLevel != null;
        // Multi-level taxonomies need a `level` filter or /options mixes branches.
        const isMultiLevelTaxonomy = maxLevel != null && maxLevel > 1;

        // Tracks levels of returned nodes so drill-down can request `parentLevel + 1`.
        const nodeLevelById = new Map<string, number>();

        const rememberLevels = (entries: MetadataOptionEntry[] | undefined): void => {
            if (!entries) {
                return;
            }
            for (const entry of entries) {
                if (entry?.id != null && entry.level != null) {
                    nodeLevelById.set(String(entry.id), Number(entry.level));
                }
                if (Array.isArray(entry?.ancestors)) {
                    for (const ancestor of entry.ancestors) {
                        if (ancestor && typeof ancestor === 'object' && ancestor.id != null && ancestor.level != null) {
                            nodeLevelById.set(String(ancestor.id), Number(ancestor.level));
                        }
                    }
                }
            }
        };

        const getChildLevel = (parentId: string | null): number => {
            if (parentId === null) {
                return singleSelectableLevel ?? 1;
            }
            const parentLevel = nodeLevelById.get(parentId);
            return parentLevel != null ? parentLevel + 1 : 1;
        };

        const getNodes = async (
            parentId: string | null,
            { marker, signal }: FetchParams,
        ): Promise<FetchResponse<TaxonomyNode>> => {
            // Single-level picker is flat — defensively ignore drill-down.
            const effectiveParentId = isSingleLevelPickerMode ? null : parentId;
            const childLevel = getChildLevel(effectiveParentId);
            const shouldFilterByLevel = isMultiLevelTaxonomy || isSingleLevelPickerMode;
            const response = await api
                .getMetadataAPI(false)
                .getMetadataOptions(fileId, scope, templateKey, fieldKey, childLevel, {
                    ...(shouldFilterByLevel ? { level: childLevel } : {}),
                    ...(effectiveParentId ? { ancestorId: effectiveParentId } : {}),
                    ...(marker ? { marker } : {}),
                    signal,
                });

            const entries = response.entries ?? [];
            rememberLevels(entries);

            return {
                entries: entries.map((option: MetadataOptionEntry) =>
                    mapOption(option, maxLevel, isSingleLevelPickerMode),
                ),
                next_marker: response.next_marker ?? undefined,
            };
        };

        const searchNodes = async (
            query: string,
            { marker, signal, parentId, levelFilter }: SearchParams,
        ): Promise<FetchResponse<TaxonomySearchResult>> => {
            const response = await api
                .getMetadataAPI(false)
                .getMetadataOptions(fileId, scope, templateKey, fieldKey, levelFilter ?? 0, {
                    searchInput: query,
                    ...(parentId ? { ancestorId: parentId } : {}),
                    ...(levelFilter ? { level: levelFilter } : {}),
                    ...(marker ? { marker } : {}),
                    signal,
                });

            const entries = response.entries ?? [];
            rememberLevels(entries);

            return {
                entries: entries.map((option: MetadataOptionEntry) =>
                    mapOption(option, maxLevel, isSingleLevelPickerMode),
                ),
                next_marker: response.next_marker ?? undefined,
            };
        };

        return { getNodes, searchNodes };
    };
