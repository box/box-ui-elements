import React, { useCallback, useState } from 'react';
import {
    MetadataTemplateEditorMode,
    MetadataTemplateEditorModal,
    type MetadataTemplateCreateBody,
} from '@box/metadata-template-editor';

interface ClosedState {
    status: 'closed';
}

interface CreateState {
    status: 'create';
    namespace: string;
}

type EditorState = ClosedState | CreateState;

interface UseMetadataTemplateEditorArgs {
    /**
     * Invoked after the user submits a valid create form. Receives the
     * API-ready payload — the host decides what to do with it (real API
     * call, mock store, etc.). The modal closes automatically on resolution.
     */
    onCreate: (body: MetadataTemplateCreateBody) => void | Promise<void>;
}

export interface UseMetadataTemplateEditorReturn {
    /** Opens the editor in create mode for the given namespace FQN. */
    openCreate: (namespaceFqn: string) => void;
    /**
     * The modal JSX to render somewhere stable in the tree (e.g. next to
     * `SidebarContent`). `null` when the editor is closed.
     */
    modal: React.ReactNode;
}

/**
 * Owns the lifecycle of the `MetadataTemplateEditorModal` for the metadata
 * sidebar — open/closed state, which namespace is targeted, and the
 * submit-and-close flow.
 *
 * Fire-and-forget by design: the host closes the dropdown popover when
 * create is initiated and the new template surfaces on the next dropdown
 * reopen via the items service. There is no live communication back to
 * the browser, so this hook does not need to return the created template.
 *
 * Only **create** mode is wired today; edit mode will join via a second
 * variant in the internal `EditorState` union when a `fetchTemplate`
 * implementation lands. Until then `eventService.onTemplateEdit` should
 * remain unwired (or no-op) at the call site.
 *
 * @example
 * const { openCreate, modal } = useMetadataTemplateEditor({
 *     onCreate: appendCreatedTemplate,
 * });
 */
export default function useMetadataTemplateEditor({
    onCreate,
}: UseMetadataTemplateEditorArgs): UseMetadataTemplateEditorReturn {
    const [state, setState] = useState<EditorState>({ status: 'closed' });

    const close = useCallback(() => {
        setState({ status: 'closed' });
    }, []);

    const openCreate = useCallback((namespace: string) => {
        setState({ status: 'create', namespace });
    }, []);

    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            if (!nextOpen) {
                close();
            }
        },
        [close],
    );

    const handleCreateTemplate = useCallback(
        async (body: MetadataTemplateCreateBody) => {
            await onCreate(body);
            close();
        },
        [onCreate, close],
    );

    const modal =
        state.status === 'create' ? (
            <MetadataTemplateEditorModal
                open
                mode={MetadataTemplateEditorMode.Create}
                namespace={state.namespace}
                onOpenChange={handleOpenChange}
                onCreateTemplate={handleCreateTemplate}
            />
        ) : null;

    return { openCreate, modal };
}
