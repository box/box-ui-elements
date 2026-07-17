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

    const onSelect = jest.fn();
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

    test('should not call onSelect when no editor template matches', async () => {
        const { result } = renderHook(() =>
            useMetadataTemplateEventService({
                templates: editorTemplates as never,
                onSelect,
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
    });

    test('should include create/edit handlers only when provided', () => {
        const { result: withoutOptional } = renderHook(() =>
            useMetadataTemplateEventService({
                templates: editorTemplates as never,
                onSelect,
            }),
        );

        expect(withoutOptional.current.onCreateTemplate).toBeUndefined();
        expect((withoutOptional.current as { onTemplateEdit?: unknown }).onTemplateEdit).toBeUndefined();

        const { result: withOptional } = renderHook(() =>
            useMetadataTemplateEventService({
                templates: editorTemplates as never,
                onSelect,
                onCreateTemplate,
                onEditTemplate,
            }),
        );

        expect(withOptional.current.onCreateTemplate).toBe(onCreateTemplate);
        expect((withOptional.current as { onTemplateEdit: typeof onEditTemplate }).onTemplateEdit).toBe(onEditTemplate);
    });
});
