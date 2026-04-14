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

const defaultGetFileImplementation = (_id, successCallback, errorCallback) => {
    try {
        successCallback(mockFile);
    } catch (error) {
        errorCallback(error);
    }
};

const defaultGetMetadataImplementation = (_file, successCallback, errorCallback) => {
    try {
        successCallback({
            editors: [],
            templates: mockTemplates,
            templateInstances: mockTemplateInstances,
        });
    } catch (error) {
        errorCallback(error);
    }
};

const defaultDeleteMetadataImplementation = (_file, template, successCallback, errorCallback) => {
    try {
        successCallback(template);
    } catch (error) {
        errorCallback(error);
    }
};

const defaultCreateMetadataRedesignImplementation = (_file, _template, successCallback, errorCallback) => {
    try {
        successCallback();
    } catch (error) {
        errorCallback(error);
    }
};

const defaultUpdateMetadataRedesignImplementation = (
    _file,
    _metadataInstance,
    _JSONPatch,
    successCallback,
    errorCallback,
) => {
    try {
        successCallback();
    } catch (error) {
        errorCallback(error);
    }
};

const mockAPI = {
    getFile: jest.fn(),
    getMetadata: jest.fn(),
    deleteMetadata: jest.fn(),
    createMetadataRedesign: jest.fn(),
    updateMetadataRedesign: jest.fn(),
    extractStructured: jest.fn(),
};
const api = {
    getFileAPI: jest.fn().mockReturnValue(mockAPI),
    getMetadataAPI: jest.fn().mockReturnValue(mockAPI),
    getIntelligenceAPI: jest.fn().mockReturnValue(mockAPI),
};

const setupDefaultMockImplementations = () => {
    mockAPI.getFile.mockImplementation(defaultGetFileImplementation);
    mockAPI.getMetadata.mockImplementation(defaultGetMetadataImplementation);
    mockAPI.deleteMetadata.mockImplementation(defaultDeleteMetadataImplementation);
    mockAPI.createMetadataRedesign.mockImplementation(defaultCreateMetadataRedesignImplementation);
    mockAPI.updateMetadataRedesign.mockImplementation(defaultUpdateMetadataRedesignImplementation);
};

describe('useSidebarMetadataFetcher', () => {
    const onErrorMock = jest.fn();
    const onSuccessMock = jest.fn();
    const isFeatureEnabledMock = true;

    const setupHook = (fileId = '123', isConfidenceScoreEnabled = false) =>
        renderHook(() =>
            useSidebarMetadataFetcher(
                api,
                fileId,
                onErrorMock,
                onSuccessMock,
                isFeatureEnabledMock,
                isConfidenceScoreEnabled,
            ),
        );

    beforeEach(() => {
        onErrorMock.mockClear();
        onSuccessMock.mockClear();
        // Reset call history and per-test overrides, then restore deterministic defaults.
        mockAPI.getFile.mockReset();
        mockAPI.getMetadata.mockReset();
        mockAPI.deleteMetadata.mockReset();
        mockAPI.createMetadataRedesign.mockReset();
        mockAPI.updateMetadataRedesign.mockReset();
        mockAPI.extractStructured.mockReset();
        setupDefaultMockImplementations();
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

    test('should pass isConfidenceScoreEnabled=true to getMetadata', async () => {
        const { result } = setupHook('123', true);

        await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

        expect(mockAPI.getMetadata).toHaveBeenCalledWith(
            mockFile,
            expect.any(Function),
            expect.any(Function),
            isFeatureEnabledMock,
            { refreshCache: true },
            true,
            true,
        );
    });

    test('should pass isConfidenceScoreEnabled=false to getMetadata by default', async () => {
        const { result } = setupHook('123');

        await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

        expect(mockAPI.getMetadata).toHaveBeenCalledWith(
            mockFile,
            expect.any(Function),
            expect.any(Function),
            isFeatureEnabledMock,
            { refreshCache: true },
            true,
            false,
        );
    });

    describe('extractSuggestions', () => {
        test('should extract suggestions successfully', async () => {
            mockAPI.extractStructured.mockResolvedValue({
                answer: { field1: 'value1', field2: 'value2' },
                created_at: '2026-03-27T08:10:14.106-07:00',
            });

            const { result } = setupHook();

            expect(result.current.templates).toEqual(mockTemplates);

            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions).toEqual([
                { ...mockTemplates[0].fields[0], aiSuggestion: 'value1' },
                { ...mockTemplates[0].fields[1], aiSuggestion: 'value2' },
            ]);
        });

        test('should map taxonomy field suggestions with value and displayValue', async () => {
            const taxonomyTemplate = {
                canEdit: true,
                id: 'metadata_template_taxonomy',
                fields: [
                    {
                        key: 'taxonomyField',
                        type: 'taxonomy' as MetadataTemplateFieldType,
                        hidden: false,
                    },
                ],
                scope: 'global',
                templateKey: 'taxonomyTemplateKey',
            };

            mockAPI.getMetadata.mockImplementation((file, successCallback) => {
                successCallback({
                    editors: [],
                    templates: [taxonomyTemplate],
                    templateInstances: [],
                });
            });
            mockAPI.extractStructured.mockResolvedValue({
                answer: {
                    taxonomyField: [
                        { id: 'taxonomy-id-1', displayName: 'Taxonomy Item 1' },
                        { id: 'taxonomy-id-2', displayName: 'Taxonomy Item 2' },
                    ],
                },
                created_at: '2026-03-27T08:10:14.106-07:00',
            });

            const { result } = setupHook();

            await waitFor(() => expect(result.current.templates).toEqual([taxonomyTemplate]));

            const suggestions = await result.current.extractSuggestions('taxonomyTemplateKey', 'global');

            expect(suggestions).toEqual([
                {
                    ...taxonomyTemplate.fields[0],
                    aiSuggestion: [
                        { value: 'taxonomy-id-1', displayValue: 'Taxonomy Item 1' },
                        { value: 'taxonomy-id-2', displayValue: 'Taxonomy Item 2' },
                    ],
                },
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

        test.each`
            description             | response
            ${'empty answer'}       | ${{ answer: {}, created_at: '2026-03-27T08:10:14.106-07:00' }}
            ${'null response'}      | ${null}
            ${'undefined response'} | ${undefined}
        `('should handle $description from extractStructured', async ({ response }) => {
            mockAPI.extractStructured.mockResolvedValue(response);

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

        test('should include include_confidence_score and include_reference when isConfidenceScoreEnabled is true', async () => {
            mockAPI.extractStructured.mockResolvedValue({
                answer: { field1: 'value1' },
                created_at: '2026-03-27T08:10:14.106-07:00',
                completion_reason: 'done',
            });

            const { result } = setupHook('123', true);

            await result.current.extractSuggestions('templateKey', 'global');

            expect(mockAPI.extractStructured).toHaveBeenCalledWith({
                items: [{ id: mockFile.id, type: mockFile.type }],
                metadata_template: { template_key: 'templateKey', scope: 'global', type: 'metadata_template' },
                include_confidence_score: true,
                include_reference: true,
            });
        });

        test('should not include include_confidence_score and include_reference when isConfidenceScoreEnabled is false', async () => {
            mockAPI.extractStructured.mockResolvedValue({
                answer: { field1: 'value1' },
                created_at: '2026-03-27T08:10:14.106-07:00',
            });

            const { result } = setupHook('123', false);

            await result.current.extractSuggestions('templateKey', 'global');

            expect(mockAPI.extractStructured).toHaveBeenCalledWith(
                expect.not.objectContaining({
                    include_confidence_score: expect.anything(),
                    include_reference: expect.anything(),
                }),
            );
        });

        test('should parse response with confidence scores', async () => {
            mockAPI.extractStructured.mockResolvedValue({
                answer: { field1: 'value1', field2: 'value2' },
                created_at: '2026-03-27T08:10:14.106-07:00',
                confidence_score: {
                    field1: { level: 'HIGH', score: 0.95 },
                    field2: { level: 'LOW', score: 0.3 },
                },
                completion_reason: 'done',
            });

            const { result } = setupHook('123', true);
            await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions).toEqual([
                {
                    ...mockTemplates[0].fields[0],
                    aiSuggestion: 'value1',
                    aiSuggestionConfidenceScore: { value: 0.95, level: 'HIGH', isAccepted: false },
                },
                {
                    ...mockTemplates[0].fields[1],
                    aiSuggestion: 'value2',
                    aiSuggestionConfidenceScore: { value: 0.3, level: 'LOW', isAccepted: false },
                },
            ]);
        });

        test('should parse response with references', async () => {
            mockAPI.extractStructured.mockResolvedValue({
                answer: { field1: 'value1' },
                created_at: '2026-03-27T08:10:14.106-07:00',
                confidence_score: {
                    field1: { level: 'MEDIUM', score: 0.85 },
                },
                reference: {
                    field1: [
                        {
                            itemId: 'file_123',
                            page: 0,
                            text: 'extracted text',
                            boundingBox: { left: 0.1, top: 0.2, right: 0.3, bottom: 0.4 },
                        },
                    ],
                },
                completion_reason: 'done',
            });

            const { result } = setupHook('123', true);
            await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions).toEqual([
                {
                    ...mockTemplates[0].fields[0],
                    aiSuggestion: 'value1',
                    aiSuggestionConfidenceScore: { value: 0.85, level: 'MEDIUM', isAccepted: false },
                    targetLocation: [
                        {
                            itemId: 'file_123',
                            page: 0,
                            text: 'extracted text',
                            boundingBox: { left: 0.1, top: 0.2, right: 0.3, bottom: 0.4 },
                        },
                    ],
                },
                mockTemplates[0].fields[1],
            ]);
        });

        test('should parse taxonomy response with confidence scores', async () => {
            const taxonomyTemplate = {
                canEdit: true,
                id: 'metadata_template_taxonomy',
                fields: [
                    {
                        key: 'taxonomyField',
                        type: 'taxonomy' as MetadataTemplateFieldType,
                        hidden: false,
                    },
                ],
                scope: 'global',
                templateKey: 'taxonomyTemplateKey',
            };

            mockAPI.getMetadata.mockImplementation((file, successCallback) => {
                successCallback({
                    editors: [],
                    templates: [taxonomyTemplate],
                    templateInstances: [],
                });
            });
            mockAPI.extractStructured.mockResolvedValue({
                answer: {
                    taxonomyField: [
                        { id: 'taxonomy-id-1', displayName: 'Taxonomy Item 1' },
                        { id: 'taxonomy-id-2', displayName: 'Taxonomy Item 2' },
                    ],
                },
                confidence_score: {
                    taxonomyField: { level: 'MEDIUM', score: 0.72 },
                },
                completion_reason: 'done',
            });

            const { result } = setupHook('123', true);

            await waitFor(() => expect(result.current.templates).toEqual([taxonomyTemplate]));

            const suggestions = await result.current.extractSuggestions('taxonomyTemplateKey', 'global');

            expect(suggestions).toEqual([
                {
                    ...taxonomyTemplate.fields[0],
                    aiSuggestion: [
                        { value: 'taxonomy-id-1', displayValue: 'Taxonomy Item 1' },
                        { value: 'taxonomy-id-2', displayValue: 'Taxonomy Item 2' },
                    ],
                    aiSuggestionConfidenceScore: { value: 0.72, level: 'MEDIUM', isAccepted: false },
                },
            ]);
        });

        test('should handle response with empty confidence_score when FF is enabled', async () => {
            mockAPI.extractStructured.mockResolvedValue({
                answer: { field1: 'value1' },
                confidence_score: {},
                created_at: '2026-03-27T08:10:14.106-07:00',
            });

            const { result } = setupHook('123', true);
            await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions).toEqual([
                {
                    ...mockTemplates[0].fields[0],
                    aiSuggestion: 'value1',
                },
                mockTemplates[0].fields[1],
            ]);
        });

        test('should handle response where only some fields have confidence scores', async () => {
            mockAPI.extractStructured.mockResolvedValue({
                answer: { field1: 'value1', field2: 'value2' },
                confidence_score: {
                    field1: { level: 'HIGH', score: 0.9 },
                },
                completion_reason: 'done',
            });

            const { result } = setupHook('123', true);
            await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions).toEqual([
                {
                    ...mockTemplates[0].fields[0],
                    aiSuggestion: 'value1',
                    aiSuggestionConfidenceScore: { value: 0.9, level: 'HIGH', isAccepted: false },
                },
                {
                    ...mockTemplates[0].fields[1],
                    aiSuggestion: 'value2',
                },
            ]);
        });

        test('should pick the lowest confidence score when confidence_score is an array', async () => {
            mockAPI.extractStructured.mockResolvedValue({
                answer: { field1: 'value1', field2: 'value2' },
                created_at: '2026-03-27T08:10:14.106-07:00',
                confidence_score: {
                    field1: [
                        { level: 'HIGH', score: 1 },
                        { level: 'LOW', score: 0.3 },
                        { level: 'MEDIUM', score: 0.7 },
                    ],
                    field2: { level: 'MEDIUM', score: 0.6 },
                },
                completion_reason: 'done',
            });

            const { result } = setupHook('123', true);
            await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions).toEqual([
                {
                    ...mockTemplates[0].fields[0],
                    aiSuggestion: 'value1',
                    aiSuggestionConfidenceScore: { value: 0.3, level: 'LOW', isAccepted: false },
                },
                {
                    ...mockTemplates[0].fields[1],
                    aiSuggestion: 'value2',
                    aiSuggestionConfidenceScore: { value: 0.6, level: 'MEDIUM', isAccepted: false },
                },
            ]);
        });

        test('should pick the lowest confidence score from array with two equal scores', async () => {
            mockAPI.extractStructured.mockResolvedValue({
                answer: { field1: 'value1' },
                created_at: '2026-03-27T08:10:14.106-07:00',
                confidence_score: {
                    field1: [
                        { level: 'HIGH', score: 1 },
                        { level: 'HIGH', score: 1 },
                    ],
                },
                completion_reason: 'done',
            });

            const { result } = setupHook('123', true);
            await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions[0].aiSuggestionConfidenceScore).toEqual({
                value: 1,
                level: 'HIGH',
                isAccepted: false,
            });
        });

        test('should flatten nested arrays of references', async () => {
            mockAPI.extractStructured.mockResolvedValue({
                answer: { field1: 'value1' },
                created_at: '2026-03-27T08:10:14.106-07:00',
                confidence_score: {
                    field1: { level: 'HIGH', score: 0.9 },
                },
                reference: {
                    field1: [
                        [
                            { itemId: 'file_123', page: 0, text: 'ref 1' },
                            { itemId: 'file_123', page: 1, text: 'ref 2' },
                        ],
                        [{ itemId: 'file_456', page: 0, text: 'ref 3' }],
                    ],
                },
                completion_reason: 'done',
            });

            const { result } = setupHook('123', true);
            await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions[0].targetLocation).toEqual([
                { itemId: 'file_123', page: 0, text: 'ref 1' },
                { itemId: 'file_123', page: 1, text: 'ref 2' },
                { itemId: 'file_456', page: 0, text: 'ref 3' },
            ]);
        });

        test('should handle flat array of references without nesting', async () => {
            mockAPI.extractStructured.mockResolvedValue({
                answer: { field1: 'value1' },
                created_at: '2026-03-27T08:10:14.106-07:00',
                reference: {
                    field1: [
                        { itemId: 'file_123', page: 0, text: 'ref 1' },
                        { itemId: 'file_123', page: 1, text: 'ref 2' },
                    ],
                },
                completion_reason: 'done',
            });

            const { result } = setupHook('123', true);
            await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions[0].targetLocation).toEqual([
                { itemId: 'file_123', page: 0, text: 'ref 1' },
                { itemId: 'file_123', page: 1, text: 'ref 2' },
            ]);
        });

        test('should handle reference entries without bounding box', async () => {
            mockAPI.extractStructured.mockResolvedValue({
                answer: { field1: 'value1' },
                confidence_score: {
                    field1: { level: 'HIGH', score: 0.8 },
                },
                reference: {
                    field1: [{ itemId: 'file_123', page: 1, text: 'some text' }],
                },
                completion_reason: 'done',
            });

            const { result } = setupHook('123', true);
            await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

            const suggestions = await result.current.extractSuggestions('templateKey', 'global');

            expect(suggestions[0].targetLocation).toEqual([{ itemId: 'file_123', page: 1, text: 'some text' }]);
        });
    });
});
