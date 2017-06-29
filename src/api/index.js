/**
 * @flow
 * @file Main entry point for the box api
 * @author Box
 */

import Cache from '../util/Cache';
import UploadAPI from './Upload';
import FolderAPI from './Folder';
import FileAPI from './File';
import WebLinkAPI from './WebLink';
import SearchAPI from './Search';
import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD } from '../constants';

class API {
    /**
     * @property {string}
     */
    id: string;

    /**
     * @property {string|function}
     */
    token: string | Function;

    /**
     * @property {string}
     */
    sharedLink: string;

    /**
     * @property {string}
     */
    sharedLinkPassword: string;

    /**
     * @property {string}
     */
    apiHost: string;

    /**
     * @property {string}
     */
    uploadHost: string;

    /**
     * @property {*}
     */
    options: any;

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
     * @property {UploadAPI}
     */
    uploadAPI: UploadAPI;

    /**
     * @property {SearchAPI}
     */
    searchAPI: SearchAPI;

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
    constructor(options: any) {
        this.id = options.id;
        this.token = options.token;
        this.sharedLink = options.sharedLink;
        this.sharedLinkPassword = options.sharedLinkPassword;
        this.apiHost = options.apiHost || DEFAULT_HOSTNAME_API;
        this.uploadHost = options.uploadHost || DEFAULT_HOSTNAME_UPLOAD;
        this.options = Object.assign({}, options, {
            apiHost: this.apiHost,
            uploadHost: this.uploadHost,
            cache: new Cache()
        });
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
        if (this.uploadAPI) {
            this.uploadAPI.destroy();
            delete this.uploadAPI;
        }
        if (this.folderAPI) {
            this.folderAPI.destroy();
            delete this.folderAPI;
        }
        if (this.searchAPI) {
            this.searchAPI.destroy();
            delete this.searchAPI;
        }
        if (destroyCache) {
            this.options.cache = new Cache();
        }
    }

    /**
     * API for file
     *
     * @return {FileAPI} FileAPI instance
     */
    getFileAPI(): FileAPI {
        this.destroy();
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
     * API for uploads
     *
     * @return {UploadAPI} UploadAPI instance
     */
    getUploadAPI(): UploadAPI {
        this.destroy();
        this.uploadAPI = new UploadAPI(this.options);
        return this.uploadAPI;
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
}

export default API;
