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

export interface MetadataNamespaceContextOptions {
    /**
     * Optional host-provided migration mode. When provided, skips
     * GET /enterprise_configurations.
     */
    metadataNamespaceMode?: MetadataScopeMode | null;
    /**
     * Optional host-provided enterprise id (numeric, numeric string, or
     * `enterprise_<id>` FQN). When provided, skips GET /users/me.
     */
    enterpriseId?: string | number;
}

/**
 * Resolves enterprise root namespace + migration mode for the metadata sidebar.
 *
 * Hosts may pass `metadataNamespaceMode` and `enterpriseId` to skip
 * `/users/me` and `GET /enterprise_configurations`. When those props are
 * omitted, this hook fetches them using the host token.
 *
 * When opt-in is off, skips network calls and returns the legacy
 * SCOPED-equivalent UI state (`mode: null`, management disabled).
 */
export default function useMetadataNamespaceContext(
    api: API,
    fileId: string,
    options: MetadataNamespaceContextOptions = {},
): MetadataNamespaceContext {
    const isNamespacesOptInEnabled = useFeatureEnabled('metadata.namespacesOptIn.enabled');
    const hasModeOverride = Object.prototype.hasOwnProperty.call(options, 'metadataNamespaceMode');
    const modeOverride = options.metadataNamespaceMode;
    const enterpriseIdOverride = options.enterpriseId;
    const enterpriseFile = useMemo(() => (fileId ? { id: fileId } : null), [fileId]);

    const { enterpriseId, enterpriseNumericId } = useCurrentUserEnterpriseId(
        api,
        enterpriseFile,
        isNamespacesOptInEnabled && !enterpriseIdOverride,
        enterpriseIdOverride,
    );
    const { mode: fetchedMode, isLoading } = useMetadataNamespaceMode(
        enterpriseFile,
        api,
        enterpriseNumericId,
        isNamespacesOptInEnabled && !hasModeOverride,
    );

    const metadataNamespaceMode = hasModeOverride ? modeOverride ?? null : fetchedMode;
    const isTemplateManagementEnabled = !!metadataNamespaceMode && metadataNamespaceMode !== METADATA_SCOPE_MODE_SCOPED;

    return {
        enterpriseId,
        metadataNamespaceMode,
        isTemplateManagementEnabled,
        isLoading: hasModeOverride ? modeOverride == null : isLoading,
    };
}
