import { useMemo } from 'react';
import API from '../../../api';
import { METADATA_SCOPE_MODE_SCOPED } from '../../../constants';
import { useFeatureEnabled } from '../../common/feature-checking';
import useCurrentUserEnterpriseId from './useCurrentUserEnterpriseId';
import useMetadataNamespaceMode, { type MetadataScopeMode } from './useMetadataNamespaceMode';

export interface MetadataNamespaceContext {
    /** Enterprise root FQN (e.g. `enterprise_123`), or `undefined` while loading / unavailable. */
    enterpriseId: string | undefined;
    /** Migration mode from enterprise configurations, or `null` while loading / unavailable. */
    metadataNamespaceMode: MetadataScopeMode | null;
    /** True when mode is known and not SCOPED (template browser / management UI). */
    isTemplateManagementEnabled: boolean;
    /** True while the enterprise-configurations request is in flight. */
    isLoading: boolean;
}

/**
 * Resolves enterprise root namespace + migration mode for the metadata sidebar.
 *
 * Uses `fileId` only (does not wait on the file GET from `useSidebarMetadataFetcher`)
 * so `getMetadata` can receive the authoritative enterprise FQN in MIGRATION/FINAL.
 *
 * When `metadata.namespacesOptIn.enabled` is off, skips network calls and returns
 * the legacy SCOPED-equivalent UI state (`mode: null`, management disabled).
 */
export default function useMetadataNamespaceContext(api: API, fileId: string): MetadataNamespaceContext {
    const isNamespacesOptInEnabled = useFeatureEnabled('metadata.namespacesOptIn.enabled');
    const enterpriseFile = useMemo(() => (fileId ? { id: fileId } : null), [fileId]);

    const { enterpriseId, enterpriseNumericId } = useCurrentUserEnterpriseId(
        api,
        enterpriseFile,
        isNamespacesOptInEnabled,
    );
    const { mode: metadataNamespaceMode, isLoading } = useMetadataNamespaceMode(
        enterpriseFile,
        api,
        enterpriseNumericId,
        isNamespacesOptInEnabled,
    );

    const isTemplateManagementEnabled = !!metadataNamespaceMode && metadataNamespaceMode !== METADATA_SCOPE_MODE_SCOPED;

    return {
        enterpriseId,
        metadataNamespaceMode,
        isTemplateManagementEnabled,
        isLoading,
    };
}
