import axios from 'axios';
import { withData } from 'leche';
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
        withData(
            {
                'negative cached result': [hostUrls[0], false],
                'positive cached result': [hostUrls[1], true],
            },
            (hostUrl, expectedIsReachable) => {
                test('should return the cached result when it exists and make no reachability requests', async () => {
                    uploadsReachability.cachedResults = validResults;
                    uploadsReachability.makeReachabilityRequest = jest.fn();
                    uploadsReachability.getCachedResult = jest.fn().mockReturnValueOnce(validResults[hostUrl]);

                    const response = await uploadsReachability.isReachable(hostUrl);

                    expect(response).toEqual(expectedIsReachable);
                    expect(uploadsReachability.makeReachabilityRequest).not.toBeCalled();
                });
            },
        );

        withData(
            {
                'expired cached result, makeReachabilityRequest() succeeds': [hostUrls[0], 1, null, true],
                'expired cached result, makeReachabilityRequest() fails': [hostUrls[0], 1, null, false],

                'no cached result, makeReachabilityRequest() succeeds': [hostUrls[1], 0, null, true],
                'no cached result, makeReachabilityRequest() fails': [hostUrls[1], 0, null, false],
            },
            (hostUrl, msToTick, getCachedResult, makeReachabilityRequestSucceeds) => {
                test('should return and store the result according to makeReachabilityRequest() when there is no valid cached result', async () => {
                    uploadsReachability.cachedResults = validAndInvalidResults;
                    uploadsReachability.makeReachabilityRequest = jest
                        .fn()
                        .mockReturnValueOnce(Promise.resolve(makeReachabilityRequestSucceeds));
                    uploadsReachability.getCachedResult = jest.fn().mockReturnValueOnce(getCachedResult);
                    uploadsReachability.updateCachedResult = jest.fn();

                    const response = await uploadsReachability.isReachable(hostUrl);

                    expect(response).toEqual(makeReachabilityRequestSucceeds);
                    expect(uploadsReachability.getCachedResult).toHaveBeenCalled();
                    expect(uploadsReachability.updateCachedResult).toHaveBeenCalledWith(
                        hostUrl,
                        makeReachabilityRequestSucceeds,
                    );
                });
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
