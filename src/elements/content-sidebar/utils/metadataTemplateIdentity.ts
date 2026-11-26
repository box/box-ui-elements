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
 * Derives a template key from a display name.
 *
 * Keeps ASCII letters and digits, then camelCases the words. Punctuation-only
 * names and names with no Latin letters or digits become `''`. Callers must
 * omit the field in that case — an empty string is rejected by the API.
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
