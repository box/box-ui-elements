/**
 * @flow
 * @file Main entry point for the box api
 * @author Box
 */

import Cache from '../util/Cache';
import ChunkedUploadAPI from './ChunkedUpload';
import PlainUploadAPI from './PlainUpload';
import FolderAPI from './Folder';
import FileAPI from './File';
import WebLinkAPI from './WebLink';
import SearchAPI from './Search';
import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD } from '../constants';
import type { Options } from '../flowTypes';

const CHUNKED_UPLOAD_MIN_SIZE_BYTES = 52428800; // 50MB

class API {
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
     * @property {UploadAPI|ChunkedUploadAPI}
     */
    uploadAPI: PlainUploadAPI | ChunkedUploadAPI;

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
    constructor(options: Options = {}) {
        this.options = Object.assign({}, options, {
            apiHost: options.apiHost || DEFAULT_HOSTNAME_API,
            uploadHost: options.uploadHost || DEFAULT_HOSTNAME_UPLOAD,
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
     * @param {boolean} chunked - Should chunked upload be used
     * @param {number} fileSize - File size
     * @return {UploadAPI} UploadAPI instance
     */
    getUploadAPI(chunked?: boolean, fileSize?: number): ChunkedUploadAPI | PlainUploadAPI {
        if (this.uploadAPI) {
            return this.uploadAPI;
        }

        if (chunked && fileSize && fileSize > CHUNKED_UPLOAD_MIN_SIZE_BYTES) {
            this.uploadAPI = new ChunkedUploadAPI(this.options);
        } else {
            this.uploadAPI = new PlainUploadAPI(this.options);
        }

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
