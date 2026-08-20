/**
 * @flow
 * @file Pure helpers for metadata namespace migration (SCOPED / MIGRATION / FINAL).
 * Keep I/O out of this file — Metadata.js / MetadataNamespaces.js own network calls.
 */

import {
    METADATA_NAMESPACE_FINAL_CONFIG_FLAG,
    METADATA_NAMESPACE_FINAL_FIELD,
    METADATA_NAMESPACE_GLOBAL,
    METADATA_NAMESPACE_MIGRATION_CONFIG_FLAG,
    METADATA_NAMESPACE_MIGRATION_FIELD,
    METADATA_SCOPE_ENTERPRISE,
    METADATA_SCOPE_GLOBAL,
    METADATA_SCOPE_MODE_FINAL,
    METADATA_SCOPE_MODE_MIGRATION,
    METADATA_SCOPE_MODE_SCOPED,
} from '../constants';
import type { MetadataInstanceV2 } from '../common/types/metadata';

/**
 * Resolves the enterprise root FQN (`enterprise_123`) from a scope and/or
 * namespace value. Child namespaces like `enterprise_123.legal` resolve to
 * `enterprise_123`.
 */
export function getEnterpriseRootFromScopeOrNamespace(scope: ?string, namespace: ?string): string | null {
    if (scope && scope.startsWith(METADATA_SCOPE_ENTERPRISE)) {
        return scope;
    }
    if (namespace && namespace.startsWith(METADATA_SCOPE_ENTERPRISE)) {
        return namespace.split('.')[0];
    }
    return null;
}

/**
 * Extracts the enterprise root namespace FQN from a list of metadata instances.
 * Prefers `$scope`, then the leading segment of `$namespace`.
 */
export function getEnterpriseNamespaceFromInstances(instances: Array<MetadataInstanceV2>): string | null {
    for (const inst of instances) {
        const root = getEnterpriseRootFromScopeOrNamespace(inst.$scope, inst.$namespace);
        if (root) {
            return root;
        }
    }
    return null;
}

/**
 * Maps enterprise_configurations content_and_sharing flags to a migration mode.
 */
export function resolveMetadataNamespaceMode(isMigration: boolean, isFinal: boolean): string {
    if (isFinal) return METADATA_SCOPE_MODE_FINAL;
    if (isMigration) return METADATA_SCOPE_MODE_MIGRATION;
    return METADATA_SCOPE_MODE_SCOPED;
}

function configFlagValue(flags: mixed, name: string): boolean {
    if (!Array.isArray(flags)) {
        return false;
    }
    const match = flags.find(flag => flag && flag.name === name);
    return !!(match && match.value);
}

/**
 * Reads SCOPED/MIGRATION/FINAL booleans from a content_and_sharing payload.
 * Supports nested `{ field: { value } }` and `configFlags` array payloads.
 */
export function getMetadataNamespaceFlagsFromContentAndSharing(contentAndSharing: ?Object): {
    isFinal: boolean,
    isMigration: boolean,
} {
    const payload = contentAndSharing || {};
    const flags = payload.configFlags || payload.config_flags;
    return {
        isMigration:
            !!payload[METADATA_NAMESPACE_MIGRATION_FIELD]?.value ||
            configFlagValue(flags, METADATA_NAMESPACE_MIGRATION_CONFIG_FLAG) ||
            configFlagValue(flags, METADATA_NAMESPACE_MIGRATION_FIELD),
        isFinal:
            !!payload[METADATA_NAMESPACE_FINAL_FIELD]?.value ||
            configFlagValue(flags, METADATA_NAMESPACE_FINAL_CONFIG_FLAG) ||
            configFlagValue(flags, METADATA_NAMESPACE_FINAL_FIELD),
    };
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
