import * as React from 'react';
import { METADATA_SCOPE_ENTERPRISE } from '../../../constants';
import { FeatureProvider } from '../../common/feature-checking';
import { renderHook } from '../../../test-utils/testing-library';
import useMetadataNamespaceContext from '../hooks/useMetadataNamespaceContext';

describe('useMetadataNamespaceContext', () => {
    const enterpriseNumericId = '173733877';
    const enterpriseId = `${METADATA_SCOPE_ENTERPRISE}_${enterpriseNumericId}`;

    const renderContextHook = (
        features: Record<string, unknown> = {},
        options?: {
            metadataNamespaceMode?: 'SCOPED' | 'MIGRATION' | 'FINAL' | null;
            enterpriseId?: string | number;
        },
    ) =>
        renderHook(() => useMetadataNamespaceContext(options), {
            wrapper: ({ children }) => <FeatureProvider features={features}>{children}</FeatureProvider>,
        });

    test('should leave mode null when namespaces opt-in is off', () => {
        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': false });

        expect(result.current).toEqual({
            enterpriseId: undefined,
            metadataNamespaceMode: null,
            isTemplateManagementEnabled: false,
            isLoading: false,
        });
    });

    test('should ignore host mode and enterprise id when namespaces opt-in is off', () => {
        const { result } = renderContextHook(
            { 'metadata.namespacesOptIn.enabled': false },
            {
                metadataNamespaceMode: 'MIGRATION',
                enterpriseId,
            },
        );

        expect(result.current).toEqual({
            enterpriseId: undefined,
            metadataNamespaceMode: null,
            isTemplateManagementEnabled: false,
            isLoading: false,
        });
    });

    test('should resolve to SCOPED when opt-in is on and host omits mode', () => {
        const { result } = renderContextHook({ 'metadata.namespacesOptIn.enabled': true });

        expect(result.current).toEqual({
            enterpriseId: undefined,
            metadataNamespaceMode: 'SCOPED',
            isTemplateManagementEnabled: false,
            isLoading: false,
        });
    });

    test('should keep SCOPED when opt-in is on and host passes SCOPED', () => {
        const { result } = renderContextHook(
            { 'metadata.namespacesOptIn.enabled': true },
            {
                metadataNamespaceMode: 'SCOPED',
                enterpriseId,
            },
        );

        expect(result.current).toEqual({
            enterpriseId,
            metadataNamespaceMode: 'SCOPED',
            isTemplateManagementEnabled: false,
            isLoading: false,
        });
    });

    test('should use host-provided mode and enterprise id', () => {
        const { result } = renderContextHook(
            { 'metadata.namespacesOptIn.enabled': true },
            {
                metadataNamespaceMode: 'MIGRATION',
                enterpriseId,
            },
        );

        expect(result.current).toEqual({
            enterpriseId,
            metadataNamespaceMode: 'MIGRATION',
            isTemplateManagementEnabled: true,
            isLoading: false,
        });
    });

    test('should normalize a numeric host enterprise id to an FQN', () => {
        const { result } = renderContextHook(
            { 'metadata.namespacesOptIn.enabled': true },
            {
                metadataNamespaceMode: 'FINAL',
                enterpriseId: Number(enterpriseNumericId),
            },
        );

        expect(result.current.enterpriseId).toBe(enterpriseId);
        expect(result.current.isTemplateManagementEnabled).toBe(true);
        expect(result.current.metadataNamespaceMode).toBe('FINAL');
    });

    test('should leave enterprise id undefined when the host omits it', () => {
        const { result } = renderContextHook(
            { 'metadata.namespacesOptIn.enabled': true },
            {
                metadataNamespaceMode: 'FINAL',
            },
        );

        expect(result.current).toEqual({
            enterpriseId: undefined,
            metadataNamespaceMode: 'FINAL',
            isTemplateManagementEnabled: true,
            isLoading: false,
        });
    });

    test('should not treat host mode as resolved while it is still loading', () => {
        const { result } = renderContextHook(
            { 'metadata.namespacesOptIn.enabled': true },
            {
                metadataNamespaceMode: null,
                enterpriseId,
            },
        );

        expect(result.current).toEqual({
            enterpriseId,
            metadataNamespaceMode: null,
            isTemplateManagementEnabled: false,
            isLoading: true,
        });
    });
});
