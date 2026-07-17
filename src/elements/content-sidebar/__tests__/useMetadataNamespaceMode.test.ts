import { renderHook, waitFor } from '../../../test-utils/testing-library';
import useMetadataNamespaceMode from '../hooks/useMetadataNamespaceMode';

describe('useMetadataNamespaceMode', () => {
    const mockFile = { id: 'file-123' };
    const enterpriseNumericId = '173733877';

    let getMetadataNamespaceMode: jest.Mock;
    let api: { getMetadataAPI: jest.Mock };

    beforeEach(() => {
        getMetadataNamespaceMode = jest.fn().mockResolvedValue('SCOPED');
        api = {
            getMetadataAPI: jest.fn().mockReturnValue({ getMetadataNamespaceMode }),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should skip the fetch and return null mode when isEnabled is false', () => {
        const { result } = renderHook(() =>
            useMetadataNamespaceMode(mockFile as never, api as never, enterpriseNumericId, false),
        );

        expect(api.getMetadataAPI).not.toHaveBeenCalled();
        expect(result.current).toEqual({ mode: null, isLoading: false });
    });

    test('should skip the fetch when enterpriseNumericId is undefined', () => {
        const { result } = renderHook(() => useMetadataNamespaceMode(mockFile as never, api as never, undefined, true));

        expect(api.getMetadataAPI).not.toHaveBeenCalled();
        expect(result.current).toEqual({ mode: null, isLoading: false });
    });

    test('should skip the fetch when file is missing', () => {
        const { result } = renderHook(() =>
            useMetadataNamespaceMode(null as never, api as never, enterpriseNumericId, true),
        );

        expect(api.getMetadataAPI).not.toHaveBeenCalled();
        expect(result.current).toEqual({ mode: null, isLoading: false });
    });

    test('should fetch namespace mode and expose loading then success state', async () => {
        let resolveMode: (mode: string) => void = () => undefined;
        getMetadataNamespaceMode.mockReturnValue(
            new Promise(resolve => {
                resolveMode = resolve;
            }),
        );

        const { result } = renderHook(() =>
            useMetadataNamespaceMode(mockFile as never, api as never, enterpriseNumericId, true),
        );

        expect(result.current.isLoading).toBe(true);
        expect(result.current.mode).toBeNull();
        expect(api.getMetadataAPI).toHaveBeenCalledWith(false);
        expect(getMetadataNamespaceMode).toHaveBeenCalledWith(mockFile, enterpriseNumericId);

        resolveMode('MIGRATION');

        await waitFor(() => {
            expect(result.current).toEqual({ mode: 'MIGRATION', isLoading: false });
        });
    });

    test('should clear mode when isEnabled becomes false', async () => {
        getMetadataNamespaceMode.mockResolvedValue('FINAL');

        const { result, rerender } = renderHook(
            ({ isEnabled }) =>
                useMetadataNamespaceMode(mockFile as never, api as never, enterpriseNumericId, isEnabled),
            { initialProps: { isEnabled: true } },
        );

        await waitFor(() => {
            expect(result.current.mode).toBe('FINAL');
        });

        rerender({ isEnabled: false });

        await waitFor(() => {
            expect(result.current).toEqual({ mode: null, isLoading: false });
        });
    });

    test('should ignore a stale response after unmount', async () => {
        let resolveMode: (mode: string) => void = () => undefined;
        getMetadataNamespaceMode.mockReturnValue(
            new Promise(resolve => {
                resolveMode = resolve;
            }),
        );

        const { result, unmount } = renderHook(() =>
            useMetadataNamespaceMode(mockFile as never, api as never, enterpriseNumericId, true),
        );

        unmount();
        resolveMode('MIGRATION');

        // Allow any lingering microtasks to flush without updating unmounted state.
        await Promise.resolve();

        expect(result.current).toEqual({ mode: null, isLoading: true });
    });
});
