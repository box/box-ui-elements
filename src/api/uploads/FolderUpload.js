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
        baseAPIOptions: Object
    ): void {
        this.addFilesToUploadQueue = addFilesToUploadQueue;
        this.destinationFolderId = destinationFolderId;
        this.addFolderToUploadQueue = addFolderToUploadQueue;
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
        Array.from(fileList).forEach((fileData) => {
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
     * Build folder tree from dataTransferItem
     *
     * @param {DataTransferItem | UploadDataTransferItemWithAPIOptions} dataTransferItem
     * @returns {Promise<any>}
     */
    async buildFolderTreeFromDataTransferItem(
        dataTransferItem: DataTransferItem | UploadDataTransferItemWithAPIOptions
    ) {
        const item = getDataTransferItem(dataTransferItem);
        const apiOptions = getDataTransferItemAPIOptions(dataTransferItem);
        const entry = getEntryFromDataTransferItem(item);
        const { name } = entry;

        this.folders[name] = this.createFolderUploadNode(name, apiOptions, entry);
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
        if (nodes.length < 1) {
            return;
        }

        // There should be only 1 FolderUploadNode in the `this.folders`
        const node = nodes[0];
        await node.upload(this.destinationFolderId, errorCallback, true);
        // Simulate BoxItem
        successCallback([
            {
                id: node.folderId
            }
        ]);
    }

    /**
     * Noop cancel
     *
     * @public
     */
    cancel() {}
}

export default FolderUpload;
