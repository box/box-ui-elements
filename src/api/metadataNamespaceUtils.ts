/**
 * @file Pure helpers for metadata namespace migration (SCOPED / MIGRATION / FINAL).
 * Keep I/O out of this file — Metadata.js / MetadataNamespaces.js own network calls.
 */

import {
    METADATA_NAMESPACE_GLOBAL,
    METADATA_SCOPE_ENTERPRISE,
    METADATA_SCOPE_GLOBAL,
    METADATA_SCOPE_MODE_FINAL,
} from '../constants';

const ENTERPRISE_FQN_PREFIX = `${METADATA_SCOPE_ENTERPRISE}_`;

/**
 * Enterprise root FQN (`enterprise_123`) from a scope or namespace value.
 * The scoped shorthand `enterprise` is not an FQN and is ignored so it does
 * not fail to match a viewer FQN like `enterprise_123`.
 * Child namespaces like `enterprise_123.legal` resolve to `enterprise_123`.
 */
const getEnterpriseRoot = (value: string | null | undefined): string | null => {
    if (!value || !value.startsWith(ENTERPRISE_FQN_PREFIX)) {
        return null;
    }
    const root = value.split('.')[0];
    return root.length > ENTERPRISE_FQN_PREFIX.length ? root : null;
};

export const getEnterpriseRootFromScopeOrNamespace = (
    scope: string | null | undefined,
    namespace: string | null | undefined,
): string | null => getEnterpriseRoot(scope) || getEnterpriseRoot(namespace);

/**
 * Extracts the enterprise root namespace FQN from a list of metadata instances.
 * Prefers `$scope`, then the leading segment of `$namespace`.
 */
export const getEnterpriseNamespaceFromInstances = (
    instances: ReadonlyArray<{ readonly $namespace?: string | null; readonly $scope?: string | null }>,
): string | null => {
    for (const inst of instances) {
        const root = getEnterpriseRootFromScopeOrNamespace(inst.$scope, inst.$namespace);
        if (root) {
            return root;
        }
    }
    return null;
};

/**
 * `global` and `box.metadata` name the same Box-owned template home.
 * Comparison only — request paths still go through `resolveScopeOrNamespace`.
 */
const isBoxOwnedMetadataHome = (value: string | null | undefined): boolean =>
    value === METADATA_SCOPE_GLOBAL || value === METADATA_NAMESPACE_GLOBAL;

/**
 * Stable identity for matching a template to an instance.
 *
 * Namespace wins when it names a real FQN. A scope-only `global` and a
 * namespace-only `box.metadata` compare as the same home, so a file that still
 * carries a legacy global instance matches templates listed from `box.metadata`
 * without a second fetch of `/metadata_templates/global`.
 */
export const canonicalMetadataHome = (
    scope: string | null | undefined,
    namespace: string | null | undefined,
): string | null => {
    if (namespace && !isBoxOwnedMetadataHome(namespace)) {
        return namespace;
    }
    if (isBoxOwnedMetadataHome(namespace) || isBoxOwnedMetadataHome(scope)) {
        return METADATA_NAMESPACE_GLOBAL;
    }
    return namespace || scope || null;
};

/**
 * Resolves the URL path segment for a scope/namespace given the current mode.
 *
 * - In FINAL mode, legacy `global` becomes `box.metadata`.
 * - When scope is absent, the namespace FQN is used.
 */
export const resolveScopeOrNamespace = (
    metadataNamespaceMode: string,
    scope: string | null | undefined,
    namespace?: string | null,
): string => {
    if (metadataNamespaceMode === METADATA_SCOPE_MODE_FINAL && scope === METADATA_SCOPE_GLOBAL) {
        return METADATA_NAMESPACE_GLOBAL;
    }
    if (!scope && namespace) {
        return namespace;
    }
    return scope || '';
};

/**
 * Whether a missing local template should be treated as externally owned.
 *
 * When the viewer's enterprise FQN is known, compare enterprise roots.
 * Without it, preserve legacy behaviour: a scoped miss is cross-enterprise;
 * a namespace-only miss is treated as same-enterprise (child namespace).
 */
export const isTemplateExternallyOwned = (
    instanceEnterpriseRoot: string,
    viewerEnterpriseFqn: string | null | undefined,
    hasEnterpriseScope: boolean,
): boolean => {
    if (viewerEnterpriseFqn) {
        return instanceEnterpriseRoot !== viewerEnterpriseFqn;
    }
    return hasEnterpriseScope;
};
