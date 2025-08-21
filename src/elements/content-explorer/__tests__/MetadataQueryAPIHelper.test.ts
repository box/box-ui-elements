import includes from 'lodash/includes';
import isArray from 'lodash/isArray';

import MetadataQueryAPIHelper from '../MetadataQueryAPIHelper';
import {
    JSON_PATCH_OP_ADD,
    JSON_PATCH_OP_REMOVE,
    JSON_PATCH_OP_REPLACE,
    JSON_PATCH_OP_TEST,
} from '../../../common/constants';
import { FIELD_METADATA, FIELD_NAME, FIELD_EXTENSION, FIELD_PERMISSIONS } from '../../../constants';

describe('features/metadata-based-view/MetadataQueryAPIHelper', () => {
    let metadataQueryAPIHelper;
    const templateScope = 'enterprise_12345';
    const templateKey = 'awesomeTemplate';
    const metadataInstance = { instance: 'instance' };
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
                type: 'file',
                id: '1234',
                name: 'filename1.pdf',
                size: 10000,
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
                type: 'file',
                id: '9876',
                name: 'filename2.mp4',
                size: 50000,
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
                        displayName: 'type',
                        key: `${FIELD_METADATA}.${templateScope}.${templateKey}.type`,
                        value: 'bill',
                        type: 'string',
                    },
                    {
                        displayName: 'year',
                        key: `${FIELD_METADATA}.${templateScope}.${templateKey}.year`,
                        value: 2017,
                        type: 'float',
                    },
                    {
                        displayName: 'approved',
                        key: `${FIELD_METADATA}.${templateScope}.${templateKey}.approved`,
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
                        displayName: 'type',
                        key: `${FIELD_METADATA}.${templateScope}.${templateKey}.type`,
                        value: 'receipt',
                        type: 'string',
                    },
                    {
                        displayName: 'year',
                        key: `${FIELD_METADATA}.${templateScope}.${templateKey}.year`,
                        value: 2018,
                        type: 'float',
                    },
                    {
                        displayName: 'approved',
                        key: `${FIELD_METADATA}.${templateScope}.${templateKey}.approved`,
                        value: 'no',
                        type: 'enum',
                        options,
                    },
                ],
                id: metadataInstanceId2,
            },
        },
    ];
    const dataWithTypes = {
        items: metadataQueryResponse.entries,
        nextMarker: metadataQueryResponse.next_marker,
    };
    const getSchemaByTemplateKeyFunc = jest.fn().mockReturnValueOnce(Promise.resolve(templateSchemaResponse));
    const queryMetadataFunc = jest.fn().mockReturnValueOnce(Promise.resolve(metadataQueryResponse));
    const updateMetadataFunc = jest.fn().mockReturnValueOnce(Promise.resolve(metadataInstance));
    const api = {
        getMetadataAPI: () => {
            return {
                getSchemaByTemplateKey: getSchemaByTemplateKeyFunc,
                updateMetadata: updateMetadataFunc,
            };
        },
        getMetadataQueryAPI: () => {
            return {
                queryMetadata: queryMetadataFunc,
            };
        },
    };
    const mdQuery = {
        ancestor_folder_id: '672838458',
        from: 'enterprise_1234.templateKey',
        query: 'query',
        query_params: {},
        fields: [
            FIELD_NAME,
            'metadata.enterprise_1234.templateKey.type',
            'metadata.enterprise_1234.templateKey.year',
            'metadata.enterprise_1234.templateKey.approved',
        ],
    };

    beforeEach(() => {
        metadataQueryAPIHelper = new MetadataQueryAPIHelper(api);
        metadataQueryAPIHelper.templateKey = templateKey;
        metadataQueryAPIHelper.templateScope = templateScope;
        metadataQueryAPIHelper.metadataTemplate = template;
        metadataQueryAPIHelper.metadataQuery = mdQuery;
    });

    describe('flattenMetadata()', () => {
        const { entries } = metadataQueryResponse;
        test.each`
            entryIndex | metadataResponseEntry  | flattenedMetadataEntry
            ${0}       | ${entries[0].metadata} | ${flattenedMetadataEntries[0]}
            ${1}       | ${entries[1].metadata} | ${flattenedMetadataEntries[1]}
        `(
            'should return correct flattened metadata for entry $entryIndex',
            ({ metadataResponseEntry, flattenedMetadataEntry }) => {
                const result = metadataQueryAPIHelper.flattenMetadata(metadataResponseEntry);
                expect(result).toEqual(flattenedMetadataEntry);
            },
        );

        test('should return empty object when instance is not found', () => {
            expect(metadataQueryAPIHelper.flattenMetadata(undefined)).toEqual({});
        });
    });

    describe('getDataWithTypes()', () => {
        test('should return data with types and set template object on the instance', () => {
            metadataQueryAPIHelper.metadataQueryResponseData = metadataQueryResponse;
            const result = metadataQueryAPIHelper.getDataWithTypes(templateSchemaResponse);
            expect(result).toEqual(dataWithTypes);
            expect(metadataQueryAPIHelper.metadataTemplate).toEqual(template);
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
            const result = metadataQueryAPIHelper.queryMetadata();
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
        test('should fetch metadata query results, template info, and call successCallback with data with data types', async () => {
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            metadataQueryAPIHelper.queryMetadata = jest
                .fn()
                .mockReturnValueOnce(Promise.resolve(metadataQueryResponse));
            metadataQueryAPIHelper.getTemplateSchemaInfo = jest.fn().mockReturnValueOnce(Promise.resolve(template));
            metadataQueryAPIHelper.getDataWithTypes = jest.fn().mockReturnValueOnce(dataWithTypes);
            await metadataQueryAPIHelper.fetchMetadataQueryResults(mdQuery, successCallback, errorCallback);
            expect(metadataQueryAPIHelper.queryMetadata).toBeCalled();
            expect(metadataQueryAPIHelper.getTemplateSchemaInfo).toBeCalledWith(metadataQueryResponse);
            expect(metadataQueryAPIHelper.getDataWithTypes).toBeCalledWith(template);
            expect(successCallback).toBeCalledWith(dataWithTypes, template);
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
            metadataQueryAPIHelper.getDataWithTypes = jest.fn().mockReturnValueOnce(dataWithTypes);
            await metadataQueryAPIHelper.fetchMetadataQueryResults(mdQuery, successCallback, errorCallback);
            expect(metadataQueryAPIHelper.queryMetadata).toBeCalled();
            expect(metadataQueryAPIHelper.getTemplateSchemaInfo).toBeCalledWith(metadataQueryResponse);
            expect(metadataQueryAPIHelper.getDataWithTypes).not.toHaveBeenCalled();
            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toBeCalledWith(err);
        });
    });

    describe('createJSONPatchOperations()', () => {
        const field = 'amount';
        const testOp = {
            op: JSON_PATCH_OP_TEST,
            path: `/${field}`,
            value: 100,
        };

        const addOp = {
            op: JSON_PATCH_OP_ADD,
            path: `/${field}`,
            value: 200,
        };

        const replaceOp = {
            op: JSON_PATCH_OP_REPLACE,
            path: `/${field}`,
            value: 200,
        };

        const removeOp = {
            op: JSON_PATCH_OP_REMOVE,
            path: `/${field}`,
        };

        test.each`
            oldValue     | newValue     | ops
            ${undefined} | ${200}       | ${[addOp]}
            ${null}      | ${200}       | ${[addOp]}
            ${100}       | ${200}       | ${[testOp, replaceOp]}
            ${100}       | ${undefined} | ${[testOp, removeOp]}
            ${100}       | ${null}      | ${[testOp, removeOp]}
        `('should return valid JSON patch object', ({ oldValue, newValue, ops }) => {
            expect(metadataQueryAPIHelper.createJSONPatchOperations(field, oldValue, newValue)).toEqual(ops);
        });
    });

    describe('getMetadataQueryFields()', () => {
        test('should get metadata instance fields array from the query', () => {
            const expectedResponse = ['type', 'year', 'approved'];
            expect(metadataQueryAPIHelper.getMetadataQueryFields()).toEqual(expectedResponse);
        });
    });

    describe('updateMetadata()', () => {
        test('should update the metadata by calling Metadata api function', async () => {
            const file = 'file';
            const field = 'amount';
            const oldValue = 100;
            const newValue = 200;
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            const JSONPatchOps = { jsonPatch: 'jsonPatch' };
            metadataQueryAPIHelper.createJSONPatchOperations = jest.fn().mockReturnValueOnce(JSONPatchOps);

            await metadataQueryAPIHelper.updateMetadata(
                file,
                field,
                oldValue,
                newValue,
                successCallback,
                errorCallback,
            );
            expect(metadataQueryAPIHelper.createJSONPatchOperations).toHaveBeenCalledWith(field, oldValue, newValue);
            expect(metadataQueryAPIHelper.api.getMetadataAPI().updateMetadata).toHaveBeenCalledWith(
                file,
                template,
                JSONPatchOps,
                successCallback,
                errorCallback,
            );
        });
    });

    describe('verifyQueryFields()', () => {
        const mdQueryWithEmptyFields = {
            ancestor_folder_id: '672838458',
            from: 'enterprise_1234.templateKey',
            query: 'query',
            query_params: {},
        };
        const mdQueryWithoutNameField = {
            ancestor_folder_id: '672838458',
            from: 'enterprise_1234.templateKey',
            query: 'query',
            query_params: {},
            fields: ['created_at', 'metadata.enterprise_1234.templateKey.type'],
        };
        const mdQueryWithNameField = {
            ancestor_folder_id: '672838458',
            from: 'enterprise_1234.templateKey',
            query: 'query',
            query_params: {},
            fields: [FIELD_NAME, 'metadata.enterprise_1234.templateKey.type'],
        };
        const mdQueryWithoutExtensionField = {
            ancestor_folder_id: '672838458',
            from: 'enterprise_1234.templateKey',
            query: 'query',
            query_params: {},
            fields: [FIELD_NAME, 'metadata.enterprise_1234.templateKey.type'],
        };
        const mdQueryWithBothFields = {
            ancestor_folder_id: '672838458',
            from: 'enterprise_1234.templateKey',
            query: 'query',
            query_params: {},
            fields: [FIELD_NAME, FIELD_EXTENSION, 'metadata.enterprise_1234.templateKey.type'],
        };
        test.each`
            index | metadataQuery
            ${1}  | ${mdQueryWithEmptyFields}
            ${2}  | ${mdQueryWithoutNameField}
            ${3}  | ${mdQueryWithNameField}
            ${4}  | ${mdQueryWithoutExtensionField}
            ${5}  | ${mdQueryWithBothFields}
        `(
            'should verify the metadata query object and add required fields if necessary',
            ({ index, metadataQuery }) => {
                const updatedMetadataQuery = metadataQueryAPIHelper.verifyQueryFields(metadataQuery);
                expect(isArray(updatedMetadataQuery.fields)).toBe(true);
                expect(includes(updatedMetadataQuery.fields, FIELD_NAME)).toBe(true);
                expect(includes(updatedMetadataQuery.fields, FIELD_EXTENSION)).toBe(true);
                expect(includes(updatedMetadataQuery.fields, FIELD_PERMISSIONS)).toBe(true);

                if (index === 2) {
                    // Verify "name", "extension" and "permission" are added to pre-existing fields
                    expect(updatedMetadataQuery.fields).toEqual([
                        ...mdQueryWithoutNameField.fields,
                        FIELD_NAME,
                        FIELD_EXTENSION,
                        FIELD_PERMISSIONS,
                    ]);
                }

                if (index === 4) {
                    // Verify "extension" and "permission" are added when "name" exists but "extension" and "permission" don't
                    expect(updatedMetadataQuery.fields).toEqual([
                        ...mdQueryWithoutExtensionField.fields,
                        FIELD_EXTENSION,
                        FIELD_PERMISSIONS,
                    ]);
                }

                if (index === 5) {
                    // Verify "permission" is added
                    expect(updatedMetadataQuery.fields).toEqual([...mdQueryWithBothFields.fields, FIELD_PERMISSIONS]);
                }
            },
        );
    });
});
