/**
 * Create/edit affordances for the metadata template browser.
 *
 * Retrieval endpoints return these only when the request includes
 * `fields=permissions`. A missing permissions object does not grant access.
 * Only the flag for the affordance is read: it must be exactly `true`.
 * Sibling flags are ignored, so a subset, a rename, or an extra flag cannot
 * hide a grant.
 */

function readPermissions(resource: unknown): unknown {
    if (!resource || typeof resource !== 'object') {
        return undefined;
    }

    return (resource as { permissions?: unknown }).permissions;
}

/** True only when the named flag is exactly `true`. */
function grantsPermission(permissions: unknown, flag: string): boolean {
    if (!permissions || typeof permissions !== 'object' || Array.isArray(permissions)) {
        return false;
    }

    return (permissions as Record<string, unknown>)[flag] === true;
}

/** True when `permissions.can_create_templates` allows creating a template under this namespace. */
export function canCreateTemplatesInNamespace(namespace: unknown): boolean {
    return grantsPermission(readPermissions(namespace), 'can_create_templates');
}

/** True when `permissions.can_update` allows editing this template. */
export function canEditMetadataTemplate(template: unknown): boolean {
    return grantsPermission(readPermissions(template), 'can_update');
}
