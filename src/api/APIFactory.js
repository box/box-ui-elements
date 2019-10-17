/**
 * @flow
 * @file Main entry point for the box api
 * @author Box
 */

import Cache from '../utils/Cache';
import ChunkedUploadAPI from './uploads/MultiputUpload';
import PlainUploadAPI from './uploads/PlainUpload';
import FolderAPI from './Folder';
import FileAPI from './File';
import WebLinkAPI from './WebLink';
import SearchAPI from './Search';
import RecentsAPI from './Recents';
import VersionsAPI from './Versions';
import CommentsAPI from './Comments';
import TasksNewAPI from './tasks/TasksNew';
import TaskCollaboratorsAPI from './tasks/TaskCollaborators';
import TaskLinksAPI from './tasks/TaskLinks';
import FileAccessStatsAPI from './FileAccessStats';
import UsersAPI from './Users';
import MetadataAPI from './Metadata';
import FileCollaboratorsAPI from './FileCollaborators';
import FeedAPI from './Feed';
import AppIntegrationsAPI from './AppIntegrations';
import OpenWithAPI from './OpenWith';
import MetadataQueryAPI from './MetadataQuery';
import BoxEditAPI from './box-edit';
import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD, TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK } from '../constants';

class APIFactory {
    /**
     * @property {*}
     */
    options: Options;

    /**
     * @property {FileAPI}
     */
    fileAPI: FileAPI;

    /**
     * @property {WebLink}
     */
    weblinkAPI: WebLinkAPI;

    /**
     * @property {FolderAPI}
     */
    folderAPI: FolderAPI;

    /**
     * @property {PlainUploadAPI}
     */
    plainUploadAPI: PlainUploadAPI;

    /**
     * @property {ChunkedUploadAPI}
     */
    chunkedUploadAPI: ChunkedUploadAPI;

    /**
     * @property {SearchAPI}
     */
    searchAPI: SearchAPI;

    /**
     * @property {RecentsAPI}
     */
    recentsAPI: RecentsAPI;

    /**
     * @property {VersionsAPI}
     */
    versionsAPI: VersionsAPI;

    /**
     * @property {CommentsAPI}
     */
    commentsAPI: CommentsAPI;

    /**
     * @property {TasksNewAPI}
     */
    tasksNewAPI: TasksNewAPI;

    /**
     * @property {TaskCollaboratorsAPI}
     */
    taskCollaboratorsAPI: TaskCollaboratorsAPI;

    /**
     * @property {TaskLinksAPI}
     */
    taskLinksAPI: TaskLinksAPI;

    /*
     * @property {FileAccessStatsAPI}
     */
    fileAccessStatsAPI: FileAccessStatsAPI;

    /*
     * @property {UsersAPI}
     */
    usersAPI: UsersAPI;

    /*
     * @property {MetadataAPI}
     */
    metadataAPI: MetadataAPI;

    /**
     * @property {FileCollaboratorsAPI}
     */
    fileCollaboratorsAPI: FileCollaboratorsAPI;

    /**
     * @property {FeedAPI}
     */
    feedItemsAPI: FeedAPI;

    /**
     * @property {OpenWithAPI}
     */
    openWithAPI: OpenWithAPI;

    /**
     * @property {AppIntegrationsAPI}
     */
    appIntegrationsAPI: AppIntegrationsAPI;

    /**
     * @property {MetadataQueryAPI}
     */
    metadataQueryAPI: MetadataQueryAPI;

    /** @property {BoxEditAPI}
     *
     */
    boxEditAPI: BoxEditAPI;

    /**
     * [constructor]
     *
     * @param {Object} options
     * @param {string} options.id - item id
     * @param {string|function} options.token - Auth token
     * @param {string} [options.sharedLink] - Shared link
     * @param {string} [options.sharedLinkPassword] - Shared link password
     * @param {string} [options.apiHost] - Api host
     * @param {string} [options.uploadHost] - Upload host name
     * @return {API} Api instance
     */
    constructor(options: Options) {
        this.options = {
            ...options,
            apiHost: options.apiHost || DEFAULT_HOSTNAME_API,
            uploadHost: options.uploadHost || DEFAULT_HOSTNAME_UPLOAD,
            cache: options.cache || new Cache(),
            language: options.language,
        };
    }

    /**
     * [destructor]
     *
     * @param {boolean} destroyCache - true to destroy cache
     * @return {void}
     */
    destroy(destroyCache: boolean = false) {
        if (this.fileAPI) {
            this.fileAPI.destroy();
            delete this.fileAPI;
        }

        if (this.weblinkAPI) {
            this.weblinkAPI.destroy();
            delete this.weblinkAPI;
        }

        if (this.plainUploadAPI) {
            this.plainUploadAPI.destroy();
            delete this.plainUploadAPI;
        }

        if (this.chunkedUploadAPI) {
            this.chunkedUploadAPI.destroy();
            delete this.chunkedUploadAPI;
        }

        if (this.folderAPI) {
            this.folderAPI.destroy();
            delete this.folderAPI;
        }

        if (this.searchAPI) {
            this.searchAPI.destroy();
            delete this.searchAPI;
        }

        if (this.recentsAPI) {
            this.recentsAPI.destroy();
            delete this.recentsAPI;
        }

        if (this.versionsAPI) {
            this.versionsAPI.destroy();
            delete this.versionsAPI;
        }

        if (this.fileAccessStatsAPI) {
            this.fileAccessStatsAPI.destroy();
            delete this.fileAccessStatsAPI;
        }

        if (this.tasksNewAPI) {
            this.tasksNewAPI.destroy();
            delete this.tasksNewAPI;
        }

        if (this.taskCollaboratorsAPI) {
            this.taskCollaboratorsAPI.destroy();
            delete this.taskCollaboratorsAPI;
        }

        if (this.taskLinksAPI) {
            this.taskLinksAPI.destroy();
            delete this.taskLinksAPI;
        }

        if (this.commentsAPI) {
            this.commentsAPI.destroy();
            delete this.commentsAPI;
        }

        if (this.usersAPI) {
            this.usersAPI.destroy();
            delete this.usersAPI;
        }

        if (this.metadataAPI) {
            this.metadataAPI.destroy();
            delete this.metadataAPI;
        }

        if (this.fileCollaboratorsAPI) {
            this.fileCollaboratorsAPI.destroy();
            delete this.fileCollaboratorsAPI;
        }

        if (this.appIntegrationsAPI) {
            this.appIntegrationsAPI.destroy();
            delete this.appIntegrationsAPI;
        }

        if (this.metadataQueryAPI) {
            this.metadataQueryAPI.destroy();
            delete this.metadataQueryAPI;
        }

        if (this.openWithAPI) {
            this.openWithAPI.destroy();
            delete this.openWithAPI;
        }

        if (destroyCache) {
            this.options.cache = new Cache();
        }
    }

    /**
     * Gets the cache instance
     *
     * @return {Cache} cache instance
     */
    getCache(): APICache {
        return ((this.options.cache: any): APICache);
    }

    /**
     * Returns the API based on type of item
     *
     * @private
     * @param {String} type - item type
     * @return {ItemAPI} api
     */
    getAPI(type: ItemType): ItemAPI {
        let api: ItemAPI;

        switch (type) {
            case TYPE_FOLDER:
                api = this.getFolderAPI();
                break;
            case TYPE_FILE:
                api = this.getFileAPI();
                break;
            case TYPE_WEBLINK:
                api = this.getWebLinkAPI();
                break;
            default:
                throw new Error('Unknown Type!');
        }

        return api;
    }

    /**
     * API for file
     *
     * @return {FileAPI} FileAPI instance
     */
    getFileAPI(shouldDestroy: boolean = true): FileAPI {
        if (shouldDestroy) {
            this.destroy();
        }
        this.fileAPI = new FileAPI(this.options);
        return this.fileAPI;
    }

    /**
     * API for web links
     *
     * @return {WebLinkAPI} WebLinkAPI instance
     */
    getWebLinkAPI(): WebLinkAPI {
        this.destroy();
        this.weblinkAPI = new WebLinkAPI(this.options);
        return this.weblinkAPI;
    }

    /**
     * API for plain uploads
     *
     * @return {UploadAPI} UploadAPI instance
     */
    getPlainUploadAPI(): PlainUploadAPI {
        this.destroy();
        this.plainUploadAPI = new PlainUploadAPI(this.options);
        return this.plainUploadAPI;
    }

    /**
     * API for chunked uploads
     *
     * @return {UploadAPI} UploadAPI instance
     */
    getChunkedUploadAPI(): ChunkedUploadAPI {
        this.destroy();
        this.chunkedUploadAPI = new ChunkedUploadAPI(this.options);
        return this.chunkedUploadAPI;
    }

    /**
     * API for folder
     *
     * @return {FolderAPI} FolderAPI instance
     */
    getFolderAPI(): FolderAPI {
        this.destroy();
        this.folderAPI = new FolderAPI(this.options);
        return this.folderAPI;
    }

    /**
     * API for search
     *
     * @return {SearchAPI} SearchAPI instance
     */
    getSearchAPI(): SearchAPI {
        this.destroy();
        this.searchAPI = new SearchAPI(this.options);
        return this.searchAPI;
    }

    /**
     * API for recents
     *
     * @return {RecentsAPI} RecentsAPI instance
     */
    getRecentsAPI(): RecentsAPI {
        this.destroy();
        this.recentsAPI = new RecentsAPI(this.options);
        return this.recentsAPI;
    }

    /**
     * API for metadata
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {MetadataAPI} MetadataAPI instance
     */
    getMetadataAPI(shouldDestroy: boolean): MetadataAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.metadataAPI = new MetadataAPI(this.options);
        return this.metadataAPI;
    }

    /**
     * API for versions
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {VersionsAPI} VersionsAPI instance
     */
    getVersionsAPI(shouldDestroy: boolean): VersionsAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.versionsAPI = new VersionsAPI(this.options);
        return this.versionsAPI;
    }

    /**
     * API for comments
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {CommentsAPI} CommentsAPI instance
     */
    getCommentsAPI(shouldDestroy: boolean): CommentsAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.commentsAPI = new CommentsAPI(this.options);
        return this.commentsAPI;
    }

    /**
     * API for tasks
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {TasksAPI} TaskAssignmentsAPI instance
     */
    getTasksNewAPI(shouldDestroy: boolean): TasksNewAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.tasksNewAPI = new TasksNewAPI(this.options);
        return this.tasksNewAPI;
    }

    /**
     * API for taskCollaborators
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {TaskCollaboratorsAPI} TaskCollaboratorsAPI instance
     */
    getTaskCollaboratorsAPI(shouldDestroy: boolean): TaskCollaboratorsAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.taskCollaboratorsAPI = new TaskCollaboratorsAPI(this.options);
        return this.taskCollaboratorsAPI;
    }

    /**
     * API for taskLinks
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {TasksAPI} TaskLinksAPI instance
     */
    getTaskLinksAPI(shouldDestroy: boolean): TaskLinksAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.taskLinksAPI = new TaskLinksAPI(this.options);
        return this.taskLinksAPI;
    }

    /**
     * API for file access stats
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {FileAccessStatsAPI} FileAccessStatsAPI instance
     */
    getFileAccessStatsAPI(shouldDestroy: boolean): FileAccessStatsAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.fileAccessStatsAPI = new FileAccessStatsAPI(this.options);
        return this.fileAccessStatsAPI;
    }

    /**
     * API for file collaborators
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {FileCollaboratorsAPI} FileCollaboratorsAPI instance
     */
    getFileCollaboratorsAPI(shouldDestroy: boolean): FileCollaboratorsAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.fileCollaboratorsAPI = new FileCollaboratorsAPI(this.options);
        return this.fileCollaboratorsAPI;
    }

    /**
     * API for Users
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {UsersAPI} UsersAPI instance
     */
    getUsersAPI(shouldDestroy: boolean): UsersAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.usersAPI = new UsersAPI(this.options);
        return this.usersAPI;
    }

    /**
     * API for Feed Items
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {FeedAPI} FeedAPI instance
     */
    getFeedAPI(shouldDestroy: boolean): FeedAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.feedItemsAPI = new FeedAPI(this.options);
        return this.feedItemsAPI;
    }

    /**
     * API for Open With
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {OpenWithAPI} OpenWithAPI instance
     */
    getOpenWithAPI(shouldDestroy: boolean): OpenWithAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.openWithAPI = new OpenWithAPI(this.options);
        return this.openWithAPI;
    }

    /**
     * API for the App Integrations endpoint
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {AppIntegrationsAPI} AppIntegrationsAPI instance
     */
    getAppIntegrationsAPI(shouldDestroy: boolean): AppIntegrationsAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.appIntegrationsAPI = new AppIntegrationsAPI(this.options);
        return this.appIntegrationsAPI;
    }

    /**
     * API for Metadata Query
     *
     * @param {boolean} shouldDestroy - true if the factory should destroy before returning the call
     * @return {MetadataQuery} MetadataQuery instance
     */
    getMetadataQueryAPI(shouldDestroy: boolean = false): MetadataQueryAPI {
        if (shouldDestroy) {
            this.destroy();
        }

        this.metadataQueryAPI = new MetadataQueryAPI(this.options);
        return this.metadataQueryAPI;
    }

    /**
     * API for Box Edit
     *
     * @return {BoxEditAPI} BoxEditAPI instance
     */
    getBoxEditAPI(): BoxEditAPI {
        this.boxEditAPI = new BoxEditAPI();
        return this.boxEditAPI;
    }
}

export default APIFactory;
