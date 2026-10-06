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
import { getMetadataTemplateNamespaceFqn, isSameMetadataTemplate } from '../utils/metadataTemplateIdentity';
import { canCreateTemplatesInNamespace, canEditMetadataTemplate } from '../utils/metadataTemplatePermissions';

type BreadcrumbEntry = NonNullable<BrowserMetadataTemplate['ancestors']>[number];

function resolveDisplayName(template: EditorMetadataTemplate, customMetadataName: string): string {
    if (template.templateKey === METADATA_TEMPLATE_PROPERTIES) {
        return customMetadataName;
    }
    return template.displayName || template.templateKey;
}

/**
 * The browser renders every row it is given — it declares `hidden` but never acts on it —
 * so hidden templates have to be dropped here, the way the sidebar drops hidden instances.
 * The API spells visibility `hidden` on some responses and `isHidden` on others.
 */
function isHiddenTemplate(template: { hidden?: unknown; isHidden?: unknown }): boolean {
    return template.hidden === true || template.isHidden === true;
}

function readNonBlank(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() ? value : undefined;
}

type NamespaceFields = {
    displayName?: unknown;
    display_name?: unknown;
    fqn?: unknown;
};

function asNamespaceFields(value: unknown): NamespaceFields | undefined {
    if (value && typeof value === 'object') {
        return value as NamespaceFields;
    }
    return undefined;
}

function toBreadcrumbEntry(value: unknown): BreadcrumbEntry | undefined {
    const fields = asNamespaceFields(value);
    if (!fields) {
        return undefined;
    }

    const fqn = readNonBlank(fields.fqn);
    if (!fqn) {
        return undefined;
    }

    const dot = fqn.lastIndexOf('.');
    const leaf = dot === -1 ? fqn : fqn.slice(dot + 1);

    return {
        fqn,
        displayName: readNonBlank(fields.displayName) || readNonBlank(fields.display_name) || leaf,
    };
}

/**
 * Search-row subtitle. The folder path is `ancestors` plus the immediate
 * folder in `containingNamespace`.
 * Root, legacy, and global hits omit both, so they render with no path.
 * `containingNamespace` is appended because `ancestors` stops at the parent.
 */
function toSearchAncestors(entry: Record<string, unknown>): BreadcrumbEntry[] | undefined {
    const rawAncestors = Array.isArray(entry.ancestors) ? entry.ancestors : [];
    const path = rawAncestors
        .map(ancestor => toBreadcrumbEntry(ancestor))
        .filter((ancestor): ancestor is BreadcrumbEntry => ancestor !== undefined);

    const containing = toBreadcrumbEntry(entry.containingNamespace);
    if (containing && !path.some(ancestor => ancestor.fqn === containing.fqn)) {
        path.push(containing);
    }

    return path.length > 0 ? path : undefined;
}

function resolveSearchDisplayName(
    hit: Record<string, unknown>,
    templateKey: string | undefined,
    editorMatch: EditorMetadataTemplate | undefined,
    customMetadataName: string,
): string {
    if (editorMatch) {
        return resolveDisplayName(editorMatch, customMetadataName);
    }
    if (templateKey === METADATA_TEMPLATE_PROPERTIES) {
        return customMetadataName;
    }
    return readNonBlank(hit.displayName) || templateKey || '';
}
/**
 * Builds the data-fetching `ItemsService` consumed by `MetadataTemplateBrowser`
 * for the metadata sidebar in namespace-enabled mode.
 *
 * - `getNamespaces` and `getTemplates` delegate to live API calls via `Metadata.js`,
 *   enabling paginated namespace navigation and per-namespace template lists.
 * - `getSearchResults` calls `GET /metadata_templates/search`. The browser
 *   already invokes this callback as the user types; this supplies the endpoint.
 *
 * Returns `undefined` when `enterpriseFqn` is not yet known (current user still loading).
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

        return {
            getNamespaces: async (
                namespaceFQN: string,
                params: FetchParams,
            ): Promise<FetchResponse<MetadataNamespace>> => {
                const result = await api
                    .getMetadataAPI(false)
                    .listNamespaces(file, namespaceFQN, { limit: params.limit, marker: params.marker });
                return {
                    entries: (result.entries ?? []).map(entry => {
                        const namespace = entry as { displayName: string; fqn: string };
                        return {
                            displayName: namespace.displayName,
                            fqn: namespace.fqn,
                            canCreate: canCreateTemplatesInNamespace(entry),
                        };
                    }),
                    next_marker: readNonBlank(result.next_marker),
                };
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
                const listed: BrowserMetadataTemplate[] = (result.entries ?? [])
                    .filter((t: Record<string, unknown>) => !isHiddenTemplate(t))
                    .map((t: Record<string, unknown>) => {
                        const templateKey = t.templateKey as string;
                        const templateScope = (t.namespace as string) ?? (t.scope as string) ?? namespaceFQN;
                        // Prefer the editor template's id so that id-based lookups in
                        // handleEditTemplateById / onTemplateSelect resolve correctly.
                        const editorMatch = templates.find(et =>
                            isSameMetadataTemplate(et, { templateKey, scope: templateScope }),
                        );
                        return {
                            id: editorMatch?.id ?? readNonBlank(t.id) ?? '',
                            type: (t.type as string) ?? 'metadata_template',
                            displayName: ((t.displayName as string) ?? templateKey) || '',
                            scope: templateScope,
                            templateKey,
                            canEdit: canEditMetadataTemplate(t),
                            hidden: false,
                        };
                    });

                // Items-service lists may omit templates already in the editor cache.
                // Merge those in so existing schemas can still be opened.
                const listedKeys = new Set(listed.map(t => t.templateKey).filter(Boolean));
                const fromLoaded: BrowserMetadataTemplate[] = templates
                    .filter(t => {
                        const fqn = getMetadataTemplateNamespaceFqn(t);
                        return (
                            !!t.templateKey &&
                            fqn === namespaceFQN &&
                            !listedKeys.has(t.templateKey) &&
                            !isHiddenTemplate(t)
                        );
                    })
                    .map(t => ({
                        id: t.id,
                        type: t.type ?? 'metadata_template',
                        displayName: resolveDisplayName(t, customMetadataName),
                        scope: getMetadataTemplateNamespaceFqn(t) ?? namespaceFQN,
                        templateKey: t.templateKey,
                        canEdit: canEditMetadataTemplate(t),
                        hidden: t.hidden ?? false,
                    }));

                return { entries: [...fromLoaded, ...listed], next_marker: result.next_marker };
            },

            getSearchResults: async (
                query: string,
                params: FetchParams,
            ): Promise<FetchResponse<BrowserMetadataTemplate>> => {
                const normalizedQuery = query.trim();
                // The search endpoint 400s on a missing or blank query. An empty
                // string is the browser leaving search, not a request to send.
                if (!normalizedQuery) {
                    return { entries: [] };
                }

                const result = await api.getMetadataAPI(false).searchTemplates(file, {
                    query: normalizedQuery,
                    limit: params.limit,
                    marker: params.marker,
                });

                const entries: BrowserMetadataTemplate[] = (result.entries ?? [])
                    .filter((hit: Record<string, unknown>) => !isHiddenTemplate(hit))
                    .map((hit: Record<string, unknown>) => {
                        const templateKey = readNonBlank(hit.templateKey);
                        const namespace = readNonBlank(hit.namespace);
                        const scope = readNonBlank(hit.scope) ?? namespace;
                        const editorMatch = templates.find(template =>
                            isSameMetadataTemplate(template, { templateKey, namespace, scope }),
                        );

                        return {
                            id: editorMatch?.id ?? readNonBlank(hit.id) ?? '',
                            type: readNonBlank(hit.type) ?? 'metadata_template',
                            displayName: resolveSearchDisplayName(hit, templateKey, editorMatch, customMetadataName),
                            scope,
                            namespace,
                            templateKey,
                            canEdit: canEditMetadataTemplate(hit),
                            hidden: false,
                            ancestors: toSearchAncestors(hit),
                        };
                    });

                return { entries, next_marker: readNonBlank(result.next_marker) };
            },
        };
    }, [api, file, enterpriseFqn, templates, customMetadataName]);
}
