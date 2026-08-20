import { useMemo } from 'react';
import API from '../../../api';
import { METADATA_SCOPE_MODE_SCOPED } from '../../../constants';
import { useFeatureEnabled } from '../../common/feature-checking';
import useCurrentUserEnterpriseId from './useCurrentUserEnterpriseId';
import { type MetadataScopeMode } from './useMetadataNamespaceMode';

export interface MetadataNamespaceContext {
    /** Enterprise root FQN (e.g. `enterprise_123`), or `undefined` while loading / unavailable. */
    enterpriseId: string | undefined;
    /** Host-provided migration mode, or `null` while loading / when opt-in is off. */
    metadataNamespaceMode: MetadataScopeMode | null;
    /** True when mode is known and not SCOPED (template browser / management UI). */
    isTemplateManagementEnabled: boolean;
    /** True while the host has passed `metadataNamespaceMode: null` (flags still loading). */
    isLoading: boolean;
}

export interface MetadataNamespaceContextOptions {
    /**
     * Host-provided migration mode. BUIE does not fetch enterprise-configuration
     * flags; omitting this keeps the sidebar in SCOPED-equivalent UI.
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
 * Hosts pass `metadataNamespaceMode` (from GraphQL enterprise-configuration
 * flags) and optionally `enterpriseId`. When mode is omitted, this hook does
 * not call the network for flags — it stays in SCOPED-equivalent UI.
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

    const { enterpriseId } = useCurrentUserEnterpriseId(
        api,
        enterpriseFile,
        isNamespacesOptInEnabled && !enterpriseIdOverride,
        enterpriseIdOverride,
    );

    if (!isNamespacesOptInEnabled) {
        return {
            enterpriseId: undefined,
            metadataNamespaceMode: null,
            isTemplateManagementEnabled: false,
            isLoading: false,
        };
    }

    const metadataNamespaceMode = hasModeOverride ? modeOverride ?? null : null;
    const isTemplateManagementEnabled = !!metadataNamespaceMode && metadataNamespaceMode !== METADATA_SCOPE_MODE_SCOPED;

    return {
        enterpriseId,
        metadataNamespaceMode,
        isTemplateManagementEnabled,
        isLoading: hasModeOverride && modeOverride == null,
    };
}
