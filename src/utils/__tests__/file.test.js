import { isBoxNote, getTypedFileId, getTypedFolderId, getFileExtension } from '../file';

describe('util/file', () => {
    describe('isBoxNote()', () => {
        test('should false when file is not a box note', () => {
            expect(
                isBoxNote({
                    extension: 'foo',
                }),
            ).toBe(false);
        });

        test('should true when file is a box note', () => {
            expect(
                isBoxNote({
                    extension: 'boxnote',
                }),
            ).toBe(true);
        });
    });

    describe('getTypedFileId()', () => {
        test('should return typed file id correctly', () => {
            expect(getTypedFileId('foo')).toBe('file_foo');
        });
    });

    describe('getTypedFolderId()', () => {
        test('should return typed folder id correctly', () => {
            expect(getTypedFolderId('foo')).toBe('folder_foo');
        });
    });

    describe('getFileExtension()', () => {
        test.each([
            ['filename.txt', 'txt'],
            ['filename.backup.mp4', 'mp4'],
            ['filename..temp.pdf', 'pdf'],
            [{ name: 'test.pdf' }, ''],
            ['invalidfilenamepdf', ''],
        ])('should return extension of file correctly', (filename, extension) => {
            expect(getFileExtension(filename)).toBe(extension);
        });
    });
});
