import noop from 'lodash/noop';
import FolderUpload from '../FolderUpload';

let folderUploadInstance;
const destinationFolderID = '123';
jest.mock('../../../utils/uploads', () => ({
    ...require.requireActual('../../../utils/uploads'),
    getDataTransferItem: jest.fn(item => item.item || item),
    getEntryFromDataTransferItem: jest.fn(item => item),
    getDataTransferItemAPIOptions: jest.fn(item => item.options || {}),
}));

describe('api/uploads/FolderUpload', () => {
    beforeEach(() => {
        folderUploadInstance = new FolderUpload(noop, destinationFolderID, noop, true, {});
    });

    describe('upload()', () => {
        test('should upload folder node', async () => {
            const upload1 = jest.fn();
            const successCallbackMock = jest.fn();
            const errorCallback = () => 'errorCallback';
            folderUploadInstance.folder = { upload: upload1, getFolderId: jest.fn(() => 'f_123') };

            await folderUploadInstance.upload({ errorCallback, successCallback: successCallbackMock });

            expect(upload1).toHaveBeenCalledWith(destinationFolderID, errorCallback, true);
            expect(successCallbackMock).toHaveBeenCalledWith([
                {
                    id: 'f_123',
                },
            ]);
        });
    });

    describe('buildFolderTreeFromWebkitRelativePath()', () => {
        test('should construct folders correctly when API options exist', () => {
            folderUploadInstance.buildFolderTreeFromWebkitRelativePath([
                { file: { webkitRelativePath: 'a' }, options: {} },
                {
                    file: { name: 'f1', webkitRelativePath: 'a/f1' },
                    options: {},
                },
                {
                    file: { name: 'f2', webkitRelativePath: 'a/f2' },
                    options: {},
                },
                {
                    file: { name: 'f3', webkitRelativePath: 'a/b/f3' },
                    options: {},
                },
                {
                    file: { name: 'f4', webkitRelativePath: 'a/c/f4' },
                    options: {},
                },
            ]);

            // /
            // - a/
            expect(folderUploadInstance.folder.name).toEqual('a');
            // /a/
            // - f1
            // - f2
            // - b/
            // - c/
            const folderA = folderUploadInstance.folder;
            expect(Object.keys(folderA.folders)).toHaveLength(2);
            expect(Object.keys(folderA.folders)).toEqual(['b', 'c']);
            expect(folderA.files).toHaveLength(2);
            expect(folderA.files.map(item => item.name)).toEqual(['f1', 'f2']);
            // /a/b
            // - f3
            const folderB = folderA.folders.b;
            expect(Object.keys(folderB.folders)).toHaveLength(0);
            expect(folderB.files).toHaveLength(1);
            expect(folderB.files.map(item => item.name)).toEqual(['f3']);
            // /a/c
            // - f4
            const folderC = folderA.folders.c;
            expect(Object.keys(folderC.folders)).toHaveLength(0);
            expect(folderC.files).toHaveLength(1);
            expect(folderC.files.map(item => item.name)).toEqual(['f4']);
        });

        test('should construct folders correctly when API options are missing', () => {
            folderUploadInstance = new FolderUpload(noop, destinationFolderID, noop, false, {});
            folderUploadInstance.buildFolderTreeFromWebkitRelativePath([
                { webkitRelativePath: 'a' },
                { name: 'f1', webkitRelativePath: 'a/f1' },
                { name: 'f2', webkitRelativePath: 'a/f2' },
                { name: 'f3', webkitRelativePath: 'a/b/f3' },
                { name: 'f4', webkitRelativePath: 'a/c/f4' },
            ]);

            // /
            // - a/
            expect(folderUploadInstance.folder.name).toEqual('a');
            // /a/
            // - f1
            // - f2
            // - b/
            // - c/
            const folderA = folderUploadInstance.folder;
            expect(Object.keys(folderA.folders)).toHaveLength(2);
            expect(Object.keys(folderA.folders)).toEqual(['b', 'c']);
            expect(folderA.files).toHaveLength(2);
            expect(folderA.files.map(item => item.name)).toEqual(['f1', 'f2']);
            // /a/b
            // - f3
            const folderB = folderA.folders.b;
            expect(Object.keys(folderB.folders)).toHaveLength(0);
            expect(folderB.files).toHaveLength(1);
            expect(folderB.files.map(item => item.name)).toEqual(['f3']);
            // /a/c
            // - f4
            const folderC = folderA.folders.c;
            expect(Object.keys(folderC.folders)).toHaveLength(0);
            expect(folderC.files).toHaveLength(1);
            expect(folderC.files.map(item => item.name)).toEqual(['f4']);
        });
    });

    describe('buildFolderTreeFromDataTransferItem()', () => {
        test('should construct folders correctly', async () => {
            const createFolderUploadNodeMock = jest.fn();
            folderUploadInstance.createFolderUploadNode = createFolderUploadNodeMock;

            await folderUploadInstance.buildFolderTreeFromDataTransferItem([
                {
                    item: { name: 'f1', webkitRelativePath: 'a/f1' },
                    options: {},
                },
            ]);

            expect(createFolderUploadNodeMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('createFolderUploadNode()', () => {
        test('should create FolderUploadNode correctly', () => {
            const name = 'hi';
            const apiOptions = { apiOptions: true };
            const entry = { entry: true };

            const nodeInstance = folderUploadInstance.createFolderUploadNode(name, apiOptions, entry);

            expect(nodeInstance.name).toEqual(name);
            expect(nodeInstance.fileAPIOptions).toEqual(apiOptions);
            expect(nodeInstance.entry).toEqual(entry);
        });
    });
});
