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

/**
 * Shape of a taxonomy node as it arrives from the backend.
 *
 * The `/options` endpoint currently emits snake_case (`display_name`, `has_children`)
 * while the `taxonomy-node` endpoint has migrated to camelCase (`displayName`,
 * `hasChildren`). Until both endpoints converge on camelCase we accept either
 * spelling on every field. See `getDisplayName` / `getHasChildren` for the
 * normalization logic.
 *
 * This local type intentionally supersedes the untyped Flow `MetadataOptionEntry`
 * for taxonomy code — it documents which fields we actually consume.
 */
type TaxonomyEntry = {
    id: string;
    // API may return level as number ('1') or string ('"1"'); callers coerce.
    level: number | string;
    display_name?: string;
    displayName?: string;
    has_children?: boolean;
    hasChildren?: boolean;
    selectable?: boolean;
    ancestors?: Array<TaxonomyEntryAncestor | string | null | undefined>;
};

type TaxonomyEntryAncestor = {
    id: string;
    level: number | string;
    display_name?: string;
    displayName?: string;
};

const getDisplayName = (entry: TaxonomyEntry | TaxonomyEntryAncestor): string =>
    entry.display_name || entry.displayName || '';

const mapAncestors = (ancestors: TaxonomyEntry['ancestors']): TaxonomyAncestor[] => {
    const list = ancestors ?? [];
    // Bare-string ancestor ids lack the data needed to render a breadcrumb.
    return list
        .filter((ancestor): ancestor is TaxonomyEntryAncestor => !!ancestor && typeof ancestor === 'object')
        .map(ancestor => ({
            id: ancestor.id,
            displayName: getDisplayName(ancestor),
            level: Number(ancestor.level),
        }));
};

/**
 * Prefers the backend `has_children` / `hasChildren` flag when present, otherwise
 * infers from taxonomy depth. In single-level picker mode every node is treated
 * as a leaf so the drill-down chevron never appears.
 */
const getHasChildren = (entry: TaxonomyEntry, maxLevel: number, isSingleLevelMode: boolean): boolean => {
    if (isSingleLevelMode) {
        return false;
    }
    if (typeof entry.has_children === 'boolean') {
        return entry.has_children;
    }
    if (typeof entry.hasChildren === 'boolean') {
        return entry.hasChildren;
    }
    return maxLevel > 0 ? Number(entry.level) < maxLevel : false;
};

// Always producing `ancestors` lets one mapper satisfy both browse (optional) and search (required).
const mapOption = (
    entry: TaxonomyEntry,
    maxLevel: number,
    isSingleLevelMode: boolean,
): TaxonomyNode & TaxonomySearchResult => ({
    id: entry.id,
    displayName: getDisplayName(entry),
    level: Number(entry.level),
    selectable: !!entry.selectable,
    hasChildren: getHasChildren(entry, maxLevel, isSingleLevelMode),
    ancestors: mapAncestors(entry.ancestors),
});

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
        // Defaults keep the rest of the logic free of `?.` / `!= null` noise.
        const { levels = [], selectableLevels = [] } = resolveField?.(templateKey, fieldKey) ?? {};
        const maxLevel = levels.length > 0 ? Math.max(...levels.map(({ level }) => level)) : 0;
        const isSingleLevelMode = selectableLevels.length === 1;
        const singleSelectableLevel = isSingleLevelMode ? Number(selectableLevels[0]) : undefined;
        // Multi-level taxonomies need a `level` filter or /options mixes branches.
        const isMultiLevelTaxonomy = maxLevel > 1;

        // Tracks levels of returned nodes so drill-down can request `parentLevel + 1`.
        const nodeLevelById = new Map<string, number>();

        const rememberLevels = (entries: TaxonomyEntry[]): void => {
            for (const entry of entries) {
                if (entry?.id != null && entry.level != null) {
                    nodeLevelById.set(String(entry.id), Number(entry.level));
                }
                for (const ancestor of entry?.ancestors ?? []) {
                    if (ancestor && typeof ancestor === 'object' && ancestor.id != null && ancestor.level != null) {
                        nodeLevelById.set(String(ancestor.id), Number(ancestor.level));
                    }
                }
            }
        };

        const getChildLevel = (parentId: string | null): number => {
            if (parentId === null) {
                return singleSelectableLevel ?? 1;
            }
            const parentLevel = nodeLevelById.get(parentId);
            return parentLevel !== undefined ? parentLevel + 1 : 1;
        };

        const getNodes = async (
            parentId: string | null,
            { marker, signal }: FetchParams,
        ): Promise<FetchResponse<TaxonomyNode>> => {
            // Single-level picker is flat — defensively ignore drill-down.
            const effectiveParentId = isSingleLevelMode ? null : parentId;
            const childLevel = getChildLevel(effectiveParentId);
            const shouldFilterByLevel = isMultiLevelTaxonomy || isSingleLevelMode;
            const response = await api
                .getMetadataAPI(false)
                .getMetadataOptions(fileId, scope, templateKey, fieldKey, childLevel, {
                    ...(shouldFilterByLevel ? { level: childLevel } : {}),
                    ...(effectiveParentId ? { ancestorId: effectiveParentId } : {}),
                    ...(marker ? { marker } : {}),
                    signal,
                });

            const entries: TaxonomyEntry[] = response.entries ?? [];
            rememberLevels(entries);

            return {
                entries: entries.map(entry => mapOption(entry, maxLevel, isSingleLevelMode)),
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

            const entries: TaxonomyEntry[] = response.entries ?? [];
            rememberLevels(entries);

            return {
                entries: entries.map(entry => mapOption(entry, maxLevel, isSingleLevelMode)),
                next_marker: response.next_marker ?? undefined,
            };
        };

        return { getNodes, searchNodes };
    };
