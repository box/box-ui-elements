/**
 * @flow
 * @file Folder upload bootstrapping
 * @author Box
 */

import FolderUploadNode from './FolderUploadNode';
import {
    getEntryFromDataTransferItem,
    getFile,
    getFileAPIOptions,
    getDataTransferItem,
    getDataTransferItemAPIOptions
} from '../../util/uploads';

const PATH_DELIMITER = '/';

class FolderUpload {
    folders: { [string]: FolderUploadNode } = {};
    files: Array<UploadFile> = [];
    destinationFolderId: string;
    uploadFile: Function;
    addFolderToQueue: Function;
    baseAPIOptions: Object;

    /**
     * [constructor]
     *
     * @param {Function} uploadFile
     * @param {string} destinationFolderId
     * @param {Function} addFolderToQueue
     * @param {Object} baseAPIOptions
     * @return {void}
     */
    constructor(
        uploadFile: Function,
        destinationFolderId: string,
        addFolderToQueue: Function,
        baseAPIOptions: Object
    ): void {
        this.uploadFile = uploadFile;
        this.destinationFolderId = destinationFolderId;
        this.addFolderToQueue = addFolderToQueue;
        this.baseAPIOptions = baseAPIOptions;
    }

    /**
     * Creates a folder tree from wekbkitRelativePath
     *
     * @public
     * @param  {Array} Array<UploadFileWithAPIOptions | UploadFile> | FileList
     * @returns {void}
     */
    buildFolderTreeFromWebkitRelativePath(fileList: Array<UploadFileWithAPIOptions | UploadFile> | FileList): void {
        // FileList does not natively have forEach, hence this workaround
        [].forEach.call(fileList, (fileData) => {
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

            let subTree = this.folders;
            // Walk the path
            pathArray.forEach((folderName, index) => {
                // Create new child folder
                if (!subTree[folderName]) {
                    subTree[folderName] = this.createFolderUploadNode(folderName, fileAPIOptions);
                }

                if (index === pathArray.length - 1) {
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
     * Build folder tree from dataTransferItems
     *
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @returns {Promise<any>}
     */
    async buildFolderTreeFromDataTransferItems(
        dataTransferItems: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>
    ) {
        dataTransferItems.forEach((itemData) => {
            const item = getDataTransferItem(itemData);
            const apiOptions = getDataTransferItemAPIOptions(itemData);
            const entry = getEntryFromDataTransferItem(item);
            const { name } = entry;

            this.folders[name] = this.createFolderUploadNode(name, apiOptions, entry);
        });
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
            this.uploadFile,
            this.addFolderToQueue,
            apiOptions,
            {
                ...this.baseAPIOptions,
                ...apiOptions
            },
            entry
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
        successCallback
    }: {
        errorCallback: Function,
        successCallback: Function
    }): Promise<any> {
        const nodes = ((Object.values(this.folders): any): Array<FolderUploadNode>);
        await Promise.all(
            nodes.map((node: FolderUploadNode) => node.upload(this.destinationFolderId, errorCallback, true))
        );

        successCallback();
    }

    /**
     * Noop cancel
     *
     * @public
     */
    cancel() {}
}

export default FolderUpload;
