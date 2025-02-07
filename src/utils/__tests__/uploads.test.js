import browser from '../Browser';

import {
    toISOStringNoMS,
    getFileLastModifiedAsISONoMSIfPossible,
    tryParseJson,
    isDataTransferItemAFolder,
    isDataTransferItemAPackage,
    isMultiputSupported,
    getFileFromDataTransferItem,
    getPackageFileFromDataTransferItem,
    doesFileContainAPIOptions,
    doesDataTransferItemContainAPIOptions,
    getFile,
    getDataTransferItem,
    getFileAPIOptions,
    getDataTransferItemAPIOptions,
    DEFAULT_API_OPTIONS,
    getFileId,
    getDataTransferItemId,
} from '../uploads';

const mockFile = { name: 'hi' };
const entry = {
    name: 'hi',
    file: fn => {
        fn(mockFile);
    },
};
const mockItem = { kind: 'file', webkitGetAsEntry: () => entry };
const options = { options: true };

describe('util/uploads', () => {
    describe('toISOStringNoMS()', () => {
        test('should format the time string properly', () => {
            const d = new Date(1273912371111);

            expect(toISOStringNoMS(d)).toBe('2010-05-15T08:32:51Z');
        });
    });

    describe('getFileLastModifiedAsISONoMSIfPossible()', () => {
        // Test cases in order
        // file with valid last modified
        // file with non-numeric last modified (string)
        // I don't know of a browser that has lastModified as a Date object, but I just added
        // these two test cases to confirm that our code does something reasonable (i.e. return
        // a string or null, but not crash).
        // file with non-numeric lastModified (valid date)
        // file with non-numeric lastModified (invalid Date)
        // file no lastModified
        test.each`
            file                                                          | expectedResult
            ${{ lastModified: 1483326245678 }}                            | ${'2017-01-02T03:04:05Z'}
            ${{ lastModified: 'not a number' }}                           | ${null}
            ${{ lastModified: new Date('2017-01-02T03:04:05.678Z') }}     | ${'2017-01-02T03:04:05Z'}
            ${{ lastModified: new Date('not valid') }}                    | ${null}
            ${{ lastModified: -11644473600 }}                             | ${null}
            ${{}}                                                         | ${null}
            ${{ lastModifiedDate: 1483326245678 }}                        | ${'2017-01-02T03:04:05Z'}
            ${{ lastModifiedDate: 'not a number' }}                       | ${null}
            ${{ lastModifiedDate: new Date('2017-01-02T03:04:05.678Z') }} | ${'2017-01-02T03:04:05Z'}
            ${{ lastModifiedDate: new Date('not valid') }}                | ${null}
            ${{ lastModifiedDate: -11644473600 }}                         | ${null}
            ${{}}                                                         | ${null}
        `(
            'should return the properly formatted date when possible and return null otherwise',
            ({ file, expectedResult }) => {
                expect(getFileLastModifiedAsISONoMSIfPossible(file)).toBe(expectedResult);
            },
        );
    });

    describe('tryParseJson()', () => {
        test.each`
            str           | expectedResult
            ${''}         | ${null}
            ${'a'}        | ${null}
            ${'{'}        | ${null}
            ${'1'}        | ${1}
            ${'"a"'}      | ${'a'}
            ${'{}'}       | ${{}}
            ${'[1,2,3]'}  | ${[1, 2, 3]}
            ${'{"a": 1}'} | ${{ a: 1 }}
        `('should return correct results', ({ str, expectedResult }) => {
            expect(tryParseJson(str)).toEqual(expectedResult);
        });
    });

    describe('doesFileContainAPIOptions()', () => {
        test('should return true when argument is UploadFileWithAPIOptions type', () => {
            expect(
                doesFileContainAPIOptions({
                    file: mockFile,
                    options,
                }),
            ).toBeTruthy();
        });

        test('should return false when argument is UploadFile type', () => {
            expect(doesFileContainAPIOptions(mockFile)).toBeFalsy();
        });
    });

    describe('doesDataTransferItemContainAPIOptions()', () => {
        test('should return true when argument is UploadDataTransferItemWithAPIOptions type', () => {
            expect(
                doesDataTransferItemContainAPIOptions({
                    item: mockItem,
                    options,
                }),
            ).toBeTruthy();
        });

        test('should return false when argument is DataTransferItem type', () => {
            expect(doesDataTransferItemContainAPIOptions(mockItem)).toBeFalsy();
        });
    });

    describe('getFile()', () => {
        test('should return file when argument is UploadFileWithAPIOptions type', () => {
            expect(
                getFile({
                    file: mockFile,
                    options,
                }),
            ).toEqual(mockFile);
        });

        test('should return file when argument is UploadFile type', () => {
            expect(getFile(mockFile)).toEqual(mockFile);
        });
    });

    describe('getDataTransferItem()', () => {
        test('should return item when argument is UploadDataTransferItemWithAPIOptions type', () => {
            expect(
                getDataTransferItem({
                    item: mockItem,
                    options,
                }),
            ).toEqual(mockItem);
        });

        test('should return item when argument is DataTransferItem type', () => {
            expect(getDataTransferItem(mockItem)).toEqual(mockItem);
        });
    });

    describe('getFileAPIOptions()', () => {
        test('should return options when argument is UploadFileWithAPIOptions type', () => {
            expect(
                getFileAPIOptions({
                    file: mockFile,
                    options,
                }),
            ).toEqual(options);
        });

        test('should return DEFAULT_API_OPTIONS when argument is UploadFile type', () => {
            expect(getFileAPIOptions(mockFile)).toEqual(DEFAULT_API_OPTIONS);
        });
    });

    describe('getDataTransferItemAPIOptions()', () => {
        test('should return options when argument is UploadDataTransferItemWithAPIOptions type', () => {
            expect(
                getDataTransferItemAPIOptions({
                    item: mockItem,
                    options,
                }),
            ).toEqual(options);
        });

        test('should return DEFAULT_API_OPTIONS when argument is DataTransferItem type', () => {
            expect(getDataTransferItemAPIOptions(mockItem)).toEqual(DEFAULT_API_OPTIONS);
        });
    });

    describe('getFileFromDataTransferItem()', () => {
        test('should return file of UploadFileWithAPIOptions type when itemData is UploadDataTransferItemWithAPIOptions type', async () => {
            const itemData = {
                item: mockItem,
                options,
            };

            expect(await getFileFromDataTransferItem(itemData)).toEqual({
                file: mockFile,
                options,
            });
        });
    });

    describe('getPackageFileFromDataTransferItem()', () => {
        test('should return file of UploadFileWithAPIOptions type when itemData is UploadDataTransferItemWithAPIOptions type', async () => {
            const mockPackageItem = {
                getAsFile: jest.fn(() => mockFile),
                webkitGetAsEntry: () => entry,
            };
            const itemData = {
                item: mockPackageItem,
                options,
            };

            expect(await getPackageFileFromDataTransferItem(itemData)).toEqual({
                file: mockFile,
                options,
            });
        });
    });

    describe('isDataTransferItemAPackage()', () => {
        test('should be false if data transfer item thinks it is a folder', () => {
            const folderEntry = {
                isDirectory: true,
            };

            const folderItem = {
                kind: '',
                webkitGetAsEntry: () => folderEntry,
            };

            const itemData = {
                item: folderItem,
                options,
            };

            expect(isDataTransferItemAPackage(itemData)).toBeFalsy();
        });

        test('should be false if data transfer item thinks it is a file', () => {
            const fileEntry = {
                isDirectory: false,
                isFile: true,
            };

            const folderItem = {
                kind: 'file',
                webkitGetAsEntry: () => fileEntry,
            };

            const itemData = {
                item: folderItem,
                options,
            };

            expect(isDataTransferItemAPackage(itemData)).toBeFalsy();
        });

        test('should be true if data transfer item has both identifies a directory but has kind = file and type = application/zip', () => {
            const packageEntry = {
                isDirectory: true,
                isFile: false,
            };

            const folderItem = {
                kind: 'file',
                type: 'application/zip',
                webkitGetAsEntry: () => packageEntry,
            };

            const itemData = {
                item: folderItem,
                options,
            };

            expect(isDataTransferItemAPackage(itemData)).toBeTruthy();
        });

        test('should be false if data transfer item has both identifies a directory but only has kind = file', () => {
            const packageEntry = {
                isDirectory: true,
                isFile: false,
            };

            const folderItem = {
                kind: 'file',
                webkitGetAsEntry: () => packageEntry,
            };

            const itemData = {
                item: folderItem,
                options,
            };

            expect(isDataTransferItemAPackage(itemData)).toBeFalsy();
        });
    });

    describe('isDataTransferItemAFolder()', () => {
        test('should return true if item is a folder', () => {
            const folderEntry = {
                isDirectory: true,
            };
            const folderItem = {
                kind: '',
                webkitGetAsEntry: () => folderEntry,
            };

            const itemData = {
                item: folderItem,
                options,
            };

            expect(isDataTransferItemAFolder(itemData)).toBeTruthy();
        });

        test('should return false if item is not a folder', () => {
            const fileEntry = {
                isDirectory: false,
            };
            const fileItem = { kind: '', webkitGetAsEntry: () => fileEntry };

            const itemData = {
                item: fileItem,
                options,
            };

            expect(isDataTransferItemAFolder(itemData)).toBeFalsy();
        });

        test('should return false if item does not have an entry', () => {
            const fileItem = { kind: '', webkitGetAsEntry: () => undefined };

            expect(isDataTransferItemAFolder(fileItem)).toBeFalsy();
        });
    });

    describe('getFileId()', () => {
        test('should return file id correctly when file does not contain API options', () => {
            const file = {
                name: 'hi',
            };

            expect(getFileId(file)).toBe('hi');
        });

        test('should return file id correctly when file does contain API options', () => {
            const file = {
                file: {
                    name: 'hi',
                },
                options: {
                    folderId: '0',
                    uploadInitTimestamp: 123123,
                },
            };

            expect(getFileId(file)).toBe('hi_0_123123');
        });
    });

    describe('getFileId()', () => {
        test('should return file id correctly when file does not contain API options', () => {
            const file = {
                name: 'hi',
            };

            expect(getFileId(file)).toBe('hi');
        });

        test('should return file id correctly when file does contain API options', () => {
            const file = {
                file: {
                    name: 'hi',
                },
                options: {
                    folderId: '0',
                    uploadInitTimestamp: 123123,
                },
            };

            expect(getFileId(file)).toBe('hi_0_123123');
        });
    });

    describe('getDataTransferItemId()', () => {
        const rootFolderId = 0;
        const now = Date.now();
        Date.now = jest.fn(() => now);

        test('should return item id correctly when item does not contain API options', () => {
            expect(getDataTransferItemId(mockItem, rootFolderId)).toBe('hi');
        });

        test('should return item id correctly when item does contain API options', () => {
            const item = {
                item: mockItem,
                options: {
                    folderId: '0',
                    uploadInitTimestamp: 123123,
                },
            };

            expect(getDataTransferItemId(item, rootFolderId)).toBe('hi_0_123123');
        });
    });

    describe('isMultiputSupported()', () => {
        let windowSpy;

        beforeEach(() => {
            windowSpy = jest.spyOn(window, 'window', 'get');
        });

        afterEach(() => {
            windowSpy.mockRestore();
        });

        test.each([
            ['mobile safari', true, false],
            ['mobile other browsers', false, true],
        ])('should return whether multiput is supported on device: %o', (test, mobileSafari, expected) => {
            windowSpy.mockImplementation(() => ({
                crypto: { subtle: true },
                location: { protocol: 'https:' },
            }));
            browser.isMobileSafari = jest.fn().mockReturnValueOnce(mobileSafari);
            expect(isMultiputSupported()).toEqual(expected);
        });
    });
});
