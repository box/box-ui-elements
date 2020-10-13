import {
    FILE_EXTENSION_GOOGLE_DOC,
    FILE_EXTENSION_GOOGLE_SHEET,
    FILE_EXTENSION_GOOGLE_SLIDE,
    FILE_EXTENSION_GOOGLE_SLIDE_LEGACY,
} from '../../constants';
import { isBoxNote, getTypedFileId, getTypedFolderId, getFileExtension, isGSuiteExtension } from '../file';

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

    describe('isGSuiteExtension()', () => {
        test.each`
            extension                             | expectedResult
            ${FILE_EXTENSION_GOOGLE_DOC}          | ${true}
            ${FILE_EXTENSION_GOOGLE_SHEET}        | ${true}
            ${FILE_EXTENSION_GOOGLE_SLIDE}        | ${true}
            ${FILE_EXTENSION_GOOGLE_SLIDE_LEGACY} | ${true}
            ${'docx'}                             | ${false}
            ${'png'}                              | ${false}
        `('should return the correct value for a $extension', ({ extension, expectedResult }) => {
            expect(isGSuiteExtension(extension)).toBe(expectedResult);
        });
    });
});
