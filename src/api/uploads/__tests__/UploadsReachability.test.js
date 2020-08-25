import axios from 'axios';
import UploadsReachability from '../UploadsReachability';
import { DEFAULT_HOSTNAME_UPLOAD } from '../../../constants';

let uploadsReachability;

describe('api/uploads/UploadsReachability', () => {
    const hostUrls = ['host0', 'host1', 'host2', 'host3'];
    const currentTimeMS = 1000;
    const validResults = {
        host0: {
            isReachable: false,
            expirationTimestampMS: currentTimeMS + 1000,
        },
        host1: {
            isReachable: true,
            expirationTimestampMS: currentTimeMS + 2000,
        },
    };
    const validAndInvalidResults = {
        host0: {
            isReachable: true,
            expirationTimestampMS: currentTimeMS - 1,
        },
        host2: {
            isReachable: false,
            expirationTimestampMS: currentTimeMS + 20,
        },

        host3: {
            isReachable: false,
            expirationTimestampMS: currentTimeMS + 30,
        },
    };

    beforeEach(() => {
        uploadsReachability = new UploadsReachability();
    });

    describe('isReachable()', () => {
        // Test cases in order
        // negative cached result
        // positive cached result
        test.each`
            hostUrl        | expectedIsReachable
            ${hostUrls[0]} | ${false}
            ${hostUrls[1]} | ${true}
        `(
            'should return the cached result when it exists and make no reachability requests',
            async ({ hostUrl, expectedIsReachable }) => {
                uploadsReachability.cachedResults = validResults;
                uploadsReachability.makeReachabilityRequest = jest.fn();
                uploadsReachability.getCachedResult = jest.fn().mockReturnValueOnce(validResults[hostUrl]);

                const response = await uploadsReachability.isReachable(hostUrl);

                expect(response).toEqual(expectedIsReachable);
                expect(uploadsReachability.makeReachabilityRequest).not.toBeCalled();
            },
        );

        // Test cases in order
        // expired cached result, makeReachabilityRequest() succeeds
        // expired cached result, makeReachabilityRequest() fails
        // no cached result, makeReachabilityRequest() succeeds
        // no cached result, makeReachabilityRequest() fails
        test.each`
            hostUrl        | getCachedResult | makeReachabilityRequestSucceed
            ${hostUrls[0]} | ${null}         | ${true}
            ${hostUrls[0]} | ${null}         | ${false}
            ${hostUrls[1]} | ${null}         | ${true}
            ${hostUrls[1]} | ${null}         | ${false}
        `(
            'should return and store the result according to makeReachabilityRequest() when there is no valid cached result',
            async ({ hostUrl, getCachedResult, makeReachabilityRequestSucceed }) => {
                uploadsReachability.cachedResults = validAndInvalidResults;
                uploadsReachability.makeReachabilityRequest = jest
                    .fn()
                    .mockReturnValueOnce(Promise.resolve(makeReachabilityRequestSucceed));
                uploadsReachability.getCachedResult = jest.fn().mockReturnValueOnce(getCachedResult);
                uploadsReachability.updateCachedResult = jest.fn();

                const response = await uploadsReachability.isReachable(hostUrl);

                expect(response).toEqual(makeReachabilityRequestSucceed);
                expect(uploadsReachability.getCachedResult).toHaveBeenCalled();
                expect(uploadsReachability.updateCachedResult).toHaveBeenCalledWith(
                    hostUrl,
                    makeReachabilityRequestSucceed,
                );
            },
        );

        test('should return true when host is DEFAULT_HOSTNAME_UPLOAD, without checking cache and making a reachability test', async () => {
            uploadsReachability.getCachedResult = jest.fn();
            uploadsReachability.makeReachabilityRequest = jest.fn();
            const response = await uploadsReachability.isReachable(`${DEFAULT_HOSTNAME_UPLOAD}/`);

            expect(response).toBe(true);
            expect(uploadsReachability.getCachedResult).not.toHaveBeenCalled();
            expect(uploadsReachability.makeReachabilityRequest).not.toHaveBeenCalled();
        });
    });

    describe(`makeReachabilityRequest()`, () => {
        test(`should return false when there is an error making POST request`, async () => {
            axios.post = jest.fn().mockReturnValueOnce(Promise.reject());

            const response = await uploadsReachability.makeReachabilityRequest(hostUrls[0]);

            expect(response).toBe(false);
            expect(axios.post).toHaveBeenCalled();
        });

        test('should return true when there is no error making POST reqeust', async () => {
            axios.post = jest.fn().mockReturnValueOnce(Promise.resolve());

            const response = await uploadsReachability.makeReachabilityRequest(hostUrls[0]);

            expect(response).toBe(true);
            expect(axios.post).toHaveBeenCalled();
        });
    });

    describe('getUnreachableHostsUrls()', () => {
        test('should return a empty list when cachedResults is null', () => {
            uploadsReachability.cachedResults = null;

            const response = uploadsReachability.getUnreachableHostsUrls();

            expect(response).toEqual([]);
        });

        test('should return a list of unreachable hosts when cachedResults is not null', () => {
            uploadsReachability.cachedResults = validResults;
            uploadsReachability.isCachedHostValid = jest.fn().mockReturnValueOnce(true);

            const response = uploadsReachability.getUnreachableHostsUrls();

            expect(response).toEqual(['host0']);
        });
    });
});
