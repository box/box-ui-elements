import { FIELD_ENTERPRISE, METADATA_SCOPE_ENTERPRISE } from '../../../constants';
import { renderHook, waitFor } from '../../../test-utils/testing-library';
import useCurrentUserEnterpriseId from '../hooks/useCurrentUserEnterpriseId';

describe('useCurrentUserEnterpriseId', () => {
    const mockFile = { id: 'file-123' };
    const enterpriseNumericId = '173733877';

    let getUser: jest.Mock;
    let api: { getUsersAPI: jest.Mock };

    beforeEach(() => {
        getUser = jest.fn();
        api = {
            getUsersAPI: jest.fn().mockReturnValue({ getUser }),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return undefined ids before the user request resolves', () => {
        const { result } = renderHook(() => useCurrentUserEnterpriseId(api as never, mockFile, true));

        expect(result.current).toEqual({
            enterpriseId: undefined,
            enterpriseNumericId: undefined,
        });
    });

    test('should skip the user fetch when isEnabled is false', () => {
        renderHook(() => useCurrentUserEnterpriseId(api as never, mockFile, false));

        expect(api.getUsersAPI).not.toHaveBeenCalled();
        expect(getUser).not.toHaveBeenCalled();
    });

    test('should skip the user fetch when file is null', () => {
        renderHook(() => useCurrentUserEnterpriseId(api as never, null, true));

        expect(api.getUsersAPI).not.toHaveBeenCalled();
        expect(getUser).not.toHaveBeenCalled();
    });

    test('should fetch the current user with the enterprise field and return FQN ids', async () => {
        getUser.mockImplementation((_id, successCallback) => {
            successCallback({ enterprise: { id: enterpriseNumericId } });
        });

        const { result } = renderHook(() => useCurrentUserEnterpriseId(api as never, mockFile, true));

        expect(api.getUsersAPI).toHaveBeenCalledWith(false);
        expect(getUser).toHaveBeenCalledWith(mockFile.id, expect.any(Function), expect.any(Function), {
            params: {
                fields: FIELD_ENTERPRISE,
            },
        });

        await waitFor(() => {
            expect(result.current).toEqual({
                enterpriseId: `${METADATA_SCOPE_ENTERPRISE}_${enterpriseNumericId}`,
                enterpriseNumericId,
            });
        });
    });

    test('should return undefined ids when the user has no enterprise', async () => {
        getUser.mockImplementation((_id, successCallback) => {
            successCallback({ id: 'user-1' });
        });

        const { result } = renderHook(() => useCurrentUserEnterpriseId(api as never, mockFile, true));

        await waitFor(() => {
            expect(getUser).toHaveBeenCalled();
        });

        expect(result.current).toEqual({
            enterpriseId: undefined,
            enterpriseNumericId: undefined,
        });
    });

    test('should return undefined ids when the user request fails', async () => {
        getUser.mockImplementation((_id, _successCallback, errorCallback) => {
            errorCallback(new Error('failed'));
        });

        const { result } = renderHook(() => useCurrentUserEnterpriseId(api as never, mockFile, true));

        await waitFor(() => {
            expect(getUser).toHaveBeenCalled();
        });

        expect(result.current).toEqual({
            enterpriseId: undefined,
            enterpriseNumericId: undefined,
        });
    });

    test('should clear ids when isEnabled becomes false after a successful fetch', async () => {
        getUser.mockImplementation((_id, successCallback) => {
            successCallback({ enterprise: { id: enterpriseNumericId } });
        });

        const { result, rerender } = renderHook(
            ({ isEnabled }) => useCurrentUserEnterpriseId(api as never, mockFile, isEnabled),
            { initialProps: { isEnabled: true } },
        );

        await waitFor(() => {
            expect(result.current.enterpriseNumericId).toBe(enterpriseNumericId);
        });

        rerender({ isEnabled: false });

        await waitFor(() => {
            expect(result.current).toEqual({
                enterpriseId: undefined,
                enterpriseNumericId: undefined,
            });
        });
        expect(getUser).toHaveBeenCalledTimes(1);
    });

    test('should ignore a stale success callback after unmount', async () => {
        let successCallback: ((user: { enterprise?: { id: string } }) => void) | undefined;
        getUser.mockImplementation((_id, onSuccess) => {
            successCallback = onSuccess;
        });

        const { result, unmount } = renderHook(() => useCurrentUserEnterpriseId(api as never, mockFile, true));

        unmount();
        successCallback?.({ enterprise: { id: enterpriseNumericId } });

        expect(result.current).toEqual({
            enterpriseId: undefined,
            enterpriseNumericId: undefined,
        });
    });
});
