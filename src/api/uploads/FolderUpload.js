/**
 * @flow
 * @file Folder upload bootstrapping
 * @author Box
 */

import FolderUploadNode from './FolderUploadNode';

const PATH_DELIMITER = '/';

class FolderUpload {
    folderNodes: Object = {};
    files: Array<File> = [];
    destinationFolderID: string;
    uploadFile: Function;
    addFolderToQueue: Function;
    areAPIOptionsInFiles: boolean;
    baseAPIOptions: Object;

    /**
     * [constructor]
     *
     * @param {Function} uploadFile
     * @param {string} destinationFolderID
     * @param {Function} addFolderToQueue
     * @param {boolean} areAPIOptionsInFiles
     * @param {Object} baseAPIOptions
     * @return {void}
     */
    constructor(
        uploadFile: Function,
        destinationFolderID: string,
        addFolderToQueue: Function,
        areAPIOptionsInFiles: boolean,
        baseAPIOptions: Object
    ): void {
        this.uploadFile = uploadFile;
        this.destinationFolderID = destinationFolderID;
        this.addFolderToQueue = addFolderToQueue;
        this.areAPIOptionsInFiles = areAPIOptionsInFiles;
        this.baseAPIOptions = baseAPIOptions;
    }

    /**
     * Creates a folder tree from wekbkitRelativePath
     *
     * @public
     * @param  {Array} Array<UploadFileWithAPIOptions | File> | FileList
     * @returns {void}
     */
    buildFolderTree(fileList: Array<UploadFileWithAPIOptions | File> | FileList): void {
        // FileList does not natively have forEach, hence this workaround
        Array.prototype.forEach.call(fileList, (fileData) => {
            const file = this.areAPIOptionsInFiles ? fileData.file : fileData;
            const pathArray = file.webkitRelativePath.split(PATH_DELIMITER).slice(0, -1);
            if (pathArray.length <= 0) {
                return;
            }

            let subTree = this.folderNodes;
            // Walk the path
            pathArray.forEach((folderName, index) => {
                // Create new child folder
                if (!subTree[folderName]) {
                    subTree[folderName] = new FolderUploadNode(
                        folderName,
                        this.uploadFile,
                        this.addFolderToQueue,
                        this.areAPIOptionsInFiles,
                        this.baseAPIOptions
                    );
                }

                if (index === pathArray.length - 1) {
                    // end of path, push the file
                    subTree[folderName].files.push(fileData);
                } else {
                    // walk the tree
                    subTree = subTree[folderName].folders;
                }
            });
        });
    }

    /**
     * Upload folderNodes
     *
     * @public
     * @param {Object} Options
     * @param {Function} options.errorCallback
     * @returns {void}
     */
    upload({ errorCallback }: { errorCallback: Function }): void {
        // $FlowFixMe
        Object.values(this.folderNodes).forEach((node: FolderUploadNode) => {
            node.upload(this.destinationFolderID, errorCallback, true);
        });
    }

    /**
     * Noop cancel
     *
     * @public
     */
    cancel() {}
}

export default FolderUpload;
