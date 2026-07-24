import React from 'react';
import { MetadataTemplateEditorMode } from '@box/metadata-template-editor';
import { act, render, renderHook, screen } from '../../../test-utils/testing-library';
import useMetadataTemplateEditor from '../hooks/useMetadataTemplateEditor';

jest.mock('@box/metadata-template-editor', () => {
    const actual = jest.requireActual('@box/metadata-template-editor');
    return {
        ...actual,
        MetadataTemplateEditorModal: ({
            mode,
            namespace,
            onCreateTemplate,
            onEditTemplate,
            onOpenChange,
            fetchTemplate,
        }: {
            mode: string;
            namespace?: string;
            onCreateTemplate?: (body: unknown) => Promise<void>;
            onEditTemplate?: (patch: unknown[], id: unknown) => Promise<void>;
            onOpenChange: (open: boolean) => void;
            fetchTemplate?: () => Promise<unknown>;
        }) => (
            <div data-testid="template-editor-modal">
                <span data-testid="editor-mode">{mode}</span>
                {namespace ? <span data-testid="editor-namespace">{namespace}</span> : null}
                {fetchTemplate ? <span data-testid="editor-has-fetch">true</span> : null}
                <button type="button" onClick={() => onOpenChange(false)}>
                    close
                </button>
                <button
                    type="button"
                    onClick={() => onCreateTemplate?.({ templateKey: 'new', namespace: namespace ?? '' })}
                >
                    submit-create
                </button>
                <button
                    type="button"
                    onClick={() =>
                        onEditTemplate?.([{ op: 'replace', path: '/displayName', value: 'Updated' }], {
                            namespaceFQN: 'enterprise_1',
                            templateKey: 'myTemplate',
                        })
                    }
                >
                    submit-edit
                </button>
            </div>
        ),
    };
});

describe('useMetadataTemplateEditor', () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    const onEdit = jest.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return null modal while closed', () => {
        const { result } = renderHook(() => useMetadataTemplateEditor({ onCreate, onEdit }));

        expect(result.current.modal).toBeNull();
    });

    test('should open create mode and close after successful create', async () => {
        const { result } = renderHook(() => useMetadataTemplateEditor({ onCreate, onEdit }));

        act(() => {
            result.current.openCreate('enterprise_123');
        });

        const { rerender } = render(<>{result.current.modal}</>);
        expect(screen.getByTestId('editor-mode')).toHaveTextContent(MetadataTemplateEditorMode.Create);
        expect(screen.getByTestId('editor-namespace')).toHaveTextContent('enterprise_123');

        await act(async () => {
            screen.getByRole('button', { name: 'submit-create' }).click();
        });

        expect(onCreate).toHaveBeenCalledWith({ templateKey: 'new', namespace: 'enterprise_123' });

        rerender(<>{result.current.modal}</>);
        expect(screen.queryByTestId('template-editor-modal')).not.toBeInTheDocument();
    });

    test('should open edit mode and close after successful edit', async () => {
        const fetchTemplate = jest.fn().mockResolvedValue({ templateKey: 'myTemplate' });
        const { result } = renderHook(() => useMetadataTemplateEditor({ onCreate, onEdit }));

        act(() => {
            result.current.openEdit({
                namespaceFqn: 'enterprise_123',
                templateKey: 'myTemplate',
                fetchTemplate,
            });
        });

        const { rerender } = render(<>{result.current.modal}</>);
        expect(screen.getByTestId('editor-mode')).toHaveTextContent(MetadataTemplateEditorMode.Edit);
        expect(screen.getByTestId('editor-has-fetch')).toHaveTextContent('true');

        await act(async () => {
            screen.getByRole('button', { name: 'submit-edit' }).click();
        });

        expect(onEdit).toHaveBeenCalledWith([{ op: 'replace', path: '/displayName', value: 'Updated' }], {
            namespaceFQN: 'enterprise_1',
            templateKey: 'myTemplate',
        });

        rerender(<>{result.current.modal}</>);
        expect(screen.queryByTestId('template-editor-modal')).not.toBeInTheDocument();
    });

    test('should close the modal when onOpenChange(false) is called', () => {
        const { result } = renderHook(() => useMetadataTemplateEditor({ onCreate, onEdit }));

        act(() => {
            result.current.openCreate('enterprise_123');
        });

        const { rerender } = render(<>{result.current.modal}</>);
        expect(screen.getByTestId('template-editor-modal')).toBeInTheDocument();

        act(() => {
            screen.getByRole('button', { name: 'close' }).click();
        });

        rerender(<>{result.current.modal}</>);
        expect(screen.queryByTestId('template-editor-modal')).not.toBeInTheDocument();
    });
});
