import { withData } from 'leche';
import {
    toISOStringNoMS,
    getFileLastModifiedAsISONoMSIfPossible,
    tryParseJson,
    isDataTransferItemAFolder,
    getFileFromDataTransferItem,
    doesFileContainAPIOptions,
    doesDataTransferItemContainAPIOptions,
    getFile,
    getDataTransferItem,
    getFileAPIOptions,
    getDataTransferItemAPIOptions,
    DEFAULT_API_OPTIONS,
    getFileId,
    getDataTransferItemId
} from '../uploads';

const mockFile = { name: 'hi' };
const entry = {
    name: 'hi',
    file: (fn) => {
        fn(mockFile);
    }
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
        withData(
            {
                'file with valid lastModified': [
                    {
                        lastModified: 1483326245678
                    },
                    '2017-01-02T03:04:05Z'
                ],
                'file with non-numeric lastModified (string)': [
                    {
                        lastModified: 'not a number'
                    },
                    null
                ],
                // I don't know of a browser that has lastModified as a Date object, but I just added
                // these two test cases to confirm that our code does something reasonable (i.e. return
                // a string or null, but not crash).
                'file with non-numeric lastModified (valid Date)': [
                    {
                        lastModified: new Date('2017-01-02T03:04:05.678Z')
                    },
                    '2017-01-02T03:04:05Z'
                ],
                'file with non-numeric lastModified (invalid Date)': [
                    {
                        lastModified: new Date('not valid')
                    },
                    null
                ],
                'file no lastModified': [{}, null]
            },
            (file, expectedResult) => {
                test('should return the properly formatted date when possible and return null otherwise', () => {
                    expect(getFileLastModifiedAsISONoMSIfPossible(file)).toBe(expectedResult);
                });
            }
        );
    });

    describe('tryParseJson()', () => {
        withData(
            [
                ['', null],
                ['a', null],
                ['{', null],
                ['1', 1],
                ['"a"', 'a'],
                ['{}', {}],
                ['[1,2,3]', [1, 2, 3]],
                ['{"a": 1}', { a: 1 }]
            ],
            (str, expectedResult) => {
                test('should return correct results', () => {
                    expect(tryParseJson(str)).toEqual(expectedResult);
                });
            }
        );
    });

    describe('doesFileContainAPIOptions()', () => {
        test('should return true when argument is UploadFileWithAPIOptions type', () => {
            expect(
                doesFileContainAPIOptions({
                    file: mockFile,
                    options
                })
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
                    options
                })
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
                    options
                })
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
                    options
                })
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
                    options
                })
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
                    options
                })
            ).toEqual(options);
        });

        test('should return DEFAULT_API_OPTIONS when argument is DataTransferItem type', () => {
            expect(getDataTransferItemAPIOptions(mockItem)).toEqual(DEFAULT_API_OPTIONS);
        });
    });

    describe('getFileFromDataTransferItem()', () => {
        // eslint-disable-next-line
        test('should return file of UploadFileWithAPIOptions type when itemData is UploadDataTransferItemWithAPIOptions type', async () => {
            const itemData = {
                item: mockItem,
                options
            };

            expect(await getFileFromDataTransferItem(itemData)).toEqual({
                file: mockFile,
                options
            });
        });
    });

    describe('isDataTransferItemAFolder()', () => {
        test('should return true if item is a folder', () => {
            const folderEntry = {
                isDirectory: true
            };
            const folderItem = { kind: '', webkitGetAsEntry: () => folderEntry };

            const itemData = {
                item: folderItem,
                options
            };

            expect(isDataTransferItemAFolder(itemData)).toBeTruthy();
        });

        test('should return false if item is not a folder', () => {
            const fileEntry = {
                isDirectory: false
            };
            const fileItem = { kind: '', webkitGetAsEntry: () => fileEntry };

            const itemData = {
                item: fileItem,
                options
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
                name: 'hi'
            };

            expect(getFileId(file)).toBe('hi');
        });

        test('should return file id correctly when file does contain API options', () => {
            const file = {
                file: {
                    name: 'hi'
                },
                options: {
                    folderId: '0',
                    uploadInitTimestamp: 123123
                }
            };

            expect(getFileId(file)).toBe('hi_0_123123');
        });
    });

    describe('getFileId()', () => {
        test('should return file id correctly when file does not contain API options', () => {
            const file = {
                name: 'hi'
            };

            expect(getFileId(file)).toBe('hi');
        });

        test('should return file id correctly when file does contain API options', () => {
            const file = {
                file: {
                    name: 'hi'
                },
                options: {
                    folderId: '0',
                    uploadInitTimestamp: 123123
                }
            };

            expect(getFileId(file)).toBe('hi_0_123123');
        });
    });

    describe('getDataTransferItemId()', () => {
        const rootFolderId = 0;
        const now = Date.now();
        Date.now = jest.fn(() => now);

        test('should return item id correctly when item does not contain API options', () => {
            expect(getDataTransferItemId(mockItem, rootFolderId)).toBe(`hi_0_${now}`);
        });

        test('should return item id correctly when item does contain API options', () => {
            const item = {
                item: mockItem,
                options: {
                    folderId: '0',
                    uploadInitTimestamp: 123123
                }
            };

            expect(getDataTransferItemId(item, rootFolderId)).toBe('hi_0_123123');
        });
    });
});
