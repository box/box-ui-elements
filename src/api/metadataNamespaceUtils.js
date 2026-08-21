/**
 * @flow
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
function getEnterpriseRoot(value: ?string): string | null {
    if (!value || !value.startsWith(ENTERPRISE_FQN_PREFIX)) {
        return null;
    }
    const root = value.split('.')[0];
    return root.length > ENTERPRISE_FQN_PREFIX.length ? root : null;
}

export function getEnterpriseRootFromScopeOrNamespace(scope: ?string, namespace: ?string): string | null {
    return getEnterpriseRoot(scope) || getEnterpriseRoot(namespace);
}

/**
 * Extracts the enterprise root namespace FQN from a list of metadata instances.
 * Prefers `$scope`, then the leading segment of `$namespace`.
 */
export function getEnterpriseNamespaceFromInstances(
    instances: Array<{ $namespace?: ?string, $scope?: ?string }>,
): string | null {
    for (const inst of instances) {
        const root = getEnterpriseRootFromScopeOrNamespace(inst.$scope, inst.$namespace);
        if (root) {
            return root;
        }
    }
    return null;
}

/**
 * Resolves the URL path segment for a scope/namespace given the current mode.
 *
 * - In FINAL mode, legacy `global` becomes `box.metadata`.
 * - When scope is absent, the namespace FQN is used.
 */
export function resolveScopeOrNamespace(metadataNamespaceMode: string, scope: ?string, namespace?: ?string): string {
    if (metadataNamespaceMode === METADATA_SCOPE_MODE_FINAL && scope === METADATA_SCOPE_GLOBAL) {
        return METADATA_NAMESPACE_GLOBAL;
    }
    if (!scope && namespace) {
        return namespace;
    }
    return scope || '';
}

/**
 * Whether a missing local template should be treated as externally owned.
 *
 * When the viewer's enterprise FQN is known, compare enterprise roots.
 * Without it, preserve legacy behaviour: a scoped miss is cross-enterprise;
 * a namespace-only miss is treated as same-enterprise (child namespace).
 */
export function isTemplateExternallyOwned(
    instanceEnterpriseRoot: string,
    viewerEnterpriseFqn: ?string,
    hasEnterpriseScope: boolean,
): boolean {
    if (viewerEnterpriseFqn) {
        return instanceEnterpriseRoot !== viewerEnterpriseFqn;
    }
    return hasEnterpriseScope;
}
