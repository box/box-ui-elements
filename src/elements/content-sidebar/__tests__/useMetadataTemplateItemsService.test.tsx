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
            permissions: {
                can_read: true,
                can_update: true,
                can_delete: false,
                can_view_permissions: false,
                can_manage_permissions: false,
            },
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
    let searchTemplates: jest.Mock;
    let api: { getMetadataAPI: jest.Mock };

    beforeEach(() => {
        listNamespaces = jest.fn().mockResolvedValue({ entries: [], next_marker: undefined });
        listTemplatesForNamespace = jest.fn().mockResolvedValue({ entries: [], next_marker: undefined });
        searchTemplates = jest.fn().mockResolvedValue({ entries: [], next_marker: undefined });
        api = {
            getMetadataAPI: jest.fn().mockReturnValue({
                listNamespaces,
                listTemplatesForNamespace,
                searchTemplates,
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
            entries: [
                {
                    fqn: `${enterpriseFqn}.child`,
                    displayName: 'Child',
                    permissions: {
                        can_read: true,
                        can_update: false,
                        can_delete: false,
                        can_view_permissions: false,
                        can_manage_permissions: false,
                        can_create_namespaces: false,
                        can_create_templates: true,
                    },
                },
                {
                    fqn: `${enterpriseFqn}.readonly`,
                    displayName: 'Read only',
                    permissions: {
                        can_read: true,
                        can_update: false,
                        can_delete: false,
                        can_view_permissions: false,
                        can_manage_permissions: false,
                        can_create_namespaces: false,
                        can_create_templates: false,
                    },
                },
            ],
            next_marker: 'marker-1',
        };
        listNamespaces.mockResolvedValue(namespacesResponse);

        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, enterpriseFqn, templates as never),
        );

        await expect(result.current!.getNamespaces(enterpriseFqn, { limit: 20, marker: 'm0' })).resolves.toEqual({
            entries: [
                { fqn: `${enterpriseFqn}.child`, displayName: 'Child', canCreate: true },
                { fqn: `${enterpriseFqn}.readonly`, displayName: 'Read only', canCreate: false },
            ],
            next_marker: 'marker-1',
        });
        expect(api.getMetadataAPI).toHaveBeenCalledWith(false);
        expect(listNamespaces).toHaveBeenCalledWith(mockFile, enterpriseFqn, { limit: 20, marker: 'm0' });
    });

    test('should drop hidden templates from getTemplates', async () => {
        listTemplatesForNamespace.mockResolvedValue({
            entries: [
                {
                    id: 'api-id-1',
                    templateKey: 'visibleTemplate',
                    namespace: `${enterpriseFqn}.legal`,
                    displayName: 'Visible',
                    permissions: {
                        can_read: true,
                        can_update: true,
                        can_delete: false,
                        can_view_permissions: false,
                        can_manage_permissions: false,
                    },
                },
                {
                    id: 'api-id-2',
                    templateKey: 'hiddenTemplate',
                    namespace: `${enterpriseFqn}.legal`,
                    displayName: 'Hidden',
                    hidden: true,
                },
            ],
            next_marker: undefined,
        });

        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, enterpriseFqn, templates as never),
        );

        const { entries } = await result.current!.getTemplates(`${enterpriseFqn}.legal`, {
            limit: 50,
            marker: undefined,
        });

        expect(entries.map(entry => entry.templateKey)).toEqual(['visibleTemplate']);
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
                    permissions: {
                        can_read: true,
                        can_update: true,
                        can_delete: false,
                        can_view_permissions: false,
                        can_manage_permissions: false,
                    },
                },
                {
                    id: 'api-id-2',
                    templateKey: 'childOnly',
                    namespace: `${enterpriseFqn}.child`,
                    displayName: 'Child Only',
                    permissions: {
                        can_read: true,
                        can_update: false,
                        can_delete: true,
                        can_view_permissions: false,
                        can_manage_permissions: false,
                    },
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

    test('should search templates through the metadata API and map the hit shape', async () => {
        searchTemplates.mockResolvedValue({
            entries: [
                {
                    type: 'metadata_template',
                    id: 'api-legal-hold',
                    templateKey: 'legalHold',
                    displayName: 'Legal Hold',
                    namespace: `${enterpriseFqn}.legal.contracts`,
                    containingNamespace: { fqn: `${enterpriseFqn}.legal.contracts`, displayName: 'Contracts' },
                    ancestors: [
                        { fqn: enterpriseFqn, displayName: 'Enterprise' },
                        { fqn: `${enterpriseFqn}.legal`, displayName: 'Legal' },
                    ],
                    permissions: {
                        can_read: true,
                        can_update: true,
                        can_delete: false,
                        can_view_permissions: false,
                        can_manage_permissions: false,
                    },
                },
                {
                    type: 'metadata_template',
                    id: 'api-my-template',
                    templateKey: 'myTemplate',
                    displayName: 'My Template',
                    namespace: enterpriseFqn,
                    permissions: {
                        can_read: true,
                        can_update: true,
                        can_delete: false,
                        can_view_permissions: false,
                        can_manage_permissions: false,
                    },
                },
                {
                    type: 'metadata_template',
                    id: 'api-global',
                    templateKey: 'legalContract',
                    displayName: 'Legal Contract',
                    namespace: 'box.metadata',
                },
                {
                    type: 'metadata_template',
                    id: 'api-hidden',
                    templateKey: 'hiddenTemplate',
                    displayName: 'Hidden',
                    namespace: enterpriseFqn,
                    hidden: true,
                },
            ],
            next_marker: null,
        });

        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, enterpriseFqn, templates as never),
        );

        await expect(result.current!.getSearchResults('  Le  ', { limit: 20, marker: 'cursor-0' })).resolves.toEqual({
            entries: [
                {
                    id: 'api-legal-hold',
                    type: 'metadata_template',
                    displayName: 'Legal Hold',
                    scope: `${enterpriseFqn}.legal.contracts`,
                    namespace: `${enterpriseFqn}.legal.contracts`,
                    templateKey: 'legalHold',
                    canEdit: true,
                    hidden: false,
                    ancestors: [
                        { fqn: enterpriseFqn, displayName: 'Enterprise' },
                        { fqn: `${enterpriseFqn}.legal`, displayName: 'Legal' },
                        { fqn: `${enterpriseFqn}.legal.contracts`, displayName: 'Contracts' },
                    ],
                },
                {
                    id: 'editor-1',
                    type: 'metadata_template',
                    displayName: 'My Template',
                    scope: enterpriseFqn,
                    namespace: enterpriseFqn,
                    templateKey: 'myTemplate',
                    canEdit: true,
                    hidden: false,
                    ancestors: undefined,
                },
                {
                    id: 'api-global',
                    type: 'metadata_template',
                    displayName: 'Legal Contract',
                    scope: 'box.metadata',
                    namespace: 'box.metadata',
                    templateKey: 'legalContract',
                    canEdit: false,
                    hidden: false,
                    ancestors: undefined,
                },
            ],
            next_marker: undefined,
        });
        expect(searchTemplates).toHaveBeenCalledWith(mockFile, { query: 'Le', limit: 20, marker: 'cursor-0' });
    });

    test('should not resolve a namespaced search hit to a root editor template sharing its scope', async () => {
        searchTemplates.mockResolvedValue({
            entries: [
                {
                    type: 'metadata_template',
                    id: 'api-legal-my-template',
                    templateKey: 'myTemplate',
                    displayName: 'Legal Template',
                    namespace: `${enterpriseFqn}.legal`,
                    scope: enterpriseFqn,
                },
            ],
            next_marker: undefined,
        });

        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, enterpriseFqn, templates as never),
        );

        await expect(result.current!.getSearchResults('legal', { limit: 20 })).resolves.toEqual({
            entries: [
                expect.objectContaining({
                    id: 'api-legal-my-template',
                    displayName: 'Legal Template',
                    namespace: `${enterpriseFqn}.legal`,
                    templateKey: 'myTemplate',
                }),
            ],
            next_marker: undefined,
        });
    });

    test('should not call search for a blank query', async () => {
        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, enterpriseFqn, templates as never),
        );

        await expect(result.current!.getSearchResults('   ', { limit: 20 })).resolves.toEqual({ entries: [] });
        expect(searchTemplates).not.toHaveBeenCalled();
    });

    test('should use the localized custom metadata name for properties templates in search', async () => {
        searchTemplates.mockResolvedValue({
            entries: [
                {
                    id: 'api-props',
                    templateKey: METADATA_TEMPLATE_PROPERTIES,
                    scope: 'global',
                    type: 'metadata_template',
                    displayName: 'Properties',
                },
            ],
            next_marker: undefined,
        });

        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, enterpriseFqn, templates as never),
        );

        await expect(result.current!.getSearchResults('custom', { limit: 10, marker: undefined })).resolves.toEqual({
            entries: [
                expect.objectContaining({
                    id: 'editor-props',
                    displayName: 'Custom Metadata',
                    canEdit: false,
                    scope: 'global',
                }),
            ],
            next_marker: undefined,
        });
    });

    test('should propagate a failed template search', async () => {
        const error = new Error('search unavailable');
        searchTemplates.mockRejectedValue(error);

        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, enterpriseFqn, templates as never),
        );

        await expect(result.current!.getSearchResults('Le', { limit: 20 })).rejects.toBe(error);
    });

    test('should merge already-loaded enterprise templates when the namespace list is empty', async () => {
        const { result } = renderHook(() =>
            useMetadataTemplateItemsService(api as never, mockFile as never, enterpriseFqn, templates as never),
        );

        await expect(result.current!.getTemplates(enterpriseFqn, { limit: 50, marker: undefined })).resolves.toEqual({
            entries: [
                expect.objectContaining({
                    id: 'editor-1',
                    templateKey: 'myTemplate',
                    canEdit: true,
                }),
            ],
            next_marker: undefined,
        });
    });
});
