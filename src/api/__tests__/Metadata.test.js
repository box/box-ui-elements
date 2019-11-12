import Cache from '../../utils/Cache';
import * as ErrorUtil from '../../utils/error';
import Metadata from '../Metadata';
import {
    METADATA_TEMPLATE_CLASSIFICATION,
    METADATA_SCOPE_GLOBAL,
    METADATA_TEMPLATE_PROPERTIES,
    ERROR_CODE_DELETE_METADATA,
    ERROR_CODE_CREATE_METADATA,
    ERROR_CODE_UPDATE_METADATA,
    ERROR_CODE_UPDATE_SKILLS,
    ERROR_CODE_FETCH_SKILLS,
    ERROR_CODE_FETCH_METADATA_TEMPLATES,
    ERROR_CODE_FETCH_METADATA,
} from '../../constants';

let metadata;

describe('api/Metadata', () => {
    beforeEach(() => {
        metadata = new Metadata({});
    });

    describe('getCacheKey()', () => {
        test('should return correct key', () => {
            expect(metadata.getCacheKey('foo')).toBe('file_foo');
        });
    });

    describe('getMetadataCacheKey()', () => {
        test('should return correct key', () => {
            expect(metadata.getMetadataCacheKey('foo')).toBe('metadata_foo');
        });
    });

    describe('getSkillsCacheKey()', () => {
        test('should return correct key', () => {
            expect(metadata.getSkillsCacheKey('foo')).toBe('metadata_foo_skills');
        });
    });

    describe('getClassificationCacheKey()', () => {
        test('should return correct key', () => {
            expect(metadata.getClassificationCacheKey('foo')).toBe('metadata_foo_classification');
        });
    });

    describe('getMetadataUrl()', () => {
        test('should return base api url when no template or scope', () => {
            expect(metadata.getMetadataUrl('foo')).toBe('https://api.box.com/2.0/files/foo/metadata');
            expect(metadata.getMetadataUrl('foo', '', 'template')).toBe('https://api.box.com/2.0/files/foo/metadata');
            expect(metadata.getMetadataUrl('foo', 'scope')).toBe('https://api.box.com/2.0/files/foo/metadata');
        });
        test('should return correct api url with scope and template', () => {
            expect(metadata.getMetadataUrl('foo', 'scope', 'template')).toBe(
                'https://api.box.com/2.0/files/foo/metadata/scope/template',
            );
        });
    });

    describe('getMetadataTemplateUrl()', () => {
        test('should return correct base api url', () => {
            expect(metadata.getMetadataTemplateUrl('scope')).toBe('https://api.box.com/2.0/metadata_templates');
        });
    });

    describe('getMetadataTemplateUrlForInstance()', () => {
        test('should return template url for an instance', () => {
            expect(metadata.getMetadataTemplateUrlForInstance('id')).toBe(
                'https://api.box.com/2.0/metadata_templates?metadata_instance_id=id',
            );
        });
    });

    describe('getMetadataTemplateSchemaUrl()', () => {
        test('should return url for to get metadata schema using template key', () => {
            const templateKey = 'templateKey_123';
            expect(metadata.getMetadataTemplateSchemaUrl(templateKey)).toBe(
                `https://api.box.com/2.0/metadata_templates/enterprise/${templateKey}/schema`,
            );
        });
    });

    describe('getMetadataTemplateUrlForScope()', () => {
        test('should return correct template url for scope', () => {
            expect(metadata.getMetadataTemplateUrlForScope('scope')).toBe(
                'https://api.box.com/2.0/metadata_templates/scope',
            );
        });
    });

    describe('getCustomPropertiesTemplate()', () => {
        test('should return correct properties template', () => {
            expect(metadata.getCustomPropertiesTemplate()).toEqual({
                id: expect.stringContaining('metadata_template_'),
                scope: METADATA_SCOPE_GLOBAL,
                templateKey: METADATA_TEMPLATE_PROPERTIES,
                hidden: false,
            });
        });
    });

    describe('createEditor()', () => {
        test('should return an uneditable editor', () => {
            expect(
                metadata.createEditor(
                    {
                        $id: 'id',
                        $foo: 'bar',
                        foo: 'bar',
                        $canEdit: true,
                    },
                    { id: 'foo' },
                    false,
                ),
            ).toEqual({
                template: {
                    id: 'foo',
                },
                instance: {
                    id: 'id',
                    canEdit: false,
                    data: {
                        foo: 'bar',
                    },
                },
            });
        });

        test('should return an editable editor', () => {
            expect(
                metadata.createEditor(
                    {
                        $id: 'id',
                        $foo: 'bar',
                        foo: 'bar',
                        $canEdit: true,
                    },
                    { id: 'foo' },
                    true,
                ),
            ).toEqual({
                template: {
                    id: 'foo',
                },
                instance: {
                    id: 'id',
                    canEdit: true,
                    data: {
                        foo: 'bar',
                    },
                },
            });
        });
    });

    describe('getTemplates()', () => {
        test('should return templates with enterprise scope', async () => {
            const templatesFromServer = [
                { id: 1, hidden: false },
                { id: 2, hidden: true },
                { id: 3, hidden: false },
                { id: 4, hidden: false },
                {
                    id: 5,
                    hidden: true,
                    templateKey: METADATA_TEMPLATE_CLASSIFICATION,
                },
                {
                    id: 6,
                    hidden: false,
                    templateKey: METADATA_TEMPLATE_CLASSIFICATION,
                },
            ];
            metadata.getMetadataTemplateUrlForScope = jest.fn().mockReturnValueOnce('template_url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce({
                data: {
                    entries: templatesFromServer,
                },
            });
            const templates = await metadata.getTemplates('id', 'enterprise');
            expect(metadata.errorCode).toBe(ERROR_CODE_FETCH_METADATA_TEMPLATES);
            expect(templates).toEqual(templates);
            expect(metadata.getMetadataTemplateUrlForScope).toHaveBeenCalledWith('enterprise');
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'template_url',
                id: 'file_id',
                params: {
                    limit: 1000,
                },
            });
        });

        test('should return templates scoped to instance id', async () => {
            const templatesFromServer = [{ id: 1, hidden: false }];
            metadata.getMetadataTemplateUrlForInstance = jest.fn().mockReturnValueOnce('template_url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce({
                data: {
                    entries: templatesFromServer,
                },
            });
            const templates = await metadata.getTemplates('id', 'scope', 'id');
            expect(metadata.errorCode).toBe(ERROR_CODE_FETCH_METADATA_TEMPLATES);
            expect(templates).toEqual(templates);
            expect(metadata.getMetadataTemplateUrlForInstance).toHaveBeenCalledWith('id');
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'template_url',
                id: 'file_id',
                params: {
                    limit: 1000,
                },
            });
        });
        test('should return empty array of templates when error is 400', async () => {
            const error = new Error();
            error.status = 400;
            metadata.getMetadataTemplateUrlForScope = jest.fn().mockReturnValueOnce('template_url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce(Promise.reject(error));
            let templates;
            try {
                templates = await metadata.getTemplates('id', 'scope');
            } catch (e) {
                expect(e.status).toEqual(400);
            }
            expect(metadata.errorCode).toBe(ERROR_CODE_FETCH_METADATA_TEMPLATES);
            expect(templates).toEqual([]);
            expect(metadata.getMetadataTemplateUrlForScope).toHaveBeenCalledWith('scope');
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'template_url',
                id: 'file_id',
                params: {
                    limit: 1000,
                },
            });
        });
        test('should throw error when error is not 400', async () => {
            const error = new Error();
            error.status = 401;
            metadata.getMetadataTemplateUrlForScope = jest.fn().mockReturnValueOnce('template_url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce(Promise.reject(error));
            let templates;
            try {
                templates = await metadata.getTemplates('id', 'scope');
            } catch (e) {
                expect(e.status).toEqual(401);
            }
            expect(metadata.errorCode).toBe(ERROR_CODE_FETCH_METADATA_TEMPLATES);
            expect(templates).toBeUndefined();
            expect(metadata.getMetadataTemplateUrlForScope).toHaveBeenCalledWith('scope');
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'template_url',
                id: 'file_id',
                params: {
                    limit: 1000,
                },
            });
        });
    });

    describe('getSchemaByTemplateKey()', () => {
        test('should return metadata template for provided template key', async () => {
            const metadataTemplate = 'metadataTemplate';
            const templateKey = 'templateKey_123';
            const url = `https://api.box.com/2.0/metadata_templates/enterprise/${templateKey}/schema`;
            metadata.xhr.get = jest.fn().mockReturnValueOnce(Promise.resolve(metadataTemplate));

            const response = await metadata.getSchemaByTemplateKey(templateKey);

            expect(metadata.xhr.get).toHaveBeenCalledWith({ url });
            expect(response).toBe(metadataTemplate);
        });
    });

    describe('getInstances()', () => {
        test('should return templates with enterprise scope', async () => {
            const instancesFromServer = [
                { id: 1, hidden: false },
                { id: 2, hidden: true },
                { id: 3, hidden: false },
                { id: 4, hidden: false },
            ];
            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('metadata_url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce({
                data: {
                    entries: instancesFromServer,
                },
            });
            const instances = await metadata.getInstances('id');
            expect(metadata.errorCode).toBe(ERROR_CODE_FETCH_METADATA);
            expect(instances).toEqual(instances);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith('id');
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'metadata_url',
                id: 'file_id',
            });
        });
        test('should return empty array of templates when error is 400', async () => {
            const error = new Error();
            error.status = 400;
            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('metadata_url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce(Promise.reject(error));
            let instances;
            try {
                instances = await metadata.getInstances('id');
            } catch (e) {
                expect(e.status).toEqual(400);
            }
            expect(metadata.errorCode).toBe(ERROR_CODE_FETCH_METADATA);
            expect(instances).toEqual([]);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith('id');
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'metadata_url',
                id: 'file_id',
            });
        });
        test('should throw error when error is not 400', async () => {
            const error = new Error();
            error.status = 401;
            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('metadata_url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce(Promise.reject(error));
            let instances;
            try {
                instances = await metadata.getInstances('id');
            } catch (e) {
                expect(e.status).toEqual(401);
            }
            expect(metadata.errorCode).toBe(ERROR_CODE_FETCH_METADATA);
            expect(instances).toBeUndefined();
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith('id');
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'metadata_url',
                id: 'file_id',
            });
        });
    });

    describe('getUserAddableTemplates()', () => {
        test('should return empty array when metadata feature is off', async () => {
            const custom = 'custom';
            const ent = [{ templateKey: 'e1' }, { templateKey: 'e2' }];
            const templates = [...ent, { templateKey: 'securityClassification-6VMVochwUWo' }];
            expect(metadata.getUserAddableTemplates(custom, templates, false)).toEqual([]);
        });
        test('should return only custom props tempalte when file is externally owned', async () => {
            const custom = 'custom';
            const ent = [{ templateKey: 'e1' }, { templateKey: 'e2' }];
            const templates = [...ent, { templateKey: 'securityClassification-6VMVochwUWo' }];
            expect(metadata.getUserAddableTemplates(custom, templates, true, true)).toEqual(['custom']);
        });
        test('should return all templates for file owner minus classification', async () => {
            const custom = 'custom';
            const ent = [{ templateKey: 'e1' }, { templateKey: 'e2' }];
            const templates = [...ent, { templateKey: 'securityClassification-6VMVochwUWo' }];
            expect(metadata.getUserAddableTemplates(custom, templates, true)).toEqual(['custom', ...ent]);
        });
        test('should return all templates for file owner minus hidden ones', async () => {
            const custom = 'custom';
            const ent = [{ templateKey: 'e1', hidden: true }, { templateKey: 'e2' }];
            const templates = [...ent, { templateKey: 'securityClassification-6VMVochwUWo' }];
            expect(metadata.getUserAddableTemplates(custom, templates, true)).toEqual([
                'custom',
                { templateKey: 'e2' },
            ]);
        });
    });

    describe('extractClassification()', () => {
        test('should extract and cache classification and return filtered instances', async () => {
            const cache = new Cache();

            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getClassificationCacheKey = jest.fn().mockReturnValueOnce('cache_id_classification');

            expect(
                metadata.extractClassification('id', [
                    { $template: 'foo' },
                    { $template: 'bad' },
                    { $template: 'securityClassification-6VMVochwUWo' },
                ]),
            ).toEqual([{ $template: 'foo' }, { $template: 'bad' }]);
            expect(metadata.getClassificationCacheKey).toHaveBeenCalledWith('id');
            expect(cache.get('cache_id_classification')).toEqual({ $template: 'securityClassification-6VMVochwUWo' });
        });
        test('should return instances if no classification found', async () => {
            const cache = new Cache();

            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getClassificationCacheKey = jest.fn().mockReturnValueOnce('cache_id_classification');

            expect(metadata.extractClassification('id', [{ $template: 'foo' }, { $template: 'bad' }])).toEqual([
                { $template: 'foo' },
                { $template: 'bad' },
            ]);
            expect(metadata.getClassificationCacheKey).not.toHaveBeenCalled();
            expect(cache.get('cache_id_classification')).toBeUndefined();
        });
    });

    describe('getTemplateForInstance()', () => {
        const templatesFromServer = [
            { id: 1, scope: 'global', templateKey: 'global1' },
            { id: 2, scope: 'enterprise', templateKey: 'enterprise2' },
            { id: 3, scope: 'enterprise', templateKey: 'enterprise3' },
            { id: 4, scope: 'enterprise', templateKey: 'enterprise4' },
            { id: 5, scope: 'global', templateKey: 'global5' },
            { id: 6, scope: 'global', templateKey: 'global6' },
        ];

        test('should return undefined when no global template found', async () => {
            const template = await metadata.getTemplateForInstance(
                'id',
                {
                    $id: 'instanceId',
                    $scope: 'global',
                    $template: 'foo',
                },
                templatesFromServer,
            );
            expect(template).toBeUndefined();
        });

        test('should return found enterprise template', async () => {
            const template = await metadata.getTemplateForInstance(
                'id',
                {
                    $id: 'instanceId',
                    $scope: 'enterprise',
                    $template: 'enterprise2',
                },
                templatesFromServer,
            );
            expect(template).toBe(templatesFromServer[1]);
        });

        test('should return templates scoped to instance id', async () => {
            metadata.getTemplates = jest.fn().mockResolvedValueOnce(['collabed_template']);
            const template = await metadata.getTemplateForInstance(
                'id',
                {
                    $id: 'instanceId',
                    $scope: 'enterprise',
                    $template: 'foobar',
                },
                templatesFromServer,
            );
            expect(template).toBe('collabed_template');
            expect(metadata.getTemplates).toBeCalledWith('id', 'enterprise', 'instanceId');
        });
    });

    describe('getEditors()', () => {
        test('should build and return editors with valid templates', async () => {
            const instances = [
                {
                    $id: '1',
                    $scope: 'global',
                    $template: 'global1',
                },
                {
                    $id: '2',
                    $scope: 'enterprise',
                    $template: 'enterprise2',
                },
                {
                    $id: '3',
                    $scope: 'enterprise',
                    $template: 'enterprise3',
                },
                {
                    $id: '4',
                    $scope: 'global',
                    $template: 'custom',
                },
                {
                    $id: '5',
                    $scope: 'global',
                    $template: 'bogus',
                },
            ];

            metadata.extractClassification = jest.fn().mockReturnValueOnce(instances);
            metadata.createEditor = jest
                .fn()
                .mockReturnValueOnce('editor1')
                .mockReturnValueOnce('editor2')
                .mockReturnValueOnce('editor3')
                .mockReturnValueOnce('editor4');
            metadata.getTemplateForInstance = jest
                .fn()
                .mockResolvedValueOnce('template1')
                .mockResolvedValueOnce('template2')
                .mockResolvedValueOnce('template3')
                .mockResolvedValueOnce('template4')
                .mockResolvedValueOnce();

            const editors = await metadata.getEditors('id', instances, {}, [], [], true);
            expect(editors).toEqual(['editor1', 'editor2', 'editor3', 'editor4']);
            expect(metadata.extractClassification).toBeCalledWith('id', instances);

            expect(metadata.createEditor).toBeCalledTimes(4);
            expect(metadata.createEditor.mock.calls[0][0]).toBe(instances[0]);
            expect(metadata.createEditor.mock.calls[0][1]).toBe('template1');
            expect(metadata.createEditor.mock.calls[0][2]).toBe(true);
            expect(metadata.createEditor.mock.calls[1][0]).toBe(instances[1]);
            expect(metadata.createEditor.mock.calls[1][1]).toBe('template2');
            expect(metadata.createEditor.mock.calls[1][2]).toBe(true);
            expect(metadata.createEditor.mock.calls[2][0]).toBe(instances[2]);
            expect(metadata.createEditor.mock.calls[2][1]).toBe('template3');
            expect(metadata.createEditor.mock.calls[2][2]).toBe(true);
            expect(metadata.createEditor.mock.calls[3][0]).toBe(instances[3]);
            expect(metadata.createEditor.mock.calls[3][1]).toBe('template4');
            expect(metadata.createEditor.mock.calls[3][2]).toBe(true);

            expect(metadata.getTemplateForInstance).toBeCalledTimes(5);
            expect(metadata.getTemplateForInstance.mock.calls[0][0]).toBe('id');
            expect(metadata.getTemplateForInstance.mock.calls[0][1]).toBe(instances[0]);
            expect(metadata.getTemplateForInstance.mock.calls[0][2]).toEqual([{}]);
            expect(metadata.getTemplateForInstance.mock.calls[1][0]).toBe('id');
            expect(metadata.getTemplateForInstance.mock.calls[1][1]).toBe(instances[1]);
            expect(metadata.getTemplateForInstance.mock.calls[1][2]).toEqual([{}]);
            expect(metadata.getTemplateForInstance.mock.calls[2][0]).toBe('id');
            expect(metadata.getTemplateForInstance.mock.calls[2][1]).toBe(instances[2]);
            expect(metadata.getTemplateForInstance.mock.calls[2][2]).toEqual([{}]);
            expect(metadata.getTemplateForInstance.mock.calls[3][0]).toBe('id');
            expect(metadata.getTemplateForInstance.mock.calls[3][1]).toBe(instances[3]);
            expect(metadata.getTemplateForInstance.mock.calls[3][2]).toEqual([{}]);
            expect(metadata.getTemplateForInstance.mock.calls[4][0]).toBe('id');
            expect(metadata.getTemplateForInstance.mock.calls[4][1]).toBe(instances[4]);
            expect(metadata.getTemplateForInstance.mock.calls[4][2]).toEqual([{}]);
        });
    });

    describe('getMetadata()', () => {
        test('should call error callback with a bad item error when no id', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            metadata.errorHandler = jest.fn();
            metadata.successHandler = jest.fn();
            metadata.getMetadata({}, jest.fn(), jest.fn(), true);
            expect(metadata.errorCode).toBe(ERROR_CODE_FETCH_METADATA);
            expect(metadata.errorHandler).toBeCalledWith('error');
            expect(metadata.successHandler).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no permissions object', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            metadata.errorHandler = jest.fn();
            metadata.successHandler = jest.fn();
            metadata.getMetadata({ id: 'id' }, jest.fn(), jest.fn(), true);
            expect(metadata.errorCode).toBe(ERROR_CODE_FETCH_METADATA);
            expect(metadata.errorHandler).toBeCalledWith('error');
            expect(metadata.successHandler).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should not make request and and return cached data', async () => {
            const file = {
                id: 'id',
                is_externally_owned: true,
                permissions: {
                    can_upload: true,
                },
            };

            const cache = new Cache();
            cache.set('cache_id_metadata', 'cached_metadata');

            metadata.errorHandler = jest.fn();
            metadata.successHandler = jest.fn();
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('cache_id_metadata');
            metadata.getInstances = jest.fn().mockResolvedValueOnce('instances');
            metadata.getEditors = jest.fn().mockResolvedValueOnce('editors');
            metadata.getCustomPropertiesTemplate = jest.fn().mockReturnValueOnce('custom');
            metadata.getUserAddableTemplates = jest.fn().mockReturnValueOnce('templates');
            metadata.getTemplates = jest
                .fn()
                .mockResolvedValueOnce('global')
                .mockResolvedValueOnce('enterprise');

            await metadata.getMetadata(file, jest.fn(), jest.fn(), true, { refreshCache: false });

            expect(metadata.isDestroyed).not.toHaveBeenCalled();
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.getInstances).not.toHaveBeenCalledWith();
            expect(metadata.getTemplates).not.toHaveBeenCalledWith();
            expect(metadata.getTemplates).not.toHaveBeenCalledWith();
            expect(metadata.getEditors).not.toHaveBeenCalledWith();
            expect(metadata.getUserAddableTemplates).not.toHaveBeenCalledWith();
            expect(metadata.successHandler).toHaveBeenCalledWith('cached_metadata');
            expect(metadata.successHandler).toHaveBeenCalledTimes(1);
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('cache_id_metadata')).toEqual('cached_metadata');
        });
        test('should make request and update cache and call success handler', async () => {
            const file = {
                id: 'id',
                is_externally_owned: true,
                permissions: {
                    can_upload: true,
                },
            };

            const cache = new Cache();

            metadata.errorHandler = jest.fn();
            metadata.successHandler = jest.fn();
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('cache_id_metadata');
            metadata.getInstances = jest.fn().mockResolvedValueOnce('instances');
            metadata.getEditors = jest.fn().mockResolvedValueOnce('editors');
            metadata.getCustomPropertiesTemplate = jest.fn().mockReturnValueOnce('custom');
            metadata.getUserAddableTemplates = jest.fn().mockReturnValueOnce('templates');
            metadata.getTemplates = jest
                .fn()
                .mockResolvedValueOnce('global')
                .mockResolvedValueOnce('enterprise');

            await metadata.getMetadata(file, jest.fn(), jest.fn(), true);

            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.getInstances).toHaveBeenCalledWith(file.id);
            expect(metadata.getTemplates).toHaveBeenCalledWith(file.id, 'global');
            expect(metadata.getTemplates).toHaveBeenCalledWith(file.id, 'enterprise');
            expect(metadata.getEditors).toHaveBeenCalledWith(
                file.id,
                'instances',
                'custom',
                'enterprise',
                'global',
                true,
            );
            expect(metadata.getUserAddableTemplates).toHaveBeenCalledWith('custom', 'enterprise', true, true);
            expect(metadata.successHandler).toHaveBeenCalledWith({
                editors: 'editors',
                templates: 'templates',
            });
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('cache_id_metadata')).toEqual({
                editors: 'editors',
                templates: 'templates',
            });
        });
        test('should make request and update cache and call success handler after returning cached value when refreshCache is true', async () => {
            const file = {
                id: 'id',
                is_externally_owned: true,
                permissions: {
                    can_upload: true,
                },
            };

            const cache = new Cache();
            cache.set('cache_id_metadata', 'cached_metadata');

            metadata.errorHandler = jest.fn();
            metadata.successHandler = jest.fn();
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('cache_id_metadata');
            metadata.getInstances = jest.fn().mockResolvedValueOnce('instances');
            metadata.getEditors = jest.fn().mockResolvedValueOnce('editors');
            metadata.getCustomPropertiesTemplate = jest.fn().mockReturnValueOnce('custom');
            metadata.getUserAddableTemplates = jest.fn().mockReturnValueOnce('templates');
            metadata.getTemplates = jest
                .fn()
                .mockResolvedValueOnce('global')
                .mockResolvedValueOnce('enterprise');

            await metadata.getMetadata(file, jest.fn(), jest.fn(), true, { refreshCache: true });

            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.getInstances).toHaveBeenCalledWith(file.id);
            expect(metadata.getTemplates).toHaveBeenCalledWith(file.id, 'global');
            expect(metadata.getTemplates).toHaveBeenCalledWith(file.id, 'enterprise');
            expect(metadata.getEditors).toHaveBeenCalledWith(
                file.id,
                'instances',
                'custom',
                'enterprise',
                'global',
                true,
            );
            expect(metadata.getUserAddableTemplates).toHaveBeenCalledWith('custom', 'enterprise', true, true);
            expect(metadata.successHandler).toHaveBeenCalledTimes(2);
            expect(metadata.successHandler).toHaveBeenCalledWith('cached_metadata');
            expect(metadata.successHandler).toHaveBeenCalledWith({
                editors: 'editors',
                templates: 'templates',
            });
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('cache_id_metadata')).toEqual({
                editors: 'editors',
                templates: 'templates',
            });
        });
        test('should ignore cache and make request and update cache and call success handler when forceFetch is true', async () => {
            const file = {
                id: 'id',
                is_externally_owned: true,
                permissions: {
                    can_upload: true,
                },
            };

            const cache = new Cache();
            cache.set('cache_id_metadata', 'cached_metadata');

            metadata.errorHandler = jest.fn();
            metadata.successHandler = jest.fn();
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('cache_id_metadata');
            metadata.getInstances = jest.fn().mockResolvedValueOnce('instances');
            metadata.getEditors = jest.fn().mockResolvedValueOnce('editors');
            metadata.getCustomPropertiesTemplate = jest.fn().mockReturnValueOnce('custom');
            metadata.getUserAddableTemplates = jest.fn().mockReturnValueOnce('templates');
            metadata.getTemplates = jest
                .fn()
                .mockResolvedValueOnce('global')
                .mockResolvedValueOnce('enterprise');

            await metadata.getMetadata(file, jest.fn(), jest.fn(), true, { forceFetch: true });

            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.getInstances).toHaveBeenCalledWith(file.id);
            expect(metadata.getTemplates).toHaveBeenCalledWith(file.id, 'global');
            expect(metadata.getTemplates).toHaveBeenCalledWith(file.id, 'enterprise');
            expect(metadata.getEditors).toHaveBeenCalledWith(
                file.id,
                'instances',
                'custom',
                'enterprise',
                'global',
                true,
            );
            expect(metadata.getUserAddableTemplates).toHaveBeenCalledWith('custom', 'enterprise', true, true);
            expect(metadata.successHandler).toHaveBeenCalledTimes(1);
            expect(metadata.successHandler).not.toHaveBeenCalledWith('cached_metadata');
            expect(metadata.successHandler).toHaveBeenCalledWith({
                editors: 'editors',
                templates: 'templates',
            });
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('cache_id_metadata')).toEqual({
                editors: 'editors',
                templates: 'templates',
            });
        });
        test('should make request and update cache and call success handler with metadata feature off', async () => {
            const file = {
                id: 'id',
                is_externally_owned: true,
                permissions: {
                    can_upload: true,
                },
            };

            const cache = new Cache();

            metadata.errorHandler = jest.fn();
            metadata.successHandler = jest.fn();
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('cache_id_metadata');
            metadata.getInstances = jest.fn().mockResolvedValueOnce('instances');
            metadata.getEditors = jest.fn().mockResolvedValueOnce('editors');
            metadata.getCustomPropertiesTemplate = jest.fn().mockReturnValueOnce('custom');
            metadata.getUserAddableTemplates = jest.fn().mockReturnValueOnce('templates');
            metadata.getTemplates = jest
                .fn()
                .mockResolvedValueOnce('global')
                .mockResolvedValueOnce('enterprise');

            await metadata.getMetadata(file, jest.fn(), jest.fn(), false);

            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.getInstances).toHaveBeenCalledWith(file.id);
            expect(metadata.getTemplates).toHaveBeenCalledWith(file.id, 'global');
            expect(metadata.getTemplates).not.toHaveBeenCalledWith(file.id, 'enterprise');
            expect(metadata.getEditors).toHaveBeenCalledWith(file.id, 'instances', 'custom', [], 'global', true);
            expect(metadata.getUserAddableTemplates).toHaveBeenCalledWith('custom', [], false, true);
            expect(metadata.successHandler).toHaveBeenCalledTimes(1);
            expect(metadata.successHandler).toHaveBeenCalledWith({
                editors: 'editors',
                templates: 'templates',
            });
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('cache_id_metadata')).toEqual({
                editors: 'editors',
                templates: 'templates',
            });
        });
        test('should call error handler on an error', async () => {
            const file = {
                id: 'id',
                is_externally_owned: true,
                permissions: {
                    can_upload: true,
                },
            };

            const cache = new Cache();

            metadata.errorHandler = jest.fn();
            metadata.successHandler = jest.fn();
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('cache_id_metadata');
            metadata.getInstances = jest.fn().mockRejectedValueOnce('error');
            metadata.getEditors = jest.fn().mockResolvedValueOnce('editors');
            metadata.getCustomPropertiesTemplate = jest.fn().mockReturnValueOnce('custom');
            metadata.getUserAddableTemplates = jest.fn().mockReturnValueOnce('templates');
            metadata.getTemplates = jest
                .fn()
                .mockResolvedValueOnce('global')
                .mockResolvedValueOnce('enterprise');

            await metadata.getMetadata(file, jest.fn(), jest.fn(), true);

            expect(metadata.isDestroyed).not.toHaveBeenCalled();
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.getInstances).toHaveBeenCalledWith(file.id);
            expect(metadata.getTemplates).toHaveBeenCalledWith(file.id, 'global');
            expect(metadata.getTemplates).toHaveBeenCalledWith(file.id, 'enterprise');
            expect(metadata.getEditors).not.toHaveBeenCalled();
            expect(metadata.getUserAddableTemplates).not.toHaveBeenCalled();
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(metadata.errorHandler).toHaveBeenCalledWith('error');
            expect(cache.get('cache_id_metadata')).toBeUndefined();
        });
        test('should not call any callback when destroyed but still update the cache', async () => {
            const file = {
                id: 'id',
                is_externally_owned: true,
                permissions: {
                    can_upload: true,
                },
            };

            const cache = new Cache();
            cache.set('cache_id_metadata', 'cached_metadata');

            metadata.errorHandler = jest.fn();
            metadata.successHandler = jest.fn();
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('cache_id_metadata');
            metadata.getInstances = jest.fn().mockResolvedValueOnce('instances');
            metadata.getEditors = jest.fn().mockResolvedValueOnce('editors');
            metadata.getCustomPropertiesTemplate = jest.fn().mockReturnValueOnce('custom');
            metadata.getUserAddableTemplates = jest.fn().mockReturnValueOnce('templates');
            metadata.getTemplates = jest
                .fn()
                .mockResolvedValueOnce('global')
                .mockResolvedValueOnce('enterprise');

            await metadata.getMetadata(file, jest.fn(), jest.fn(), true, { forceFetch: true });

            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.getInstances).toHaveBeenCalledWith(file.id);
            expect(metadata.getTemplates).toHaveBeenCalledWith(file.id, 'global');
            expect(metadata.getTemplates).toHaveBeenCalledWith(file.id, 'enterprise');
            expect(metadata.getEditors).toHaveBeenCalledWith(
                file.id,
                'instances',
                'custom',
                'enterprise',
                'global',
                true,
            );
            expect(metadata.getUserAddableTemplates).toHaveBeenCalled();
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('cache_id_metadata')).toEqual({
                editors: 'editors',
                templates: 'templates',
            });
        });
    });

    describe('getSkills()', () => {
        test('should call error callback with a bad item error when no id', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.getSkills({}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_FETCH_SKILLS);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should not make request but get skills from cache and call success handler', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
                metadata: {
                    global: {
                        boxSkillsCards: {
                            cards: [],
                        },
                    },
                },
            };
            const cache = new Cache();
            cache.set('cache_id_skills', ['card1', 'card2']);

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce({ data: { cards: 'cards' } });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getSkillsCacheKey = jest.fn().mockReturnValueOnce('cache_id_skills');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.getSkills(file, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).not.toHaveBeenCalled();
            expect(metadata.xhr.get).not.toHaveBeenCalled();
            expect(metadata.isDestroyed).not.toHaveBeenCalled();
            expect(metadata.getSkillsCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).toHaveBeenCalledWith(['card1', 'card2']);
            expect(metadata.errorHandler).not.toHaveBeenCalled();
        });
        test('should not make request but get skills from file and call success handler and ignore cache', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
                metadata: {
                    global: {
                        boxSkillsCards: {
                            cards: ['card3', 'card4'],
                        },
                    },
                },
            };
            const cache = new Cache();
            cache.set('cache_id_skills', ['card1', 'card2']);

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce({ data: { cards: 'cards' } });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getSkillsCacheKey = jest.fn().mockReturnValueOnce('cache_id_skills');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.getSkills(file, success, error, true);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).not.toHaveBeenCalled();
            expect(metadata.xhr.get).not.toHaveBeenCalled();
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getSkillsCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).toHaveBeenCalledWith(['card3', 'card4']);
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('cache_id_skills')).toEqual(['card3', 'card4']);
        });
        test('should make request and update cache and success handler', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const cache = new Cache();
            cache.set('cache_id_skills', ['card1', 'card2']);

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce({ data: { cards: ['card3', 'card4'] } });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getSkillsCacheKey = jest.fn().mockReturnValueOnce('cache_id_skills');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.getSkills(file, success, error, true);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'global', 'boxSkillsCards');
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'url',
                id: 'file_id',
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getSkillsCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).toHaveBeenCalledWith(['card3', 'card4']);
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('cache_id_skills')).toEqual(['card3', 'card4']);
        });
        test('should make request but update cache or call success handler when destroyed', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const cache = new Cache();
            cache.set('cache_id_skills', ['card1', 'card2']);

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce({ data: { cards: ['card3', 'card4'] } });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getSkillsCacheKey = jest.fn().mockReturnValueOnce('cache_id_skills');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.getSkills(file, success, error, true);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'global', 'boxSkillsCards');
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'url',
                id: 'file_id',
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getSkillsCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('cache_id_skills')).toBeUndefined();
        });
        test('should make request and call error handler for error', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const cache = new Cache();
            cache.set('cache_id_skills', ['card1', 'card2']);
            const xhrError = new Error('error');

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce(Promise.reject(xhrError));
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getSkillsCacheKey = jest.fn().mockReturnValueOnce('cache_id_skills');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.getSkills(file, success, error, true);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'global', 'boxSkillsCards');
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'url',
                id: 'file_id',
            });
            expect(metadata.isDestroyed).not.toHaveBeenCalled();
            expect(metadata.getSkillsCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(metadata.errorHandler).toHaveBeenCalledWith(xhrError);
            expect(cache.get('cache_id_skills')).toBeUndefined();
        });
    });

    describe('updateSkills()', () => {
        test('should call error callback with a bad item error when no id', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.updateSkills({}, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_UPDATE_SKILLS);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no permissions', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.updateSkills({ id: 'id' }, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_UPDATE_SKILLS);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad permissions error', () => {
            ErrorUtil.getBadPermissionsError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.updateSkills({ id: 'id', permissions: {} }, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_UPDATE_SKILLS);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should make request and call merge and success handler', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const ops = [{ op: 'add' }, { op: 'test' }];
            const cacheSet = jest.fn();

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.put = jest.fn().mockReturnValueOnce({ data: { cards: 'cards' } });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce({ set: cacheSet });
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getSkillsCacheKey = jest.fn().mockReturnValueOnce('cache_id_skills');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.updateSkills(file, ops, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'global', 'boxSkillsCards');
            expect(metadata.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                headers: { 'Content-Type': 'application/json-patch+json' },
                id: 'file_id',
                data: ops,
            });
            expect(cacheSet).toHaveBeenCalledWith('cache_id_skills', 'cards');
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getCacheKey).toHaveBeenCalledWith(file.id);

            expect(metadata.getSkillsCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.merge).toHaveBeenCalledWith('cache_id', 'metadata.global.boxSkillsCards', {
                cards: 'cards',
            });
            expect(metadata.successHandler).toHaveBeenCalledWith('cards');
            expect(metadata.errorHandler).not.toHaveBeenCalled();
        });
        test('should make request but not merge or call success handler when destroyed', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const ops = [{ op: 'add' }, { op: 'test' }];
            const cacheSet = jest.fn();

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.put = jest.fn().mockReturnValueOnce({ data: { cards: 'cards' } });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadata.getCache = jest.fn().mockReturnValueOnce({ set: cacheSet });
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getSkillsCacheKey = jest.fn().mockReturnValueOnce('cache_id_skills');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.updateSkills(file, ops, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'global', 'boxSkillsCards');
            expect(metadata.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                headers: { 'Content-Type': 'application/json-patch+json' },
                id: 'file_id',
                data: ops,
            });
            expect(cacheSet).not.toHaveBeenCalled();
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCache).not.toHaveBeenCalled();
            expect(metadata.getCacheKey).not.toHaveBeenCalled();

            expect(metadata.getSkillsCacheKey).not.toHaveBeenCalled();
            expect(metadata.merge).not.toHaveBeenCalled();
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(metadata.errorHandler).not.toHaveBeenCalled();
        });
        test('should make request and call error handler for error', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const ops = [{ op: 'add' }, { op: 'test' }];
            const cacheSet = jest.fn();
            const xhrError = new Error('error');

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.put = jest.fn().mockReturnValueOnce(Promise.reject(xhrError));
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadata.getCache = jest.fn().mockReturnValueOnce({ set: cacheSet });
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getSkillsCacheKey = jest.fn().mockReturnValueOnce('cache_id_skills');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.updateSkills(file, ops, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'global', 'boxSkillsCards');
            expect(metadata.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                headers: { 'Content-Type': 'application/json-patch+json' },
                id: 'file_id',
                data: ops,
            });
            expect(cacheSet).not.toHaveBeenCalled();
            expect(metadata.isDestroyed).not.toHaveBeenCalled();
            expect(metadata.getCache).not.toHaveBeenCalled();
            expect(metadata.getCacheKey).not.toHaveBeenCalled();

            expect(metadata.getSkillsCacheKey).not.toHaveBeenCalled();
            expect(metadata.merge).not.toHaveBeenCalled();
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(metadata.errorHandler).toHaveBeenCalledWith(xhrError);
        });
    });

    describe('updateMetadata()', () => {
        test('should call error callback with a bad item error when no id', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.updateMetadata({}, {}, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_UPDATE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no permissions', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.updateMetadata({ id: 'id' }, {}, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_UPDATE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad permissions error', () => {
            ErrorUtil.getBadPermissionsError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.updateMetadata({ id: 'id', permissions: {} }, {}, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_UPDATE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should call error callback with a bad permissions error when can upload is false', () => {
            ErrorUtil.getBadPermissionsError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.updateMetadata(
                { id: 'id', permissions: { can_upload: false } },
                {},
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_UPDATE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should make request and update cache and call success handler', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const ops = [{ op: 'add' }, { op: 'test' }];
            const cache = new Cache();
            const template = { scope: 'scope', templateKey: 'templateKey' };

            const priorMetadata = {
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'bar',
                    },
                },
            };

            const updatedMetadata = {
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'baz',
                    },
                },
            };

            cache.set('metadata_id', {
                editors: [priorMetadata],
            });

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.put = jest.fn().mockReturnValueOnce({ data: 'foo' });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.createEditor = jest.fn().mockReturnValueOnce(updatedMetadata);
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.updateMetadata(file, template, ops, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'scope', 'templateKey');
            expect(metadata.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                headers: { 'Content-Type': 'application/json-patch+json' },
                id: 'file_id',
                data: ops,
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.createEditor).toHaveBeenCalledWith('foo', template, true);
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).toHaveBeenCalledWith(updatedMetadata);
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('metadata_id')).toEqual({
                editors: [updatedMetadata],
            });
        });
        test('should make request but not update cache or call success handler when destroyed', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const ops = [{ op: 'add' }, { op: 'test' }];
            const cache = new Cache();
            const template = { scope: 'scope', templateKey: 'templateKey' };

            const priorMetadata = {
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'bar',
                    },
                },
            };

            const updatedMetadata = {
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'baz',
                    },
                },
            };

            cache.set('metadata_id', {
                editors: [priorMetadata],
            });

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.put = jest.fn().mockReturnValueOnce({ data: 'foo' });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.createEditor = jest.fn().mockReturnValueOnce(updatedMetadata);
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.updateMetadata(file, template, ops, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'scope', 'templateKey');
            expect(metadata.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                headers: { 'Content-Type': 'application/json-patch+json' },
                id: 'file_id',
                data: ops,
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.createEditor).not.toHaveBeenCalled();
            expect(metadata.getCache).not.toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).not.toHaveBeenCalled();
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('metadata_id')).toEqual({
                editors: [priorMetadata],
            });
        });
        test('should make request and call error handler for error', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const ops = [{ op: 'add' }, { op: 'test' }];
            const cache = new Cache();
            const template = { scope: 'scope', templateKey: 'templateKey' };
            const xhrError = new Error('error');

            const priorMetadata = {
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'bar',
                    },
                },
            };

            const updatedMetadata = {
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'baz',
                    },
                },
            };

            cache.set('metadata_id', {
                editors: [priorMetadata],
            });

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.put = jest.fn().mockReturnValueOnce(Promise.reject(xhrError));
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.createEditor = jest.fn().mockReturnValueOnce(updatedMetadata);
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.updateMetadata(file, template, ops, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'scope', 'templateKey');
            expect(metadata.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                headers: { 'Content-Type': 'application/json-patch+json' },
                id: 'file_id',
                data: ops,
            });
            expect(metadata.isDestroyed).not.toHaveBeenCalled();
            expect(metadata.createEditor).not.toHaveBeenCalled();
            expect(metadata.getCache).not.toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).not.toHaveBeenCalled();
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(cache.get('metadata_id')).toEqual({
                editors: [priorMetadata],
            });
            expect(metadata.errorHandler).toHaveBeenCalledWith(xhrError);
        });
    });

    describe('createMetadata()', () => {
        test('should call error callback with a bad item error when no file', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.createMetadata(undefined, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_CREATE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no template', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.createMetadata({}, undefined, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_CREATE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no id', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.createMetadata({}, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_CREATE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no permissions', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.createMetadata({ id: 'id' }, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_CREATE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad permissions error', () => {
            ErrorUtil.getBadPermissionsError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.createMetadata({ id: 'id', permissions: {} }, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_CREATE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should call error callback with a bad permissions error when can upload is false', () => {
            ErrorUtil.getBadPermissionsError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.createMetadata(
                { id: 'id', permissions: { can_upload: false } },
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_CREATE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should call error callback when file is externally owned and template isnt global', () => {
            ErrorUtil.getBadPermissionsError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.createMetadata(
                {
                    id: 'id',
                    permissions: { can_upload: true },
                    is_externally_owned: true,
                },
                { scope: 'global', template: 'foo' },
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_CREATE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should call error callback when file is externally owned and template isnt properties', () => {
            ErrorUtil.getBadPermissionsError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.createMetadata(
                {
                    id: 'id',
                    permissions: { can_upload: true },
                    is_externally_owned: true,
                },
                { scope: 'blah', template: 'properties' },
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_CREATE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should make request and update cache and call success handler', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const cache = new Cache();
            const template = { scope: 'scope', templateKey: 'templateKey' };

            const priorMetadata = {
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'bar',
                    },
                },
            };

            const updatedMetadata = {
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'baz',
                    },
                },
            };

            cache.set('metadata_id', {
                editors: [priorMetadata],
            });

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.post = jest.fn().mockReturnValueOnce({ data: 'foo' });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.createEditor = jest.fn().mockReturnValueOnce(updatedMetadata);
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.createMetadata(file, template, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'scope', 'templateKey');
            expect(metadata.xhr.post).toHaveBeenCalledWith({
                url: 'url',
                id: 'file_id',
                data: {},
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.createEditor).toHaveBeenCalledWith('foo', template, true);
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).toHaveBeenCalledWith(updatedMetadata);
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('metadata_id')).toEqual({
                editors: [priorMetadata, updatedMetadata],
            });
        });
        test('should make request but not update cache or call success handler when destroyed', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const cache = new Cache();
            const template = { scope: 'scope', templateKey: 'templateKey' };

            const priorMetadata = {
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'bar',
                    },
                },
            };

            const updatedMetadata = {
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'baz',
                    },
                },
            };

            cache.set('metadata_id', {
                editors: [priorMetadata],
            });

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.post = jest.fn().mockReturnValueOnce({ data: 'foo' });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.createEditor = jest.fn().mockReturnValueOnce(updatedMetadata);
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.createMetadata(file, template, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'scope', 'templateKey');
            expect(metadata.xhr.post).toHaveBeenCalledWith({
                url: 'url',
                id: 'file_id',
                data: {},
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.createEditor).not.toHaveBeenCalled();
            expect(metadata.getCache).not.toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).not.toHaveBeenCalled();
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('metadata_id')).toEqual({
                editors: [priorMetadata],
            });
        });
        test('should make request and call error handler for error', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const cache = new Cache();
            const template = { scope: 'scope', templateKey: 'templateKey' };
            const xhrError = new Error('error');
            const priorMetadata = {
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'bar',
                    },
                },
            };

            const updatedMetadata = {
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'baz',
                    },
                },
            };

            cache.set('metadata_id', {
                editors: [priorMetadata],
            });

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.post = jest.fn().mockReturnValueOnce(Promise.reject(xhrError));
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.createEditor = jest.fn().mockReturnValueOnce(updatedMetadata);
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.createMetadata(file, template, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'scope', 'templateKey');
            expect(metadata.xhr.post).toHaveBeenCalledWith({
                url: 'url',
                id: 'file_id',
                data: {},
            });
            expect(metadata.isDestroyed).not.toHaveBeenCalled();
            expect(metadata.createEditor).not.toHaveBeenCalled();
            expect(metadata.getCache).not.toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).not.toHaveBeenCalled();
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(cache.get('metadata_id')).toEqual({
                editors: [priorMetadata],
            });
            expect(metadata.errorHandler).toHaveBeenCalledWith(xhrError);
        });
    });

    describe('deleteMetadata()', () => {
        test('should call error callback with a bad item error when no file', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.deleteMetadata(undefined, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_DELETE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no template', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.deleteMetadata({}, undefined, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_DELETE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no id', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.deleteMetadata({}, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_DELETE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no permissions', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.deleteMetadata({ id: 'id' }, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_DELETE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad permissions error', () => {
            ErrorUtil.getBadPermissionsError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.deleteMetadata({ id: 'id', permissions: {} }, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_DELETE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should call error callback with a bad permissions error when can upload is false', () => {
            ErrorUtil.getBadPermissionsError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.deleteMetadata(
                { id: 'id', permissions: { can_upload: false } },
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error', ERROR_CODE_DELETE_METADATA);
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should make request and update cache and call success handler', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const cache = new Cache();
            const template = { scope: 'scope', templateKey: 'templateKey' };

            const priorMetadata = {
                template,
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'bar',
                    },
                },
            };

            cache.set('metadata_id', {
                editors: [priorMetadata],
            });

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.delete = jest.fn().mockReturnValueOnce({ data: 'foo' });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.deleteMetadata(file, template, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'scope', 'templateKey');
            expect(metadata.xhr.delete).toHaveBeenCalledWith({
                url: 'url',
                id: 'file_id',
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).toHaveBeenCalled();
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('metadata_id')).toEqual({
                editors: [],
            });
        });
        test('should make request but not update cache or call success handler when destroyed', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const cache = new Cache();
            const template = { scope: 'scope', templateKey: 'templateKey' };

            const priorMetadata = {
                template,
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'bar',
                    },
                },
            };

            cache.set('metadata_id', {
                editors: [priorMetadata],
            });

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.delete = jest.fn().mockReturnValueOnce({ data: 'foo' });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.deleteMetadata(file, template, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'scope', 'templateKey');
            expect(metadata.xhr.delete).toHaveBeenCalledWith({
                url: 'url',
                id: 'file_id',
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCache).not.toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).not.toHaveBeenCalled();
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(metadata.errorHandler).not.toHaveBeenCalled();
            expect(cache.get('metadata_id')).toEqual({
                editors: [priorMetadata],
            });
        });
        test('should make request and call error handler for error', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true,
                },
            };
            const cache = new Cache();
            const template = { scope: 'scope', templateKey: 'templateKey' };
            const xhrError = new Error('error');
            const priorMetadata = {
                template,
                instance: {
                    id: 'instance_id',
                    data: {
                        foo: 'bar',
                    },
                },
            };

            cache.set('metadata_id', {
                editors: [priorMetadata],
            });

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.delete = jest.fn().mockReturnValueOnce(Promise.reject(xhrError));
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getMetadataCacheKey = jest.fn().mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.deleteMetadata(file, template, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, 'scope', 'templateKey');
            expect(metadata.xhr.delete).toHaveBeenCalledWith({
                url: 'url',
                id: 'file_id',
            });
            expect(metadata.isDestroyed).not.toHaveBeenCalled();
            expect(metadata.getCache).not.toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).not.toHaveBeenCalled();
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(cache.get('metadata_id')).toEqual({
                editors: [priorMetadata],
            });
            expect(metadata.errorHandler).toHaveBeenCalledWith(xhrError);
        });
    });
});
