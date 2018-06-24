/**
 * @flow
 * @file Recursively create folder and upload files
 * @author Box
 */
import FolderAPI from '../../api/Folder';

import { STATUS_COMPLETE, ERROR_CODE_ITEM_NAME_IN_USE } from '../../constants';

class FolderUploadNode {
    addFolderToQueue: Function;
    files: Array<UploadFileWithAPIOptions | File> = [];
    folderID: string;
    folders: Object = {};
    name: string;
    parentFolderID: string;
    uploadFile: Function;
    areAPIOptionsInFiles: boolean;
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
        areAPIOptionsInFiles: boolean,
        baseAPIOptions: Object
    ) {
        this.name = name;
        this.uploadFile = uploadFile;
        this.addFolderToQueue = addFolderToQueue;
        this.areAPIOptionsInFiles = areAPIOptionsInFiles;
        this.baseAPIOptions = baseAPIOptions;
    }

    /**
     * Upload a folder
     *
     * @public
     * @param {string} parentFolderID
     * @param {Function} errorCallback
     * @param {boolean} isRoot
     * @returns {Promise}
     */
    async upload(parentFolderID: string, errorCallback: Function, isRoot: boolean = false) {
        await this.createAndUploadFolder(parentFolderID, errorCallback, isRoot);
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
        const promises = folderNodes.map((folder) => folder.upload(this.folderID, errorCallback));

        await Promise.all(promises);
    };

    /**
     * Create folder and add it to the upload queue
     *
     * @private
     * @param {string} parentFolderID
     * @param {Function} errorCallback
     * @param {boolean} isRoot
     * @returns {Promise}
     */
    createAndUploadFolder = async (parentFolderID: string, errorCallback: Function, isRoot: boolean) => {
        try {
            const data = await this.createFolder(parentFolderID);
            this.folderID = data.id;
        } catch (error) {
            // @TODO: Handle 429
            if (error.code !== ERROR_CODE_ITEM_NAME_IN_USE) {
                errorCallback(error);
            }
            this.folderID = error.context_info.conflicts[0].id;
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
     * @param {string} parentFolderID
     * @param {Function} errorCallback
     * @param {boolean} isRoot
     * @returns {Array<UploadFileWithAPIOptions>}
     */
    getFormattedFiles = (): Array<UploadFileWithAPIOptions> =>
        this.files.map((fileData: File | UploadFileWithAPIOptions) => {
            let file = fileData;
            const additionalOptions = {
                folderId: this.folderID,
                uploadInitTimestamp: Date.now()
            };
            let options = additionalOptions;

            if (this.areAPIOptionsInFiles) {
                // In case this.areAPIOptionsInFiles is true, this.files is Array<UploadItemAPIOptions>
                // fileData.file is File type, and we expand fileData.options with additionalOptions

                // $FlowFixMe fileData is UploadFileWithAPIOptions type
                file = fileData.file; // eslint-disable-line prefer-destructuring
                options = {
                    // $FlowFixMe fileData is UploadFileWithAPIOptions type
                    ...fileData.options,
                    ...additionalOptions
                };
            }

            return {
                // $FlowFixMe file is File type
                file,
                options
            };
        });

    /**
     * Promisify create folder
     *
     * @private
     * @param {string} parentFolderID
     * @returns {Promise}
     */
    createFolder(parentFolderID: string): Promise<any> {
        const folderAPI = new FolderAPI({
            ...this.baseAPIOptions,
            id: `folder_${this.parentFolderID}`
        });
        return new Promise((resolve, reject) => {
            folderAPI.create(parentFolderID, this.name, resolve, reject);
        });
    }
}

export default FolderUploadNode;
