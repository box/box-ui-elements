import { RouteComponentProps } from 'react-router-dom';
import { act, renderHook } from '../../../test-utils/testing-library';
import { useMetadataSidebarFilteredTemplates } from '../hooks/useMetadataSidebarFilteredTemplates';
import { SIDEBAR_VIEW_METADATA } from '../../../constants';

type History = RouteComponentProps['history'];
const mockHistoryPush = jest.fn();
const history = { push: mockHistoryPush } as unknown as History;

const templateInstances = [
    {
        id: 'template1',
        canEdit: true,
        fields: [],
        scope: 'enterprise_123',
        templateKey: 'temlpate_1',
        type: 'metadata_template',
    },
    {
        id: 'template2',
        canEdit: true,
        fields: [],
        scope: 'enterprise_123',
        templateKey: 'temlpate_2',
        type: 'metadata_template',
    },
];

const hiddenTemplateInstances = {
    id: 'template3',
    canEdit: true,
    fields: [],
    hidden: true,
    scope: 'enterprise_123',
    templateKey: 'temlpate_1',
    type: 'metadata_template',
};

describe('useMetadataSidebarFilteredTemplates', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should initialize with empty filteredTemplates', () => {
        const { result } = renderHook(() => useMetadataSidebarFilteredTemplates(history, undefined, templateInstances));

        expect(result.current.filteredTemplates).toEqual([]);
        expect(result.current.templateInstancesList).toEqual(templateInstances);
    });

    test('should set filteredTemplates based on filteredTemplateIds', () => {
        const { result } = renderHook(() =>
            useMetadataSidebarFilteredTemplates(history, 'template1', templateInstances),
        );

        expect(result.current.filteredTemplates).toEqual(['template1']);
        expect(result.current.templateInstancesList).toEqual([templateInstances[0]]);
    });

    test('should update filteredTemplates when handleSetFilteredTemplates is called', () => {
        const { result } = renderHook(() => useMetadataSidebarFilteredTemplates(history, undefined, templateInstances));

        act(() => {
            result.current.handleSetFilteredTemplates(['template2']);
        });

        expect(result.current.filteredTemplates).toEqual(['template2']);
        expect(result.current.templateInstancesList).toEqual([templateInstances[1]]);
        expect(mockHistoryPush).toHaveBeenCalledWith(`/${SIDEBAR_VIEW_METADATA}/filteredTemplates/template2`);
    });

    test('should reset filteredTemplates when handleSetFilteredTemplates is called with empty array', () => {
        const { result } = renderHook(() =>
            useMetadataSidebarFilteredTemplates(history, 'template1', templateInstances),
        );

        act(() => {
            result.current.handleSetFilteredTemplates([]);
        });

        expect(result.current.filteredTemplates).toEqual([]);
        expect(result.current.templateInstancesList).toEqual(templateInstances);
        expect(mockHistoryPush).toHaveBeenCalledWith(`/${SIDEBAR_VIEW_METADATA}`);
    });

    test('should memoize templateInstancesList correctly', () => {
        const { result, rerender } = renderHook(
            ({ filteredTemplateIds }: { filteredTemplateIds: string | undefined }) =>
                useMetadataSidebarFilteredTemplates(history, filteredTemplateIds, templateInstances),
            {
                initialProps: { filteredTemplateIds: 'template1' },
            },
        );

        expect(result.current.templateInstancesList).toEqual([templateInstances[0]]);

        rerender({ filteredTemplateIds: undefined });

        expect(result.current.templateInstancesList).toEqual(templateInstances);
    });

    test('should filter out hidden template instances', () => {
        const templateInstancesWithHidden = [...templateInstances, hiddenTemplateInstances];
        const { result } = renderHook(() =>
            useMetadataSidebarFilteredTemplates(history, 'template1', templateInstancesWithHidden),
        );

        expect(result.current.filteredTemplates).toEqual(['template1']);
        expect(result.current.templateInstancesList).toEqual([templateInstances[0]]);
    });

    test('should filter out non existing template instances', () => {
        const { result } = renderHook(() =>
            useMetadataSidebarFilteredTemplates(history, 'template1,template4', templateInstances),
        );

        expect(result.current.filteredTemplates).toEqual(['template1']);
        expect(result.current.templateInstancesList).toEqual([templateInstances[0]]);
    });
});
