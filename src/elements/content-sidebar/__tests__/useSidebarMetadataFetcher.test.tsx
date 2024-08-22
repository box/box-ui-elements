import { renderHook, waitFor } from '../../../test-utils/testing-library';
import messages from '../../common/messages';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../../constants';
import useSidebarMetadataFetcher, { STATUS } from '../hooks/useSidebarMetadataFetcher';

const mockError = {
    status: 500,
    message: 'Internal Server Error',
};

const mockFile = {
    id: '123',
    permissions: { [FIELD_PERMISSIONS_CAN_UPLOAD]: true },
};

const mockTemplates = [
    {
        id: 'metadata_template_custom_1',
        scope: 'global',
        templateKey: 'properties',
        hidden: false,
    },
];

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
            });
        } catch (error) {
            errorCallback(error);
        }
    }),
};
const api = {
    getFileAPI: jest.fn().mockReturnValue(mockAPI),
    getMetadataAPI: jest.fn().mockReturnValue(mockAPI),
};

describe('useSidebarMetadataFetcher', () => {
    const onErrorMock = jest.fn();
    const isFeatureEnabledMock = true;

    const setupHook = (fileId = '123') =>
        renderHook(() => useSidebarMetadataFetcher(api, fileId, onErrorMock, isFeatureEnabledMock));

    test('should fetch the file and metadata successfully', async () => {
        const { result } = setupHook();

        await waitFor(() => expect(result.current.status).toBe(STATUS.SUCCESS));

        expect(result.current.file).toEqual(mockFile);
        expect(result.current.templates).toEqual(mockTemplates);
        expect(result.current.errorMessage).toBeNull();
    });

    test('should handle file fetching error', async () => {
        mockAPI.getFile.mockImplementation((id, successCallback, errorCallback) =>
            errorCallback(mockError, 'file_fetch_error'),
        );

        const { result } = setupHook();

        await waitFor(() => expect(result.current.status).toBe(STATUS.ERROR));

        expect(result.current.file).toBeUndefined();
        expect(result.current.errorMessage).toBe(messages.sidebarMetadataEditingErrorContent);
        expect(onErrorMock).toHaveBeenCalledWith(
            mockError,
            'file_fetch_error',
            expect.objectContaining({
                error: mockError,
                isErrorDisplayed: true,
            }),
        );
    });

    test('should handle metadata fetching error', async () => {
        mockAPI.getFile.mockImplementation((id, successCallback) => {
            successCallback(mockFile);
        });
        mockAPI.getMetadata.mockImplementation((file, successCallback, errorCallback) => {
            errorCallback(mockError, 'metadata_fetch_error');
        });
        const { result } = setupHook();

        await waitFor(() => expect(result.current.status).toBe(STATUS.ERROR));

        expect(result.current.templates).toBeNull();
        expect(result.current.errorMessage).toBe(messages.sidebarMetadataFetchingErrorContent);
        expect(onErrorMock).toHaveBeenCalledWith(
            mockError,
            'metadata_fetch_error',
            expect.objectContaining({
                error: mockError,
                isErrorDisplayed: true,
            }),
        );
    });
});
