import { useCallback, useMemo, useState } from 'react';
import uniqueId from 'lodash/uniqueId';
import { type BrowserMetadataTemplate, type MetadataTemplate, type MetadataTemplateField } from '@box/metadata-editor';
import { type MetadataTemplateCreateBody, type MetadataTemplateFieldCreateBody } from '@box/metadata-template-editor';

export interface UseMockCreatedTemplatesReturn {
    /**
     * Browser-shape view of session-created templates, grouped by namespace
     * FQN. Buckets are ordered newest-first so consumers can splice them
     * directly onto the head of a fetched list and get the desired order.
     * Consumed by `useMetadataTemplateItemsService.getTemplates`.
     */
    browserTemplatesByNamespace: ReadonlyMap<string, BrowserMetadataTemplate[]>;
    /**
     * Editor-shape view of session-created templates, keyed by template id.
     * Used by the selection bridge (`useMetadataTemplateEventService`) as a
     * fallback pool — `useSidebarMetadataFetcher` only knows about
     * backend-fetched templates, so without this map session-created
     * templates fail id-lookup and `onSelect` is silently dropped.
     */
    editorTemplatesById: ReadonlyMap<string, MetadataTemplate>;
    /**
     * Records a freshly-submitted template create body into the in-memory
     * mock store. Generates a stable client-side id and stores the editor
     * shape as the single source of truth. The two derived maps update
     * automatically on the next render.
     */
    appendCreatedTemplate: (body: MetadataTemplateCreateBody) => void;
}

/**
 * Adapts a `MetadataTemplateFieldCreateBody` (POST-shape) to the editor-shape
 * `MetadataTemplateField` (GET-shape) consumed by the instance editor form.
 *
 * The two shapes overlap heavily — both use `hidden`/`key`/`displayName` and
 * the same `type` enum values. Differences this adapter resolves:
 * - Dropdown option entries: API-create uses `{ key }`, editor uses `{ key, id }`,
 *   so we mint a client-side id per option.
 * - Taxonomy: API-create's `optionsRules` / `taxonomyKey` / `namespace` carry
 *   over unchanged.
 */
function toEditorField(field: MetadataTemplateFieldCreateBody): MetadataTemplateField {
    const base = {
        key: field.key,
        displayName: field.displayName,
        description: field.description,
        hidden: field.hidden,
        type: field.type,
    };

    if (field.type === 'enum' || field.type === 'multiSelect') {
        return {
            ...base,
            options: field.options.map(option => ({ key: option.key, id: uniqueId('mock-option-') })),
        };
    }

    if (field.type === 'taxonomy') {
        return {
            ...base,
            taxonomyKey: field.taxonomyKey,
            namespace: field.namespace,
            optionsRules: field.optionsRules,
        };
    }

    return base;
}

function toEditorTemplate(body: MetadataTemplateCreateBody): MetadataTemplate {
    return {
        id: uniqueId('mock-template-'),
        type: 'metadata_template',
        templateKey: body.templateKey,
        scope: body.namespace,
        displayName: body.displayName,
        hidden: body.hidden,
        canEdit: true,
        fields: body.fields.map(toEditorField),
    };
}

function toBrowserTemplate(template: MetadataTemplate): BrowserMetadataTemplate {
    return {
        id: template.id,
        type: template.type,
        displayName: template.displayName ?? template.templateKey,
        templateKey: template.templateKey,
        scope: template.scope,
        hidden: template.hidden,
        canEdit: template.canEdit,
    };
}

/**
 * In-memory store for metadata templates created during the session.
 *
 * Stand-in until a real `POST /metadata_templates` is wired. Stores
 * editor-shape templates as the single source of truth and derives the
 * browser-shape and by-id views via `useMemo`. The two derived views
 * cannot disagree because they share one Map.
 *
 * Templates are stored in insertion order; derived views surface newest-first
 * so the latest create lands at the top of the list when the dropdown reopens.
 *
 * When the real backend lands, this hook (and its mock store) should be
 * removed: the server-returned template will be pushed into
 * `useSidebarMetadataFetcher`'s editor pool, and the `editorTemplatesById`
 * fallback in `useMetadataTemplateEventService` becomes dead code.
 *
 * @example
 * const { browserTemplatesByNamespace, editorTemplatesById, appendCreatedTemplate } =
 *     useMockCreatedTemplates();
 */
export default function useMockCreatedTemplates(): UseMockCreatedTemplatesReturn {
    const [editorTemplatesById, setEditorTemplatesById] = useState<Map<string, MetadataTemplate>>(() => new Map());

    const appendCreatedTemplate = useCallback((body: MetadataTemplateCreateBody) => {
        const editorTemplate = toEditorTemplate(body);
        setEditorTemplatesById(previous => {
            const next = new Map(previous);
            next.set(editorTemplate.id, editorTemplate);
            return next;
        });
    }, []);

    const browserTemplatesByNamespace = useMemo<ReadonlyMap<string, BrowserMetadataTemplate[]>>(() => {
        const grouped = new Map<string, BrowserMetadataTemplate[]>();
        // Iterate newest-first by reversing the Map's insertion order so each
        // namespace bucket carries the most recently created template at index 0.
        const newestFirst = Array.from(editorTemplatesById.values()).reverse();
        for (const template of newestFirst) {
            const bucket = grouped.get(template.scope) ?? [];
            bucket.push(toBrowserTemplate(template));
            grouped.set(template.scope, bucket);
        }
        return grouped;
    }, [editorTemplatesById]);

    return { browserTemplatesByNamespace, editorTemplatesById, appendCreatedTemplate };
}
