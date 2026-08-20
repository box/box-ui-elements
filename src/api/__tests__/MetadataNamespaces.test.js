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
    let getMetadataAuthToken;

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
        getMetadataAuthToken,
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
        getMetadataAuthToken = jest.fn().mockResolvedValue(null);
        host = createHost();
        api = new MetadataNamespaces(host);
    });

    describe('resolveNamespacedRequestAuth()', () => {
        test('should use the file-scoped id in SCOPED mode even when a metadata token is available', async () => {
            getMetadataAuthToken.mockResolvedValue('meta-token');

            await expect(api.resolveNamespacedRequestAuth(file)).resolves.toEqual({ id: 'file_123' });
            expect(getMetadataAuthToken).not.toHaveBeenCalled();
        });

        test('should use the host metadata-service token in MIGRATION mode', async () => {
            host.metadataNamespaceMode = METADATA_SCOPE_MODE_MIGRATION;
            getMetadataAuthToken.mockResolvedValue('meta-token');

            await expect(api.resolveNamespacedRequestAuth(file)).resolves.toEqual({ accessToken: 'meta-token' });
            expect(getMetadataAuthToken).toHaveBeenCalledTimes(1);
        });

        test('should use the host metadata-service token in FINAL mode', async () => {
            host.metadataNamespaceMode = METADATA_SCOPE_MODE_FINAL;
            getMetadataAuthToken.mockResolvedValue('meta-token');

            await expect(api.resolveNamespacedRequestAuth(file)).resolves.toEqual({ accessToken: 'meta-token' });
        });

        test('should fall back to the file-scoped id when the getter returns null', async () => {
            host.metadataNamespaceMode = METADATA_SCOPE_MODE_MIGRATION;

            await expect(api.resolveNamespacedRequestAuth(file)).resolves.toEqual({ id: 'file_123' });
        });

        test('should fall back to the file-scoped id when the getter fails', async () => {
            host.metadataNamespaceMode = METADATA_SCOPE_MODE_MIGRATION;
            getMetadataAuthToken.mockRejectedValue(new Error('mint failed'));

            await expect(api.resolveNamespacedRequestAuth(file)).resolves.toEqual({ id: 'file_123' });
        });

        test('should fall back to the file-scoped id when the host omits the getter', async () => {
            host = createHost({ getMetadataAuthToken: undefined });
            host.metadataNamespaceMode = METADATA_SCOPE_MODE_MIGRATION;
            api = new MetadataNamespaces(host);

            await expect(api.resolveNamespacedRequestAuth(file)).resolves.toEqual({ id: 'file_123' });
        });
    });

    describe('createMetadataTemplate()', () => {
        test('should POST with the metadata-service token in MIGRATION mode', async () => {
            host.metadataNamespaceMode = METADATA_SCOPE_MODE_MIGRATION;
            getMetadataAuthToken.mockResolvedValue('meta-token');
            const successCallback = jest.fn();
            host.xhr.post.mockImplementation(() => {
                expect(host.xhr.token).toBe('meta-token');
                return Promise.resolve({ data: {} });
            });

            await api.createMetadataTemplate(file, { displayName: 'Contract' }, successCallback, jest.fn());

            expect(getMetadataAuthToken).toHaveBeenCalledTimes(1);
            expect(host.xhr.post).toHaveBeenCalledWith({
                url: 'https://api.box.com/2.0/metadata_templates/schema',
                id: 'file_123',
                data: { displayName: 'Contract' },
            });
            expect(host.xhr.token).toBe('preview-token');
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
        test('should PUT with the metadata-service token in FINAL mode', async () => {
            host.metadataNamespaceMode = METADATA_SCOPE_MODE_FINAL;
            getMetadataAuthToken.mockResolvedValue('meta-token');
            const patchItems = [{ op: 'replace', path: '/displayName', value: 'Renamed' }];

            await api.updateMetadataTemplate(file, 'enterprise_1', 'contract', patchItems, jest.fn(), jest.fn());

            expect(getMetadataAuthToken).toHaveBeenCalledTimes(1);
            expect(host.xhr.put).toHaveBeenCalledWith({
                url: 'https://api.box.com/2.0/metadata_templates/enterprise_1/contract/schema',
                id: 'file_123',
                headers: { 'Content-Type': 'application/json-patch+json' },
                data: patchItems,
            });
            expect(host.xhr.token).toBe('preview-token');
        });
    });

    describe('getTemplateSchemaForEditor()', () => {
        test('should map hidden from the live schema response', async () => {
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
        });
    });
});
