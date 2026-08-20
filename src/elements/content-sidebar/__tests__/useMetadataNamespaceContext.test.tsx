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

    const renderContextHook = (
        features: Record<string, unknown> = {},
        hookFileId = fileId,
        options?: {
            metadataNamespaceMode?: 'SCOPED' | 'MIGRATION' | 'FINAL' | null;
            enterpriseId?: string | number;
        },
    ) =>
        renderHook(() => useMetadataNamespaceContext(api as never, hookFileId, options), {
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

    test('should use option-provided mode and enterprise id without fetching', () => {
        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true }, fileId, {
            metadataNamespaceMode: 'MIGRATION',
            enterpriseId,
        });

        expect(api.getUsersAPI).not.toHaveBeenCalled();
        expect(getMetadataNamespaceMode).not.toHaveBeenCalled();
        expect(result.current).toEqual({
            enterpriseId,
            metadataNamespaceMode: 'MIGRATION',
            isTemplateManagementEnabled: true,
            isLoading: false,
        });
    });

    test('should not fetch enterprise_configurations while the option mode is still loading', () => {
        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true }, fileId, {
            metadataNamespaceMode: null,
            enterpriseId,
        });

        expect(getMetadataNamespaceMode).not.toHaveBeenCalled();
        expect(result.current).toEqual({
            enterpriseId,
            metadataNamespaceMode: null,
            isTemplateManagementEnabled: false,
            isLoading: true,
        });
    });

    test('should skip enterprise_configurations when options provide mode only', async () => {
        getUser.mockImplementation((_id, successCallback) => {
            successCallback({ enterprise: { id: enterpriseNumericId } });
        });

        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true }, fileId, {
            metadataNamespaceMode: 'FINAL',
        });

        await waitFor(() => {
            expect(result.current.enterpriseId).toBe(enterpriseId);
        });

        expect(getMetadataNamespaceMode).not.toHaveBeenCalled();
        expect(result.current.metadataNamespaceMode).toBe('FINAL');
        expect(result.current.isTemplateManagementEnabled).toBe(true);
    });
});
