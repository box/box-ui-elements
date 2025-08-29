import {
    mergeQueryParams,
    mergeQueries,
    getStringFilter,
    getRangeFilter,
    getSelectFilter,
    getMimeTypeFilter,
} from '../MetadataQueryBuilder';

describe('elements/content-explorer/MetadataQueryBuilder', () => {
    describe('mergeQueryParams', () => {
        test('should merge two objects', () => {
            const target = { key1: 'value1' };
            const source = { key2: 'value2' };
            const result = mergeQueryParams(target, source);
            expect(result).toEqual({ key1: 'value1', key2: 'value2' });
        });

        test('should override target values with source values', () => {
            const target = { key1: 'value1', key2: 'old' };
            const source = { key2: 'new', key3: 'value3' };
            const result = mergeQueryParams(target, source);
            expect(result).toEqual({ key1: 'value1', key2: 'new', key3: 'value3' });
        });

        test('should return source when target is empty', () => {
            const target = {};
            const source = { key1: 'value1' };
            const result = mergeQueryParams(target, source);
            expect(result).toEqual({ key1: 'value1' });
        });

        test('should return target when source is empty', () => {
            const target = { key1: 'value1' };
            const source = {};
            const result = mergeQueryParams(target, source);
            expect(result).toEqual({ key1: 'value1' });
        });

        test('should return empty object when both are empty', () => {
            const result = mergeQueryParams({}, {});
            expect(result).toEqual({});
        });
    });

    describe('mergeQueries', () => {
        test('should merge two arrays', () => {
            const target = ['query1'];
            const source = ['query2'];
            const result = mergeQueries(target, source);
            expect(result).toEqual(['query1', 'query2']);
        });

        test('should handle empty target array', () => {
            const target: string[] = [];
            const source = ['query1', 'query2'];
            const result = mergeQueries(target, source);
            expect(result).toEqual(['query1', 'query2']);
        });

        test('should handle empty source array', () => {
            const target = ['query1', 'query2'];
            const source: string[] = [];
            const result = mergeQueries(target, source);
            expect(result).toEqual(['query1', 'query2']);
        });

        test('should handle both empty arrays', () => {
            const result = mergeQueries([], []);
            expect(result).toEqual([]);
        });
    });

    describe('getStringFilter', () => {
        test('should generate string filter with ILIKE query', () => {
            const result = getStringFilter('test', 'field_name', 0);
            expect(result).toEqual({
                queryParams: { arg_field_name_1: '%test%' },
                queries: ['(field_name ILIKE :arg_field_name_1)'],
                keysGenerated: 1,
            });
        });

        test('should escape special characters in value', () => {
            const result = getStringFilter('test_value%123', 'field_name', 0);
            expect(result).toEqual({
                queryParams: { arg_field_name_1: '%test\\_value\\%123%' },
                queries: ['(field_name ILIKE :arg_field_name_1)'],
                keysGenerated: 1,
            });
        });

        test('should use correct arg index', () => {
            const result = getStringFilter('test', 'field_name', 5);
            expect(result).toEqual({
                queryParams: { arg_field_name_6: '%test%' },
                queries: ['(field_name ILIKE :arg_field_name_6)'],
                keysGenerated: 1,
            });
        });
    });

    describe('getRangeFilter', () => {
        test('should generate range filter with both gt and lt', () => {
            const filterValue = { range: { gt: 10, lt: 20 } };
            const result = getRangeFilter(filterValue, 'field_name', 0);
            expect(result).toEqual({
                queryParams: { arg_field_name_1: 10, arg_field_name_2: 20 },
                queries: ['(field_name >= :arg_field_name_1 AND field_name <= :arg_field_name_2)'],
                keysGenerated: 2,
            });
        });

        test('should generate range filter with only gt', () => {
            const filterValue = { range: { gt: 10, lt: '' } };
            const result = getRangeFilter(filterValue, 'field_name', 0);
            expect(result).toEqual({
                queryParams: { arg_field_name_1: 10 },
                queries: ['(field_name >= :arg_field_name_1)'],
                keysGenerated: 1,
            });
        });

        test('should generate range filter with only lt', () => {
            const filterValue = { range: { gt: '', lt: 20 } };
            const result = getRangeFilter(filterValue, 'field_name', 0);
            expect(result).toEqual({
                queryParams: { arg_field_name_1: 20 },
                queries: ['(field_name <= :arg_field_name_1)'],
                keysGenerated: 1,
            });
        });

        test('should handle null values in range', () => {
            const filterValue = { range: { gt: null, lt: 20 } };
            const result = getRangeFilter(filterValue, 'field_name', 0);
            expect(result).toEqual({
                queryParams: { arg_field_name_1: 20 },
                queries: ['(field_name <= :arg_field_name_1)'],
                keysGenerated: 1,
            });
        });

        test('should handle undefined values in range', () => {
            const filterValue = { range: { gt: undefined, lt: 20 } };
            const result = getRangeFilter(filterValue, 'field_name', 0);
            expect(result).toEqual({
                queryParams: { arg_field_name_1: 20 },
                queries: ['(field_name <= :arg_field_name_1)'],
                keysGenerated: 1,
            });
        });

        test('should handle zero values in range', () => {
            const filterValue = { range: { gt: 0, lt: 100 } };
            const result = getRangeFilter(filterValue, 'field_name', 0);
            expect(result).toEqual({
                queryParams: { arg_field_name_1: 0, arg_field_name_2: 100 },
                queries: ['(field_name >= :arg_field_name_1 AND field_name <= :arg_field_name_2)'],
                keysGenerated: 2,
            });
        });

        test('should return empty result for invalid filter value', () => {
            const result = getRangeFilter(null, 'field_name', 0);
            expect(result).toEqual({
                queryParams: {},
                queries: [],
                keysGenerated: 0,
            });
        });

        test('should return empty result for filter value without range', () => {
            const filterValue = { someOtherProperty: 'value' } as unknown as
                | string[]
                | { range: { gt: number | string; lt: number | string } };
            const result = getRangeFilter(filterValue, 'field_name', 0);
            expect(result).toEqual({
                queryParams: {},
                queries: [],
                keysGenerated: 0,
            });
        });

        test('should return empty result for empty range', () => {
            const filterValue = { range: { gt: '', lt: '' } };
            const result = getRangeFilter(filterValue, 'field_name', 0);
            expect(result).toEqual({
                queryParams: {},
                queries: [],
                keysGenerated: 0,
            });
        });

        test('should return empty result for null range', () => {
            const filterValue = { range: null };
            const result = getRangeFilter(filterValue, 'field_name', 0);
            expect(result).toEqual({
                queryParams: {},
                queries: [],
                keysGenerated: 0,
            });
        });

        test('should use correct arg index', () => {
            const filterValue = { range: { gt: 10, lt: 20 } };
            const result = getRangeFilter(filterValue, 'field_name', 5);
            expect(result).toEqual({
                queryParams: { arg_field_name_6: 10, arg_field_name_7: 20 },
                queries: ['(field_name >= :arg_field_name_6 AND field_name <= :arg_field_name_7)'],
                keysGenerated: 2,
            });
        });
    });

    describe('getSelectFilter', () => {
        test('should generate select filter for multiple values', () => {
            const filterValue = ['value1', 'value2', 'value3'];
            const result = getSelectFilter(filterValue, 'field_name', 0);
            expect(result).toEqual({
                queryParams: {
                    arg_field_name_1: 'value1',
                    arg_field_name_2: 'value2',
                    arg_field_name_3: 'value3',
                },
                queries: ['(field_name HASANY (:arg_field_name_1, :arg_field_name_2, :arg_field_name_3))'],
                keysGenerated: 3,
            });
        });

        test('should handle single value array', () => {
            const filterValue = ['single_value'];
            const result = getSelectFilter(filterValue, 'field_name', 0);
            expect(result).toEqual({
                queryParams: { arg_field_name_1: 'single_value' },
                queries: ['(field_name HASANY (:arg_field_name_1))'],
                keysGenerated: 1,
            });
        });

        test('should handle numeric values converted to strings', () => {
            const filterValue = ['123', '456'];
            const result = getSelectFilter(filterValue, 'field_name', 0);
            expect(result).toEqual({
                queryParams: {
                    arg_field_name_1: '123',
                    arg_field_name_2: '456',
                },
                queries: ['(field_name HASANY (:arg_field_name_1, :arg_field_name_2))'],
                keysGenerated: 2,
            });
        });

        test('should return empty result for empty array', () => {
            const result = getSelectFilter([], 'field_name', 0);
            expect(result).toEqual({
                queryParams: {},
                queries: [],
                keysGenerated: 0,
            });
        });

        test('should return empty result for null/undefined', () => {
            const result = getSelectFilter(null, 'field_name', 0);
            expect(result).toEqual({
                queryParams: {},
                queries: [],
                keysGenerated: 0,
            });
        });

        test('should use correct arg index', () => {
            const filterValue = ['value1'];
            const result = getSelectFilter(filterValue, 'field_name', 5);
            expect(result).toEqual({
                queryParams: { arg_field_name_6: 'value1' },
                queries: ['(field_name HASANY (:arg_field_name_6))'],
                keysGenerated: 1,
            });
        });

        test('should handle field names with special characters', () => {
            const filterValue = ['value1', 'value2'];
            const result = getSelectFilter(filterValue, 'field-name.with/special_chars', 0);
            expect(result).toEqual({
                queryParams: {
                    arg_field_name_with_special_chars_1: 'value1',
                    arg_field_name_with_special_chars_2: 'value2',
                },
                queries: [
                    '(field-name.with/special_chars HASANY (:arg_field_name_with_special_chars_1, :arg_field_name_with_special_chars_2))',
                ],
                keysGenerated: 2,
            });
        });
    });

    describe('getMimeTypeFilter', () => {
        test('should generate mime type filter using mapFileTypes', () => {
            const filterValue = ['pdfType', 'documentType'];
            const result = getMimeTypeFilter(filterValue, 'mimetype', 0);
            expect(result).toEqual({
                queryParams: {
                    arg_mimetype_1: 'pdf',
                    arg_mimetype_2: 'doc',
                    arg_mimetype_3: 'docx',
                    arg_mimetype_4: 'gdoc',
                    arg_mimetype_5: 'rtf',
                    arg_mimetype_6: 'txt',
                },
                queries: [
                    '(item.extension IN (:arg_mimetype_1, :arg_mimetype_2, :arg_mimetype_3, :arg_mimetype_4, :arg_mimetype_5, :arg_mimetype_6))',
                ],
                keysGenerated: 6,
            });
        });

        test('should handle values that are not in FILE_FOLDER_TYPES_MAP', () => {
            const filterValue = ['pdf', 'doc'];
            const result = getMimeTypeFilter(filterValue, 'mimetype', 0);
            expect(result).toEqual({
                queryParams: {},
                queries: [],
                keysGenerated: 0,
            });
        });

        test('should handle mixed valid and invalid values', () => {
            const filterValue = ['pdfType', 'doc', 'documentType'];
            const result = getMimeTypeFilter(filterValue, 'mimetype', 0);
            expect(result).toEqual({
                queryParams: {
                    arg_mimetype_1: 'pdf',
                    arg_mimetype_2: 'doc',
                    arg_mimetype_3: 'docx',
                    arg_mimetype_4: 'gdoc',
                    arg_mimetype_5: 'rtf',
                    arg_mimetype_6: 'txt',
                },
                queries: [
                    '(item.extension IN (:arg_mimetype_1, :arg_mimetype_2, :arg_mimetype_3, :arg_mimetype_4, :arg_mimetype_5, :arg_mimetype_6))',
                ],
                keysGenerated: 6,
            });
        });

        test('should handle single value array', () => {
            const filterValue = ['pdfType'];
            const result = getMimeTypeFilter(filterValue, 'mimetype', 0);
            expect(result).toEqual({
                queryParams: { arg_mimetype_1: 'pdf' },
                queries: ['(item.extension IN (:arg_mimetype_1))'],
                keysGenerated: 1,
            });
        });

        test('should handle numeric values that are not in FILE_FOLDER_TYPES_MAP', () => {
            const filterValue = ['123', '456'];
            const result = getMimeTypeFilter(filterValue, 'mimetype', 0);
            expect(result).toEqual({
                queryParams: {},
                queries: [],
                keysGenerated: 0,
            });
        });

        test('should return empty result for empty array', () => {
            const result = getMimeTypeFilter([], 'mimetype', 0);
            expect(result).toEqual({
                queryParams: {},
                queries: [],
                keysGenerated: 0,
            });
        });

        test('should return empty result for null/undefined', () => {
            const result = getMimeTypeFilter(null, 'mimetype', 0);
            expect(result).toEqual({
                queryParams: {},
                queries: [],
                keysGenerated: 0,
            });
        });

        test('should use correct arg index', () => {
            const filterValue = ['pdfType'];
            const result = getMimeTypeFilter(filterValue, 'mimetype', 5);
            expect(result).toEqual({
                queryParams: { arg_mimetype_6: 'pdf' },
                queries: ['(item.extension IN (:arg_mimetype_6))'],
                keysGenerated: 1,
            });
        });

        test('should handle field names with special characters', () => {
            const filterValue = ['pdfType', 'documentType'];
            const result = getMimeTypeFilter(filterValue, 'mime-type.with/special_chars', 0);
            expect(result).toEqual({
                queryParams: {
                    arg_mime_type_with_special_chars_1: 'pdf',
                    arg_mime_type_with_special_chars_2: 'doc',
                    arg_mime_type_with_special_chars_3: 'docx',
                    arg_mime_type_with_special_chars_4: 'gdoc',
                    arg_mime_type_with_special_chars_5: 'rtf',
                    arg_mime_type_with_special_chars_6: 'txt',
                },
                queries: [
                    '(item.extension IN (:arg_mime_type_with_special_chars_1, :arg_mime_type_with_special_chars_2, :arg_mime_type_with_special_chars_3, :arg_mime_type_with_special_chars_4, :arg_mime_type_with_special_chars_5, :arg_mime_type_with_special_chars_6))',
                ],
                keysGenerated: 6,
            });
        });

        // New tests for folderType functionality
        test('should handle folderType only', () => {
            const filterValue = ['folderType'];
            const result = getMimeTypeFilter(filterValue, 'mimetype', 0);
            expect(result).toEqual({
                queryParams: {
                    arg_mime_folderType_1: 'folder',
                },
                queries: ['(item.type = :arg_mime_folderType_1)'],
                keysGenerated: 1,
            });
        });

        test('should handle folderType with file types', () => {
            const filterValue = ['folderType', 'pdfType', 'documentType'];
            const result = getMimeTypeFilter(filterValue, 'mimetype', 0);
            expect(result).toEqual({
                queryParams: {
                    arg_mime_folderType_1: 'folder',
                    arg_mimetype_2: 'pdf',
                    arg_mimetype_3: 'doc',
                    arg_mimetype_4: 'docx',
                    arg_mimetype_5: 'gdoc',
                    arg_mimetype_6: 'rtf',
                    arg_mimetype_7: 'txt',
                },
                queries: [
                    '((item.type = :arg_mime_folderType_1) OR (item.extension IN (:arg_mimetype_2, :arg_mimetype_3, :arg_mimetype_4, :arg_mimetype_5, :arg_mimetype_6, :arg_mimetype_7)))',
                ],
                keysGenerated: 7,
            });
        });

        test('should handle folderType with mixed valid and invalid file types', () => {
            const filterValue = ['folderType', 'pdfType', 'doc', 'documentType'];
            const result = getMimeTypeFilter(filterValue, 'mimetype', 0);
            expect(result).toEqual({
                queryParams: {
                    arg_mime_folderType_1: 'folder',
                    arg_mimetype_2: 'pdf',
                    arg_mimetype_3: 'doc',
                    arg_mimetype_4: 'docx',
                    arg_mimetype_5: 'gdoc',
                    arg_mimetype_6: 'rtf',
                    arg_mimetype_7: 'txt',
                },
                queries: [
                    '((item.type = :arg_mime_folderType_1) OR (item.extension IN (:arg_mimetype_2, :arg_mimetype_3, :arg_mimetype_4, :arg_mimetype_5, :arg_mimetype_6, :arg_mimetype_7)))',
                ],
                keysGenerated: 7,
            });
        });

        test('should handle folderType with single file type', () => {
            const filterValue = ['folderType', 'pdfType'];
            const result = getMimeTypeFilter(filterValue, 'mimetype', 0);
            expect(result).toEqual({
                queryParams: {
                    arg_mime_folderType_1: 'folder',
                    arg_mimetype_2: 'pdf',
                },
                queries: ['((item.type = :arg_mime_folderType_1) OR (item.extension IN (:arg_mimetype_2)))'],
                keysGenerated: 2,
            });
        });

        test('should handle folderType with file types using correct arg index', () => {
            const filterValue = ['folderType', 'pdfType', 'documentType'];
            const result = getMimeTypeFilter(filterValue, 'mimetype', 5);
            expect(result).toEqual({
                queryParams: {
                    arg_mime_folderType_6: 'folder',
                    arg_mimetype_7: 'pdf',
                    arg_mimetype_8: 'doc',
                    arg_mimetype_9: 'docx',
                    arg_mimetype_10: 'gdoc',
                    arg_mimetype_11: 'rtf',
                    arg_mimetype_12: 'txt',
                },
                queries: [
                    '((item.type = :arg_mime_folderType_6) OR (item.extension IN (:arg_mimetype_7, :arg_mimetype_8, :arg_mimetype_9, :arg_mimetype_10, :arg_mimetype_11, :arg_mimetype_12)))',
                ],
                keysGenerated: 7,
            });
        });

        test('should handle multiple folderType entries (should only process one)', () => {
            const filterValue = ['folderType', 'pdfType', 'folderType', 'documentType'];
            const result = getMimeTypeFilter(filterValue, 'mimetype', 0);
            expect(result).toEqual({
                queryParams: {
                    arg_mime_folderType_1: 'folder',
                    arg_mimetype_2: 'pdf',
                    arg_mimetype_3: 'doc',
                    arg_mimetype_4: 'docx',
                    arg_mimetype_5: 'gdoc',
                    arg_mimetype_6: 'rtf',
                    arg_mimetype_7: 'txt',
                },
                queries: [
                    '((item.type = :arg_mime_folderType_1) OR (item.extension IN (:arg_mimetype_2, :arg_mimetype_3, :arg_mimetype_4, :arg_mimetype_5, :arg_mimetype_6, :arg_mimetype_7)))',
                ],
                keysGenerated: 7,
            });
        });

        test('should handle folderType with field names containing special characters', () => {
            const filterValue = ['folderType', 'pdfType'];
            const result = getMimeTypeFilter(filterValue, 'mime-type.with/special_chars', 0);
            expect(result).toEqual({
                queryParams: {
                    arg_mime_folderType_1: 'folder',
                    arg_mime_type_with_special_chars_2: 'pdf',
                },
                queries: [
                    '((item.type = :arg_mime_folderType_1) OR (item.extension IN (:arg_mime_type_with_special_chars_2)))',
                ],
                keysGenerated: 2,
            });
        });
    });
});
