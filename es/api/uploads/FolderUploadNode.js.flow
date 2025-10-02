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
    DEFAULT_RETRY_DELAY_MS,
    MS_IN_S,
} from '../../constants';
import type {
    UploadFileWithAPIOptions,
    FileSystemFileEntry,
    FolderUploadItem,
    DirectoryReader,
} from '../../common/types/upload';
import sleep from '../../utils/sleep';

const CHILD_FOLDER_UPLOAD_CONCURRENCY = 3;
const MAX_RETRIES = 3;

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
        // Gets FolderUploadNode values from this.folders key value pairs object
        // $FlowFixMe
        const folders: Array<FolderUploadNode> = Object.values(this.folders);

        // Worker function: picks the next folder from the array and uploads until no more folders are available
        const worker = async () => {
            while (folders.length > 0) {
                const folder = folders.pop();
                if (folder) {
                    // Await is needed to help ensure rate limit is respected
                    // eslint-disable-next-line no-await-in-loop
                    await folder.upload(this.folderId, errorCallback);
                }
            }
        };

        // Spawns up to CHILD_FOLDER_UPLOAD_CONCURRENCY workers that upload folders in parallel until folders array is empty
        const workers = [];
        for (let i = 0; i < CHILD_FOLDER_UPLOAD_CONCURRENCY && i < folders.length; i += 1) {
            workers.push(worker());
        }

        // Waits for all workers to finish
        await Promise.all(workers);
    };

    /**
     * Create folder and add it to the upload queue
     *
     * @private
     * @param {Function} errorCallback
     * @param {boolean} isRoot
     * @returns {Promise}
     */
    createAndUploadFolder = async (errorCallback: Function, isRoot: boolean, retryCount: number = 0) => {
        await this.buildCurrentFolderFromEntry();

        let errorEncountered = false;
        let errorCode = '';
        try {
            const data = await this.createFolder();
            this.folderId = data.id;
        } catch (error) {
            if (error.code === ERROR_CODE_ITEM_NAME_IN_USE) {
                this.folderId = error.context_info.conflicts[0].id;
            } else if (error.status === 429 && retryCount < MAX_RETRIES) {
                // Set a default exponential backoff delay with a random jitter(0–999 ms) to avoid all requests being sent at once
                // This will be overridden if the Retry-After header is present in the response
                let retryAfterMs = DEFAULT_RETRY_DELAY_MS * 2 ** retryCount + Math.floor(Math.random() * 1000);
                if (error.headers) {
                    const retryAfterHeaderSec = parseInt(
                        error.headers['retry-after'] || error.headers.get('Retry-After'),
                        10,
                    );
                    if (!Number.isNaN(retryAfterHeaderSec)) {
                        retryAfterMs = retryAfterHeaderSec * MS_IN_S;
                    }
                }
                await sleep(retryAfterMs);
                return this.createAndUploadFolder(errorCallback, isRoot, retryCount + 1);
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
            return undefined;
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
        return undefined;
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
