import Metadata from '../Metadata';
import Cache from '../../util/Cache';
import * as ErrorUtil from '../../util/error';

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
            expect(metadata.getSkillsCacheKey('foo')).toBe(
                'metadata_foo_skills',
            );
        });
    });

    describe('getMetadataUrl()', () => {
        test('should return correct api url', () => {
            expect(metadata.getMetadataUrl('foo')).toBe(
                'https://api.box.com/2.0/files/foo/metadata',
            );
        });
        test('should return correct api url with scope and template', () => {
            expect(metadata.getMetadataUrl('foo', 'scope', 'template')).toBe(
                'https://api.box.com/2.0/files/foo/metadata/scope/template',
            );
        });
    });

    describe('getMetadataTemplateUrl()', () => {
        test('should return correct api url', () => {
            expect(metadata.getMetadataTemplateUrl('scope')).toBe(
                'https://api.box.com/2.0/metadata_templates/scope',
            );
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
                    'template',
                    false,
                ),
            ).toEqual({
                template: 'template',
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
                    'template',
                    true,
                ),
            ).toEqual({
                template: 'template',
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
        test('should return unhidden templates', async () => {
            metadata.getMetadataTemplateUrl = jest
                .fn()
                .mockReturnValueOnce('template_url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce({
                data: {
                    entries: [
                        { id: 1, hidden: false },
                        { id: 2, hidden: true },
                        { id: 3, hidden: false },
                        { id: 4, hidden: false },
                    ],
                },
            });
            const templates = await metadata.getTemplates('id', 'scope');
            expect(templates).toEqual([
                { id: 1, hidden: false },
                { id: 3, hidden: false },
                { id: 4, hidden: false },
            ]);
            expect(metadata.getMetadataTemplateUrl).toHaveBeenCalledWith(
                'scope',
            );
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'template_url',
                id: 'file_id',
            });
        });
    });

    describe('getInstances()', () => {
        test('should return instances', async () => {
            metadata.getMetadataUrl = jest
                .fn()
                .mockReturnValueOnce('instance_url');
            metadata.xhr.get = jest.fn().mockReturnValueOnce({
                data: {
                    entries: [{ id: 1 }, { id: 2 }],
                },
            });
            const templates = await metadata.getInstances('id');
            expect(templates).toEqual([{ id: 1 }, { id: 2 }]);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith('id');
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'instance_url',
                id: 'file_id',
            });
        });
    });

    describe('getSkills()', () => {
        test('should call error callback with a bad item error when no id', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.getSkills({}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error');
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
            metadata.xhr.get = jest
                .fn()
                .mockReturnValueOnce({ data: { cards: 'cards' } });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getSkillsCacheKey = jest
                .fn()
                .mockReturnValueOnce('cache_id_skills');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.getSkills(file, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).not.toHaveBeenCalled();
            expect(metadata.xhr.get).not.toHaveBeenCalled();
            expect(metadata.isDestroyed).not.toHaveBeenCalled();
            expect(metadata.getSkillsCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).toHaveBeenCalledWith([
                'card1',
                'card2',
            ]);
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
            metadata.xhr.get = jest
                .fn()
                .mockReturnValueOnce({ data: { cards: 'cards' } });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getSkillsCacheKey = jest
                .fn()
                .mockReturnValueOnce('cache_id_skills');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.getSkills(file, success, error, true);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).not.toHaveBeenCalled();
            expect(metadata.xhr.get).not.toHaveBeenCalled();
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getSkillsCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).toHaveBeenCalledWith([
                'card3',
                'card4',
            ]);
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
            metadata.xhr.get = jest
                .fn()
                .mockReturnValueOnce({ data: { cards: ['card3', 'card4'] } });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getSkillsCacheKey = jest
                .fn()
                .mockReturnValueOnce('cache_id_skills');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.getSkills(file, success, error, true);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'global',
                'boxSkillsCards',
            );
            expect(metadata.xhr.get).toHaveBeenCalledWith({
                url: 'url',
                id: 'file_id',
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getSkillsCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).toHaveBeenCalledWith([
                'card3',
                'card4',
            ]);
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
            metadata.xhr.get = jest
                .fn()
                .mockReturnValueOnce({ data: { cards: ['card3', 'card4'] } });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getSkillsCacheKey = jest
                .fn()
                .mockReturnValueOnce('cache_id_skills');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.getSkills(file, success, error, true);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'global',
                'boxSkillsCards',
            );
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
            metadata.xhr.get = jest
                .fn()
                .mockReturnValueOnce(Promise.reject(xhrError));
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getSkillsCacheKey = jest
                .fn()
                .mockReturnValueOnce('cache_id_skills');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.getSkills(file, success, error, true);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'global',
                'boxSkillsCards',
            );
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
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no permissions', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.updateSkills(
                { id: 'id' },
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad permissions error', () => {
            ErrorUtil.getBadPermissionsError = jest
                .fn()
                .mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.updateSkills(
                { id: 'id', permissions: {} },
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error');
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
            metadata.xhr.put = jest
                .fn()
                .mockReturnValueOnce({ data: { cards: 'cards' } });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest
                .fn()
                .mockReturnValueOnce({ set: cacheSet });
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getSkillsCacheKey = jest
                .fn()
                .mockReturnValueOnce('cache_id_skills');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.updateSkills(file, ops, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'global',
                'boxSkillsCards',
            );
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
            expect(metadata.merge).toHaveBeenCalledWith(
                'cache_id',
                'metadata.global.boxSkillsCards',
                {
                    cards: 'cards',
                },
            );
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
            metadata.xhr.put = jest
                .fn()
                .mockReturnValueOnce({ data: { cards: 'cards' } });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadata.getCache = jest
                .fn()
                .mockReturnValueOnce({ set: cacheSet });
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getSkillsCacheKey = jest
                .fn()
                .mockReturnValueOnce('cache_id_skills');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.updateSkills(file, ops, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'global',
                'boxSkillsCards',
            );
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
            metadata.xhr.put = jest
                .fn()
                .mockReturnValueOnce(Promise.reject(xhrError));
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadata.getCache = jest
                .fn()
                .mockReturnValueOnce({ set: cacheSet });
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getSkillsCacheKey = jest
                .fn()
                .mockReturnValueOnce('cache_id_skills');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.updateSkills(file, ops, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'global',
                'boxSkillsCards',
            );
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
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no permissions', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.updateMetadata(
                { id: 'id' },
                {},
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad permissions error', () => {
            ErrorUtil.getBadPermissionsError = jest
                .fn()
                .mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.updateMetadata(
                { id: 'id', permissions: {} },
                {},
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should call error callback with a bad permissions error when can upload is false', () => {
            ErrorUtil.getBadPermissionsError = jest
                .fn()
                .mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.updateMetadata(
                { id: 'id', permissions: { can_upload: false } },
                {},
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error');
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
            metadata.getMetadataCacheKey = jest
                .fn()
                .mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.createEditor = jest
                .fn()
                .mockReturnValueOnce(updatedMetadata);
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.updateMetadata(file, template, ops, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'scope',
                'templateKey',
            );
            expect(metadata.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                headers: { 'Content-Type': 'application/json-patch+json' },
                id: 'file_id',
                data: ops,
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.createEditor).toHaveBeenCalledWith(
                'foo',
                template,
                true,
            );
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).toHaveBeenCalledWith(
                updatedMetadata,
            );
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
            metadata.getMetadataCacheKey = jest
                .fn()
                .mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.createEditor = jest
                .fn()
                .mockReturnValueOnce(updatedMetadata);
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.updateMetadata(file, template, ops, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'scope',
                'templateKey',
            );
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
            metadata.xhr.put = jest
                .fn()
                .mockReturnValueOnce(Promise.reject(xhrError));
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getMetadataCacheKey = jest
                .fn()
                .mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.createEditor = jest
                .fn()
                .mockReturnValueOnce(updatedMetadata);
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.updateMetadata(file, template, ops, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'scope',
                'templateKey',
            );
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
        test('should call error callback with a bad item error when no id', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.createMetadata({}, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no permissions', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.createMetadata(
                { id: 'id' },
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad permissions error', () => {
            ErrorUtil.getBadPermissionsError = jest
                .fn()
                .mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.createMetadata(
                { id: 'id', permissions: {} },
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should call error callback with a bad permissions error when can upload is false', () => {
            ErrorUtil.getBadPermissionsError = jest
                .fn()
                .mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.createMetadata(
                { id: 'id', permissions: { can_upload: false } },
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should call error callback when file is externally owned and template isnt global', () => {
            ErrorUtil.getBadPermissionsError = jest
                .fn()
                .mockReturnValueOnce('error');
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
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should call error callback when file is externally owned and template isnt properties', () => {
            ErrorUtil.getBadPermissionsError = jest
                .fn()
                .mockReturnValueOnce('error');
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
            expect(errorCallback).toBeCalledWith('error');
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
            metadata.getMetadataCacheKey = jest
                .fn()
                .mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.createEditor = jest
                .fn()
                .mockReturnValueOnce(updatedMetadata);
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.createMetadata(file, template, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'scope',
                'templateKey',
            );
            expect(metadata.xhr.post).toHaveBeenCalledWith({
                url: 'url',
                id: 'file_id',
                data: {},
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.createEditor).toHaveBeenCalledWith(
                'foo',
                template,
                true,
            );
            expect(metadata.getCache).toHaveBeenCalled();
            expect(metadata.getMetadataCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.successHandler).toHaveBeenCalledWith(
                updatedMetadata,
            );
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
            metadata.getMetadataCacheKey = jest
                .fn()
                .mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.createEditor = jest
                .fn()
                .mockReturnValueOnce(updatedMetadata);
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.createMetadata(file, template, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'scope',
                'templateKey',
            );
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
            metadata.xhr.post = jest
                .fn()
                .mockReturnValueOnce(Promise.reject(xhrError));
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getMetadataCacheKey = jest
                .fn()
                .mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.createEditor = jest
                .fn()
                .mockReturnValueOnce(updatedMetadata);
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.createMetadata(file, template, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'scope',
                'templateKey',
            );
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
        test('should call error callback with a bad item error when no id', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.deleteMetadata({}, {}, successCallback, errorCallback);
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad item error when no permissions', () => {
            ErrorUtil.getBadItemError = jest.fn().mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.deleteMetadata(
                { id: 'id' },
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadItemError).toBeCalled();
        });
        test('should call error callback with a bad permissions error', () => {
            ErrorUtil.getBadPermissionsError = jest
                .fn()
                .mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.deleteMetadata(
                { id: 'id', permissions: {} },
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error');
            expect(successCallback).not.toBeCalled();
            expect(ErrorUtil.getBadPermissionsError).toBeCalled();
        });
        test('should call error callback with a bad permissions error when can upload is false', () => {
            ErrorUtil.getBadPermissionsError = jest
                .fn()
                .mockReturnValueOnce('error');
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadata.deleteMetadata(
                { id: 'id', permissions: { can_upload: false } },
                {},
                successCallback,
                errorCallback,
            );
            expect(errorCallback).toBeCalledWith('error');
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
            metadata.xhr.delete = jest
                .fn()
                .mockReturnValueOnce({ data: 'foo' });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getMetadataCacheKey = jest
                .fn()
                .mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.deleteMetadata(file, template, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'scope',
                'templateKey',
            );
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
            metadata.xhr.delete = jest
                .fn()
                .mockReturnValueOnce({ data: 'foo' });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getMetadataCacheKey = jest
                .fn()
                .mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.deleteMetadata(file, template, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'scope',
                'templateKey',
            );
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
            metadata.xhr.delete = jest
                .fn()
                .mockReturnValueOnce(Promise.reject(xhrError));
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCache = jest.fn().mockReturnValueOnce(cache);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.getMetadataCacheKey = jest
                .fn()
                .mockReturnValueOnce('metadata_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.deleteMetadata(file, template, success, error);

            expect(metadata.successCallback).toBe(success);
            expect(metadata.errorCallback).toBe(error);
            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(
                file.id,
                'scope',
                'templateKey',
            );
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
