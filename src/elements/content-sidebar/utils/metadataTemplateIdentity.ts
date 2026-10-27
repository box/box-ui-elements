/**
 * Runtime shape for metadata templates/instances during the scope → namespace
 * migration. `@box/metadata-editor` types still only declare `scope`, but the
 * API (and BUIE's Flow types) may populate `namespace` instead — or in addition —
 * in MIGRATION/FINAL modes.
 */
export type MetadataTemplateIdentity = {
    /** Optional on `@box/metadata-template-browser` MetadataTemplate; required at runtime for a match. */
    templateKey?: string;
    scope?: string;
    namespace?: string;
};

/**
 * Read the most specific namespace FQN from a template/instance that may carry
 * either field.
 *
 * `namespace` wins over `scope`: in MIGRATION mode a child-namespace template can
 * report the enterprise root in `scope` (e.g. `enterprise_123`) while `namespace`
 * holds the real location (`enterprise_123.legal`). Preferring `scope` there would
 * address the wrong namespace and disagree with `isSameMetadataTemplate`.
 */
export function getMetadataTemplateNamespaceFqn(template: MetadataTemplateIdentity): string | undefined {
    return template.namespace ?? template.scope;
}

/**
 * Derives an API-acceptable `templateKey` from a display name.
 *
 * Template keys stay ASCII-only to match the Public API pattern
 * (`^[a-zA-Z_][-a-zA-Z0-9_]*$`). Punctuation-only names (`---`) and names with
 * no Latin letters or digits (Japanese, Arabic, emoji-only, …) therefore
 * become `''`. Callers must reject that result before POSTing — metadata-api
 * would otherwise answer `Invalid template-key value:`.
 *
 * `@box/metadata-template-editor` has no template-key input and submits an empty
 * string. Until the editor owns this, the sidebar fills the gap before POSTing.
 */
export function deriveMetadataTemplateKey(displayName: string): string {
    const words = displayName
        .replace(/[^a-zA-Z0-9]+/gu, ' ')
        .trim()
        .split(' ')
        .filter(Boolean);

    if (words.length === 0) {
        return '';
    }

    return words
        .map((word, index) =>
            index === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`,
        )
        .join('');
}

/**
 * Resolves the `templateKey` to send on create: an explicit key wins, otherwise
 * one is derived from `displayName`. An empty string means the name cannot
 * produce a valid ASCII key and must not be POSTed.
 */
export function resolveCreateMetadataTemplateKey(body: { displayName: string; templateKey?: string }): string {
    return body.templateKey?.trim() || deriveMetadataTemplateKey(body.displayName);
}

const METADATA_SCOPE_GLOBAL = 'global';
const METADATA_NAMESPACE_GLOBAL = 'box.metadata';

/**
 * `global` and `box.metadata` name the same template scope.
 * Other FQNs are unchanged.
 */
function canonicalMetadataHome(fqn: string): string {
    return fqn === METADATA_SCOPE_GLOBAL ? METADATA_NAMESPACE_GLOBAL : fqn;
}

/** Every FQN a template/instance identifies itself by, most specific first. */
function getIdentifiers(template: MetadataTemplateIdentity): string[] {
    return [template.namespace, template.scope].filter((fqn): fqn is string => fqn != null).map(canonicalMetadataHome);
}

/**
 * Whether two metadata templates/instances refer to the same template.
 *
 * - When both sides declare a `namespace`, that is the authoritative comparison.
 *   Falling back to a shared `scope` here would collapse distinct child-namespace
 *   templates, since MIGRATION-mode templates in `enterprise_123.legal` and
 *   `enterprise_123.hr` both report `scope: 'enterprise_123'`.
 * - When only one side declares a `namespace`, the other side's single FQN is
 *   ambiguous (it may be stored in `scope`), so a match on any known FQN counts.
 *   This is what lets a browser-shaped template (FQN in `scope`) match an
 *   editor-shaped one, and an AI-suggestion lookup by legacy scope still resolve.
 * - Two missing FQNs never match.
 */
export function isSameMetadataTemplate(a: MetadataTemplateIdentity, b: MetadataTemplateIdentity): boolean {
    if (a.templateKey == null || b.templateKey == null || a.templateKey !== b.templateKey) {
        return false;
    }
    if (a.namespace != null && b.namespace != null) {
        return canonicalMetadataHome(a.namespace) === canonicalMetadataHome(b.namespace);
    }
    const aIdentifiers = getIdentifiers(a);
    const bIdentifiers = getIdentifiers(b);
    return aIdentifiers.some(fqn => bIdentifiers.includes(fqn));
}
