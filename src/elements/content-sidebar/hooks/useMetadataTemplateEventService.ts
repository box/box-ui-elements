import { useMemo } from 'react';
import { type BrowserMetadataTemplate, type EventService, type MetadataTemplate } from '@box/metadata-editor';

interface UseMetadataTemplateEventServiceArgs {
    /**
     * Editor-shape templates known to the host from the backend-fetched pool
     * (`useSidebarMetadataFetcher`). Primary lookup target when resolving the
     * original editor-shape template after the browser fires a browser-shape
     * `onTemplateSelect`.
     */
    templates: MetadataTemplate[];
    /** Invoked with the original editor-shape template when the user picks one. */
    onSelect: (template: MetadataTemplate) => void;
    /**
     * Secondary editor-shape lookup pool consulted when a template id is not
     * found in `templates`. Used today to resolve session-created templates
     * that live only in the mock store; will be unnecessary once
     * `useSidebarMetadataFetcher` accepts created templates directly into its
     * pool.
     */
    additionalTemplatesById?: ReadonlyMap<string, MetadataTemplate>;
    /** Optional: opens the template editor for a new template under the given namespace. */
    onCreateTemplate?: (namespaceFqn: string) => void;
    /** Optional: opens the template editor for the given existing template id. */
    onEditTemplate?: (templateId: string) => void;
}

/**
 * Builds the side-effects `EventService` consumed by `MetadataTemplateBrowser`.
 *
 * Owns the browser-shape → editor-shape bridge: the browser package emits its
 * own template shape on `onTemplateSelect`, but downstream sidebar code (e.g.
 * `convertTemplateToTemplateInstance`) requires editor-shape — so we resolve
 * via id-lookup. The lookup falls back to `additionalTemplatesById` (the
 * session pool) when the primary `templates` array misses, so newly-created
 * templates can be selected without the bridge silently dropping the click.
 *
 * @example
 * const eventService = useMetadataTemplateEventService({
 *     templates,
 *     onSelect: handleTemplateSelect,
 *     additionalTemplatesById: editorTemplatesById,
 *     onCreateTemplate: openCreateTemplate,
 * });
 */
export default function useMetadataTemplateEventService({
    additionalTemplatesById,
    onCreateTemplate,
    onEditTemplate,
    onSelect,
    templates,
}: UseMetadataTemplateEventServiceArgs): EventService {
    return useMemo<EventService>(
        () => ({
            onTemplateSelect: async (browserTemplate: BrowserMetadataTemplate) => {
                const editorTemplate =
                    templates.find(template => template.id === browserTemplate.id) ??
                    additionalTemplatesById?.get(browserTemplate.id);
                if (editorTemplate) {
                    onSelect(editorTemplate);
                }
            },
            ...(onCreateTemplate && { onCreateTemplate }),
            ...(onEditTemplate && { onTemplateEdit: onEditTemplate }),
        }),
        [templates, additionalTemplatesById, onSelect, onCreateTemplate, onEditTemplate],
    );
}
