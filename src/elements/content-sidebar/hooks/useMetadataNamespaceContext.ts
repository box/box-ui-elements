import { METADATA_SCOPE_ENTERPRISE, METADATA_SCOPE_MODE_SCOPED } from '../../../constants';
import { useFeatureEnabled } from '../../common/feature-checking';

/** Mirrors the METADATA_SCOPE_MODE_* constants from constants.js as a strict union. */
export type MetadataScopeMode = 'SCOPED' | 'MIGRATION' | 'FINAL';

export interface MetadataNamespaceContext {
    /** Enterprise root FQN (e.g. `enterprise_123`), or `undefined` when opt-in is off / host omitted it. */
    enterpriseId: string | undefined;
    /**
     * Resolved migration mode.
     * `null` when opt-in is off or flags are still loading.
     * `SCOPED` when opted in but nothing is enabled / the host omitted mode.
     */
    metadataNamespaceMode: MetadataScopeMode | null;
    /** True when mode is known and not SCOPED (template browser / management UI). */
    isTemplateManagementEnabled: boolean;
    /** True while opt-in is on and the host has passed `metadataNamespaceMode: null`. */
    isLoading: boolean;
}

export interface MetadataNamespaceContextOptions {
    /**
     * Host-provided migration mode. BUIE does not fetch enterprise-configuration
     * flags. Ignored when `metadata.namespacesOptIn` is off. Omitting this
     * (with opt-in on) resolves to `SCOPED`.
     */
    metadataNamespaceMode?: MetadataScopeMode | null;
    /**
     * Host-provided enterprise id (numeric, numeric string, or `enterprise_<id>` FQN).
     * Required for MIGRATION/FINAL template management. Hosts own this value;
     * BUIE does not fetch `/users/me`.
     */
    enterpriseId?: string | number;
}

function toEnterpriseFqn(hostEnterpriseId?: string | number): string | undefined {
    if (hostEnterpriseId == null || hostEnterpriseId === '') {
        return undefined;
    }
    const value = String(hostEnterpriseId);
    if (value.startsWith(`${METADATA_SCOPE_ENTERPRISE}_`)) {
        return value.slice(METADATA_SCOPE_ENTERPRISE.length + 1) ? value : undefined;
    }
    return `${METADATA_SCOPE_ENTERPRISE}_${value}`;
}

/**
 * Resolves enterprise root namespace + migration mode for the metadata sidebar.
 *
 * Opt-in takes precedence. When `metadata.namespacesOptIn` is off, host mode
 * and enterprise id are ignored (`metadataNamespaceMode: null`, management off).
 *
 * When opt-in is on, hosts pass `metadataNamespaceMode` and `enterpriseId`.
 * Omitting mode, or passing `SCOPED`, is the opted-in legacy path.
 */
export default function useMetadataNamespaceContext(
    options: MetadataNamespaceContextOptions = {},
): MetadataNamespaceContext {
    const isNamespacesOptInEnabled = useFeatureEnabled('metadata.namespacesOptIn.enabled');
    const hasModeOverride = Object.prototype.hasOwnProperty.call(options, 'metadataNamespaceMode');
    const modeOverride = options.metadataNamespaceMode;

    if (!isNamespacesOptInEnabled) {
        return {
            enterpriseId: undefined,
            metadataNamespaceMode: null,
            isTemplateManagementEnabled: false,
            isLoading: false,
        };
    }

    const isLoading = hasModeOverride && modeOverride == null;
    const metadataNamespaceMode = isLoading ? null : modeOverride ?? METADATA_SCOPE_MODE_SCOPED;
    const isTemplateManagementEnabled = !!metadataNamespaceMode && metadataNamespaceMode !== METADATA_SCOPE_MODE_SCOPED;

    return {
        enterpriseId: toEnterpriseFqn(options.enterpriseId),
        metadataNamespaceMode,
        isTemplateManagementEnabled,
        isLoading,
    };
}
