/**
 * @flow
 * @file Recursively create folder and upload files
 * @author Box
 */

import { STATUS_COMPLETE } from '../../constants';

class FolderUploadNode {
    addFolderToQueue: Function;
    createFolder: Function;
    files: Array<File> = [];
    folderID: string;
    folders: Object = {};
    name: string;
    parentFolderID: string;
    uploadFile: Function;

    /**
     * [constructor]
     *
     * @param {string} name
     * @param {Function} createFolder
     * @param {Function} uploadFile
     * @param {Function} addFolderToQueue
     * @returns {void}
     */
    constructor(name: string, createFolder: Function, uploadFile: Function, addFolderToQueue: Function) {
        this.name = name;
        this.createFolder = createFolder;
        this.uploadFile = uploadFile;
        this.addFolderToQueue = addFolderToQueue;
    }

    /**
     * Upload a folder upload node
     *
     * @param {string} parentFolderID
     * @param {Function} errorCallback
     * @param {boolean} isRoot
     * @returns {Promise}
     */
    async upload(parentFolderID: string, errorCallback: Function, isRoot: boolean = false) {
        try {
            const data = await this.createFolderPromise(parentFolderID);
            this.folderID = data.id;
        } catch (error) {
            if (error.code !== 'item_name_in_use') {
                errorCallback(error);
            }
            this.folderID = error.context_info.conflicts[0].id;
        }

        if (!isRoot) {
            this.addFolderToQueue([
                {
                    extension: '',
                    name: this.name,
                    status: STATUS_COMPLETE,
                    isFolder: true
                }
            ]);
        }

        const filesWithOptions = this.files.map((file) => ({
            file,
            options: {
                folderId: this.folderID,
                uploadInitTimestamp: Date.now()
            }
        }));

        this.uploadFile(filesWithOptions, true);

        /* eslint-disable no-restricted-syntax */
        // $FlowFixMe this.folders values are FolderUploadNode
        for (const folder: FolderUploadNode of Object.values(this.folders)) {
            // eslint-disable-next-line no-await-in-loop
            await folder.upload(this.folderID, errorCallback);
        }
        /* eslint-enable no-restricted-syntax */
    }

    /**
     * Promisify create folder
     *
     * @param {string} parentFolderID
     * @returns {Promise}
     */
    createFolderPromise(parentFolderID: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createFolder(parentFolderID, this.name, resolve, reject);
        });
    }
}

export default FolderUploadNode;
