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
                        method: 'post',
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
                method: 'put',
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
                method: 'delete',
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
                        method: 'options',
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
                        method: 'options',
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
});
