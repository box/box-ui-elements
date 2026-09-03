import { act, renderHook } from '../../../test-utils/testing-library';
import useMetadataTemplateEventService from '../hooks/useMetadataTemplateEventService';

describe('useMetadataTemplateEventService', () => {
    const editorTemplates = [
        {
            id: 'tmpl-1',
            templateKey: 'myTemplate',
            scope: 'enterprise_123',
            type: 'metadata_template',
            displayName: 'My Template',
            canEdit: true,
            hidden: false,
            fields: [],
        },
        {
            id: 'tmpl-2',
            templateKey: 'otherTemplate',
            scope: 'enterprise_123',
            type: 'metadata_template',
            displayName: 'Other Template',
            canEdit: true,
            hidden: false,
            fields: [],
        },
    ];

    const childNamespaceTemplate = {
        id: 'child-1',
        templateKey: 'nda',
        namespace: 'enterprise_123.legal',
        type: 'metadata_template',
        displayName: 'NDA',
        hidden: false,
        fields: [],
    };

    const onSelect = jest.fn();
    const onSelectError = jest.fn();
    const fetchTemplate = jest.fn();
    const onCreateTemplate = jest.fn();
    const onEditTemplate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should resolve selection by exact template id', async () => {
        const { result } = renderHook(() =>
            useMetadataTemplateEventService({
                templates: editorTemplates as never,
                onSelect,
            }),
        );

        await act(async () => {
            await result.current.onTemplateSelect({
                id: 'tmpl-1',
                templateKey: 'unrelated',
                scope: 'enterprise_999',
            } as never);
        });

        expect(onSelect).toHaveBeenCalledWith(editorTemplates[0]);
    });

    test('should fall back to templateKey + scope when ids do not match', async () => {
        const { result } = renderHook(() =>
            useMetadataTemplateEventService({
                templates: editorTemplates as never,
                onSelect,
            }),
        );

        await act(async () => {
            await result.current.onTemplateSelect({
                id: 'browser-only-id',
                templateKey: 'otherTemplate',
                scope: 'enterprise_123',
            } as never);
        });

        expect(onSelect).toHaveBeenCalledWith(editorTemplates[1]);
    });

    test('should fetch and select a child-namespace template missing from the editor list', async () => {
        fetchTemplate.mockResolvedValue(childNamespaceTemplate);

        const { result } = renderHook(() =>
            useMetadataTemplateEventService({
                templates: editorTemplates as never,
                onSelect,
                fetchTemplate,
                onSelectError,
            }),
        );

        await act(async () => {
            await result.current.onTemplateSelect({
                id: 'child-1',
                templateKey: 'nda',
                scope: 'enterprise_123.legal',
            } as never);
        });

        expect(fetchTemplate).toHaveBeenCalledWith({
            id: 'child-1',
            namespaceFqn: 'enterprise_123.legal',
            templateKey: 'nda',
        });
        expect(onSelect).toHaveBeenCalledWith(childNamespaceTemplate);
        expect(onSelectError).not.toHaveBeenCalled();
    });

    test('should report an error when the fetched template does not exist', async () => {
        fetchTemplate.mockResolvedValue(null);

        const { result } = renderHook(() =>
            useMetadataTemplateEventService({
                templates: editorTemplates as never,
                onSelect,
                fetchTemplate,
                onSelectError,
            }),
        );

        await act(async () => {
            await result.current.onTemplateSelect({
                id: 'missing',
                templateKey: 'missing',
                scope: 'enterprise_123.legal',
            } as never);
        });

        expect(onSelect).not.toHaveBeenCalled();
        expect(onSelectError).toHaveBeenCalledWith(expect.any(Error));
    });

    test('should report an error when the fetch fails', async () => {
        const fetchError = new Error('network down');
        fetchTemplate.mockRejectedValue(fetchError);

        const { result } = renderHook(() =>
            useMetadataTemplateEventService({
                templates: editorTemplates as never,
                onSelect,
                fetchTemplate,
                onSelectError,
            }),
        );

        await act(async () => {
            await result.current.onTemplateSelect({
                id: 'child-1',
                templateKey: 'nda',
                scope: 'enterprise_123.legal',
            } as never);
        });

        expect(onSelect).not.toHaveBeenCalled();
        expect(onSelectError).toHaveBeenCalledWith(fetchError);
    });

    test('should report an error instead of silently dropping when no fetcher is provided', async () => {
        const { result } = renderHook(() =>
            useMetadataTemplateEventService({
                templates: editorTemplates as never,
                onSelect,
                onSelectError,
            }),
        );

        await act(async () => {
            await result.current.onTemplateSelect({
                id: 'missing',
                templateKey: 'missing',
                scope: 'enterprise_123',
            } as never);
        });

        expect(onSelect).not.toHaveBeenCalled();
        expect(onSelectError).toHaveBeenCalledWith(expect.any(Error));
    });

    test('should include create/edit handlers only when provided', () => {
        const { result: withoutOptional } = renderHook(() =>
            useMetadataTemplateEventService({
                templates: editorTemplates as never,
                onSelect,
            }),
        );

        expect((withoutOptional.current as { onCreateTemplate?: unknown }).onCreateTemplate).toBeUndefined();
        expect((withoutOptional.current as { onTemplateEdit?: unknown }).onTemplateEdit).toBeUndefined();

        const { result: withOptional } = renderHook(() =>
            useMetadataTemplateEventService({
                templates: editorTemplates as never,
                onSelect,
                onCreateTemplate,
                onEditTemplate,
            }),
        );

        expect((withOptional.current as { onCreateTemplate: typeof onCreateTemplate }).onCreateTemplate).toBe(
            onCreateTemplate,
        );
        expect((withOptional.current as { onTemplateEdit: typeof onEditTemplate }).onTemplateEdit).toBe(onEditTemplate);
    });
});
