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
        test('Should return extension of file correctly', () => {
            expect(getFileExtension('filename.txt')).toBe('txt');
            expect(getFileExtension('filename.backup.mp4')).toBe('mp4');
            expect(getFileExtension('filename..temp.pdf')).toBe('pdf');
            expect(getFileExtension({ name: 'test.pdf' })).toBe(null);
            expect(getFileExtension('invalidfilenamepdf')).toBe(null);
        });
    });
});
