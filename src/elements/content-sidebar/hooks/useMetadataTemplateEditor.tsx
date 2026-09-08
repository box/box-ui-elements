import React, { useCallback, useState } from 'react';
import {
    MetadataTemplateEditorMode,
    MetadataTemplateEditorModal,
    type FetchTaxonomyByKey,
    type MetadataTemplateApiResponse,
    type MetadataTemplateCreateBody,
    type MetadataTemplateEditorProps,
    type MetadataTemplatePatchItem,
} from '@box/metadata-template-editor';

type ClosedState = { status: 'closed' };
type CreateState = { status: 'create'; namespace: string };
type EditState = {
    status: 'edit';
    namespaceFqn: string;
    templateKey: string;
    fetchTemplate: () => Promise<MetadataTemplateApiResponse>;
};
type EditorState = ClosedState | CreateState | EditState;

interface UseMetadataTemplateEditorArgs {
    /**
     * Called after the user submits a valid create form. Receives the API-ready
     * payload — the host owns the network call. The modal closes automatically
     * after the promise resolves.
     */
    onCreate: (body: MetadataTemplateCreateBody) => void | Promise<void>;
    /**
     * Called after the user saves changes to an existing template. Receives the
     * JSON-patch array and the template identifier — the host owns the network
     * call. The modal closes automatically after the promise resolves.
     */
    onEdit: (
        patchItems: MetadataTemplatePatchItem[],
        identifier: { namespaceFQN: string; templateKey: string },
    ) => void | Promise<void>;
    /**
     * Resolves a single taxonomy by namespace + key so existing taxonomy fields
     * can show display name and levels. Optional — omit it when the host cannot
     * look up taxonomies (the editor falls back to a placeholder).
     */
    fetchTaxonomyByKey?: FetchTaxonomyByKey;
    /**
     * Taxonomy catalogue for the picker. Taxonomies are not namespaced yet —
     * the host supplies one catalogue fetcher (typically enterprise-scoped).
     */
    fetchTaxonomies?: NonNullable<MetadataTemplateEditorProps['fetchTaxonomies']>;
}

export interface UseMetadataTemplateEditorReturn {
    /** Opens the editor in create mode for the given namespace FQN. */
    openCreate: (namespaceFqn: string) => void;
    /** Opens the editor in edit mode for the given namespace + templateKey. */
    openEdit: (args: {
        namespaceFqn: string;
        templateKey: string;
        fetchTemplate: () => Promise<MetadataTemplateApiResponse>;
    }) => void;
    /**
     * The modal JSX to render somewhere stable in the tree (e.g. beside
     * `SidebarContent`). `null` when the editor is closed.
     */
    modal: React.ReactNode;
}

/**
 * Manages the lifecycle of the `MetadataTemplateEditorModal` for the metadata
 * sidebar — open/closed state, which mode (create / edit) is active, and the
 * submit-and-close flow.
 *
 * @example
 * const { openCreate, openEdit, modal } = useMetadataTemplateEditor({
 *     onCreate: handleCreateTemplate,
 *     onEdit: handleEditTemplate,
 * });
 */
export default function useMetadataTemplateEditor({
    onCreate,
    onEdit,
    fetchTaxonomyByKey,
    fetchTaxonomies,
}: UseMetadataTemplateEditorArgs): UseMetadataTemplateEditorReturn {
    const [state, setState] = useState<EditorState>({ status: 'closed' });

    const close = useCallback(() => setState({ status: 'closed' }), []);

    const openCreate = useCallback((namespace: string) => {
        setState({ status: 'create', namespace });
    }, []);

    const openEdit = useCallback(
        ({
            namespaceFqn,
            templateKey,
            fetchTemplate,
        }: {
            namespaceFqn: string;
            templateKey: string;
            fetchTemplate: () => Promise<MetadataTemplateApiResponse>;
        }) => {
            setState({ status: 'edit', namespaceFqn, templateKey, fetchTemplate });
        },
        [],
    );

    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            if (!nextOpen) close();
        },
        [close],
    );

    const handleCreate = useCallback(
        async (body: MetadataTemplateCreateBody) => {
            await onCreate(body);
            close();
        },
        [onCreate, close],
    );

    const handleEdit = useCallback(
        async (patchItems: MetadataTemplatePatchItem[], identifier: { namespaceFQN: string; templateKey: string }) => {
            await onEdit(patchItems, identifier);
            close();
        },
        [onEdit, close],
    );

    let modal: React.ReactNode = null;

    if (state.status === 'create') {
        modal = (
            <MetadataTemplateEditorModal
                open
                mode={MetadataTemplateEditorMode.Create}
                namespace={state.namespace}
                onOpenChange={handleOpenChange}
                onCreateTemplate={handleCreate}
                fetchTaxonomyByKey={fetchTaxonomyByKey}
                fetchTaxonomies={fetchTaxonomies}
            />
        );
    } else if (state.status === 'edit') {
        modal = (
            <MetadataTemplateEditorModal
                open
                mode={MetadataTemplateEditorMode.Edit}
                fetchTemplate={state.fetchTemplate}
                onOpenChange={handleOpenChange}
                onEditTemplate={handleEdit}
                fetchTaxonomyByKey={fetchTaxonomyByKey}
                fetchTaxonomies={fetchTaxonomies}
            />
        );
    }

    return { openCreate, openEdit, modal };
}
