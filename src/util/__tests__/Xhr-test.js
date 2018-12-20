import noop from 'lodash/noop';
import Xhr from '../Xhr';

describe('util/Xhr', () => {
    let xhrInstance;

    beforeEach(() => {
        xhrInstance = new Xhr({
            token: '123',
        });
    });

    describe('get()', () => {
        test('should make get call with axios', () => {
            const url = 'parsedurl';
            xhrInstance.getParsedUrl = jest.fn().mockReturnValue(url);
            xhrInstance.getHeaders = jest.fn().mockReturnValue(Promise.resolve({}));
            xhrInstance.axios = {
                get: jest.fn().mockReturnValue({}),
            };

            return xhrInstance
                .get({
                    url: 'url',
                    data: {},
                })
                .then(() => {
                    expect(xhrInstance.axios.get).toHaveBeenCalledWith('url', {
                        cancelToken: xhrInstance.axiosSource.token,
                        params: {},
                        headers: {},
                        parsedUrl: url,
                    });
                });
        });
    });

    describe('post()', () => {
        test('should make post call with axios', () => {
            const url = 'parsedurl';
            xhrInstance.getParsedUrl = jest.fn().mockReturnValue(url);
            xhrInstance.getHeaders = jest.fn().mockReturnValue(Promise.resolve({}));
            xhrInstance.axios = jest.fn().mockReturnValue({});

            return xhrInstance
                .post({
                    url: 'url',
                    data: {},
                })
                .then(() => {
                    expect(xhrInstance.axios).toHaveBeenCalledWith({
                        url: 'url',
                        method: 'POST',
                        parsedUrl: url,
                        data: {},
                        headers: {},
                    });
                });
        });
    });

    describe('put()', () => {
        test('should call post() with put method', () => {
            xhrInstance.post = jest.fn();
            xhrInstance.put({
                id: '123',
                url: 'url',
                data: {},
            });

            expect(xhrInstance.post).toHaveBeenCalledWith({
                id: '123',
                url: 'url',
                data: {},
                method: 'PUT',
                headers: {},
            });
        });
    });

    describe('delete()', () => {
        test('should call post() with delete method', () => {
            xhrInstance.post = jest.fn();
            xhrInstance.delete({
                id: '123',
                url: 'url',
                data: {},
            });

            expect(xhrInstance.post).toHaveBeenCalledWith({
                id: '123',
                url: 'url',
                data: {},
                method: 'DELETE',
                headers: {},
            });
        });
    });

    describe('options()', () => {
        test('should make options call with axios and call successHandler on success', () => {
            const response = { data: {} };
            const successHandler = jest.fn();
            xhrInstance.getHeaders = jest.fn().mockReturnValue(Promise.resolve({}));
            xhrInstance.axios = jest.fn().mockReturnValue(Promise.resolve(response));

            return xhrInstance
                .options({
                    successHandler,
                    errorHandler: noop,
                })
                .then(() => {
                    expect(xhrInstance.axios).toHaveBeenCalledWith({
                        method: 'OPTIONS',
                        headers: {},
                    });
                    expect(successHandler).toHaveBeenCalledWith(response);
                });
        });

        test('should call errorHandler on axios error', () => {
            const error = { status: '' };
            const errorHandler = jest.fn();
            xhrInstance.getHeaders = jest.fn().mockReturnValue(Promise.resolve({}));
            xhrInstance.axios = jest.fn().mockReturnValue(Promise.reject(error));

            return xhrInstance
                .options({
                    successHandler: noop,
                    errorHandler,
                })
                .then(() => {
                    expect(xhrInstance.axios).toHaveBeenCalledWith({
                        method: 'OPTIONS',
                        headers: {},
                    });
                    expect(errorHandler).toHaveBeenCalledWith(error);
                });
        });

        test('should call errorHandler on getHeaders error', () => {
            const error = { status: '' };
            const errorHandler = jest.fn();
            xhrInstance.getHeaders = jest.fn().mockReturnValue(Promise.reject(error));

            return xhrInstance
                .options({
                    successHandler: noop,
                    errorHandler,
                })
                .then(() => {
                    expect(errorHandler).toHaveBeenCalledWith(error);
                });
        });
    });

    describe('uploadFile()', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.clearAllTimers();
        });

        test('should call abort & idleTimeoutHandler if there is no upload progress after idleTimeoutDuration', () => {
            xhrInstance.abort = jest.fn();
            xhrInstance.axios = jest.fn();
            xhrInstance.getHeaders = jest.fn().mockReturnValue(Promise.resolve({}));
            const idleTimoutHandler = jest.fn();

            return xhrInstance
                .uploadFile({
                    successHandler: noop,
                    errorHandler: noop,
                    progressHandler: noop,
                    withIdleTimeout: true,
                    idleTimeoutDuration: 100,
                    idleTimeoutHandler: idleTimoutHandler,
                })
                .then(() => {
                    jest.advanceTimersByTime(101); // 101ms should trigger idle timeout func that calls abort

                    expect(xhrInstance.abort).toHaveBeenCalled();
                    expect(idleTimoutHandler).toHaveBeenCalled();
                });
        });

        test('should not call abort if there is upload progress before idleTimeoutDuration', () => {
            const uploadHandler = jest.fn();
            xhrInstance.abort = jest.fn();
            xhrInstance.axios = jest.fn(({ onUploadProgress }) => {
                jest.advanceTimersByTime(50); // simulate progress event after 50ms
                onUploadProgress();
            });
            xhrInstance.getHeaders = jest.fn().mockReturnValue(Promise.resolve({}));

            return xhrInstance
                .uploadFile({
                    successHandler: noop,
                    errorHandler: noop,
                    progressHandler: uploadHandler,
                    withIdleTimeout: true,
                    idleTimeoutDuration: 100,
                })
                .then(() => {
                    jest.advanceTimersByTime(51); // 50 + 51ms will original idle timeout func unless cancelled

                    expect(uploadHandler).toHaveBeenCalled();
                    expect(xhrInstance.abort).not.toHaveBeenCalled();
                });
        });

        test('should call successHandler and not call abort if upload succeeds', () => {
            const successHandler = jest.fn();
            const response = { data: {} };

            xhrInstance.abort = jest.fn();
            xhrInstance.axios = jest.fn().mockReturnValue(Promise.resolve(response));
            xhrInstance.getHeaders = jest.fn().mockReturnValue(Promise.resolve({}));

            return xhrInstance
                .uploadFile({
                    successHandler,
                    errorHandler: noop,
                    progressHandler: noop,
                    withIdleTimeout: true,
                    idleTimeoutDuration: 100,
                })
                .then(() => {
                    jest.advanceTimersByTime(101);

                    expect(xhrInstance.abort).not.toHaveBeenCalled();
                    expect(successHandler).toHaveBeenCalledWith(response);
                });
        });

        test('should call errorHandler and not call abort if upload fails', () => {
            const errorHandler = jest.fn();
            const error = { status: '' };

            xhrInstance.abort = jest.fn();
            xhrInstance.axios = jest.fn().mockReturnValue(Promise.reject(error));
            xhrInstance.getHeaders = jest.fn().mockReturnValue(Promise.resolve({}));

            return xhrInstance
                .uploadFile({
                    successHandler: noop,
                    errorHandler,
                    progressHandler: noop,
                    withIdleTimeout: true,
                    idleTimeoutDuration: 100,
                })
                .then(() => {
                    jest.advanceTimersByTime(101);

                    expect(xhrInstance.abort).not.toHaveBeenCalled();
                    expect(errorHandler).toHaveBeenCalledWith(error);
                });
        });

        test('should call errorHandler if getHeaders fails', () => {
            const errorHandler = jest.fn();
            const error = { status: '' };

            xhrInstance.getHeaders = jest.fn().mockReturnValue(Promise.reject(error));

            return xhrInstance
                .uploadFile({
                    successHandler: noop,
                    errorHandler,
                    progressHandler: noop,
                })
                .then(() => {
                    expect(errorHandler).toHaveBeenCalledWith(error);
                });
        });
    });

    describe('abort()', () => {
        test('should cancel axios request', () => {
            xhrInstance.axiosSource = {
                cancel: jest.fn(),
            };

            xhrInstance.abort();

            expect(xhrInstance.axiosSource.cancel).toHaveBeenCalled();
        });
    });

    describe('defaultResponseInterceptor()', () => {
        test('should return the response', () => {
            const origResponse = {
                status: 500,
                foo: 'bar',
            };
            const response = xhrInstance.defaultResponseInterceptor(origResponse);
            expect(response).toEqual(origResponse);
        });
    });

    describe('shouldRetryRequest', () => {
        const createXhrInstance = shouldRetryRequest => {
            xhrInstance = new Xhr({
                token: '123',
                shouldRetryRequest,
            });
        };

        test.each([
            [
                false,
                {
                    status: 429,
                },
                {
                    data: {
                        foo: 'bar',
                    },
                },
                4,
                false,
            ], // false, shouldRetry false
            [
                true,
                {
                    status: 429,
                },
                {
                    data: {
                        foo: 'bar',
                    },
                },
                0,
                true,
            ], // true, rate limit
            [
                true,
                {
                    status: 429,
                },
                {
                    data: {
                        foo: 'bar',
                    },
                },
                4,
                false,
            ], // false, max number exceeded
            [
                true,
                {
                    status: 500,
                },
                {
                    data: {
                        foo: 'bar',
                    },
                },
                0,
                false,
            ], // false, not valid code
            [
                true,
                {
                    status: 404,
                },
                {
                    data: {
                        foo: 'bar',
                    },
                },
                0,
                false,
            ], // false, not valid code
            [
                true,
                undefined,
                {
                    data: {
                        foo: 'bar',
                    },
                },
                0,
                true,
            ], // true, generic network error
            [
                true,
                {
                    status: 404,
                },
                {
                    data: {
                        foo: 'bar',
                    },
                },
                0,
                false,
            ], // false, invalid status code
            [true, undefined, undefined, 0, false], // false, error thrown during request
        ])('should retry request %#', (shouldRetryRequest, response, request, retryCount, expected) => {
            createXhrInstance(shouldRetryRequest);
            xhrInstance.retryCount = retryCount;
            const result = xhrInstance.shouldRetryRequest({
                response,
                request,
            });
            expect(result).toBe(expected);
        });
    });

    describe('getExponentialRetryTimeoutInMs()', () => {
        beforeEach(() => {
            jest.spyOn(Math, 'random').mockReturnValue(0.1);
        });

        test.each([[1, 1200], [2, 2400], [3, 4800], [4, 9600]])(
            'should get exponential retry timeout %#',
            (retryCount, expected) => {
                expect(xhrInstance.getExponentialRetryTimeoutInMs(retryCount)).toBe(expected);
            },
        );
    });

    describe('getRetryDelayInMs()', () => {
        const RETRY_AFTER = 4;
        const RETRY_AFTER_EXPONENTIAL = 5000;

        beforeEach(() => {
            xhrInstance.getExponentialRetryTimeoutInMs = jest.fn().mockReturnValue(RETRY_AFTER_EXPONENTIAL);
        });
        test('should use the retry-after header if first retry and rate limit', () => {
            const result = xhrInstance.getRetryDelayInMs({
                status: 429,
                response: {
                    headers: {
                        'Retry-After': RETRY_AFTER.toString(),
                    },
                },
            });
            expect(result).toBe(RETRY_AFTER * 1000);
        });

        test('should use exponential backoff if retry-after header does not exist', () => {
            const result = xhrInstance.getRetryDelayInMs({
                status: 429,
                response: {
                    headers: {
                        foo: 'bar',
                    },
                },
            });
            expect(result).toEqual(RETRY_AFTER_EXPONENTIAL);
        });

        test('should use exponential backoff on try > 0 even if retry-after header exists', () => {
            xhrInstance.retryCount = 1;
            const result = xhrInstance.getRetryDelayInMs({
                response: {
                    headers: {
                        'Retry-After': RETRY_AFTER.toString(),
                    },
                },
            });
            expect(result).toEqual(RETRY_AFTER_EXPONENTIAL);
        });
    });

    describe('errorInterceptor()', () => {
        const DELAY = 500;
        beforeEach(() => {
            xhrInstance.shouldRetryRequest = jest.fn();
            xhrInstance.getRetryDelayInMs = jest.fn().mockReturnValue(DELAY);
            xhrInstance.responseInterceptor = jest.fn();

            jest.useFakeTimers();
        });

        test('should retry the request before calling the error interceptor', () => {
            const error = {
                status: 500,
                response: {
                    data: undefined,
                },
            };
            xhrInstance.axios = jest.fn().mockImplementation(() => {
                xhrInstance.errorInterceptor(error);
                return Promise.resolve();
            });
            // first time return true, then false
            xhrInstance.shouldRetryRequest.mockReturnValue(false).mockReturnValueOnce(true);
            xhrInstance.errorInterceptor(error);

            expect(xhrInstance.responseInterceptor).not.toHaveBeenCalled();

            jest.runAllTimers();

            expect(xhrInstance.axios).toHaveBeenCalled();
            expect(xhrInstance.responseInterceptor).toHaveBeenCalledWith(error);
        });

        test('should not retry the request before calling the error interceptor', () => {
            const response = {
                data: {
                    foo: 'bar',
                },
            };
            const error = {
                status: 500,
                response,
            };
            xhrInstance.axios = jest.fn().mockImplementation(() => {
                xhrInstance.errorInterceptor(error);
                return Promise.resolve();
            });
            xhrInstance.shouldRetryRequest.mockReturnValue(false);
            xhrInstance.errorInterceptor(error);

            expect(xhrInstance.axios).not.toHaveBeenCalled();
            expect(xhrInstance.responseInterceptor).toHaveBeenCalledWith(response.data);
        });
    });
});
