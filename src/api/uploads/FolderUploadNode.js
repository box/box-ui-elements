/**
 * @flow
 * @file Recursively create folder and upload files
 * @author Box
 */
import noop from 'lodash/noop';
import FolderAPI from '../../api/Folder';
import { STATUS_COMPLETE, ERROR_CODE_ITEM_NAME_IN_USE } from '../../constants';
import { getFileFromEntry } from '../../util/uploads';

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
    entry: ?FileSystemFileEntry;

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
        baseAPIOptions: Object,
        entry?: FileSystemFileEntry
    ) {
        this.name = name;
        this.uploadFile = uploadFile;
        this.addFolderToQueue = addFolderToQueue;
        this.fileAPIOptions = fileAPIOptions;
        this.baseAPIOptions = baseAPIOptions;
        this.entry = entry;
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
        this.uploadFile(this.getFormattedFiles(), noop);
        await this.uploadChildFolders(errorCallback);
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
        const folders: Array<FolderUploadNode> = Object.values(this.folders);
        const promises = folders.map((folder) => folder.upload(this.folderId, errorCallback));

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
        await this.buildCurrentFolderFromEntry();

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

    /**
     * Create FolderUploadNode instances from entries
     *
     * @private
     * @param {Array<FileSystemFileEntry>} entries
     * @returns {Promise<any>}
     */
    createFolderUploadNodesFromEntries = async (entries: Array<FileSystemFileEntry>): Promise<any> => {
        await Promise.all(
            entries.map(async (entry) => {
                const { isFile, name } = entry;

                if (isFile) {
                    const file = await getFileFromEntry(entry);
                    this.files.push(file);
                    return;
                }

                this.folders[name] = new FolderUploadNode(
                    name,
                    this.uploadFile,
                    this.addFolderToQueue,
                    this.fileAPIOptions,
                    {
                        ...this.baseAPIOptions,
                        ...this.fileAPIOptions
                    },
                    entry
                );
            })
        );
    };

    /**
     * Recursively read an entry
     *
     * @private
     * @param {DirectoryReader} reader
     * @param {Function} resolve
     * @returns {void}
     */
    readEntry = (reader: DirectoryReader, resolve: Function) => {
        reader.readEntries(async (entries) => {
            // Quit recursing when there are no remaining entries.
            if (!entries.length) {
                resolve();
                return;
            }

            await this.createFolderUploadNodesFromEntries(entries);

            this.readEntry(reader, resolve);
        }, noop);
    };

    /**
     * Build current folder from entry
     *
     * @private
     * @returns {Promise<any>}
     */
    buildCurrentFolderFromEntry = (): Promise<any> => {
        if (!this.entry) {
            return Promise.resolve();
        }

        return new Promise(async (resolve) => {
            // $FlowFixMe entry is not empty
            const reader = this.entry.createReader();

            this.readEntry(reader, resolve);
        });
    };
}

export default FolderUploadNode;
