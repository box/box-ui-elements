import Cache from '../../utils/Cache';
import MetadataQuery from '../MetadataQuery';

import { CACHE_PREFIX_METADATA_QUERY, ERROR_CODE_METADATA_QUERY } from '../../constants';

let metadataQuery;
let cache;
const marker = 'marker_123456789';
const metadataInstanceId1 = 'c614dcaa-ebdc-4c88-b242-15cad4f7b787';
const metadataInstanceId2 = 'ee348ed1-9460-44f3-9c34-aa580a93efda';

const mockMetadataQuerySuccessResponse = {
    entries: [
        {
            item: {
                type: 'file',
                id: '1234',
                name: 'filename1.pdf',
                size: 10000,
            },
            metadata: {
                enterprise_2222: {
                    awesomeTemplateKey: {
                        $id: metadataInstanceId1,
                        $parent: 'file_998877',
                        $type: 'awesomeTemplateKey-asdlk-1234-asd1',
                        $typeScope: 'enterprise_2222',
                        $typeVersion: 0,
                        $version: 0,
                        type: 'bill', // metadata template field
                        amount: 500, // metadata template field
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
                size: 389027,
            },
            metadata: {
                enterprise_2222: {
                    awesomeTemplateKey: {
                        $id: metadataInstanceId2,
                        $parent: 'file_998877',
                        $type: 'awesomeTemplateKey-asdlk-1234-asd1',
                        $typeScope: 'enterprise_2222',
                        $typeVersion: 0,
                        $version: 0,
                        type: 'receipt', // metadata template field
                        amount: 2735, // metadata template field
                        approved: 'no', // metadata template field
                    },
                },
            },
        },
    ],
    next_marker: marker,
};

const url = 'https://api.box.com/2.0/metadata_queries/execute_read';
const mockQuery = {
    from: 'enterprise_1234.templateKey',
    query: 'type = :arg1',
    query_params: {
        arg1: 'bill',
    },
    ancestor_folder_id: '12345',
};
const mockAPIRequestParams = {
    url,
    data: mockQuery,
};

describe('api/MetadataQuery', () => {
    beforeEach(() => {
        metadataQuery = new MetadataQuery({});
        cache = new Cache();
        metadataQuery.getCache = jest.fn().mockReturnValueOnce(cache);
    });

    describe('getCacheKey()', () => {
        test('should return correct key', () => {
            expect(metadataQuery.getCacheKey('foo')).toBe(`${CACHE_PREFIX_METADATA_QUERY}foo`);
        });
    });

    describe('getUrl()', () => {
        test('should return correct metadata query API endpoint url', () => {
            expect(metadataQuery.getUrl()).toBe(url);
        });
    });

    describe('isLoaded()', () => {
        test('should return false when no cache', () => {
            metadataQuery.key = 'key';
            expect(metadataQuery.isLoaded()).toBe(false);
        });

        test('should return false when no value', () => {
            metadataQuery.key = 'key';
            expect(metadataQuery.isLoaded()).toBe(false);
        });

        test('should return true when loaded', () => {
            metadataQuery.key = 'key';
            cache.set('key', mockMetadataQuerySuccessResponse);
            expect(metadataQuery.isLoaded()).toBe(true);
        });
    });

    describe('finish()', () => {
        beforeEach(() => {
            metadataQuery.key = `${CACHE_PREFIX_METADATA_QUERY}_foo`;
            cache.set(metadataQuery.key, mockMetadataQuerySuccessResponse);
        });

        test('should not do anything if destroyed', () => {
            metadataQuery.successCallback = jest.fn();
            cache.get = jest.fn();
            metadataQuery.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadataQuery.finish();
            expect(cache.get).not.toHaveBeenCalled();
            expect(metadataQuery.successCallback).not.toHaveBeenCalled();
        });

        test('should call success callback with proper collection', () => {
            metadataQuery.successCallback = jest.fn();
            metadataQuery.finish();
            expect(metadataQuery.successCallback).toHaveBeenCalledWith(mockMetadataQuerySuccessResponse);
        });
    });

    describe('queryMetadataSuccessHandler()', () => {
        test('should set up the chache with success response and finish the processing', () => {
            cache.set = jest.fn();
            metadataQuery.finish = jest.fn();

            metadataQuery.queryMetadataSuccessHandler({
                data: mockMetadataQuerySuccessResponse,
            });

            expect(cache.set).toHaveBeenCalledWith(metadataQuery.key, mockMetadataQuerySuccessResponse);
            expect(metadataQuery.finish).toHaveBeenCalled();
        });
    });

    describe('queryMetadataRequest()', () => {
        beforeEach(() => {
            metadataQuery.queryMetadataSuccessHandler = jest.fn();
            metadataQuery.errorHandler = jest.fn();
        });

        test('should not do anything if destroyed', () => {
            metadataQuery.isDestroyed = jest.fn().mockReturnValueOnce(true);
            return expect(metadataQuery.queryMetadataRequest()).toBeUndefined();
        });

        test('should make xhr call to metadata_queries/execute endpoint and call success callback', async () => {
            const mockAPIResponse = { data: mockMetadataQuerySuccessResponse };

            metadataQuery.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadataQuery.xhr = {
                post: jest.fn().mockReturnValueOnce(Promise.resolve(mockAPIResponse)),
            };

            await metadataQuery.queryMetadataRequest(mockQuery);
            expect(metadataQuery.xhr.post).toHaveBeenCalledWith(mockAPIRequestParams);
            expect(metadataQuery.queryMetadataSuccessHandler).toHaveBeenCalledWith(mockAPIResponse);
            expect(metadataQuery.errorHandler).not.toHaveBeenCalled();
        });

        test('should make xhr call to metadata_queries/execute endpoint and call error callback', async () => {
            const error = new Error('error');
            metadataQuery.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadataQuery.xhr = {
                post: jest.fn().mockReturnValueOnce(Promise.reject(error)),
            };

            try {
                await metadataQuery.queryMetadataRequest(mockQuery);
            } catch (e) {
                expect(metadataQuery.xhr.post).toHaveBeenCalledWith(mockAPIRequestParams);
                expect(metadataQuery.errorCode).toBe(ERROR_CODE_METADATA_QUERY);
                expect(metadataQuery.errorHandler).toHaveBeenCalledWith(error);
                expect(metadataQuery.queryMetadataSuccessHandler).not.toHaveBeenCalled();
            }
        });
    });

    describe('queryMetadata()', () => {
        const successCallback = jest.fn();
        const errorCallback = jest.fn();
        const context = { id: 'abc' };
        const mockCacheKey = `${CACHE_PREFIX_METADATA_QUERY}${context.id}`;

        test('should not do anything if destroyed', () => {
            metadataQuery.getCacheKey = jest.fn();
            metadataQuery.isLoaded = jest.fn();
            metadataQuery.queryMetadataRequest = jest.fn();
            metadataQuery.isDestroyed = jest.fn().mockReturnValueOnce(true);

            metadataQuery.queryMetadata(mockQuery, successCallback, errorCallback, {});
            expect(metadataQuery.getCacheKey).not.toHaveBeenCalled();
            expect(metadataQuery.isLoaded).not.toHaveBeenCalled();
            expect(metadataQuery.queryMetadataRequest).not.toHaveBeenCalled();
        });

        test('should return data from cache in case of cache-hit and not make xhr call', () => {
            const options = { context };

            metadataQuery.queryMetadataRequest = jest.fn();
            metadataQuery.finish = jest.fn();
            metadataQuery.isLoaded = jest.fn().mockReturnValueOnce(true);

            metadataQuery.queryMetadata(mockQuery, successCallback, errorCallback, options);
            expect(metadataQuery.finish).toHaveBeenCalled();
            expect(metadataQuery.queryMetadataRequest).not.toHaveBeenCalled();
        });

        test('should make the xhr call if forceFetch option is set', () => {
            const options = {
                forceFetch: true,
                context,
            };

            cache.unset = jest.fn();
            metadataQuery.queryMetadataRequest = jest.fn();
            metadataQuery.isLoaded = jest.fn();

            metadataQuery.queryMetadata(mockQuery, successCallback, errorCallback, options);
            expect(cache.unset).toHaveBeenCalledWith(mockCacheKey);
            expect(metadataQuery.queryMetadataRequest).toHaveBeenCalledWith(mockQuery);
        });
    });
});
