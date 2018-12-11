import APIFactory from '../APIFactory';
import Cache from '../../util/Cache';
import ChunkedUploadAPI from '../uploads/MultiputUpload';
import PlainUploadAPI from '../uploads/PlainUpload';
import FolderAPI from '../Folder';
import FileAPI from '../File';
import WebLinkAPI from '../WebLink';
import SearchAPI from '../Search';
import RecentsAPI from '../Recents';
import VersionsAPI from '../Versions';
import CommentsAPI from '../Comments';
import TasksAPI from '../Tasks';
import FileAccessStatsAPI from '../FileAccessStats';
import MetadataAPI from '../Metadata';
import FileCollaboratorsAPI from '../FileCollaborators';
import UsersAPI from '../Users';
import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD } from '../../constants';

let factory;

describe('api/APIFactory', () => {
    beforeEach(() => {
        factory = new APIFactory({});
    });

    describe('getCache()', () => {
        test('should return a cache instance', () => {
            expect(factory.getCache()).toBeInstanceOf(Cache);
        });
    });

    describe('destroy()', () => {
        test('should destroy all APIs', () => {
            factory.fileAPI = { destroy: jest.fn() };
            factory.folderAPI = { destroy: jest.fn() };
            factory.weblinkAPI = { destroy: jest.fn() };
            factory.searchAPI = { destroy: jest.fn() };
            factory.plainUploadAPI = { destroy: jest.fn() };
            factory.chunkedUploadAPI = { destroy: jest.fn() };
            factory.recentsAPI = { destroy: jest.fn() };
            factory.versionsAPI = { destroy: jest.fn() };
            factory.metadataAPI = { destroy: jest.fn() };
            factory.usersAPI = { destroy: jest.fn() };
            factory.destroy();
            expect(factory.fileAPI).toBeUndefined();
            expect(factory.folderAPI).toBeUndefined();
            expect(factory.weblinkAPI).toBeUndefined();
            expect(factory.searchAPI).toBeUndefined();
            expect(factory.plainUploadAPI).toBeUndefined();
            expect(factory.chunkedUploadAPI).toBeUndefined();
            expect(factory.recentsAPI).toBeUndefined();
            expect(factory.versionsAPI).toBeUndefined();
            expect(factory.metadataAPI).toBeUndefined();
            expect(factory.usersAPI).toBeUndefined();
        });
        test('should not destroy cache by default', () => {
            const { cache } = factory.options;
            cache.set('foo', 'bar');
            factory.destroy();
            expect(factory.options.cache).toBe(cache);
            expect(factory.options.cache.get('foo')).toBe('bar');
        });
        test('should destroy cache when asked', () => {
            const { cache } = factory.options;
            cache.set('foo', 'bar');
            factory.destroy(true);
            expect(factory.options.cache).not.toBe(cache);
            expect(factory.options.cache.get('foo')).toBeUndefined();
        });
    });

    describe('getAPI()', () => {
        test('should return file api when type is file', () => {
            expect(factory.getAPI('file')).toBeInstanceOf(FileAPI);
        });
        test('should return folder api when type is folder', () => {
            expect(factory.getAPI('folder')).toBeInstanceOf(FolderAPI);
        });
        test('should return web link api when type is web_link', () => {
            expect(factory.getAPI('web_link')).toBeInstanceOf(WebLinkAPI);
        });
        test('should throw error when type is incorrect', () => {
            expect(factory.getAPI.bind(factory, 'foo')).toThrow(Error, /Unknown Type/);
        });
    });

    describe('getFileAPI()', () => {
        test('should call destroy and return file API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const fileAPI = factory.getFileAPI();
            expect(spy).toBeCalled();
            expect(fileAPI).toBeInstanceOf(FileAPI);
            expect(fileAPI.options.cache).toBeInstanceOf(Cache);
            expect(fileAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(fileAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getWebLinkAPI()', () => {
        test('should call destroy and return web link API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const webLinkAPI = factory.getWebLinkAPI();
            expect(spy).toBeCalled();
            expect(webLinkAPI).toBeInstanceOf(WebLinkAPI);
            expect(webLinkAPI.options.cache).toBeInstanceOf(Cache);
            expect(webLinkAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(webLinkAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getPlainUploadAPI()', () => {
        test('should call destroy and return plain upload API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const plainUploadAPI = factory.getPlainUploadAPI();
            expect(spy).toBeCalled();
            expect(plainUploadAPI).toBeInstanceOf(PlainUploadAPI);
            expect(plainUploadAPI.options.cache).toBeInstanceOf(Cache);
            expect(plainUploadAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(plainUploadAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getChunkedUploadAPI()', () => {
        test('should call destroy and return chunked upload API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const chunkedUploadAPI = factory.getChunkedUploadAPI();
            expect(spy).toBeCalled();
            expect(chunkedUploadAPI).toBeInstanceOf(ChunkedUploadAPI);
            expect(chunkedUploadAPI.options.cache).toBeInstanceOf(Cache);
            expect(chunkedUploadAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(chunkedUploadAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getFolderAPI()', () => {
        test('should call destroy and return folder API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const folderAPI = factory.getFolderAPI();
            expect(spy).toBeCalled();
            expect(folderAPI).toBeInstanceOf(FolderAPI);
            expect(folderAPI.options.cache).toBeInstanceOf(Cache);
            expect(folderAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(folderAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getSearchAPI()', () => {
        test('should call destroy and return search API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const searchAPI = factory.getSearchAPI();
            expect(spy).toBeCalled();
            expect(searchAPI).toBeInstanceOf(SearchAPI);
            expect(searchAPI.options.cache).toBeInstanceOf(Cache);
            expect(searchAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(searchAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getRecentsAPI()', () => {
        test('should call destroy and return recents API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const recentsAPI = factory.getRecentsAPI();
            expect(spy).toBeCalled();
            expect(recentsAPI).toBeInstanceOf(RecentsAPI);
            expect(recentsAPI.options.cache).toBeInstanceOf(Cache);
            expect(recentsAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(recentsAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getVersionsAPI()', () => {
        test('should call destroy and return versions API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const versionsAPI = factory.getVersionsAPI(true);
            expect(spy).toBeCalled();
            expect(versionsAPI).toBeInstanceOf(VersionsAPI);
            expect(versionsAPI.options.cache).toBeInstanceOf(Cache);
            expect(versionsAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(versionsAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });

        test('should not call destroy and return versions API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const versionsAPI = factory.getVersionsAPI();
            expect(spy).not.toHaveBeenCalled();
            expect(versionsAPI).toBeInstanceOf(VersionsAPI);
            expect(versionsAPI.options.cache).toBeInstanceOf(Cache);
            expect(versionsAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(versionsAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getCommentsAPI()', () => {
        test('should call destroy and return comments API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const commentsAPI = factory.getCommentsAPI(true);
            expect(spy).toBeCalled();
            expect(commentsAPI).toBeInstanceOf(CommentsAPI);
            expect(commentsAPI.options.cache).toBeInstanceOf(Cache);
            expect(commentsAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(commentsAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });

        test('should not call destroy and return comments API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const commentsAPI = factory.getCommentsAPI();
            expect(spy).not.toHaveBeenCalled();
            expect(commentsAPI).toBeInstanceOf(CommentsAPI);
            expect(commentsAPI.options.cache).toBeInstanceOf(Cache);
            expect(commentsAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(commentsAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getTasksAPI()', () => {
        test('should call destroy and return tasks API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const tasksAPI = factory.getTasksAPI(true);
            expect(spy).toBeCalled();
            expect(tasksAPI).toBeInstanceOf(TasksAPI);
            expect(tasksAPI.options.cache).toBeInstanceOf(Cache);
            expect(tasksAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(tasksAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });

        test('should not call destroy and return tasks API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const tasksAPI = factory.getTasksAPI();
            expect(spy).not.toHaveBeenCalled();
            expect(tasksAPI).toBeInstanceOf(TasksAPI);
            expect(tasksAPI.options.cache).toBeInstanceOf(Cache);
            expect(tasksAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(tasksAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getFileAccessStatsAPI()', () => {
        test('should call destroy and return versions API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const fileAccessStatsAPI = factory.getFileAccessStatsAPI(true);
            expect(spy).toBeCalled();
            expect(fileAccessStatsAPI).toBeInstanceOf(FileAccessStatsAPI);
            expect(fileAccessStatsAPI.options.cache).toBeInstanceOf(Cache);
            expect(fileAccessStatsAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(fileAccessStatsAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });

        test('should not call destroy and return versions API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const fileAccessStatsAPI = factory.getFileAccessStatsAPI();
            expect(spy).not.toHaveBeenCalled();
            expect(fileAccessStatsAPI).toBeInstanceOf(FileAccessStatsAPI);
            expect(fileAccessStatsAPI.options.cache).toBeInstanceOf(Cache);
            expect(fileAccessStatsAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(fileAccessStatsAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getMetadataAPI()', () => {
        test('should call destroy and return metadata API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const metadataAPI = factory.getMetadataAPI(true);
            expect(spy).toBeCalled();
            expect(metadataAPI).toBeInstanceOf(MetadataAPI);
            expect(metadataAPI.options.cache).toBeInstanceOf(Cache);
            expect(metadataAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(metadataAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });

        test('should not call destroy and return metadata API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const metadataAPI = factory.getMetadataAPI();
            expect(spy).not.toHaveBeenCalled();
            expect(metadataAPI).toBeInstanceOf(MetadataAPI);
            expect(metadataAPI.options.cache).toBeInstanceOf(Cache);
            expect(metadataAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(metadataAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getFileCollaboratorsAPI()', () => {
        test('should call destroy and return file collaborators API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const fileCollaboratorsAPI = factory.getFileCollaboratorsAPI(true);
            expect(spy).toBeCalled();
            expect(fileCollaboratorsAPI).toBeInstanceOf(FileCollaboratorsAPI);
            expect(fileCollaboratorsAPI.options.cache).toBeInstanceOf(Cache);
            expect(fileCollaboratorsAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(fileCollaboratorsAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });

        test('should not call destroy and return file collaborators API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const fileCollaboratorsAPI = factory.getFileCollaboratorsAPI();
            expect(spy).not.toHaveBeenCalled();
            expect(fileCollaboratorsAPI).toBeInstanceOf(FileCollaboratorsAPI);
            expect(fileCollaboratorsAPI.options.cache).toBeInstanceOf(Cache);
            expect(fileCollaboratorsAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(fileCollaboratorsAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getUsersAPI()', () => {
        test('should call destroy and return users API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const usersAPI = factory.getUsersAPI(true);
            expect(spy).toBeCalled();
            expect(usersAPI).toBeInstanceOf(UsersAPI);
            expect(usersAPI.options.cache).toBeInstanceOf(Cache);
            expect(usersAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(usersAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });

        test('should not call destroy and return users API', () => {
            const spy = jest.spyOn(factory, 'destroy');
            const usersAPI = factory.getUsersAPI();
            expect(spy).not.toHaveBeenCalled();
            expect(usersAPI).toBeInstanceOf(UsersAPI);
            expect(usersAPI.options.cache).toBeInstanceOf(Cache);
            expect(usersAPI.options.apiHost).toBe(DEFAULT_HOSTNAME_API);
            expect(usersAPI.options.uploadHost).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });
    });
});
