/**
 * Runtime shape for metadata templates/instances during the scope → namespace
 * migration. `@box/metadata-editor` types still only declare `scope`, but the
 * API (and BUIE's Flow types) may populate `namespace` instead — or in addition —
 * in MIGRATION/FINAL modes.
 */
export type MetadataTemplateIdentity = {
    templateKey: string;
    scope?: string;
    namespace?: string;
};

/** Read scope or namespace FQN from a template/instance that may only have one. */
export function getMetadataTemplateNamespaceFqn(template: MetadataTemplateIdentity): string | undefined {
    return template.scope ?? template.namespace;
}

/**
 * Whether two metadata templates/instances refer to the same template.
 *
 * Mirrors `Metadata.getTemplateForInstance` matching:
 * - Prefer `scope` when both sides define it (SCOPED / enterprise-scoped MIGRATION)
 * - Otherwise compare namespace FQNs (including when one side stores the FQN in `scope`
 *   and the other in `namespace`, as the template browser does)
 * - Never treat two missing scopes as a match — that would collapse distinct
 *   child-namespace templates that share a `templateKey`
 *   (e.g. `enterprise_123.legal.contract` vs `enterprise_123.hr.contract`).
 */
export function isSameMetadataTemplate(a: MetadataTemplateIdentity, b: MetadataTemplateIdentity): boolean {
    if (a.templateKey !== b.templateKey) {
        return false;
    }
    // Fast path: both sides still carry a legacy scope and they agree.
    if (a.scope != null && b.scope != null && a.scope === b.scope) {
        return true;
    }
    // Otherwise compare resolved FQNs. Prefer `namespace` when present so a
    // browser-shaped template (FQN in `scope`) can match an editor-shaped
    // template that only has `namespace` (or has both). Two missing FQNs must
    // not match — that would collapse distinct child-namespace templates that
    // share a templateKey.
    const aFqn = a.namespace ?? a.scope;
    const bFqn = b.namespace ?? b.scope;
    return aFqn != null && bFqn != null && aFqn === bFqn;
}
