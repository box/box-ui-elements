import { useMemo } from 'react';
import type { EventService, MetadataTemplate as BrowserMetadataTemplate } from '@box/metadata-template-browser';
import type { MetadataTemplate as EditorMetadataTemplate } from '@box/metadata-editor';
import { getMetadataTemplateNamespaceFqn, isSameMetadataTemplate } from '../utils/metadataTemplateIdentity';

/** Identifies a template the editor list does not hold yet. */
export interface MetadataTemplateLocator {
    /** Id reported by the template browser, reused so the fetched template keeps a stable identity. */
    id: string;
    namespaceFqn: string;
    templateKey: string;
}

interface UseMetadataTemplateEventServiceArgs {
    /**
     * Editor-shape templates from `useSidebarMetadataFetcher`. Primary lookup pool
     * for resolving a browser-shape template back to editor-shape on selection.
     */
    templates: EditorMetadataTemplate[];
    /** Invoked with the editor-shape template when the user selects one in the browser. */
    onSelect: (template: EditorMetadataTemplate) => void;
    /**
     * Fetches a template the editor list does not hold. Required for child namespaces:
     * the sidebar only loads templates at the enterprise root, so anything the browser
     * lists under a child namespace has to be fetched on selection.
     */
    fetchTemplate?: (locator: MetadataTemplateLocator) => Promise<EditorMetadataTemplate | null>;
    /** Reports a selection that could not be resolved, so the user is not left with a dead click. */
    onSelectError?: (error: Error) => void;
    /** Opens the template editor modal for creating a new template in the given namespace. */
    onCreateTemplate?: (namespaceFqn: string) => void;
    /**
     * Called when the user clicks the edit affordance on a template in the browser.
     * Receives the native template `id`; the host resolves `namespaceFqn` and `templateKey`
     * by looking up in `templates`.
     */
    onEditTemplate?: (templateId: string) => void;
}

/**
 * Builds the side-effects `EventService` consumed by `MetadataTemplateBrowser`.
 *
 * Owns the browser-shape → editor-shape bridge: the browser emits its own
 * `MetadataTemplate` shape on `onTemplateSelect`, but downstream sidebar code
 * (e.g. `convertTemplateToTemplateInstance`) requires the editor shape — so we
 * resolve by id-lookup in `templates`, then by fetching when the browser lists a
 * template the sidebar never loaded (any child namespace).
 *
 * @example
 * const eventService = useMetadataTemplateEventService({
 *     templates,
 *     onSelect: handleTemplateSelect,
 *     fetchTemplate: fetchTemplateByLocator,
 *     onSelectError: handleTemplateSelectError,
 *     onCreateTemplate: handleOpenCreateEditor,
 *     onEditTemplate: handleEditTemplateById,
 * });
 */
export default function useMetadataTemplateEventService({
    templates,
    onSelect,
    fetchTemplate,
    onSelectError,
    onCreateTemplate,
    onEditTemplate,
}: UseMetadataTemplateEventServiceArgs): EventService {
    return useMemo<EventService>(
        () => ({
            onTemplateSelect: async (browserTemplate: BrowserMetadataTemplate) => {
                // Primary: exact id match (production path — both lists share the same API ids).
                // Fallback: templateKey + scope/namespace match for cases where the browser
                // returns a different id shape than the editor list (e.g. during mock dev).
                const editorTemplate =
                    templates.find(t => t.id === browserTemplate.id) ??
                    templates.find(t => isSameMetadataTemplate(t, browserTemplate));
                if (editorTemplate) {
                    onSelect(editorTemplate);
                    return;
                }

                const namespaceFqn = getMetadataTemplateNamespaceFqn(browserTemplate);
                const { templateKey } = browserTemplate;
                if (!fetchTemplate || !namespaceFqn || !templateKey) {
                    onSelectError?.(
                        new Error(`Cannot resolve metadata template "${templateKey ?? browserTemplate.id}".`),
                    );
                    return;
                }

                try {
                    const fetchedTemplate = await fetchTemplate({
                        id: browserTemplate.id,
                        namespaceFqn,
                        templateKey,
                    });
                    if (!fetchedTemplate) {
                        throw new Error(`Metadata template "${namespaceFqn}.${templateKey}" was not found.`);
                    }
                    onSelect(fetchedTemplate);
                } catch (error) {
                    onSelectError?.(error instanceof Error ? error : new Error(String(error)));
                }
            },
            ...(onCreateTemplate && { onCreateTemplate }),
            ...(onEditTemplate && { onTemplateEdit: onEditTemplate }),
        }),
        [templates, onSelect, fetchTemplate, onSelectError, onCreateTemplate, onEditTemplate],
    );
}
