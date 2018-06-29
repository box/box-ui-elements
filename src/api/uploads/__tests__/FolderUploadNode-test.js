import noop from 'lodash/noop';
import FolderUploadNode from '../FolderUploadNode';
import FolderAPI from '../../../api/Folder';
import { ERROR_CODE_ITEM_NAME_IN_USE, STATUS_COMPLETE } from '../../../constants';

jest.mock('../../../api/Folder');

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
            create: folderCreateMock
        }));
    });

    describe('upload()', () => {
        test('should call createAndUploadFolder(), uploadFile() and uploadChildFolders()', async () => {
            const errorCallback = () => 'errorCallback';
            const parentFolderId = '0';
            const isRoot = true;
            const files = [{ file: 1 }];
            folderUploadNodeInstance.createAndUploadFolder = jest.fn(() => Promise.resolve());
            folderUploadNodeInstance.uploadFile = jest.fn();
            folderUploadNodeInstance.uploadChildFolders = jest.fn();
            folderUploadNodeInstance.getFormattedFiles = jest.fn(() => files);

            await folderUploadNodeInstance.upload(parentFolderId, errorCallback, isRoot);

            expect(folderUploadNodeInstance.createAndUploadFolder).toHaveBeenCalledWith(errorCallback, isRoot);
            expect(folderUploadNodeInstance.uploadFile).toHaveBeenCalledWith(files, expect.any(Function));
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
                    upload: upload1
                },
                b: {
                    upload: upload2
                }
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
            folderUploadNodeInstance.createFolder = jest.fn(() => ({ id: folderId }));
            folderUploadNodeInstance.addFolderToQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(errorCallback, isRoot);

            expect(folderUploadNodeInstance.createFolder).toHaveBeenCalledWith();
            expect(folderUploadNodeInstance.folderId).toBe(folderId);
        });

        test('should call errorCallback when create folder fails and error code is not ITEM_NAME_IN_USE', async () => {
            const errorCallback = jest.fn();
            const isRoot = true;
            const error = { code: 'random' };
            folderUploadNodeInstance.createFolder = jest.fn(() => Promise.reject(error));
            folderUploadNodeInstance.addFolderToQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(errorCallback, isRoot);

            expect(errorCallback).toHaveBeenCalledWith(error);
        });

        test('should recovery correctly from ITEM_NAME_IN_USE', async () => {
            const errorCallback = jest.fn();
            const folderId = '1';
            const isRoot = true;
            const error = { code: ERROR_CODE_ITEM_NAME_IN_USE, context_info: { conflicts: [{ id: folderId }] } };
            folderUploadNodeInstance.createFolder = jest.fn(() => Promise.reject(error));
            folderUploadNodeInstance.addFolderToQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(errorCallback, isRoot);

            expect(errorCallback).not.toHaveBeenCalledWith(error);
            expect(folderUploadNodeInstance.folderId).toBe(folderId);
        });

        test('should call addFolderToQueue when folder is created successfully for non-root folder', async () => {
            const folderId = '1';
            const errorCallback = () => 'errorCallback';
            const isRoot = false;
            folderUploadNodeInstance.name = name;
            folderUploadNodeInstance.createFolder = jest.fn(() => ({ id: folderId }));
            folderUploadNodeInstance.addFolderToQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(errorCallback, isRoot);

            expect(folderUploadNodeInstance.addFolderToQueue).toHaveBeenCalledWith([
                {
                    extension: '',
                    name,
                    status: STATUS_COMPLETE,
                    isFolder: true,
                    size: 1,
                    progress: 100
                }
            ]);
        });

        test('should not addFolderToQueue() when folder is created successfully for root folder', async () => {
            const folderId = '1';
            const errorCallback = () => 'errorCallback';
            const isRoot = true;
            folderUploadNodeInstance.name = name;
            folderUploadNodeInstance.createFolder = jest.fn(() => ({ id: folderId }));
            folderUploadNodeInstance.addFolderToQueue = jest.fn();

            await folderUploadNodeInstance.createAndUploadFolder(errorCallback, isRoot);

            expect(folderUploadNodeInstance.addFolderToQueue).not.toHaveBeenCalled();
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
                        uploadInitTimestamp: now
                    }
                },
                {
                    file: file2,
                    options: {
                        ...folderUploadNodeInstance.fileAPIOptions,
                        folderId: folderUploadNodeInstance.folderId,
                        uploadInitTimestamp: now
                    }
                }
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
});
