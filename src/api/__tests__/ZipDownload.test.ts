import { BoxClient, BoxDeveloperTokenAuth } from 'box-typescript-sdk-gen';
import ZipDownloadAPI, { ZipDownloadItem, ZipDownloadOptions, ZipDownloadResponse } from '../ZipDownload';

// Mock the box-typescript-sdk-gen
jest.mock('box-typescript-sdk-gen', () => ({
    BoxClient: jest.fn(),
    BoxDeveloperTokenAuth: jest.fn(),
}));

// Mock window.open and URL.revokeObjectURL
const mockWindowOpen = jest.fn();
const mockUrlRevokeObjectURL = jest.fn();

Object.defineProperty(window, 'open', {
    value: mockWindowOpen,
    writable: true,
});

Object.defineProperty(window, 'focus', {
    value: jest.fn(),
    writable: true,
});

Object.defineProperty(global, 'URL', {
    value: {
        revokeObjectURL: mockUrlRevokeObjectURL,
    },
    writable: true,
});

describe('ZipDownloadAPI', () => {
    let zipDownloadAPI: ZipDownloadAPI;
    let mockClient: jest.Mocked<BoxClient>;
    let mockAuth: jest.Mocked<BoxDeveloperTokenAuth>;
    let mockCreateZipDownload: jest.Mock;

    const mockOptions: ZipDownloadOptions = {
        token: 'test-token',
        downloadFileName: 'test-download.zip',
    };

    const mockItems: ZipDownloadItem[] = [
        { id: '123', type: 'file' },
        { id: '456', type: 'folder' },
    ];

    const mockZipDownloadResponse: ZipDownloadResponse = {
        downloadUrl: 'https://api.box.com/2.0/zip_downloads/test-download-url',
        statusUrl: 'https://api.box.com/2.0/zip_downloads/test-status-url',
        expiresAt: '2024-01-01T00:00:00Z',
        state: 'succeeded',
        totalCount: 2,
        downloadedCount: 2,
        skippedCount: 0,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mocks
        mockAuth = {
            token: 'test-token',
        } as jest.Mocked<BoxDeveloperTokenAuth>;

        mockCreateZipDownload = jest.fn();
        mockClient = {
            zipDownloads: {
                createZipDownload: mockCreateZipDownload,
            },
        } as unknown as jest.Mocked<BoxClient>;

        (BoxDeveloperTokenAuth as jest.Mock).mockImplementation(() => mockAuth);
        (BoxClient as jest.Mock).mockImplementation(() => mockClient);

        zipDownloadAPI = new ZipDownloadAPI(mockOptions);
    });

    describe('constructor', () => {
        test('should initialize with correct options', () => {
            expect(BoxDeveloperTokenAuth).toHaveBeenCalledWith({ token: 'test-token' });
            expect(BoxClient).toHaveBeenCalledWith({ auth: mockAuth });
        });

        test('should initialize without downloadFileName', () => {
            const optionsWithoutFileName: ZipDownloadOptions = {
                token: 'test-token',
            };

            const apiWithoutFileName = new ZipDownloadAPI(optionsWithoutFileName);

            expect(BoxDeveloperTokenAuth).toHaveBeenCalledWith({ token: 'test-token' });
            expect(BoxClient).toHaveBeenCalledWith({ auth: mockAuth });
            expect(apiWithoutFileName).toBeInstanceOf(ZipDownloadAPI);
        });
    });

    describe('createZipDownload', () => {
        test('should successfully create ZIP download', async () => {
            mockCreateZipDownload.mockResolvedValue(mockZipDownloadResponse);

            const result = await zipDownloadAPI.createZipDownload(mockItems);

            expect(mockCreateZipDownload).toHaveBeenCalledWith({
                items: mockItems,
                downloadFileName: 'test-download.zip',
            });
            expect(result).toEqual(mockZipDownloadResponse);
            expect(mockWindowOpen).toHaveBeenCalledWith(
                'https://api.box.com/2.0/zip_downloads/test-download-url',
                '_blank',
                'noopener,noreferrer',
            );
        });

        test('should create ZIP download without downloadFileName', async () => {
            const optionsWithoutFileName: ZipDownloadOptions = {
                token: 'test-token',
            };
            const apiWithoutFileName = new ZipDownloadAPI(optionsWithoutFileName);

            mockCreateZipDownload.mockResolvedValue(mockZipDownloadResponse);

            await apiWithoutFileName.createZipDownload(mockItems);

            expect(mockCreateZipDownload).toHaveBeenCalledWith({
                items: mockItems,
                downloadFileName: undefined,
            });
        });

        test('should throw error when items array is empty', async () => {
            await expect(zipDownloadAPI.createZipDownload([])).rejects.toThrow('Items array cannot be empty');
        });

        test('should throw error when items array is null', async () => {
            await expect(zipDownloadAPI.createZipDownload(null as unknown as ZipDownloadItem[])).rejects.toThrow(
                'Items array cannot be empty',
            );
        });

        test('should throw error when items array is undefined', async () => {
            await expect(zipDownloadAPI.createZipDownload(undefined as unknown as ZipDownloadItem[])).rejects.toThrow(
                'Items array cannot be empty',
            );
        });

        test('should handle API errors and throw with descriptive message', async () => {
            const apiError = new Error('API Error');
            mockCreateZipDownload.mockRejectedValue(apiError);

            await expect(zipDownloadAPI.createZipDownload(mockItems)).rejects.toThrow(
                'Failed to create ZIP download: API Error',
            );
        });

        test('should handle non-Error objects and convert to string', async () => {
            const apiError = 'String error';
            mockCreateZipDownload.mockRejectedValue(apiError);

            await expect(zipDownloadAPI.createZipDownload(mockItems)).rejects.toThrow(
                'Failed to create ZIP download: String error',
            );
        });

        test('should handle different item types', async () => {
            const mixedItems: ZipDownloadItem[] = [
                { id: '123', type: 'file' },
                { id: '456', type: 'folder' },
                { id: '789', type: 'file' },
            ];

            mockCreateZipDownload.mockResolvedValue(mockZipDownloadResponse);

            await zipDownloadAPI.createZipDownload(mixedItems);

            expect(mockCreateZipDownload).toHaveBeenCalledWith({
                items: mixedItems,
                downloadFileName: 'test-download.zip',
            });
        });
    });

    describe('downloadZipFile (private method)', () => {
        test('should open download URL in new window', async () => {
            mockCreateZipDownload.mockResolvedValue(mockZipDownloadResponse);

            await zipDownloadAPI.createZipDownload(mockItems);

            expect(mockWindowOpen).toHaveBeenCalledWith(
                'https://api.box.com/2.0/zip_downloads/test-download-url',
                '_blank',
                'noopener,noreferrer',
            );
            expect(window.focus).toHaveBeenCalled();
        });

        test('should revoke object URL after timeout', async () => {
            jest.useFakeTimers();

            mockCreateZipDownload.mockResolvedValue(mockZipDownloadResponse);

            await zipDownloadAPI.createZipDownload(mockItems);

            // Fast-forward timers to trigger the setTimeout
            jest.advanceTimersByTime(1000);

            expect(mockUrlRevokeObjectURL).toHaveBeenCalledWith(
                'https://api.box.com/2.0/zip_downloads/test-download-url',
            );

            jest.useRealTimers();
        });

        test('should handle window.open errors', async () => {
            const windowError = new Error('Window open error');
            mockWindowOpen.mockImplementation(() => {
                throw windowError;
            });

            mockCreateZipDownload.mockResolvedValue(mockZipDownloadResponse);

            await expect(zipDownloadAPI.createZipDownload(mockItems)).rejects.toThrow(
                'Failed to download ZIP file: Window open error',
            );
        });

        test('should handle non-Error window.open errors', async () => {
            mockWindowOpen.mockImplementation(() => {
                throw new Error('String window error');
            });

            mockCreateZipDownload.mockResolvedValue(mockZipDownloadResponse);

            await expect(zipDownloadAPI.createZipDownload(mockItems)).rejects.toThrow(
                'Failed to download ZIP file: String window error',
            );
        });
    });

    describe('integration scenarios', () => {
        test('should handle successful download with in_progress state', async () => {
            const inProgressResponse: ZipDownloadResponse = {
                ...mockZipDownloadResponse,
                state: 'in_progress',
                downloadUrl: undefined,
            };

            mockCreateZipDownload.mockResolvedValue(inProgressResponse);

            const result = await zipDownloadAPI.createZipDownload(mockItems);

            expect(result.state).toBe('in_progress');
            expect(mockWindowOpen).not.toHaveBeenCalled();
        });

        test('should handle failed download state', async () => {
            const failedResponse: ZipDownloadResponse = {
                ...mockZipDownloadResponse,
                state: 'failed',
                downloadUrl: undefined,
            };

            mockCreateZipDownload.mockResolvedValue(failedResponse);

            const result = await zipDownloadAPI.createZipDownload(mockItems);

            expect(result.state).toBe('failed');
            expect(mockWindowOpen).not.toHaveBeenCalled();
        });

        test('should handle response without downloadUrl', async () => {
            const responseWithoutUrl: ZipDownloadResponse = {
                ...mockZipDownloadResponse,
                downloadUrl: undefined,
            };

            mockCreateZipDownload.mockResolvedValue(responseWithoutUrl);

            const result = await zipDownloadAPI.createZipDownload(mockItems);

            expect(result.downloadUrl).toBeUndefined();
            expect(mockWindowOpen).not.toHaveBeenCalled();
        });
    });
});
