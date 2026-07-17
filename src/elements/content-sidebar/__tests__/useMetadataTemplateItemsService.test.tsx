/// <reference types="jest" />
import { renderHook } from '@testing-library/react';
import { METADATA_TEMPLATE_PROPERTIES } from '../../../constants';
import useMetadataTemplateItemsService from '../hooks/useMetadataTemplateItemsService';

describe('useMetadataTemplateItemsService', () => {
    const mockFile = { id: 'file-123' };
    const enterpriseFqn = 'enterprise_173733877';

    const templates = [
        {
            id: 'editor-1',
            templateKey: 'myTemplate',
            scope: enterpriseFqn,
            type: 'metadata_template',
            displayName: 'My Template',
            canEdit: true,
            hidden: false,
            fields: [],
        },
        {
            id: 'editor-props',
            templateKey: METADATA_TEMPLATE_PROPERTIES,
            scope: 'global',
            type: 'metadata_template',
            displayName: 'Properties',
            canEdit: true,
            hidden: false,
            fields: [],
        },
    ];

    let listNamespaces: jest.Mock;
    let listTemplatesForNamespace: jest.Mock;
    let api: { getMetadataAPI: jest.Mock };

    beforeEach(() => {
        listNamespaces = jest.fn().mockResolvedValue({ entries: [], next_marker: undefined });
        listTemplatesForNamespace = jest.fn().mockResolvedValue({ entries: [], next_marker: undefined });
        api = {
            getMetadataAPI: jest.fn().mockReturnValue({
                listNamespaces,
                listTemplatesForNamespace,
            }),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return undefined when enterpriseFqn is not known', () => {
        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, undefined, templates as never),
        );

        expect(result.current).toBeUndefined();
    });

    test('should delegate getNamespaces to the metadata API', async () => {
        const namespacesResponse = {
            entries: [{ id: 'ns-1', fqn: `${enterpriseFqn}.child`, displayName: 'Child' }],
            next_marker: 'marker-1',
        };
        listNamespaces.mockResolvedValue(namespacesResponse);

        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, enterpriseFqn, templates as never),
        );

        await expect(result.current!.getNamespaces(enterpriseFqn, { limit: 20, marker: 'm0' })).resolves.toEqual(
            namespacesResponse,
        );
        expect(api.getMetadataAPI).toHaveBeenCalledWith(false);
        expect(listNamespaces).toHaveBeenCalledWith(mockFile, enterpriseFqn, { limit: 20, marker: 'm0' });
    });

    test('should map getTemplates entries and prefer editor template ids', async () => {
        listTemplatesForNamespace.mockResolvedValue({
            entries: [
                {
                    id: 'api-id-1',
                    templateKey: 'myTemplate',
                    namespace: enterpriseFqn,
                    displayName: 'My Template',
                    canEdit: true,
                    hidden: false,
                },
                {
                    id: 'api-id-2',
                    templateKey: 'childOnly',
                    namespace: `${enterpriseFqn}.child`,
                    displayName: 'Child Only',
                },
            ],
            next_marker: undefined,
        });

        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, enterpriseFqn, templates as never),
        );

        await expect(result.current!.getTemplates(enterpriseFqn, { limit: 50, marker: undefined })).resolves.toEqual({
            entries: [
                {
                    id: 'editor-1',
                    type: 'metadata_template',
                    displayName: 'My Template',
                    scope: enterpriseFqn,
                    templateKey: 'myTemplate',
                    canEdit: true,
                    hidden: false,
                },
                {
                    id: 'api-id-2',
                    type: 'metadata_template',
                    displayName: 'Child Only',
                    scope: `${enterpriseFqn}.child`,
                    templateKey: 'childOnly',
                    canEdit: false,
                    hidden: false,
                },
            ],
            next_marker: undefined,
        });
    });

    test('should filter and paginate getSearchResults client-side', async () => {
        const manyTemplates = Array.from({ length: 5 }, (_, index) => ({
            id: `id-${index}`,
            templateKey: `key-${index}`,
            scope: enterpriseFqn,
            type: 'metadata_template',
            displayName: index % 2 === 0 ? `Alpha ${index}` : `Beta ${index}`,
            canEdit: true,
            hidden: false,
            fields: [],
        }));

        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, enterpriseFqn, manyTemplates as never),
        );

        await expect(result.current!.getSearchResults('alpha', { limit: 2, marker: undefined })).resolves.toEqual({
            entries: [
                expect.objectContaining({ displayName: 'Alpha 0' }),
                expect.objectContaining({ displayName: 'Alpha 2' }),
            ],
            next_marker: '2',
        });

        await expect(result.current!.getSearchResults('alpha', { limit: 2, marker: '2' })).resolves.toEqual({
            entries: [expect.objectContaining({ displayName: 'Alpha 4' })],
            next_marker: undefined,
        });
    });

    test('should use the localized custom metadata name for properties templates in search', async () => {
        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, enterpriseFqn, templates as never),
        );

        await expect(result.current!.getSearchResults('custom', { limit: 10, marker: undefined })).resolves.toEqual({
            entries: [expect.objectContaining({ id: 'editor-props', displayName: 'Custom Metadata' })],
            next_marker: undefined,
        });
    });
});
