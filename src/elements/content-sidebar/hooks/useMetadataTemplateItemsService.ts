import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
    type FetchParams,
    type FetchResponse,
    type ItemsService,
    type MetadataTemplate as BrowserMetadataTemplate,
    type MetadataNamespace,
} from '@box/metadata-template-browser';
import type { MetadataTemplate as EditorMetadataTemplate } from '@box/metadata-editor';

import API from '../../../api';
import { METADATA_TEMPLATE_PROPERTIES } from '../../../constants';
import messages from '../../../features/metadata-instance-editor/messages';
import type { BoxItem } from '../../../common/types/core';

function resolveDisplayName(template: EditorMetadataTemplate, customMetadataName: string): string {
    if (template.templateKey === METADATA_TEMPLATE_PROPERTIES) {
        return customMetadataName;
    }
    return template.displayName || template.templateKey;
}

/**
 * Builds the data-fetching `ItemsService` consumed by `MetadataTemplateBrowser`
 * for the metadata sidebar in namespace-enabled mode.
 *
 * - `getNamespaces` and `getTemplates` delegate to live API calls via `Metadata.js`,
 *   enabling paginated namespace navigation and per-namespace template lists.
 * - `getSearchResults` performs client-side filtering over the editor-shape `templates`
 *   already fetched by `useSidebarMetadataFetcher`. A server-side search endpoint
 *   would replace this body when available.
 *
 * Returns `undefined` when `enterpriseFqn` is not yet known (templates still loading).
 *
 * @example
 * const itemsService = useMetadataTemplateItemsService(api, enterpriseFqn, templates);
 */
export default function useMetadataTemplateItemsService(
    api: API,
    file: BoxItem,
    enterpriseFqn: string | undefined,
    templates: EditorMetadataTemplate[],
): ItemsService | undefined {
    const { formatMessage } = useIntl();
    const customMetadataName = formatMessage(messages.customTitle);

    return useMemo<ItemsService | undefined>(() => {
        if (!enterpriseFqn) {
            return undefined;
        }

        // Flat browser-shape list derived from the already-loaded editor templates.
        // Used for client-side search so search doesn't require a round-trip.
        const browserTemplatesForSearch: BrowserMetadataTemplate[] = templates.map(t => ({
            id: t.id,
            type: t.type,
            displayName: resolveDisplayName(t, customMetadataName),
            scope: t.scope,
            templateKey: t.templateKey,
            canEdit: t.canEdit,
            hidden: t.hidden,
        }));

        return {
            getNamespaces: async (
                namespaceFQN: string,
                params: FetchParams,
            ): Promise<FetchResponse<MetadataNamespace>> => {
                const result = await api
                    .getMetadataAPI(false)
                    .listNamespaces(file, namespaceFQN, { limit: params.limit, marker: params.marker });
                return result as FetchResponse<MetadataNamespace>;
            },

            getTemplates: async (
                namespaceFQN: string,
                params: FetchParams,
            ): Promise<FetchResponse<BrowserMetadataTemplate>> => {
                const result = await api
                    .getMetadataAPI(false)
                    .listTemplatesForNamespace(file, namespaceFQN, { limit: params.limit, marker: params.marker });
                // Map the raw API response to the browser-expected shape.
                // The API returns camelCase fields; we normalise displayName and scope/namespace.
                const entries: BrowserMetadataTemplate[] = (result.entries ?? []).map((t: Record<string, unknown>) => {
                    const templateKey = t.templateKey as string;
                    const templateScope = (t.namespace as string) ?? (t.scope as string) ?? namespaceFQN;
                    // Prefer the editor template's id so that id-based lookups in
                    // handleEditTemplateById / onTemplateSelect resolve correctly.
                    // Falls back to the raw API id when there is no matching editor template
                    // (e.g. child-namespace-only templates not yet in the editor list).
                    const editorMatch = templates.find(
                        et =>
                            et.templateKey === templateKey &&
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (et.scope === templateScope || (et as any).namespace === templateScope),
                    );
                    return {
                        id: editorMatch?.id ?? (t.id as string),
                        type: (t.type as string) ?? 'metadata_template',
                        displayName: ((t.displayName as string) ?? templateKey) || '',
                        scope: templateScope,
                        templateKey,
                        canEdit: (t.canEdit as boolean) ?? false,
                        hidden: (t.hidden as boolean) ?? false,
                    };
                });
                return { entries, next_marker: result.next_marker };
            },

            getSearchResults: async (
                query: string,
                params: FetchParams,
            ): Promise<FetchResponse<BrowserMetadataTemplate>> => {
                const normalizedQuery = query.trim().toLowerCase();
                const filtered = normalizedQuery
                    ? browserTemplatesForSearch.filter(t => t.displayName.toLowerCase().includes(normalizedQuery))
                    : browserTemplatesForSearch;

                // Cursor pagination over in-memory results using numeric offset markers.
                const start = params.marker ? Number.parseInt(params.marker, 10) : 0;
                const end = start + params.limit;
                return {
                    entries: filtered.slice(start, end),
                    next_marker: end < filtered.length ? String(end) : undefined,
                };
            },
        };
    }, [api, file, enterpriseFqn, templates, customMetadataName]);
}
