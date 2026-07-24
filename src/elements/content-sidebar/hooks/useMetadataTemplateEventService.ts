import { useMemo } from 'react';
import type { EventService, MetadataTemplate as BrowserMetadataTemplate } from '@box/metadata-template-browser';
import type { MetadataTemplate as EditorMetadataTemplate } from '@box/metadata-editor';

interface UseMetadataTemplateEventServiceArgs {
    /**
     * Editor-shape templates from `useSidebarMetadataFetcher`. Primary lookup pool
     * for resolving a browser-shape template back to editor-shape on selection.
     */
    templates: EditorMetadataTemplate[];
    /** Invoked with the editor-shape template when the user selects one in the browser. */
    onSelect: (template: EditorMetadataTemplate) => void;
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
 * resolve by id-lookup in `templates`.
 *
 * @example
 * const eventService = useMetadataTemplateEventService({
 *     templates,
 *     onSelect: handleTemplateSelect,
 *     onCreateTemplate: handleOpenCreateEditor,
 *     onEditTemplate: handleEditTemplateById,
 * });
 */
export default function useMetadataTemplateEventService({
    templates,
    onSelect,
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
                    templates.find(
                        t =>
                            t.templateKey === browserTemplate.templateKey &&
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (t.scope === browserTemplate.scope || (t as any).namespace === browserTemplate.scope),
                    );
                if (editorTemplate) {
                    onSelect(editorTemplate);
                }
            },
            ...(onCreateTemplate && { onCreateTemplate }),
            ...(onEditTemplate && { onTemplateEdit: onEditTemplate }),
        }),
        [templates, onSelect, onCreateTemplate, onEditTemplate],
    );
}
