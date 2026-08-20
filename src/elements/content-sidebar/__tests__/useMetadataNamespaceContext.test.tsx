import * as React from 'react';
import { METADATA_SCOPE_ENTERPRISE } from '../../../constants';
import { FeatureProvider } from '../../common/feature-checking';
import { renderHook, waitFor } from '../../../test-utils/testing-library';
import useMetadataNamespaceContext from '../hooks/useMetadataNamespaceContext';

describe('useMetadataNamespaceContext', () => {
    const fileId = 'file-123';
    const enterpriseNumericId = '173733877';
    const enterpriseId = `${METADATA_SCOPE_ENTERPRISE}_${enterpriseNumericId}`;

    let getUser: jest.Mock;
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
        api = {
            getUsersAPI: jest.fn().mockReturnValue({ getUser }),
            getMetadataAPI: jest.fn(),
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

    test('should stay SCOPED-equivalent without fetching flags when opt-in is on and host omits mode', async () => {
        getUser.mockImplementation((_id, successCallback) => {
            successCallback({ enterprise: { id: enterpriseNumericId } });
        });

        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true });

        await waitFor(() => {
            expect(result.current.enterpriseId).toBe(enterpriseId);
        });

        expect(getUser).toHaveBeenCalledWith(fileId, expect.any(Function), expect.any(Function), expect.any(Object));
        expect(api.getMetadataAPI).not.toHaveBeenCalled();
        expect(result.current).toEqual({
            enterpriseId,
            metadataNamespaceMode: null,
            isTemplateManagementEnabled: false,
            isLoading: false,
        });
    });

    test('should use option-provided mode and enterprise id without fetching', () => {
        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true }, fileId, {
            metadataNamespaceMode: 'MIGRATION',
            enterpriseId,
        });

        expect(api.getUsersAPI).not.toHaveBeenCalled();
        expect(api.getMetadataAPI).not.toHaveBeenCalled();
        expect(result.current).toEqual({
            enterpriseId,
            metadataNamespaceMode: 'MIGRATION',
            isTemplateManagementEnabled: true,
            isLoading: false,
        });
    });

    test('should enable template management for host-provided FINAL mode', () => {
        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true }, fileId, {
            metadataNamespaceMode: 'FINAL',
            enterpriseId,
        });

        expect(result.current.isTemplateManagementEnabled).toBe(true);
        expect(result.current.metadataNamespaceMode).toBe('FINAL');
    });

    test('should not fetch flags while the host mode is still loading', () => {
        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true }, fileId, {
            metadataNamespaceMode: null,
            enterpriseId,
        });

        expect(api.getMetadataAPI).not.toHaveBeenCalled();
        expect(result.current).toEqual({
            enterpriseId,
            metadataNamespaceMode: null,
            isTemplateManagementEnabled: false,
            isLoading: true,
        });
    });

    test('should skip flag fetches when options provide mode only', async () => {
        getUser.mockImplementation((_id, successCallback) => {
            successCallback({ enterprise: { id: enterpriseNumericId } });
        });

        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true }, fileId, {
            metadataNamespaceMode: 'FINAL',
        });

        await waitFor(() => {
            expect(result.current.enterpriseId).toBe(enterpriseId);
        });

        expect(api.getMetadataAPI).not.toHaveBeenCalled();
        expect(result.current.metadataNamespaceMode).toBe('FINAL');
        expect(result.current.isTemplateManagementEnabled).toBe(true);
    });
});
