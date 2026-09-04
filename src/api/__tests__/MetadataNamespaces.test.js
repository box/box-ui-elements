import MetadataNamespaces from '../MetadataNamespaces';
import { METADATA_SCOPE_MODE_FINAL, METADATA_SCOPE_MODE_MIGRATION, METADATA_SCOPE_MODE_SCOPED } from '../../constants';

jest.mock('../metadataNamespaceMocks', () => ({
    IS_NAMESPACE_API_MOCKED: false,
    mockListNamespaces: jest.fn(),
    mockListTemplatesForNamespace: jest.fn(),
    mockCreateMetadataTemplate: jest.fn(),
    mockUpdateMetadataTemplate: jest.fn(),
    mockGetTemplateSchemaForEditor: jest.fn(),
}));

describe('api/MetadataNamespaces', () => {
    const file = { id: '123' };
    let host;
    let api;

    const createHost = (overrides = {}) => ({
        errorCode: '',
        metadataNamespaceMode: METADATA_SCOPE_MODE_SCOPED,
        getBaseApiUrl: () => 'https://api.box.com/2.0',
        getCache: () => ({ unset: jest.fn() }),
        getMetadataTemplateSchemaCacheKey: () => 'cache-key',
        getMetadataTemplateSchemaUrl: (templateKey, scope) =>
            `https://api.box.com/2.0/metadata_templates/${scope}/${templateKey}/schema`,
        getMetadataTemplateUrl: () => 'https://api.box.com/2.0/metadata_templates',
        getMetadataTemplateUrlForScope: scope => `https://api.box.com/2.0/metadata_templates/${scope}`,
        isDestroyed: () => false,
        xhr: {
            token: 'preview-token',
            get: jest.fn().mockResolvedValue({ data: {} }),
            post: jest.fn().mockResolvedValue({ data: {} }),
            put: jest.fn().mockResolvedValue({ data: {} }),
        },
        ...overrides,
    });

    beforeEach(() => {
        host = createHost();
        api = new MetadataNamespaces(host);
    });

    describe('createMetadataTemplate()', () => {
        test('should POST with the file-scoped id in MIGRATION mode', async () => {
            host.metadataNamespaceMode = METADATA_SCOPE_MODE_MIGRATION;
            const successCallback = jest.fn();

            await api.createMetadataTemplate(file, { displayName: 'Contract' }, successCallback, jest.fn());

            expect(host.xhr.post).toHaveBeenCalledWith({
                url: 'https://api.box.com/2.0/metadata_templates/schema',
                id: 'file_123',
                data: { displayName: 'Contract' },
            });
            expect(successCallback).toHaveBeenCalled();
        });

        test('should POST with the file-scoped id when token is a per-file function', async () => {
            host = createHost({
                xhr: {
                    token: () => Promise.resolve('file-preview-token'),
                    get: jest.fn(),
                    post: jest.fn().mockResolvedValue({ data: {} }),
                    put: jest.fn(),
                },
            });
            host.metadataNamespaceMode = METADATA_SCOPE_MODE_MIGRATION;
            api = new MetadataNamespaces(host);
            const successCallback = jest.fn();

            await api.createMetadataTemplate(file, { displayName: 'Contract' }, successCallback, jest.fn());

            expect(host.xhr.post).toHaveBeenCalledWith({
                url: 'https://api.box.com/2.0/metadata_templates/schema',
                id: 'file_123',
                data: { displayName: 'Contract' },
            });
            expect(successCallback).toHaveBeenCalled();
        });

        test('should POST with the file-scoped id in SCOPED mode', async () => {
            await api.createMetadataTemplate(file, { displayName: 'Contract' }, jest.fn(), jest.fn());

            expect(host.xhr.post).toHaveBeenCalledWith({
                url: 'https://api.box.com/2.0/metadata_templates/schema',
                id: 'file_123',
                data: { displayName: 'Contract' },
            });
        });
    });

    describe('updateMetadataTemplate()', () => {
        test('should PUT with the file-scoped id in FINAL mode', async () => {
            host.metadataNamespaceMode = METADATA_SCOPE_MODE_FINAL;
            const patchItems = [{ op: 'replace', path: '/displayName', value: 'Renamed' }];

            await api.updateMetadataTemplate(file, 'enterprise_1', 'contract', patchItems, jest.fn(), jest.fn());

            expect(host.xhr.put).toHaveBeenCalledWith({
                url: 'https://api.box.com/2.0/metadata_templates/enterprise_1/contract/schema',
                id: 'file_123',
                headers: { 'Content-Type': 'application/json-patch+json' },
                data: patchItems,
            });
        });
    });

    describe('listNamespaces()', () => {
        test('should GET with the file-scoped id when token is a per-file function', async () => {
            host = createHost({
                xhr: {
                    token: () => Promise.resolve('file-preview-token'),
                    get: jest.fn().mockResolvedValue({ data: { entries: [] } }),
                    post: jest.fn(),
                    put: jest.fn(),
                },
            });
            host.metadataNamespaceMode = METADATA_SCOPE_MODE_MIGRATION;
            api = new MetadataNamespaces(host);

            await expect(api.listNamespaces(file, 'enterprise_1', { limit: 20 })).resolves.toEqual({ entries: [] });
            expect(host.xhr.get).toHaveBeenCalledWith({
                url: 'https://api.box.com/2.0/metadata_namespaces/enterprise_1/children',
                id: 'file_123',
                params: { limit: 20, marker: undefined },
            });
        });
    });

    describe('getTemplateSchemaForEditor()', () => {
        test('should map hidden from the live schema response', async () => {
            host.metadataNamespaceMode = METADATA_SCOPE_MODE_MIGRATION;
            host.xhr.get.mockResolvedValue({
                data: {
                    namespace: 'enterprise_1',
                    templateKey: 'contract',
                    displayName: 'Contract',
                    hidden: false,
                    fields: [{ type: 'string', key: 'vendor', displayName: 'Vendor', hidden: true }],
                },
            });

            await expect(api.getTemplateSchemaForEditor('enterprise_1', 'contract', file)).resolves.toEqual({
                namespace: 'enterprise_1',
                templateKey: 'contract',
                displayName: 'Contract',
                hidden: false,
                fields: [{ type: 'string', key: 'vendor', displayName: 'Vendor', hidden: true }],
            });
            expect(host.xhr.get).toHaveBeenCalledWith({
                url: 'https://api.box.com/2.0/metadata_templates/enterprise_1/contract/schema',
                id: 'file_123',
            });
        });
    });
});
