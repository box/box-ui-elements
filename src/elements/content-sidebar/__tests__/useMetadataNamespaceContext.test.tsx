import * as React from 'react';
import { METADATA_SCOPE_ENTERPRISE } from '../../../constants';
import { FeatureProvider } from '../../common/feature-checking';
import { act, renderHook, waitFor } from '../../../test-utils/testing-library';
import useMetadataNamespaceContext from '../hooks/useMetadataNamespaceContext';

describe('useMetadataNamespaceContext', () => {
    const fileId = 'file-123';
    const enterpriseNumericId = '173733877';
    const enterpriseId = `${METADATA_SCOPE_ENTERPRISE}_${enterpriseNumericId}`;

    let getUser: jest.Mock;
    let getMetadataNamespaceMode: jest.Mock;
    let api: { getUsersAPI: jest.Mock; getMetadataAPI: jest.Mock };

    const renderContextHook = (features: Record<string, unknown> = {}, hookFileId = fileId) =>
        renderHook(() => useMetadataNamespaceContext(api as never, hookFileId), {
            wrapper: ({ children }) => <FeatureProvider features={features}>{children}</FeatureProvider>,
        });

    beforeEach(() => {
        getUser = jest.fn();
        getMetadataNamespaceMode = jest.fn().mockResolvedValue('SCOPED');
        api = {
            getUsersAPI: jest.fn().mockReturnValue({ getUser }),
            getMetadataAPI: jest.fn().mockReturnValue({ getMetadataNamespaceMode }),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should skip fetches and disable template management when namespaces opt-in is off', () => {
        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': false });

        expect(api.getUsersAPI).not.toHaveBeenCalled();
        expect(api.getMetadataAPI).not.toHaveBeenCalled();
        expect(result.current).toEqual({
            enterpriseId: undefined,
            metadataNamespaceMode: null,
            isTemplateManagementEnabled: false,
            isLoading: false,
        });
    });

    test('should resolve enterprise id and SCOPED mode without enabling template management', async () => {
        getUser.mockImplementation((_id, successCallback) => {
            successCallback({ enterprise: { id: enterpriseNumericId } });
        });
        getMetadataNamespaceMode.mockResolvedValue('SCOPED');

        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true });

        await waitFor(() => {
            expect(result.current.metadataNamespaceMode).toBe('SCOPED');
        });

        expect(getUser).toHaveBeenCalledWith(fileId, expect.any(Function), expect.any(Function), expect.any(Object));
        expect(getMetadataNamespaceMode).toHaveBeenCalledWith({ id: fileId }, enterpriseNumericId);
        expect(result.current).toEqual({
            enterpriseId,
            metadataNamespaceMode: 'SCOPED',
            isTemplateManagementEnabled: false,
            isLoading: false,
        });
    });

    test('should enable template management for MIGRATION mode', async () => {
        getUser.mockImplementation((_id, successCallback) => {
            successCallback({ enterprise: { id: enterpriseNumericId } });
        });
        getMetadataNamespaceMode.mockResolvedValue('MIGRATION');

        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true });

        await waitFor(() => {
            expect(result.current).toEqual({
                enterpriseId,
                metadataNamespaceMode: 'MIGRATION',
                isTemplateManagementEnabled: true,
                isLoading: false,
            });
        });
    });

    test('should enable template management for FINAL mode', async () => {
        getUser.mockImplementation((_id, successCallback) => {
            successCallback({ enterprise: { id: enterpriseNumericId } });
        });
        getMetadataNamespaceMode.mockResolvedValue('FINAL');

        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true });

        await waitFor(() => {
            expect(result.current.isTemplateManagementEnabled).toBe(true);
            expect(result.current.metadataNamespaceMode).toBe('FINAL');
        });
    });

    test('should not fetch namespace mode until enterprise id is available', async () => {
        let resolveUser: (user: { enterprise: { id: string } }) => void = () => undefined;
        getUser.mockImplementation((_id, successCallback) => {
            resolveUser = successCallback;
        });

        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true });

        expect(api.getMetadataAPI).not.toHaveBeenCalled();
        expect(result.current.enterpriseId).toBeUndefined();
        expect(result.current.isTemplateManagementEnabled).toBe(false);

        await act(async () => {
            resolveUser({ enterprise: { id: enterpriseNumericId } });
        });

        await waitFor(() => {
            expect(getMetadataNamespaceMode).toHaveBeenCalledWith({ id: fileId }, enterpriseNumericId);
        });
    });
});
