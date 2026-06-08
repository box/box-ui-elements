// Synthetic metadata-instance-editor fixtures shaped like the `editors` payload the editor
// consumes. All values are fabricated placeholders; use the builders' overrides to vary only
// what a given test cares about.

const ENTERPRISE_SCOPE = 'enterprise_1111111111';
const FOLDER_ID = '22222222222';

// Cascade policy ids are opaque base64 strings. These are synthetic placeholders (they decode
// to obvious fake labels) and are only ever checked for truthiness, never parsed.
const AI_EXTRACT_POLICY_ID = 'ZmFrZS1haS1leHRyYWN0LWNhc2NhZGUtcG9saWN5';
const REGULAR_POLICY_ID = 'ZmFrZS1yZWd1bGFyLWNhc2NhZGUtcG9saWN5';

/**
 * Builds a single template field shaped like the server payload. Defaults to a simple
 * string field so tests avoid taxonomy/enum providers unless they opt in.
 */
const makeField = (overrides = {}) => ({
    id: '00000000-0000-0000-0000-000000000001',
    key: 'stringfield',
    displayName: 'String Field',
    type: 'string',
    isHidden: false,
    options: null,
    taxonomyKey: '',
    namespace: '',
    ...overrides,
});

/**
 * Builds a user-defined metadata template with a single string field by default.
 */
const makeTemplate = (overrides = {}) => ({
    id: '00000000-0000-0000-0000-000000000002',
    displayName: 'Test Template',
    scope: ENTERPRISE_SCOPE,
    template: '',
    templateKey: 'testTemplate',
    typeKey: '',
    isHidden: false,
    fields: [makeField()],
    ...overrides,
});

/**
 * Builds the special "custom properties" template: no fields and the reserved `properties` key.
 */
const makePropertiesTemplate = (overrides = {}) => ({
    id: 'custom-properties',
    displayName: 'Custom Metadata',
    scope: 'global',
    template: '',
    templateKey: 'properties',
    typeKey: '',
    isHidden: false,
    fields: [],
    ...overrides,
});

/**
 * Builds an AI-extract (Box AI agent managed) cascade policy. These carry an `agent`
 * configuration prefixed like `extract_agent_<digits>`.
 */
const makeAiExtractCascadePolicy = (overrides = {}) => ({
    canEdit: true,
    id: AI_EXTRACT_POLICY_ID,
    cascadePolicyType: 'ai_extract',
    cascadePolicyConfiguration: { agent: 'extract_agent_1234567890' },
    metadataTemplate: { id: '00000000-0000-0000-0000-000000000002', type: 'metadata-template' },
    owner: { id: '1111111111', type: 'enterprise' },
    parent: { id: FOLDER_ID, type: 'folder' },
    ...overrides,
});

/**
 * Builds a regular (non-AI) cascade policy. Non-AI policies have `cascadePolicyType: null`
 * and no agent configuration.
 */
const makeRegularCascadePolicy = (overrides = {}) => ({
    canEdit: true,
    id: REGULAR_POLICY_ID,
    cascadePolicyType: null,
    cascadePolicyConfiguration: null,
    metadataTemplate: { id: '00000000-0000-0000-0000-000000000003', type: 'metadata-template' },
    owner: { id: '1111111111', type: 'enterprise' },
    parent: { id: FOLDER_ID, type: 'folder' },
    ...overrides,
});

/**
 * Builds a metadata instance. Pass `cascadePolicy` to attach one; omit it for instances
 * (e.g. custom properties) that have no cascade policy.
 */
const makeInstance = ({ cascadePolicy, ...overrides } = {}) => ({
    id: '00000000-0000-0000-0000-000000000004',
    canEdit: true,
    data: {},
    type: 'metadata-instance',
    parent: { id: FOLDER_ID, type: 'folder' },
    metadataTemplate: { id: '00000000-0000-0000-0000-000000000002', type: 'metadata-template' },
    ...(cascadePolicy ? { cascadePolicy } : {}),
    ...overrides,
});

/**
 * Builds an editor entry (the `{ instance, template, ... }` wrapper) as consumed by
 * `Instances` / `MetadataInstanceEditor`.
 *
 * @example
 * makeEditor({ cascadePolicy: makeAiExtractCascadePolicy() });
 */
const makeEditor = ({ instance = {}, template, cascadePolicy, hasError = false, isDirty = false } = {}) => ({
    hasError,
    isDirty,
    instance: makeInstance({ ...(cascadePolicy ? { cascadePolicy } : {}), ...instance }),
    template: template || makeTemplate(),
});

/** Editor whose instance is managed by a Box AI extract agent. */
const makeAiExtractEditor = (overrides = {}) =>
    makeEditor({ cascadePolicy: makeAiExtractCascadePolicy(), ...overrides });

/** Editor with a regular (non-AI) cascade policy. */
const makeRegularEditor = (overrides = {}) => makeEditor({ cascadePolicy: makeRegularCascadePolicy(), ...overrides });

/** Editor for the custom properties template (no cascade policy, no fields). */
const makePropertiesEditor = (overrides = {}) => makeEditor({ template: makePropertiesTemplate(), ...overrides });

export {
    ENTERPRISE_SCOPE,
    FOLDER_ID,
    makeField,
    makeTemplate,
    makePropertiesTemplate,
    makeAiExtractCascadePolicy,
    makeRegularCascadePolicy,
    makeInstance,
    makeEditor,
    makeAiExtractEditor,
    makeRegularEditor,
    makePropertiesEditor,
};
