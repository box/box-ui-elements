/**
 * Create/edit affordances for the metadata template browser.
 *
 * Retrieval endpoints return these only when the request includes
 * `fields=permissions`. A missing or null object stays unknown and does not
 * grant access. A present object must carry every documented boolean; anything
 * else, including a null flag, is an explicit deny. This matches the
 * metadata-ui-client permission adapter.
 */

const TEMPLATE_PERMISSION_KEYS = [
    'can_read',
    'can_update',
    'can_delete',
    'can_view_permissions',
    'can_manage_permissions',
] as const;

const NAMESPACE_PERMISSION_KEYS = [
    ...TEMPLATE_PERMISSION_KEYS,
    'can_create_namespaces',
    'can_create_templates',
] as const;

function readPermissions(resource: unknown): unknown {
    if (!resource || typeof resource !== 'object') {
        return undefined;
    }

    return (resource as { permissions?: unknown }).permissions;
}

/** True only when every documented flag is a boolean and the named flag is true. */
function grantsPermission(permissions: unknown, keys: readonly string[], flag: string): boolean {
    if (permissions === undefined || permissions === null) {
        return false;
    }
    if (typeof permissions !== 'object' || Array.isArray(permissions)) {
        return false;
    }

    const values = permissions as Record<string, unknown>;
    if (keys.some(key => typeof values[key] !== 'boolean')) {
        return false;
    }

    return values[flag] === true;
}

/** True when `permissions.can_create_templates` allows creating a template under this namespace. */
export function canCreateTemplatesInNamespace(namespace: unknown): boolean {
    return grantsPermission(readPermissions(namespace), NAMESPACE_PERMISSION_KEYS, 'can_create_templates');
}

/** True when `permissions.can_update` allows editing this template. */
export function canEditMetadataTemplate(template: unknown): boolean {
    return grantsPermission(readPermissions(template), TEMPLATE_PERMISSION_KEYS, 'can_update');
}
