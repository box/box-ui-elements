import noop from 'lodash/noop';
import FolderUpload from '../FolderUpload';

let folderUploadInstance;
const destinationFolderID = '123';

describe('api/uploads/FolderUpload', () => {
    beforeEach(() => {
        folderUploadInstance = new FolderUpload(noop, destinationFolderID, noop, true, {});
    });

    describe('upload()', () => {
        test('should upload each folder node', () => {
            const upload1 = jest.fn();
            const upload2 = jest.fn();
            const errorCallback = () => 'errorCallback';
            folderUploadInstance.folders = {
                1: { upload: upload1 },
                2: { upload: upload2 }
            };

            folderUploadInstance.upload({ errorCallback });

            expect(upload1).toHaveBeenCalledWith(destinationFolderID, errorCallback, true);
            expect(upload2).toHaveBeenCalledWith(destinationFolderID, errorCallback, true);
        });
    });

    describe('buildFolderTreeFromWebkitRelativePath()', () => {
        test('should construct folders correctly when API options exist', () => {
            folderUploadInstance.buildFolderTreeFromWebkitRelativePath([
                { file: { webkitRelativePath: 'a' }, options: {} },
                { file: { name: 'f1', webkitRelativePath: 'a/f1' }, options: {} },
                { file: { name: 'f2', webkitRelativePath: 'a/f2' }, options: {} },
                { file: { name: 'f3', webkitRelativePath: 'a/b/f3' }, options: {} },
                { file: { name: 'f4', webkitRelativePath: 'a/c/f4' }, options: {} }
            ]);

            // /
            // - a/
            expect(Object.values(folderUploadInstance.folders)).toHaveLength(1);
            expect(Object.keys(folderUploadInstance.folders)).toEqual(['a']);
            // /a/
            // - f1
            // - f2
            // - b/
            // - c/
            const folderA = folderUploadInstance.folders.a;
            expect(Object.keys(folderA.folders)).toHaveLength(2);
            expect(Object.keys(folderA.folders)).toEqual(['b', 'c']);
            expect(folderA.files).toHaveLength(2);
            expect(folderA.files.map((item) => item.name)).toEqual(['f1', 'f2']);
            // /a/b
            // - f3
            const folderB = folderA.folders.b;
            expect(Object.keys(folderB.folders)).toHaveLength(0);
            expect(folderB.files).toHaveLength(1);
            expect(folderB.files.map((item) => item.name)).toEqual(['f3']);
            // /a/c
            // - f4
            const folderC = folderA.folders.c;
            expect(Object.keys(folderC.folders)).toHaveLength(0);
            expect(folderC.files).toHaveLength(1);
            expect(folderC.files.map((item) => item.name)).toEqual(['f4']);
        });

        test('should construct folders correctly when API options are missing', () => {
            folderUploadInstance = new FolderUpload(noop, destinationFolderID, noop, false, {});
            folderUploadInstance.buildFolderTreeFromWebkitRelativePath([
                { webkitRelativePath: 'a' },
                { name: 'f1', webkitRelativePath: 'a/f1' },
                { name: 'f2', webkitRelativePath: 'a/f2' },
                { name: 'f3', webkitRelativePath: 'a/b/f3' },
                { name: 'f4', webkitRelativePath: 'a/c/f4' }
            ]);

            // /
            // - a/
            expect(Object.values(folderUploadInstance.folders)).toHaveLength(1);
            expect(Object.keys(folderUploadInstance.folders)).toEqual(['a']);
            // /a/
            // - f1
            // - f2
            // - b/
            // - c/
            const folderA = folderUploadInstance.folders.a;
            expect(Object.keys(folderA.folders)).toHaveLength(2);
            expect(Object.keys(folderA.folders)).toEqual(['b', 'c']);
            expect(folderA.files).toHaveLength(2);
            expect(folderA.files.map((item) => item.name)).toEqual(['f1', 'f2']);
            // /a/b
            // - f3
            const folderB = folderA.folders.b;
            expect(Object.keys(folderB.folders)).toHaveLength(0);
            expect(folderB.files).toHaveLength(1);
            expect(folderB.files.map((item) => item.name)).toEqual(['f3']);
            // /a/c
            // - f4
            const folderC = folderA.folders.c;
            expect(Object.keys(folderC.folders)).toHaveLength(0);
            expect(folderC.files).toHaveLength(1);
            expect(folderC.files.map((item) => item.name)).toEqual(['f4']);
        });
    });
});
