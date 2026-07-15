// @flow
// ─── TODO(MDX-2136): Namespace API mocks ─────────────────────────────────────
// Temporary stand-ins for the namespace-related Metadata APIs.
//
// To remove all mocks when the real API is deployed:
//   1. Delete this file.
//   2. Remove the import block from Metadata.js.
//   3. Remove the single `if (IS_NAMESPACE_API_MOCKED)` guard from each method.
//
// Template ids use the "fqn||templateKey" format so MetadataTemplateDropdown's
// handleEditTemplateById can parse namespaceFqn and templateKey unambiguously
// (templateKeys can contain underscores). Remove the `||` fallback in
// handleEditTemplateById alongside this file.
// ─────────────────────────────────────────────────────────────────────────────

export const IS_NAMESPACE_API_MOCKED: boolean = true;

// ---------------------------------------------------------------------------
// In-memory template store — mutated by mockCreateMetadataTemplate /
// mockUpdateMetadataTemplate so the browser reflects creates/edits without a
// real API call.
// ---------------------------------------------------------------------------

const templateStore: { [key: string]: Array<Object> } = {};

function seedNamespace(fqn: string): void {
    if (templateStore[fqn]) return;

    if (!fqn.includes('.')) {
        // Root namespace: templates have both scope + namespace (MIGRATION mode §1.7.2)
        templateStore[fqn] = [
            {
                id: `${fqn}||productInfo`,
                type: 'metadata_template',
                scope: fqn,
                namespace: fqn,
                templateKey: 'productInfo',
                displayName: 'Product Info',
                hidden: false,
                canEdit: true,
                fields: [
                    { type: 'string', key: 'category', displayName: 'Category', id: `${fqn}_f1` },
                    { type: 'string', key: 'sku', displayName: 'SKU', id: `${fqn}_f2` },
                ],
            },
            {
                id: `${fqn}||contractDetails`,
                type: 'metadata_template',
                scope: fqn,
                namespace: fqn,
                templateKey: 'contractDetails',
                displayName: 'Contract Details',
                hidden: false,
                canEdit: true,
                fields: [
                    { type: 'string', key: 'client', displayName: 'Client', id: `${fqn}_f3` },
                    {
                        type: 'enum',
                        key: 'status',
                        displayName: 'Status',
                        id: `${fqn}_f4`,
                        options: [
                            { key: 'active', id: `${fqn}_o1` },
                            { key: 'expired', id: `${fqn}_o2` },
                        ],
                    },
                ],
            },
        ];
    } else {
        // Child namespace: namespace-only templates (MIGRATION mode §1.7.2)
        const childKey = (fqn.split('.').pop(): any);
        const seeds: { [key: string]: Array<Object> } = {
            legal: [
                {
                    id: `${fqn}||nda`,
                    type: 'metadata_template',
                    namespace: fqn,
                    templateKey: 'nda',
                    displayName: 'NDA',
                    hidden: false,
                    canEdit: true,
                    fields: [
                        { type: 'string', key: 'counterparty', displayName: 'Counterparty', id: `${fqn}_lf1` },
                        { type: 'date', key: 'expiryDate', displayName: 'Expiry Date', id: `${fqn}_lf2` },
                    ],
                },
            ],
            hr: [
                {
                    id: `${fqn}||jobRequisition`,
                    type: 'metadata_template',
                    namespace: fqn,
                    templateKey: 'jobRequisition',
                    displayName: 'Job Requisition',
                    hidden: false,
                    canEdit: true,
                    fields: [
                        { type: 'string', key: 'role', displayName: 'Role', id: `${fqn}_hf1` },
                        { type: 'float', key: 'headcount', displayName: 'Headcount', id: `${fqn}_hf2` },
                    ],
                },
            ],
            finance: [
                {
                    id: `${fqn}||invoiceDetails`,
                    type: 'metadata_template',
                    namespace: fqn,
                    templateKey: 'invoiceDetails',
                    displayName: 'Invoice Details',
                    hidden: false,
                    canEdit: true,
                    fields: [
                        { type: 'float', key: 'amount', displayName: 'Amount (USD)', id: `${fqn}_ff1` },
                        { type: 'date', key: 'dueDate', displayName: 'Due Date', id: `${fqn}_ff2` },
                    ],
                },
            ],
        };
        templateStore[fqn] = seeds[childKey] ?? [];
    }
}

function getNamespaceTemplates(fqn: string): Array<Object> {
    seedNamespace(fqn);
    return templateStore[fqn];
}

// ---------------------------------------------------------------------------
// Exported mock functions — each mirrors the signature of its Metadata.js
// counterpart so the delegation is a single line.
// ---------------------------------------------------------------------------

export function mockListNamespaces(
    file: Object,
    namespaceFqn: string,
    params: Object, // eslint-disable-line no-unused-vars
): Promise<{ entries: Array<Object>, next_marker?: string }> {
    if (!namespaceFqn.includes('.')) {
        return Promise.resolve({
            entries: [
                { id: `${namespaceFqn}.legal`, displayName: 'Legal', canCreate: true },
                { id: `${namespaceFqn}.hr`, displayName: 'Human Resources', canCreate: true },
                { id: `${namespaceFqn}.finance`, displayName: 'Finance', canCreate: false },
            ],
            next_marker: undefined,
        });
    }
    // Child namespaces are leaves in this mock — no further nesting.
    return Promise.resolve({ entries: [], next_marker: undefined });
}

export function mockListTemplatesForNamespace(
    file: Object, // eslint-disable-line no-unused-vars
    namespaceFqn: string,
    params: Object, // eslint-disable-line no-unused-vars
): Promise<{ entries: Array<Object>, next_marker?: string }> {
    return Promise.resolve({ entries: getNamespaceTemplates(namespaceFqn), next_marker: undefined });
}

export function mockCreateMetadataTemplate(file: Object, body: Object, successCallback: Function): void {
    const newTemplate = {
        id: `${body.namespace}||${body.templateKey || 'template'}`,
        type: 'metadata_template',
        namespace: body.namespace,
        templateKey: body.templateKey,
        displayName: body.displayName || body.templateKey,
        hidden: body.hidden ?? false,
        canEdit: true,
        fields: body.fields || [],
    };
    getNamespaceTemplates(body.namespace).push(newTemplate);
    successCallback(newTemplate);
}

export function mockUpdateMetadataTemplate(
    file: Object, // eslint-disable-line no-unused-vars
    namespaceFqn: string,
    templateKey: string,
    patchItems: Array<Object>,
    successCallback: Function,
): void {
    const templates = getNamespaceTemplates(namespaceFqn);
    const idx = templates.findIndex(t => t.templateKey === templateKey);
    if (idx !== -1) {
        let updated = { ...templates[idx] };
        patchItems.forEach(op => {
            if (!op || typeof op !== 'object') return;
            const { op: operation, path, value } = op;
            if (operation === 'replace') {
                if (path === '/displayName') updated = { ...updated, displayName: value };
                else if (path === '/hidden') updated = { ...updated, hidden: value };
                else if (path === '/fields') updated = { ...updated, fields: value };
            } else if (operation === 'add' && path === '/fields/-') {
                updated = { ...updated, fields: [...(updated.fields || []), value] };
            }
        });
        templates[idx] = updated;
    }
    successCallback({ type: 'metadata_template', namespace: namespaceFqn, templateKey });
}

/**
 * Returns a MetadataTemplateApiResponse-shaped object for the editor modal,
 * or null if the template is not in the mock store (caller falls through to real API).
 */
export function mockGetTemplateSchemaForEditor(namespaceFqn: string, templateKey: string): Object | null {
    const tmpl = getNamespaceTemplates(namespaceFqn).find(t => t.templateKey === templateKey);
    if (!tmpl) return null;
    return {
        namespace: tmpl.namespace || namespaceFqn,
        templateKey: tmpl.templateKey,
        displayName: tmpl.displayName,
        fields: (tmpl.fields || []).map(f => ({
            ...f,
            isHidden: f.isHidden != null ? f.isHidden : f.hidden ?? false,
        })),
        isHidden: tmpl.isHidden != null ? tmpl.isHidden : tmpl.hidden ?? false,
    };
}
