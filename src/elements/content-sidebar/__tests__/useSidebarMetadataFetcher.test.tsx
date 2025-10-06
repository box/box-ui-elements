import { MetadataTemplateFieldType } from '@box/metadata-editor';
import { renderHook, waitFor } from '../../../test-utils/testing-library';
import messages from '../../common/messages';
import {
    ERROR_CODE_EMPTY_METADATA_SUGGESTIONS,
    ERROR_CODE_FETCH_METADATA_SUGGESTIONS,
    ERROR_CODE_METADATA_AUTOFILL_TIMEOUT,
    ERROR_CODE_METADATA_PRECONDITION_FAILED,
    ERROR_CODE_UNKNOWN,
    FIELD_PERMISSIONS_CAN_UPLOAD,
    SUCCESS_CODE_DELETE_METADATA_TEMPLATE_INSTANCE,
    SUCCESS_CODE_UPDATE_METADATA_TEMPLATE_INSTANCE,
    SUCCESS_CODE_CREATE_METADATA_TEMPLATE_INSTANCE,
} from '../../../constants';
import useSidebarMetadataFetcher, { STATUS } from '../hooks/useSidebarMetadataFetcher';

const mockRateLimitError = {
    status: 429,
    message: 'Rate Limit Exceeded',
};

const mockInternalServerError = {
    status: 500,
    message: 'Internal Server Error',
};

const mockTimeoutError = {
    status: 408,
    message: 'Request Timeout',
};

const mockPreconditionFailedError = {
    status: 412,
    message: 'Precondition Failed',
};

const mockFile = {
    id: '123',
    permissions: { [FIELD_PERMISSIONS_CAN_UPLOAD]: true },
    type: 'file',
};

const mockTemplates = [
    {
        canEdit: true,
        id: 'metadata_template_instance_1',
        fields: [
            {
                key: 'field1',
                type: 'string' as MetadataTemplateFieldType,
                hidden: false,
            },
            {
                key: 'field2',
                type: 'string' as MetadataTemplateFieldType,
                hidden: false,
            },
        ],
        scope: 'global',
        templateKey: 'templateKey',
    },
    {
        id: 'metadata_template_custom_1',
        scope: 'global',
        templateKey: 'properties',
        hidden: false,
    },
];

const mockTemplateInstances = [
    {
        canEdit: true,
        id: 'metadata_template_instance_2',
        fields: [],
        scope: 'global',
        templateKey: 'properties1',
        type: 'properties',
        hidden: false,
    },
];

const newTemplateInstance = {
    canEdit: true,
    id: 'metadata_template_instance_3',
    fields: [],
    scope: 'global',
    templateKey: 'properties',
    type: 'properties',
    hidden: false,
};

const mockAPI = {
    getFile: jest.fn((id, successCallback, errorCallback) => {
        try {
            successCallback(mockFile);
        } catch (error) {
            errorCallback(error);
        }
    }),
    getMetadata: jest.fn((_file, successCallback, errorCallback) => {
        try {
            successCallback({
                editors: [],
                templates: mockTemplates,
                templateInstances: mockTemplateInstances,
            });
        } catch (error) {
            errorCallback(error);
        }
    }),
    deleteMetadata: jest.fn((_file, template, successCallback, errorCallback) => {
        try {
            successCallback(template);
        } catch (error) {
            errorCallback(error);
        }
    }),
    createMetadataRedesign: jest.fn((_file, template, successCallback, errorCallback) => {
        try {
            successCallback();
        } catch (error) {
            errorCallback(error);
        }
    }),
    updateMetadataRedesign: jest.fn((_file, _metadataInstance, _JSONPatch, successCallback, errorCallback) => {
        try {
            successCallback();
        } catch (error) {
            errorCallback(error);
        }
    }),
    extractStructured: jest.fn(),
};
const api = {
    getFileAPI: jest.fn().mockReturnValue(mockAPI),
    getMetadataAPI: jest.fn().mockReturnValue(mockAPI),
    getIntelligenceAPI: jest.fn().mockReturnValue(mockAPI),
};

describe('useSidebarMetadataFetcher', () => {
    const onErrorMock = jest.fn();
    const onSuccessMock = jest.fn();
    const isFeatureEnabledMock = true;

    const setupHook = (fileId = '123') =>
        renderHook(() => useSidebarMetadataFetcher(api, fileId, onErrorMock, onSuccessMock, isFeatureEnabledMock));

    beforeEach(() => {
        onErrorMock.mockClear();
        onSuccessMock.mockClear();
        mockAPI.getFile.mockClear();
        mockAPI.getMetadata.mockClear();
        mockAPI.deleteMetadata.mockClear();
        mockAPI.updateMetadataRedesign.mockClear();
        mockAPI.extractStructured.mockClear();
    });

    test('should fetch the file and metadata successfully', async () => {
        const { result } = setupHook();

        await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

        expect(result.current.file).toEqual(mockFile);
        expect(result.current.templates).toEqual(mockTemplates);
        expect(result.current.errorMessage).toBeNull();
    });

    test('should handle file fetching error', async () => {
        mockAPI.getFile.mockImplementation((id, successCallback, errorCallback) =>
            errorCallback(mockInternalServerError, 'file_fetch_error'),
        );

        const { result } = setupHook();

        await waitFor(() => expect(result.current.status).toBe(STATUS.ERROR));

        expect(result.current.file).toBeUndefined();
        expect(result.current.errorMessage).toBe(messages.sidebarMetadataEditingErrorContent);
        expect(onSuccessMock).not.toHaveBeenCalled();
        expect(onErrorMock).toHaveBeenCalledWith(
            mockInternalServerError,
            'file_fetch_error',
            expect.objectContaining({
                error: mockInternalServerError,
                isErrorDisplayed: true,
            }),
        );
    });

    test('should handle metadata fetching error', async () => {
        mockAPI.getFile.mockImplementation((id, successCallback) => {
            successCallback(mockFile);
        });
        mockAPI.getMetadata.mockImplementation((file, successCallback, errorCallback) => {
            errorCallback(mockInternalServerError, 'metadata_fetch_error');
        });
        const { result } = setupHook();

        await waitFor(() => expect(result.current.status).toBe(STATUS.ERROR));

        expect(result.current.templates).toBeNull();
        expect(result.current.errorMessage).toBe(messages.sidebarMetadataFetchingErrorContent);
        expect(onSuccessMock).not.toHaveBeenCalled();
        expect(onErrorMock).toHaveBeenCalledWith(
            mockInternalServerError,
            'metadata_fetch_error',
            expect.objectContaining({
                error: mockInternalServerError,
                isErrorDisplayed: true,
            }),
        );
    });

    test('should handle metadata instance removal', async () => {
        mockAPI.getMetadata.mockImplementation((file, successCallback) => {
            successCallback({ templateInstances: mockTemplateInstances, templates: mockTemplates });
        });
        mockAPI.deleteMetadata.mockImplementation((file, template, successCallback) => {
            successCallback(mockTemplateInstances[0]);
        });

        const { result } = setupHook();
        expect(result.current.templateInstances).toEqual(mockTemplateInstances);

        await waitFor(() => result.current.handleDeleteMetadataInstance(mockTemplateInstances[0]));

        expect(result.current.templates).toEqual(mockTemplates);
        expect(result.current.status).toEqual(STATUS.SUCCESS);
        expect(result.current.errorMessage).toBeNull();
        expect(onSuccessMock).toHaveBeenCalledWith(SUCCESS_CODE_DELETE_METADATA_TEMPLATE_INSTANCE, true);
    });

    test('should handle metadata instance removal error', async () => {
        mockAPI.getMetadata.mockImplementation((file, successCallback) => {
            successCallback({ templateInstances: mockTemplateInstances, templates: mockTemplates });
        });
        mockAPI.deleteMetadata.mockImplementation((file, template, successCallback, errorCallback) => {
            errorCallback(mockInternalServerError, 'metadata_remove_error');
        });

        const { result } = setupHook();
        expect(result.current.status).toEqual(STATUS.SUCCESS);

        await waitFor(() => result.current.handleDeleteMetadataInstance(mockTemplateInstances[0]));

        expect(result.current.status).toEqual(STATUS.ERROR);
        expect(onSuccessMock).not.toHaveBeenCalled();
        expect(onErrorMock).toHaveBeenCalledWith(
            mockInternalServerError,
            'metadata_remove_error',
            expect.objectContaining({
                error: mockInternalServerError,
                isErrorDisplayed: true,
            }),
        );
    });

    test('should handle metadata instance creation', async () => {
        mockAPI.getMetadata.mockImplementation((file, successCallback) => {
            successCallback({ templateInstances: mockTemplateInstances, templates: mockTemplates });
        });
        mockAPI.createMetadataRedesign.mockImplementation((file, template, successCallback) => {
            successCallback();
        });

        const successCallback = jest.fn();

        const { result } = setupHook();

        expect(result.current.templateInstances).toEqual(mockTemplateInstances);
        await waitFor(() => result.current.handleCreateMetadataInstance(newTemplateInstance, successCallback));

        expect(successCallback).toHaveBeenCalled();
        expect(onSuccessMock).toHaveBeenCalledWith(SUCCESS_CODE_CREATE_METADATA_TEMPLATE_INSTANCE, true);
    });

    test('should handle metadata instance creation error', async () => {
        mockAPI.getMetadata.mockImplementation((file, successCallback) => {
            successCallback({ templateInstances: mockTemplateInstances, templates: mockTemplates });
        });
        mockAPI.createMetadataRedesign.mockImplementation((file, template, successCallback, errorCallback) => {
            errorCallback(mockInternalServerError, 'metadata_creation_error');
        });

        const { result } = setupHook();
        expect(result.current.status).toBe(STATUS.SUCCESS);

        await waitFor(() => result.current.handleCreateMetadataInstance(newTemplateInstance, jest.fn()));

        expect(result.current.status).toBe(STATUS.ERROR);
        expect(onSuccessMock).not.toHaveBeenCalled();
        expect(onErrorMock).toHaveBeenCalledWith(
            mockInternalServerError,
            'metadata_creation_error',
            expect.objectContaining({
                error: mockInternalServerError,
                isErrorDisplayed: true,
            }),
        );
    });

    test('should handle metadata update', async () => {
        mockAPI.getMetadata.mockImplementation((file, successCallback) => {
            successCallback({ templateInstances: mockTemplateInstances, templates: mockTemplates });
        });
        mockAPI.updateMetadataRedesign.mockImplementation((_file, _metadataInstance, _JSONPatch, successCallback) => {
            successCallback();
        });
        const ops = [{ op: 'add', path: '/foo', value: 'bar' }];
        const successCallback = jest.fn();

        const { result } = setupHook();
        expect(result.current.templateInstances).toEqual(mockTemplateInstances);

        await waitFor(() =>
            result.current.handleUpdateMetadataInstance(mockTemplateInstances[0], ops, successCallback),
        );
        expect(successCallback).toHaveBeenCalled();
        expect(onSuccessMock).toHaveBeenCalledWith(SUCCESS_CODE_UPDATE_METADATA_TEMPLATE_INSTANCE, true);
    });

    test('should handle metadata update error', async () => {
        mockAPI.updateMetadataRedesign.mockImplementation(
            (_file, _metadataInstance, _JSONPatch, successCallback, errorCallback) => {
                errorCallback(mockInternalServerError, 'metadata_update_error');
            },
        );
        const ops = [{ op: 'add', path: '/foo', value: 'bar' }];
        const successCallback = jest.fn();
        const { result } = setupHook();

        expect(result.current.templateInstances).toEqual(mockTemplateInstances);

        await waitFor(() =>
            result.current.handleUpdateMetadataInstance(mockTemplateInstances[0], ops, successCallback),
        );

        expect(successCallback).not.toHaveBeenCalled();
        expect(onSuccessMock).not.toHaveBeenCalled();

        expect(result.current.status).toEqual(STATUS.ERROR);
        expect(result.current.templates).toEqual(mockTemplates);
        expect(result.current.errorMessage).toEqual(messages.sidebarMetadataEditingErrorContent);
        expect(onErrorMock).toHaveBeenCalledWith(
            mockInternalServerError,
            'metadata_update_error',
            expect.objectContaining({
                error: mockInternalServerError,
                isErrorDisplayed: true,
            }),
        );
    });

    describe('extractSuggestions', () => {
        test('should extract suggestions successfully', async () => {
            const mockSuggestions = {
                field1: 'value1',
                field2: 'value2',
            };
            mockAPI.extractStructured.mockResolvedValue(mockSuggestions);

            const { result } = setupHook();

            expect(result.current.templates).toEqual(mockTemplates);

            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions).toEqual([
                { ...mockTemplates[0].fields[0], aiSuggestion: 'value1' },
                { ...mockTemplates[0].fields[1], aiSuggestion: 'value2' },
            ]);
        });

        test('should handle user correctable error during suggestions extraction', async () => {
            mockAPI.extractStructured.mockRejectedValue({ response: mockRateLimitError });

            const { result } = setupHook();
            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions).toEqual([]);
            expect(onSuccessMock).not.toHaveBeenCalled();
            expect(onErrorMock).toHaveBeenCalledWith(
                { response: mockRateLimitError },
                ERROR_CODE_FETCH_METADATA_SUGGESTIONS,
                expect.objectContaining({
                    showNotification: true,
                }),
            );
            await waitFor(() => expect(result.current.extractErrorCode).toBeNull());
        });

        test.each`
            description                               | error                                        | expectedErrorCode
            ${'metadata autofill timeout error'}      | ${{ response: mockTimeoutError }}            | ${ERROR_CODE_METADATA_AUTOFILL_TIMEOUT}
            ${'metadata pre-condition failure error'} | ${{ response: mockPreconditionFailedError }} | ${ERROR_CODE_METADATA_PRECONDITION_FAILED}
            ${'internal server error'}                | ${{ response: mockInternalServerError }}     | ${ERROR_CODE_UNKNOWN}
        `('should set extract error code for $description and get cleared', async ({ error, expectedErrorCode }) => {
            mockAPI.extractStructured.mockRejectedValue(error);

            const { result } = setupHook();
            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions).toEqual([]);
            expect(onSuccessMock).not.toHaveBeenCalled();
            expect(onErrorMock).toHaveBeenCalledWith(error, expectedErrorCode);
            await waitFor(() => expect(result.current.extractErrorCode).toEqual(expectedErrorCode));

            await result.current.clearExtractError();
            await waitFor(() => expect(result.current.extractErrorCode).toBeNull());
        });

        test('should handle empty suggestions', async () => {
            mockAPI.extractStructured.mockResolvedValue([]);

            const { result } = setupHook();
            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions).toEqual([]);
            expect(onSuccessMock).not.toHaveBeenCalled();
            expect(onErrorMock).toHaveBeenCalledWith(
                new Error('No suggestions found.'),
                ERROR_CODE_EMPTY_METADATA_SUGGESTIONS,
                expect.objectContaining({
                    showNotification: true,
                }),
            );
        });

        test('should call extractStructured with custom AI agent ID', async () => {
            const { result } = setupHook();
            const agentId = 'custom-agent-123';

            await result.current.extractSuggestions('templateKey', 'global', agentId);

            expect(mockAPI.extractStructured).toHaveBeenCalledWith({
                items: [{ id: mockFile.id, type: mockFile.type }],
                metadata_template: { template_key: 'templateKey', scope: 'global', type: 'metadata_template' },
                ai_agent: { type: 'ai_agent_id', id: agentId },
            });
        });

        test('should not call extractStructured with custom AI agent ID', async () => {
            const { result } = setupHook();

            await result.current.extractSuggestions('templateKey', 'global');

            // Assert that ai_agent is NOT present
            expect(mockAPI.extractStructured).toHaveBeenCalledWith(
                expect.not.objectContaining({
                    ai_agent: expect.anything(),
                }),
            );
            // Also verify what IS present
            expect(mockAPI.extractStructured).toHaveBeenCalledWith({
                items: [{ id: mockFile.id, type: mockFile.type }],
                metadata_template: { template_key: 'templateKey', scope: 'global', type: 'metadata_template' },
            });
        });

        test('should handle undefined agentIDs', async () => {
            const { result } = setupHook();

            await result.current.extractSuggestions('templateKey', 'global', undefined);

            // Assert that ai_agent is NOT present
            expect(mockAPI.extractStructured).toHaveBeenCalledWith(
                expect.not.objectContaining({
                    ai_agent: expect.anything(),
                }),
            );
            // Also verify what IS present
            expect(mockAPI.extractStructured).toHaveBeenCalledWith({
                items: [{ id: mockFile.id, type: mockFile.type }],
                metadata_template: { template_key: 'templateKey', scope: 'global', type: 'metadata_template' },
            });
            mockAPI.extractStructured.mockClear();

            await result.current.extractSuggestions('templateKey', 'global', '');
            expect(mockAPI.extractStructured).toHaveBeenCalledWith(
                expect.not.objectContaining({
                    ai_agent: expect.anything(),
                }),
            );
        });
    });
});
