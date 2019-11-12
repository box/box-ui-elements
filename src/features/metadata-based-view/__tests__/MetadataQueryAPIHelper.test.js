import MetadataQueryAPIHelper from '../MetadataQueryAPIHelper';
import { ITEM_TYPE_FILE } from '../../../common/constants';

describe('features/metadata-based-view/MetadataQueryAPIHelper', () => {
    let metadataQueryAPIHelper;
    const templateScope = 'enterprise_12345';
    const templateKey = 'awesomeTemplate';
    const metadataInstanceId1 = 'metadataInstanceId1';
    const metadataInstanceId2 = 'metadataInstanceId2';
    const options = [
        {
            id: '3887b73d-0087-43bb-947e-0dff1543bdfb',
            key: 'yes',
        },
        {
            id: '3393eed2-f254-4fd0-a7ff-cd9a5f75e222',
            key: 'no',
        },
    ];
    const template = {
        id: 'cdb8c36d-4470-41df-90ba',
        type: 'metadata_template',
        templateKey,
        scope: templateScope,
        displayName: 'Test Template',
        hidden: false,
        fields: [
            {
                id: '854045ee-a219-47ef-93ec-6e3b3417b68f',
                type: 'string',
                key: 'type',
                displayName: 'type',
                hidden: false,
                description: 'type',
            },
            {
                id: '04af7602-7cad-4d60-b843-acc14b0ef587',
                type: 'float',
                key: 'year',
                displayName: 'year',
                hidden: false,
                description: 'year',
            },
            {
                id: '9e5849a1-02f4-4a9a-b626-91fe46a89f2a',
                type: 'enum',
                key: 'approved',
                displayName: 'approved',
                hidden: false,
                description: 'approved yes/no',
                options,
            },
        ],
    };
    const templateSchemaResponse = {
        data: template,
    };
    const nextMarker = 'marker1234567890';
    const metadataQueryResponse = {
        entries: [
            {
                item: {
                    type: 'file',
                    id: '1234',
                    name: 'filename1.pdf',
                    size: 10000,
                },
                metadata: {
                    [templateScope]: {
                        [templateKey]: {
                            $id: metadataInstanceId1,
                            $parent: 'file_998877',
                            $type: 'awesomeTemplateKey-asdlk-1234-asd1',
                            $typeScope: 'enterprise_2222',
                            $typeVersion: 0,
                            $version: 0,
                            type: 'bill', // metadata template field
                            year: 2017, // metadata template field
                            approved: 'yes', // metadata template field
                        },
                    },
                },
            },
            {
                item: {
                    type: 'file',
                    id: '9876',
                    name: 'filename2.mp4',
                    size: 50000,
                },
                metadata: {
                    [templateScope]: {
                        [templateKey]: {
                            $id: metadataInstanceId2,
                            $parent: 'file_998877',
                            $type: 'awesomeTemplateKey-asdlk-1234-asd1',
                            $typeScope: 'enterprise_2222',
                            $typeVersion: 0,
                            $version: 0,
                            type: 'receipt', // metadata template field
                            year: 2018, // metadata template field
                            approved: 'no', // metadata template field
                        },
                    },
                },
            },
        ],
        next_marker: nextMarker,
    };
    const flattenedMetadataEntries = [
        {
            enterprise: {
                fields: [
                    {
                        name: 'type',
                        value: 'bill',
                        type: 'string',
                    },
                    {
                        name: 'year',
                        value: 2017,
                        type: 'float',
                    },
                    {
                        name: 'approved',
                        value: 'yes',
                        type: 'enum',
                        options,
                    },
                ],
                id: metadataInstanceId1,
            },
        },
        {
            enterprise: {
                fields: [
                    {
                        name: 'type',
                        value: 'receipt',
                        type: 'string',
                    },
                    {
                        name: 'year',
                        value: 2018,
                        type: 'float',
                    },
                    {
                        name: 'approved',
                        value: 'no',
                        type: 'enum',
                        options,
                    },
                ],
                id: metadataInstanceId2,
            },
        },
    ];
    const flattenedResponse = [
        {
            id: '1234',
            metadata: flattenedMetadataEntries[0],
            name: 'filename1.pdf',
            size: 10000,
        },
        {
            id: '9876',
            metadata: flattenedMetadataEntries[1],
            name: 'filename2.mp4',
            size: 50000,
        },
    ];
    const flattenedDataWithTypes = {
        items: flattenedResponse,
        nextMarker: metadataQueryResponse.next_marker,
    };
    const getSchemaByTemplateKeyFunc = jest.fn().mockReturnValueOnce(Promise.resolve(templateSchemaResponse));
    const queryMetadataFunc = jest.fn().mockReturnValueOnce(Promise.resolve(metadataQueryResponse));
    const api = {
        getMetadataAPI: () => {
            return {
                getSchemaByTemplateKey: getSchemaByTemplateKeyFunc,
            };
        },
        getMetadataQueryAPI: () => {
            return {
                queryMetadata: queryMetadataFunc,
            };
        },
    };
    const mdQuery = {
        query: 'query',
        ancestor_folder_id: '672838458',
        query_params: {},
    };

    beforeEach(() => {
        metadataQueryAPIHelper = new MetadataQueryAPIHelper(api);
        metadataQueryAPIHelper.templateKey = templateKey;
        metadataQueryAPIHelper.templateScope = templateScope;
        metadataQueryAPIHelper.metadataTemplate = template;
    });

    describe('flattenMetadata()', () => {
        const { entries } = metadataQueryResponse;
        test.each`
            entryIndex | metadataResponseEntry  | flattenedMetadataEntry
            ${0}       | ${entries[0].metadata} | ${flattenedMetadataEntries[0]}
            ${1}       | ${entries[1].metadata} | ${flattenedMetadataEntries[1]}
        `(
            'should return correct flattend metadata for entry $entryIndex',
            ({ metadataResponseEntry, flattenedMetadataEntry }) => {
                const result = metadataQueryAPIHelper.flattenMetadata(metadataResponseEntry);
                expect(result).toEqual(flattenedMetadataEntry);
            },
        );

        test('should return empty object when instance is not found', () => {
            expect(metadataQueryAPIHelper.flattenMetadata(undefined)).toEqual({});
        });
    });

    describe('flattenResponseEntry()', () => {
        const { entries } = metadataQueryResponse;
        test.each`
            entryIndex | metadataResponseEntry | flattenedResponseEntry
            ${0}       | ${entries[0]}         | ${flattenedResponse[0]}
            ${1}       | ${entries[1]}         | ${flattenedResponse[1]}
        `(
            'should return correct flattened response for entry $entryIndex',
            ({ metadataResponseEntry, flattenedResponseEntry }) => {
                const result = metadataQueryAPIHelper.flattenResponseEntry(metadataResponseEntry);
                expect(result).toEqual(flattenedResponseEntry);
            },
        );
    });

    describe('getFlattenedDataWithTypes()', () => {
        test('should return flattened data with types and set template object on the instance', () => {
            metadataQueryAPIHelper.metadataQueryResponseData = metadataQueryResponse;
            const result = metadataQueryAPIHelper.getFlattenedDataWithTypes(templateSchemaResponse);
            expect(result).toEqual(flattenedDataWithTypes);
            expect(metadataQueryAPIHelper.metadataTemplate).toEqual(template);
        });
    });

    describe('filterMetdataQueryResponse()', () => {
        test('should return query response with entries of type file only', () => {
            const entries = [
                { item: { type: 'file' }, metadata: {} },
                { item: { type: 'folder' }, metadata: {} },
                { item: { type: 'file' }, metadata: {} },
                { item: { type: 'folder' }, metadata: {} },
                { item: { type: 'file' }, metadata: {} },
            ];
            const next_marker = 'marker_123456789';
            const mdQueryResponse = {
                entries,
                next_marker,
            };

            const filteredResponse = metadataQueryAPIHelper.filterMetdataQueryResponse(mdQueryResponse);
            const isEveryEntryOfTypeFile = filteredResponse.entries.every(entry => entry.item.type === ITEM_TYPE_FILE);
            expect(isEveryEntryOfTypeFile).toBe(true);
        });
    });

    describe('getTemplateSchemaInfo()', () => {
        test('should set instance properties and make xhr call to get template info when response has valid entries', async () => {
            const result = await metadataQueryAPIHelper.getTemplateSchemaInfo(metadataQueryResponse);
            expect(getSchemaByTemplateKeyFunc).toHaveBeenCalledWith(templateKey);
            expect(result).toEqual(templateSchemaResponse);
            expect(metadataQueryAPIHelper.metadataQueryResponseData).toEqual(metadataQueryResponse);
            expect(metadataQueryAPIHelper.templateScope).toEqual(templateScope);
            expect(metadataQueryAPIHelper.templateKey).toEqual(templateKey);
        });

        test('should not make xhr call to get metadata template info when response has zero/invalid entries', async () => {
            const emptyEntriesResponse = { entries: [], next_marker: nextMarker };
            const result = await metadataQueryAPIHelper.getTemplateSchemaInfo(emptyEntriesResponse);
            expect(getSchemaByTemplateKeyFunc).not.toHaveBeenCalled();
            expect(result).toBe(undefined);
            expect(metadataQueryAPIHelper.metadataQueryResponseData).toEqual(emptyEntriesResponse);
        });
    });

    describe('queryMetadata()', () => {
        test('should return a promise that resolves with metadata query result', async () => {
            const result = metadataQueryAPIHelper.queryMetadata(mdQuery);
            expect(result).toBeInstanceOf(Promise);
            expect(queryMetadataFunc).toBeCalledWith(
                mdQuery,
                expect.any(Function), // resolve
                expect.any(Function), // reject
                { forceFetch: true },
            );
        });
    });

    describe('fetchMetadataQueryResults()', () => {
        test('should fetch metadata query results, template info, and call successCallback with flattened data with data types', async () => {
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadataQueryAPIHelper.queryMetadata = jest
                .fn()
                .mockReturnValueOnce(Promise.resolve(metadataQueryResponse));
            metadataQueryAPIHelper.getTemplateSchemaInfo = jest.fn().mockReturnValueOnce(Promise.resolve(template));
            metadataQueryAPIHelper.getFlattenedDataWithTypes = jest.fn().mockReturnValueOnce(flattenedDataWithTypes);
            await metadataQueryAPIHelper.fetchMetadataQueryResults(mdQuery, successCallback, errorCallback);
            expect(metadataQueryAPIHelper.queryMetadata).toBeCalledWith(mdQuery);
            expect(metadataQueryAPIHelper.getTemplateSchemaInfo).toBeCalledWith(metadataQueryResponse);
            expect(metadataQueryAPIHelper.getFlattenedDataWithTypes).toBeCalledWith(template);
            expect(successCallback).toBeCalledWith(flattenedDataWithTypes);
            expect(errorCallback).not.toHaveBeenCalled();
        });

        test('should call error callback when the promise chain throws exception during API data fetch', async () => {
            const err = new Error();
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadataQueryAPIHelper.queryMetadata = jest
                .fn()
                .mockReturnValueOnce(Promise.resolve(metadataQueryResponse));
            metadataQueryAPIHelper.getTemplateSchemaInfo = jest.fn().mockReturnValueOnce(Promise.reject(err));
            metadataQueryAPIHelper.getFlattenedDataWithTypes = jest.fn().mockReturnValueOnce(flattenedDataWithTypes);
            await metadataQueryAPIHelper.fetchMetadataQueryResults(mdQuery, successCallback, errorCallback);
            expect(metadataQueryAPIHelper.queryMetadata).toBeCalledWith(mdQuery);
            expect(metadataQueryAPIHelper.getTemplateSchemaInfo).toBeCalledWith(metadataQueryResponse);
            expect(metadataQueryAPIHelper.getFlattenedDataWithTypes).not.toHaveBeenCalled();
            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toBeCalledWith(err);
        });
    });
});
