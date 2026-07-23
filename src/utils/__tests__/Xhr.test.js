import noop from 'lodash/noop';
import TokenService from '../TokenService';
import Xhr from '../Xhr';

jest.mock('../TokenService');
TokenService.getReadToken.mockImplementation(() => Promise.resolve(`${Math.random()}`));

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
                        signal: xhrInstance.axiosAbortController.signal,
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
            const mockAbortController = {
                signal: jest.fn(),
                abort: jest.fn(),
            };
            xhrInstance.axiosAbortController = mockAbortController;

            xhrInstance.abort();

            expect(mockAbortController.abort).toHaveBeenCalled();
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
        const createXhrInstance = options => {
            xhrInstance = new Xhr({
                token: '123',
                ...options,
            });
        };

        test.each`
            condition                      | shouldRetry | method      | retryableStatusCodes | responseCode | hasRequestBody | retryCount | expected
            ${'shouldRetry=false'}         | ${false}    | ${'get'}    | ${undefined}         | ${429}       | ${true}        | ${0}       | ${false}
            ${'max retries hit'}           | ${true}     | ${'get'}    | ${undefined}         | ${429}       | ${true}        | ${3}       | ${false}
            ${'invalid status 5xx'}        | ${true}     | ${'get'}    | ${undefined}         | ${500}       | ${true}        | ${0}       | ${false}
            ${'invalid status 4xx'}        | ${true}     | ${'get'}    | ${undefined}         | ${404}       | ${true}        | ${0}       | ${false}
            ${'error was thrown'}          | ${true}     | ${'get'}    | ${undefined}         | ${undefined} | ${false}       | ${0}       | ${false}
            ${'unsafe http method POST'}   | ${true}     | ${'post'}   | ${[500]}             | ${500}       | ${true}        | ${0}       | ${false}
            ${'unsafe http method PUT'}    | ${true}     | ${'put'}    | ${[500]}             | ${500}       | ${true}        | ${0}       | ${false}
            ${'unsafe http method DELETE'} | ${true}     | ${'delete'} | ${[500]}             | ${500}       | ${true}        | ${0}       | ${false}
            ${'unsafe method w/429 code'}  | ${true}     | ${'post'}   | ${undefined}         | ${429}       | ${true}        | ${0}       | ${true}
            ${'rate limit status 429'}     | ${true}     | ${'get'}    | ${undefined}         | ${429}       | ${true}        | ${0}       | ${true}
            ${'custom retryable statuses'} | ${true}     | ${'get'}    | ${[503, 429]}        | ${503}       | ${true}        | ${0}       | ${true}
            ${'generic error is thrown'}   | ${true}     | ${'get'}    | ${undefined}         | ${undefined} | ${true}        | ${0}       | ${true}
        `(
            `should retry = $expected when $condition`,
            ({ shouldRetry, method, retryableStatusCodes, responseCode, hasRequestBody, retryCount, expected }) => {
                createXhrInstance({ shouldRetry, retryableStatusCodes });
                xhrInstance.retryCount = retryCount;
                const result = xhrInstance.shouldRetryRequest({
                    response: responseCode ? { status: responseCode } : undefined,
                    request: hasRequestBody ? { data: { foo: 'bar' } } : undefined,
                    config: { method }, // AxiosXHRConfig for the request
                });
                expect(result).toBe(expected);
            },
        );
    });

    describe('getExponentialRetryTimeoutInMs()', () => {
        beforeEach(() => {
            jest.spyOn(Math, 'random').mockReturnValue(0.5);
        });

        test.each([
            [1, 1500],
            [2, 2500],
            [3, 4500],
            [4, 8500],
        ])('should get exponential retry timeout %#', (retryCount, expected) => {
            expect(xhrInstance.getExponentialRetryTimeoutInMs(retryCount)).toBe(expected);
        });
    });

    describe('errorInterceptor()', () => {
        const DELAY = 500;
        beforeEach(() => {
            xhrInstance.shouldRetryRequest = jest.fn();
            xhrInstance.getExponentialRetryTimeoutInMs = jest.fn().mockReturnValue(DELAY);
            xhrInstance.responseInterceptor = jest.fn();

            jest.useFakeTimers();
        });

        test('should retry the request before calling the error interceptor', () => {
            const error = {
                status: 429,
                response: {
                    data: undefined,
                },
            };
            xhrInstance.axios = jest.fn().mockImplementation(() => {
                xhrInstance
                    .errorInterceptor(error)
                    .then(() => {})
                    .catch(() => {});
                return Promise.resolve();
            });
            // first time return true, then false
            xhrInstance.shouldRetryRequest.mockReturnValue(false).mockReturnValueOnce(true);
            xhrInstance.errorInterceptor(error);

            expect(xhrInstance.retryCount).toBe(1);
            expect(xhrInstance.getExponentialRetryTimeoutInMs).toHaveBeenCalled();
            expect(xhrInstance.responseInterceptor).not.toHaveBeenCalled();

            jest.runAllTimers();

            expect(xhrInstance.axios).toHaveBeenCalled();
            expect(xhrInstance.retryCount).toBe(1);
            expect(xhrInstance.responseInterceptor).toHaveBeenCalledWith(error);
        });

        test('should not retry the request before calling the error interceptor', () => {
            expect.assertions(3);
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
            xhrInstance.errorInterceptor(error).catch(() => {
                expect(xhrInstance.getExponentialRetryTimeoutInMs).not.toHaveBeenCalled();
                expect(xhrInstance.axios).not.toHaveBeenCalled();
                expect(xhrInstance.responseInterceptor).toHaveBeenCalledWith(response.data);
            });
        });
    });

    describe('getHeaders()', () => {
        it('should not override any existing Accept-Language header', async () => {
            xhrInstance.language = 'bar';
            const actHeaders = await xhrInstance.getHeaders('123', { 'Accept-Language': 'foo' });

            expect(actHeaders['Accept-Language']).toBe('foo');
        });

        it('should apply Accept-Language header if language exists', async () => {
            xhrInstance.language = 'bar';
            const actHeaders = await xhrInstance.getHeaders('123');

            expect(actHeaders['Accept-Language']).toBe('bar');
        });
    });
});
