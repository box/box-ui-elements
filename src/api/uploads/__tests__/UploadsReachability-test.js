/* eslint-disable no-unused-expressions, no-underscore-dangle */
import { withData } from 'leche';

import UploadsReachability from '../UploadReachability';
import { DEFAULT_HOSTNAME_UPLOAD } from '../../../constants';

describe('api/UploadsReachability', () => {
    let uploadsReachabilityTest;
    const token = '123';
    const apiHost = 'abc.box.com';

    beforeEach(() => {
        uploadsReachabilityTest = new UploadsReachability(token, apiHost);
    });

    describe('isUploadHostReachable()', () => {
        test('should return true when the upload host is default upload host', async () => {
            const res = await uploadsReachabilityTest.isUploadHostReachable(DEFAULT_HOSTNAME_UPLOAD);
            expect(res).toBe(true);
        });

        test('should return false when there is an error when making the GET request', async () => {
            window.fetch = jest.fn().mockReturnValueOnce(Promise.reject());
            const res = await uploadsReachabilityTest.isUploadHostReachable('random_url');
            expect(res).toBe(false);
        });

        test('should return true when there is no error when making the GET request', async () => {
            window.fetch = jest.fn().mockReturnValueOnce(Promise.resolve());
            const res = await uploadsReachabilityTest.isUploadHostReachable('random_url');
            expect(res).toBe(true);
        });
    });

    describe('getUploadHost()', () => {
        test('should call handlePreflightResponse()', async () => {
            uploadsReachabilityTest.xhr.options = jest.fn().mockReturnValueOnce(Promise.resolve());
            uploadsReachabilityTest.handlePreflightResponse = jest.fn();
            await uploadsReachabilityTest.getUploadHost();
            expect(uploadsReachabilityTest.handlePreflightResponse).toHaveBeenCalled();
        });
    });

    describe('handlePreflightResponse()', () => {
        withData(
            [
                [{random: 1}, DEFAULT_HOSTNAME_UPLOAD],
                [undefined, DEFAULT_HOSTNAME_UPLOAD],
                [null, DEFAULT_HOSTNAME_UPLOAD],
                [{ upload_url: 'http://random.com/hello123' }, 'http://random.com']
            ],
            (response, host) => {
                test('should resolve preflight response to upload host properly', async () => {
                    const res = await uploadsReachabilityTest.handlePreflightResponse(response);

                    expect(res).toBe(host);
                });
            }
        );
    });

    describe('getReachableUploadHost()', () => {
        test('should return the upload host when it is the default upload host', async () => {
            uploadsReachabilityTest.getUploadHost = jest
                .fn()
                .mockReturnValueOnce(Promise.resolve(DEFAULT_HOSTNAME_UPLOAD));

            const res = await uploadsReachabilityTest.getReachableUploadHost();

            expect(res).toBe(DEFAULT_HOSTNAME_UPLOAD);
        });

        withData(
            [[{ randomHost: true }, 'randomHost'], [{ randomHost: false }, DEFAULT_HOSTNAME_UPLOAD]],
            (cache, result) => {
                test('should return a reachable host with reference to the cached results', async () => {
                    uploadsReachabilityTest.getUploadHost = jest
                        .fn()
                        .mockReturnValueOnce(Promise.resolve('randomHost'));
                    uploadsReachabilityTest.localStore.getItem = jest.fn().mockReturnValueOnce(cache);

                    const res = await uploadsReachabilityTest.getReachableUploadHost();

                    expect(res).toBe(result);
                });
            }
        );

        withData([[true, 'randomHost'], [false, DEFAULT_HOSTNAME_UPLOAD]], (isReachable, result) => {
            test('should return a reachable host when host is not cached', async () => {
                const cache = { stuff: true };
                uploadsReachabilityTest.getUploadHost = jest.fn().mockReturnValueOnce(Promise.resolve('randomHost'));
                uploadsReachabilityTest.isUploadHostReachable = jest.fn().mockReturnValueOnce(isReachable);
                uploadsReachabilityTest.localStore.getItem = jest.fn().mockReturnValueOnce(cache);
                uploadsReachabilityTest.localStore.setItem = jest.fn();

                const res = await uploadsReachabilityTest.getReachableUploadHost();

                expect(res).toBe(result);
            });
        });
    });
});
