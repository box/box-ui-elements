/**
 * @flow
 * @file Recursively create folder and upload files
 * @author Box
 */
import FolderAPI from '../../api/Folder';

import { STATUS_COMPLETE, ERROR_CODE_ITEM_NAME_IN_USE } from '../../constants';

class FolderUploadNode {
    addFolderToQueue: Function;
    files: Array<File> = [];
    folderId: string;
    folders: Object = {};
    name: string;
    parentFolderId: string;
    uploadFile: Function;
    fileAPIOptions: Object;
    baseAPIOptions: Object;

    /**
     * [constructor]
     *
     * @param {string} name
     * @param {Function} uploadFile
     * @param {Function} addFolderToQueue
     * @returns {void}
     */
    constructor(
        name: string,
        uploadFile: Function,
        addFolderToQueue: Function,
        fileAPIOptions: Object,
        baseAPIOptions: Object
    ) {
        this.name = name;
        this.uploadFile = uploadFile;
        this.addFolderToQueue = addFolderToQueue;
        this.fileAPIOptions = fileAPIOptions;
        this.baseAPIOptions = baseAPIOptions;
    }

    /**
     * Upload a folder
     *
     * @public
     * @param {string} parentFolderId
     * @param {Function} errorCallback
     * @param {boolean} isRoot
     * @returns {Promise}
     */
    async upload(parentFolderId: string, errorCallback: Function, isRoot: boolean = false) {
        this.parentFolderId = parentFolderId;

        await this.createAndUploadFolder(errorCallback, isRoot);
        this.uploadFile(this.getFormattedFiles(), true);
        this.uploadChildFolders(errorCallback);
    }

    /**
     * Upload all child folders
     *
     * @private
     * @param {Function} errorCallback
     * @returns {Promise}
     */
    uploadChildFolders = async (errorCallback: Function) => {
        // $FlowFixMe
        const folderNodes: Array<FolderUploadNode> = Object.values(this.folders);
        const promises = folderNodes.map((folder) => folder.upload(this.folderId, errorCallback));

        await Promise.all(promises);
    };

    /**
     * Create folder and add it to the upload queue
     *
     * @private
     * @param {Function} errorCallback
     * @param {boolean} isRoot
     * @returns {Promise}
     */
    createAndUploadFolder = async (errorCallback: Function, isRoot: boolean) => {
        try {
            const data = await this.createFolder();
            this.folderId = data.id;
        } catch (error) {
            // @TODO: Handle 429
            if (error.code !== ERROR_CODE_ITEM_NAME_IN_USE) {
                errorCallback(error);
                return;
            }
            this.folderId = error.context_info.conflicts[0].id;
        }

        if (isRoot) {
            return;
        }

        this.addFolderToQueue([
            {
                extension: '',
                name: this.name,
                status: STATUS_COMPLETE,
                isFolder: true,
                size: 1,
                progress: 100
            }
        ]);
    };

    /**
     * Format files to Array<UploadFileWithAPIOptions> for upload
     *
     * @private
     * @returns {Array<UploadFileWithAPIOptions>}
     */
    getFormattedFiles = (): Array<UploadFileWithAPIOptions> =>
        this.files.map((file: File) => ({
            file,
            options: {
                ...this.fileAPIOptions,
                folderId: this.folderId,
                uploadInitTimestamp: Date.now()
            }
        }));

    /**
     * Promisify create folder
     *
     * @private
     * @returns {Promise}
     */
    createFolder(): Promise<any> {
        const folderAPI = new FolderAPI({
            ...this.baseAPIOptions,
            id: `folder_${this.parentFolderId}`
        });
        return new Promise((resolve, reject) => {
            folderAPI.create(this.parentFolderId, this.name, resolve, reject);
        });
    }
}

export default FolderUploadNode;
