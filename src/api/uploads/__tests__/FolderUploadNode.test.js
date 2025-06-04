import noop from 'lodash/noop';
import FolderUploadNode from '../FolderUploadNode';
import FolderAPI from '../../Folder';
import sleep from '../../../utils/sleep';
import {
    ERROR_CODE_ITEM_NAME_IN_USE,
    STATUS_COMPLETE,
    ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED,
} from '../../../constants';

jest.mock('../../Folder');
jest.mock('../../../utils/uploads', () => ({
    ...jest.requireActual('../../../utils/uploads'),
    getFileFromEntry: jest.fn(entry => entry),
}));
jest.mock('../../../utils/sleep', () => jest.fn(() => Promise.resolve()));

let folderUploadNodeInstance;
let folderCreateMock;

describe('api/uploads/FolderUploadNode', () => {
    const name = 'hi';

    beforeEach(() => {
        folderUploadNodeInstance = new FolderUploadNode(name, noop, noop, {}, {});
        folderCreateMock = jest.fn((a, b, resolve) => {
            resolve();
        });
        FolderAPI.mockClear();
        FolderAPI.mockImplementation(() => ({
            create: folderCreateMock,
        }));
    });

    describe('upload()', () => {
        test('should call createAndUploadFolder(), addFilesToUploadQueue() and uploadChildFolders()', async () => {
            const errorCallback = () => 'errorCallback';
            const parentFolderId = '0';
            const isRoot = true;
            const files = [{ file: 1 }];
            folderUploadNodeInstance.createAndUploadFolder = jest.fn(() => Promise.resolve());
            folderUploadNodeInstance.addFilesToUploadQueue = jest.fn();
            folderUploadNodeInstance.uploadChildFolders = jest.fn();
            folderUploadNodeInstance.getFormattedFiles = jest.fn(() => files);
            folderUploadNodeInstance.getFolderId = jest.fn(() => 123);

            await folderUploadNodeInstance.upload(parentFolderId, errorCallback, isRoot);

            expect(folderUploadNodeInstance.createAndUploadFolder).toHaveBeenCalledWith(errorCallback, isRoot);
            expect(folderUploadNodeInstance.addFilesToUploadQueue).toHaveBeenCalledWith(
                files,
                expect.any(Function),
                true,
            );
            expect(folderUploadNodeInstance.uploadChildFolders).toHaveBeenCalledWith(errorCallback);
        });
    });

    describe('uploadChildFolders()', () => {
        test('should upload all child folders', async () => {
            const errorCallback = () => 'errorCallback';
            const upload1 = jest.fn();
            const upload2 = jest.fn();
            folderUploadNodeInstance.folders = {
                a: {
                    upload: upload1,
                },
                b: {
                    upload: upload2,
                },
            };
            folderUploadNodeInstance.folderId = '123';

            await folderUploadNodeInstance.uploadChildFolders(errorCallback);

            expect(upload1).toHaveBeenCalledWith(folderUploadNodeInstance.folderId, errorCallback);
        });
    });

    describe('createAndUploadFolder()', () => {
        test('should create folder', async () => {
            const folderId = '1';
            const errorCallback = () => 'errorCallback';
            const isRoot = true;
            folderUploadNodeInstance.createFolder = jest.fn(() => ({
                id: folderId,
            }));
            folderUploadNodeInstance.addFolderToUploadQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(errorCallback, isRoot);

            expect(folderUploadNodeInstance.createFolder).toHaveBeenCalledWith();
            expect(folderUploadNodeInstance.folderId).toBe(folderId);
        });

        test('should call errorCallback when create folder fails and error code is not ITEM_NAME_IN_USE', async () => {
            const errorCallback = jest.fn();
            const isRoot = true;
            const error = { code: 'random' };
            folderUploadNodeInstance.createFolder = jest.fn(() => Promise.reject(error));
            folderUploadNodeInstance.addFolderToUploadQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(errorCallback, isRoot);

            expect(errorCallback).toHaveBeenCalledWith(error);
        });

        test('should recovery correctly from ITEM_NAME_IN_USE', async () => {
            const errorCallback = jest.fn();
            const folderId = '1';
            const isRoot = true;
            const error = {
                code: ERROR_CODE_ITEM_NAME_IN_USE,
                context_info: { conflicts: [{ id: folderId }] },
            };
            folderUploadNodeInstance.createFolder = jest.fn(() => Promise.reject(error));
            folderUploadNodeInstance.addFolderToUploadQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(errorCallback, isRoot);

            expect(errorCallback).not.toHaveBeenCalledWith(error);
            expect(folderUploadNodeInstance.folderId).toBe(folderId);
        });

        test('should call addFolderToUploadQueue if the sub-folder(s) already exist', async () => {
            const folderId = '1';
            const errorCallback = jest.fn();
            const isRoot = false;
            const error = {
                code: ERROR_CODE_ITEM_NAME_IN_USE,
                context_info: { conflicts: [{ id: folderId }] },
            };
            folderUploadNodeInstance.name = name;
            folderUploadNodeInstance.createFolder = jest.fn(() => Promise.reject(error));
            folderUploadNodeInstance.addFolderToUploadQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(errorCallback, isRoot);

            expect(errorCallback).not.toHaveBeenCalledWith(error);
            expect(errorCallback).not.toHaveBeenCalledWith({ code: ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED });
            expect(folderUploadNodeInstance.addFolderToUploadQueue).toHaveBeenCalledWith({
                extension: '',
                name,
                status: STATUS_COMPLETE,
                isFolder: true,
                size: 1,
                progress: 100,
            });
        });

        test('should call addFolderToUploadQueue when folder is created successfully for non-root folder', async () => {
            const folderId = '1';
            const errorCallback = () => 'errorCallback';
            const isRoot = false;
            folderUploadNodeInstance.name = name;
            folderUploadNodeInstance.createFolder = jest.fn(() => ({
                id: folderId,
            }));
            folderUploadNodeInstance.addFolderToUploadQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(errorCallback, isRoot);

            expect(folderUploadNodeInstance.addFolderToUploadQueue).toHaveBeenCalledWith({
                extension: '',
                name,
                status: STATUS_COMPLETE,
                isFolder: true,
                size: 1,
                progress: 100,
            });
        });

        test('should not addFolderToUploadQueue() when folder is created successfully for root folder', async () => {
            const folderId = '1';
            const errorCallback = () => 'errorCallback';
            const isRoot = true;
            folderUploadNodeInstance.name = name;
            folderUploadNodeInstance.createFolder = jest.fn(() => ({
                id: folderId,
            }));
            folderUploadNodeInstance.addFolderToUploadQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(errorCallback, isRoot);

            expect(folderUploadNodeInstance.addFolderToUploadQueue).not.toHaveBeenCalled();
        });

        test('should retry on 429 with default delay', async () => {
            const error = { status: 429 };
            const success = { id: '123' };
            const createFolder = jest.fn().mockRejectedValueOnce(error).mockResolvedValueOnce(success);
            folderUploadNodeInstance.createFolder = createFolder;
            folderUploadNodeInstance.addFolderToUploadQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(jest.fn(), false, 0);

            expect(createFolder).toHaveBeenCalledTimes(2);
            expect(folderUploadNodeInstance.folderId).toBe('123');
        });

        test.each`
            headersMock                                                  | description
            ${{ 'retry-after': '2' }}                                    | ${'lower case plain object'}
            ${{ get: key => (key === 'Retry-After' ? '2' : undefined) }} | ${'capitalized map object'}
        `('should handle $description headers', async ({ headersMock }) => {
            const error = { status: 429, headers: headersMock };
            const success = { id: '123' };
            const createFolder = jest.fn().mockRejectedValueOnce(error).mockResolvedValueOnce(success);
            folderUploadNodeInstance.createFolder = createFolder;
            folderUploadNodeInstance.addFolderToUploadQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(jest.fn(), false, 0);

            expect(sleep).toHaveBeenCalledWith(2000);
            expect(createFolder).toHaveBeenCalledTimes(2);
            expect(folderUploadNodeInstance.folderId).toBe('123');
        });

        test('should stop retrying after max retries', async () => {
            const error = { status: 429 };
            const createFolder = jest.fn().mockRejectedValue(error);
            folderUploadNodeInstance.createFolder = createFolder;
            folderUploadNodeInstance.addFolderToUploadQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(jest.fn(), false, 3);

            expect(createFolder).toHaveBeenCalledTimes(1);
            expect(folderUploadNodeInstance.folderId).toBeUndefined();
        });
    });

    describe('getFormattedFiles()', () => {
        test('should return correctly formatted file', () => {
            const now = Date.now();
            Date.now = jest.fn(() => now);
            const file1 = { name: 1 };
            const file2 = { name: 2 };
            folderUploadNodeInstance.files = [file1, file2];

            folderUploadNodeInstance.folderId = '1';
            folderUploadNodeInstance.fileAPIOptions = { a: 1, b: 2 };

            const data = folderUploadNodeInstance.getFormattedFiles();

            expect(data).toEqual([
                {
                    file: file1,
                    options: {
                        ...folderUploadNodeInstance.fileAPIOptions,
                        folderId: folderUploadNodeInstance.folderId,
                        uploadInitTimestamp: now,
                    },
                },
                {
                    file: file2,
                    options: {
                        ...folderUploadNodeInstance.fileAPIOptions,
                        folderId: folderUploadNodeInstance.folderId,
                        uploadInitTimestamp: now,
                    },
                },
            ]);
        });
    });

    describe('createFolder()', () => {
        test('create folder with folderAPI', async () => {
            const parentFolderId = '0';
            folderUploadNodeInstance.folderId = '123';
            folderUploadNodeInstance.folderId = '123';
            folderUploadNodeInstance.parentFolderId = parentFolderId;

            await folderUploadNodeInstance.createFolder();

            expect(FolderAPI).toHaveBeenCalled();
            expect(folderCreateMock).toHaveBeenCalled();
        });
    });

    describe('buildCurrentFolderFromEntry()', () => {
        test('should resolve when entry is empty', async () => {
            folderUploadNodeInstance.entry = undefined;

            try {
                await folderUploadNodeInstance.buildCurrentFolderFromEntry();
            } catch (error) {
                throw Error('buildCurrentFolderFromEntry throws an error');
            }
        });

        test('should readEntry() when entry is not empty', async () => {
            const reader = { reader: true };
            folderUploadNodeInstance.readEntry = (readerParam, resolve) => {
                expect(readerParam).toEqual(reader);
                resolve();
            };

            folderUploadNodeInstance.entry = {
                createReader: () => reader,
            };

            await folderUploadNodeInstance.buildCurrentFolderFromEntry();
        });
    });

    describe('readEntry()', () => {
        test('should call readEntries() on the reader instance', async () => {
            const readEntriesMock = jest.fn();
            const reader = { readEntries: readEntriesMock };

            await folderUploadNodeInstance.readEntry(reader, noop);

            expect(readEntriesMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('createFolderUploadNodesFromEntries()', () => {
        test('should create folders and files from entries', async () => {
            const entries = [
                { name: '1', isFile: true },
                { name: '2', isFile: false },
                { name: '3', isFile: true },
            ];

            await folderUploadNodeInstance.createFolderUploadNodesFromEntries(entries);

            expect(folderUploadNodeInstance.files).toEqual([
                { name: '1', isFile: true },
                { name: '3', isFile: true },
            ]);
            expect(Object.keys(folderUploadNodeInstance.folders)).toHaveLength(1);
            expect(folderUploadNodeInstance.folders['2'].name).toEqual('2');
            expect(folderUploadNodeInstance.folders['2'].entry).toEqual(entries[1]);
        });
    });
});
