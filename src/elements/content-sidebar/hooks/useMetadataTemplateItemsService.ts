import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
    type BrowserMetadataTemplate,
    type FetchParams,
    type FetchResponse,
    type ItemsService,
    type MetadataNamespace,
    type MetadataTemplate,
} from '@box/metadata-editor';

import { METADATA_TEMPLATE_PROPERTIES } from '../../../constants';
import messages from '../../../features/metadata-instance-editor/messages';
import {
    MOCK_METADATA_TEMPLATE_NAMESPACE_IDS,
    MOCK_METADATA_TEMPLATE_NAMESPACES,
} from '../constants/mockMetadataTemplateNamespaces';

/**
 * Paginates an in-memory list using `marker` as a numeric offset string.
 * Mirrors the `next_marker` cursor convention the browser package expects.
 */
function paginate<T>(items: T[], { limit, marker }: FetchParams): FetchResponse<T> {
    const start = marker ? Number.parseInt(marker, 10) : 0;
    const end = start + limit;
    const entries = items.slice(start, end);
    const next_marker = end < items.length ? String(end) : undefined;

    return { entries, next_marker };
}

function resolveDisplayName(template: MetadataTemplate, customMetadataName: string): string {
    if (template.templateKey === METADATA_TEMPLATE_PROPERTIES) {
        return customMetadataName;
    }
    return template.displayName || template.templateKey;
}

function toBrowserTemplate(template: MetadataTemplate, customMetadataName: string): BrowserMetadataTemplate {
    return {
        id: template.id,
        type: template.type,
        copyInstanceOnItemCopy: template.copyInstanceOnItemCopy,
        displayName: resolveDisplayName(template, customMetadataName),
        scope: template.scope,
        templateKey: template.templateKey,
        canEdit: template.canEdit,
        hidden: template.hidden,
    };
}

/**
 * Builds the data-fetching `ItemsService` consumed by
 * `MetadataTemplateBrowser` for the metadata sidebar.
 *
 * Today this is a flat-list adapter over the templates already fetched by
 * `useSidebarMetadataFetcher`: pagination + search are computed client-side,
 * namespaces are served from `MOCK_METADATA_TEMPLATE_NAMESPACES` while the
 * backend `getNamespaces` endpoint does not exist yet, and templates the
 * user creates during the session via the editor modal are merged in from
 * `browserTemplatesByNamespace` (which the host produces newest-first per
 * namespace). Session-created templates are prepended on each fetch so the
 * latest creation appears at the top of the dropdown on every reopen.
 *
 * When the backend gains paginated template / namespace / search endpoints,
 * replace the body of this hook with real `api.getMetadataAPI()` calls — the
 * returned shape and consumer contract stay the same.
 *
 * @example
 * const itemsService = useMetadataTemplateItemsService(templates, browserTemplatesByNamespace);
 */
export default function useMetadataTemplateItemsService(
    templates: MetadataTemplate[],
    browserTemplatesByNamespace: ReadonlyMap<string, BrowserMetadataTemplate[]>,
): ItemsService {
    const { formatMessage } = useIntl();
    const customMetadataName = formatMessage(messages.customTitle);

    return useMemo<ItemsService>(() => {
        const browserTemplates = templates.map(template => toBrowserTemplate(template, customMetadataName));
        const namespaces: MetadataNamespace[] = MOCK_METADATA_TEMPLATE_NAMESPACES.map(
            ({ id, displayName, canCreate }) => ({
                id,
                displayName,
                ...(canCreate !== undefined && { canCreate }),
            }),
        );
        const templatesByNamespaceId = new Map<string, BrowserMetadataTemplate[]>(
            MOCK_METADATA_TEMPLATE_NAMESPACES.map(namespace => [
                namespace.id,
                namespace.templates.map(template => toBrowserTemplate(template, customMetadataName)),
            ]),
        );

        const getCreatedForNamespace = (namespaceFQN: string): BrowserMetadataTemplate[] =>
            browserTemplatesByNamespace.get(namespaceFQN) ?? [];

        return {
            getNamespaces: async (namespaceFQN, params) => {
                // Mock namespaces have no children yet — drilling into one
                // returns an empty list. All other FQNs (e.g. the enterprise
                // root) receive the full mock namespace list.
                if (MOCK_METADATA_TEMPLATE_NAMESPACE_IDS.has(namespaceFQN)) {
                    return { entries: [], next_marker: undefined };
                }
                return paginate(namespaces, params);
            },
            getTemplates: async (namespaceFQN, params) => {
                // Prepend session-created templates so the most recently
                // created one appears at the top of the list on each reopen.
                // Inside a mock namespace, follow up with that namespace's
                // mock templates. At the enterprise root, follow up with the
                // flat list already fetched by `useSidebarMetadataFetcher`.
                const created = getCreatedForNamespace(namespaceFQN);
                const namespaced = templatesByNamespaceId.get(namespaceFQN);
                if (namespaced) {
                    return paginate([...created, ...namespaced], params);
                }
                return paginate([...created, ...browserTemplates], params);
            },
            getSearchResults: async (query, params) => {
                const allCreated = Array.from(browserTemplatesByNamespace.values()).flat();
                const normalizedQuery = query.trim().toLowerCase();
                const filtered = [...allCreated, ...browserTemplates].filter(template =>
                    template.displayName.toLowerCase().includes(normalizedQuery),
                );
                return paginate(filtered, params);
            },
        };
    }, [templates, customMetadataName, browserTemplatesByNamespace]);
}
