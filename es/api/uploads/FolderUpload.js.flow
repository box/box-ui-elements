/**
 * @flow
 * @file Folder upload bootstrapping
 * @author Box
 */

import {
    getEntryFromDataTransferItem,
    getFile,
    getFileAPIOptions,
    getDataTransferItem,
    getDataTransferItemAPIOptions,
} from '../../utils/uploads';
import FolderUploadNode from './FolderUploadNode';
import type {
    UploadDataTransferItemWithAPIOptions,
    UploadFileWithAPIOptions,
    UploadFile,
    FileSystemFileEntry,
} from '../../common/types/upload';

const PATH_DELIMITER = '/';

class FolderUpload {
    folder: FolderUploadNode;

    files: Array<UploadFile> = [];

    destinationFolderId: string;

    addFilesToUploadQueue: Function;

    addFolderToUploadQueue: Function;

    baseAPIOptions: Object;

    /**
     * [constructor]
     *
     * @param {Function} addFilesToUploadQueue
     * @param {string} destinationFolderId
     * @param {Function} addFolderToUploadQueue
     * @param {Object} baseAPIOptions
     * @return {void}
     */
    constructor(
        addFilesToUploadQueue: Function,
        destinationFolderId: string,
        addFolderToUploadQueue: Function,
        baseAPIOptions: Object,
    ): void {
        this.addFilesToUploadQueue = addFilesToUploadQueue;
        this.destinationFolderId = destinationFolderId;
        this.addFolderToUploadQueue = addFolderToUploadQueue;
        this.baseAPIOptions = baseAPIOptions;
    }

    /**
     * Create a folder tree from fileList wekbkitRelativePath
     *
     * @public
     * @param  {Array} Array<UploadFileWithAPIOptions | UploadFile> | FileList
     * @returns {void}
     */
    buildFolderTreeFromWebkitRelativePath(fileList: Array<UploadFileWithAPIOptions | UploadFile> | FileList): void {
        Array.from(fileList).forEach(fileData => {
            const file = getFile(fileData);
            const { webkitRelativePath } = file;

            if (!webkitRelativePath) {
                return;
            }

            const fileAPIOptions = getFileAPIOptions(fileData);
            const pathArray = webkitRelativePath.split(PATH_DELIMITER).slice(0, -1);
            if (pathArray.length <= 0) {
                return;
            }

            // Since only 1 folder tree can be uploaded a time with using webkitRelativePath, the root folder name
            // of all the files should be the same.
            if (!this.folder) {
                const rootFolderName = pathArray[0];
                this.folder = this.createFolderUploadNode(rootFolderName, fileAPIOptions);
            }

            // Add file to the root folder
            if (pathArray.length === 1) {
                this.folder.files.push(file);
            }

            let subTree = this.folder.folders;
            // Walk the path after the root folder
            const pathArryAfterRoot = pathArray.slice(1);
            pathArryAfterRoot.forEach((folderName, index) => {
                // Create new child folder
                if (!subTree[folderName]) {
                    subTree[folderName] = this.createFolderUploadNode(folderName, fileAPIOptions);
                }

                if (index === pathArryAfterRoot.length - 1) {
                    // end of path, push the file
                    subTree[folderName].files.push(file);
                } else {
                    // walk the tree
                    subTree = subTree[folderName].folders;
                }
            });
        });
    }

    /**
     * Build folder tree from dataTransferItem, which can only represent 1 folder tree
     *
     * @param {DataTransferItem | UploadDataTransferItemWithAPIOptions} dataTransferItem
     * @returns {void}
     */
    buildFolderTreeFromDataTransferItem(dataTransferItem: DataTransferItem | UploadDataTransferItemWithAPIOptions) {
        const item = getDataTransferItem(dataTransferItem);
        const apiOptions = getDataTransferItemAPIOptions(dataTransferItem);
        const entry = getEntryFromDataTransferItem(item);
        const { name } = entry;

        this.folder = this.createFolderUploadNode(name, apiOptions, entry);
    }

    /**
     * Create a FolderUploadNode instance
     *
     * @param {string} name
     * @param {Object} apiOptions
     * @param {FileSystemFileEntry} [entry]
     * @returns {FolderUploadNode}
     */
    createFolderUploadNode(name: string, apiOptions: Object, entry?: FileSystemFileEntry): FolderUploadNode {
        return new FolderUploadNode(
            name,
            this.addFilesToUploadQueue,
            this.addFolderToUploadQueue,
            apiOptions,
            {
                ...this.baseAPIOptions,
                ...apiOptions,
            },
            entry,
        );
    }

    /**
     * Upload folders
     *
     * @public
     * @param {Object} Options
     * @param {Function} options.errorCallback
     * @returns {Promise<any>}
     */
    async upload({
        errorCallback,
        successCallback,
    }: {
        errorCallback: Function,
        successCallback: Function,
    }): Promise<any> {
        await this.folder.upload(this.destinationFolderId, errorCallback, true);
        // If the folder upload failed then a folderID will not be set
        const newFolderId = this.folder.getFolderId();
        if (newFolderId) {
            successCallback([
                {
                    id: newFolderId,
                },
            ]);
        }
    }

    /**
     * Noop cancel
     *
     * @public
     */
    cancel() {}
}

export default FolderUpload;
