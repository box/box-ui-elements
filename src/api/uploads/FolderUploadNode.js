/**
 * @flow
 * @file Recursively create folder and upload files
 * @author Box
 */
import noop from 'lodash/noop';
import { getFileFromEntry } from '../../utils/uploads';
import FolderAPI from '../Folder';
import {
    STATUS_COMPLETE,
    STATUS_ERROR,
    ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED,
    ERROR_CODE_ITEM_NAME_IN_USE,
} from '../../constants';
import type {
    UploadFileWithAPIOptions,
    FileSystemFileEntry,
    FolderUploadItem,
    DirectoryReader,
} from '../../common/types/upload';

class FolderUploadNode {
    addFolderToUploadQueue: Function;

    files: Array<File> = [];

    folderId: string;

    folders: Object = {};

    name: string;

    parentFolderId: string;

    addFilesToUploadQueue: Function;

    fileAPIOptions: Object;

    baseAPIOptions: Object;

    entry: ?FileSystemFileEntry;

    /**
     * [constructor]
     *
     * @param {string} name
     * @param {Function} addFilesToUploadQueue
     * @param {Function} addFolderToUploadQueue
     * @returns {void}
     */
    constructor(
        name: string,
        addFilesToUploadQueue: Function,
        addFolderToUploadQueue: Function,
        fileAPIOptions: Object,
        baseAPIOptions: Object,
        entry?: FileSystemFileEntry,
    ) {
        this.name = name;
        this.addFilesToUploadQueue = addFilesToUploadQueue;
        this.addFolderToUploadQueue = addFolderToUploadQueue;
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

        // Check if folder was successfully created before we attempt to upload its contents.
        if (this.getFolderId()) {
            this.addFilesToUploadQueue(this.getFormattedFiles(), noop, true);
            await this.uploadChildFolders(errorCallback);
        }
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
        const promises = folders.map(folder => folder.upload(this.folderId, errorCallback));

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

        let errorEncountered = false;
        let errorCode = '';
        try {
            const data = await this.createFolder();
            this.folderId = data.id;
        } catch (error) {
            // @TODO: Handle 429
            if (error.code === ERROR_CODE_ITEM_NAME_IN_USE) {
                this.folderId = error.context_info.conflicts[0].id;
            } else if (isRoot) {
                errorCallback(error);
            } else {
                // If this is a child folder of the folder being uploaded, this errorCallback will set
                // an error message on the root folder being uploaded. Set a generic messages saying that a
                // child has caused the error. The child folder will be tagged with the error message in
                // the call to this.addFolderToUploadQueue below
                errorEncountered = true;
                errorCode = error.code;
                errorCallback({ code: ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED });
            }
        }

        // The root folder has already been added to the upload queue in ContentUploader
        if (isRoot) {
            return;
        }

        const folderObject: FolderUploadItem = {
            extension: '',
            name: this.name,
            status: STATUS_COMPLETE,
            isFolder: true,
            size: 1,
            progress: 100,
        };

        if (errorEncountered) {
            folderObject.status = STATUS_ERROR;
            folderObject.error = { code: errorCode };
        }

        this.addFolderToUploadQueue(folderObject);
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
                uploadInitTimestamp: Date.now(),
            },
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
            id: `folder_${this.parentFolderId}`,
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
            entries.map(async entry => {
                const { isFile, name } = entry;

                if (isFile) {
                    const file = await getFileFromEntry(entry);
                    this.files.push(file);
                    return;
                }

                this.folders[name] = new FolderUploadNode(
                    name,
                    this.addFilesToUploadQueue,
                    this.addFolderToUploadQueue,
                    this.fileAPIOptions,
                    {
                        ...this.baseAPIOptions,
                        ...this.fileAPIOptions,
                    },
                    entry,
                );
            }),
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
        reader.readEntries(async entries => {
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

        return new Promise(resolve => {
            // $FlowFixMe entry is not empty
            const reader = this.entry.createReader();

            this.readEntry(reader, resolve);
        });
    };

    /**
     * Returns the folderId
     * @returns {string}
     */
    getFolderId = (): string => {
        return this.folderId;
    };
}

export default FolderUploadNode;
