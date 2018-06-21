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
    createFolder: Function;
    uploadFile: Function;
    addFolderToQueue: Function;

    /**
     * [constructor]
     *
     * @param {Function} createFolder
     * @param {Function} uploadFile
     * @param {string} destinationFolderID
     * @param {Function} addFolderToQueue
     * @return {void}
     */
    constructor(
        createFolder: Function,
        uploadFile: Function,
        destinationFolderID: string,
        addFolderToQueue: Function
    ): void {
        this.createFolder = createFolder;
        this.uploadFile = uploadFile;
        this.destinationFolderID = destinationFolderID;
        this.addFolderToQueue = addFolderToQueue;
    }

    /**
     * Creates a folder tree from wekbkitRelativePath
     *
     * @param  {FileList} Array<UploadFileWithAPIOptions | File> | FileList
     * @returns {void}
     */
    buildFolderTree(fileList: Array<UploadFileWithAPIOptions | File> | FileList): void {
        // FileList does not natively have forEach, hence this workaround
        Array.prototype.forEach.call(fileList, (file) => {
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
                        this.createFolder,
                        this.uploadFile,
                        this.addFolderToQueue
                    );
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
     * Upload folderNodes
     *
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
     */
    cancel() {}
}

export default FolderUpload;
