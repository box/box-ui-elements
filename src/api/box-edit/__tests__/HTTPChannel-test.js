import HTTPChannel from '../HTTPChannel';

let clock;
let FakeXHR;

const APP_NAME = 'AppName';
const URL = 'http://127.0.0.1:';
const CHANNEL_NAME = 'http-channel';
const TIMEOUT_MS = 5000;
const TIMEOUT_SECONDS = 5;

let stubGetCookie;
let stubSetCookie;
let stubGenerateId;
let stubGetWindow;

describe('lib/box-edit/HTTPChannel', () => {
    beforeEach(() => {
        stubGetCookie = jest.fn();
        stubSetCookie = jest.fn();
        stubGenerateId = jest.fn();
        stubGetWindow = jest.fn();
    });

    afterEach(() => {});

    describe('createCORSRequest()', () => {
        let fakeXHR;

        beforeEach(() => {
            fakeXHR = {
                open: jest.fn(),
            };
            window.XMLHttpRequest = jest.fn(() => fakeXHR);
        });

        test('should return XHR when XHR.open does not throw', () => {
            const channel = new HTTPChannel(APP_NAME, URL);

            const result = channel.createCORSRequest('GET', URL);

            expect(result).toEqual(fakeXHR);
        });

        test('should return XHR when XHR.open fails on first attempt', () => {
            fakeXHR.open = jest
                .fn(() => true)
                .mockImplementationOnce(() => {
                    throw new Error();
                });

            const channel = new HTTPChannel(APP_NAME, URL);
            const result = channel.createCORSRequest('GET', URL);

            expect(fakeXHR.open.mock.results[0].isThrow).toEqual(true);
            expect(result).toEqual(fakeXHR);
        });

        // // TODO fix when we figure out return / settimeout
        test('should return XHR when XHR.open fails on first and second attempt', () => {
            fakeXHR.open = jest
                .fn(() => true)
                .mockImplementationOnce(() => {
                    throw new Error();
                })
                .mockImplementationOnce(() => {
                    throw new Error();
                });

            const channel = new HTTPChannel(APP_NAME, URL);
            const result = channel.createCORSRequest('GET', URL);

            expect(result).toEqual(fakeXHR);
        });

        test('should throw when XHR.open fails on first, second, and third attempt', () => {
            fakeXHR.open = jest.fn(() => {
                throw new Error();
            });

            const catchMock = jest.fn();

            const channel = new HTTPChannel(APP_NAME, URL);
            try {
                channel.createCORSRequest('GET', URL);
            } catch (err) {
                catchMock();
            } finally {
                expect(catchMock).toBeCalled();
            }
        });
    });

    describe('getComServerStatusInstallationPromise()', () => {
        test('should resolve returned promise', async () => {
            const expected = '1234';
            const channel = new HTTPChannel(APP_NAME, URL, CHANNEL_NAME);

            channel.checkInstallStatus = jest.fn().mockImplementationOnce(() => Promise.resolve(expected));

            const result = await channel.getComServerStatusInstallationPromise(TIMEOUT_MS);
            expect(result).toEqual(expected);
        });

        test('should reject when checkInstallStatus rejects with notrunning', async () => {
            const channel = new HTTPChannel(APP_NAME, URL, CHANNEL_NAME);
            const expected = 'notrunning';
            channel.checkInstallStatus = jest.fn().mockImplementationOnce(() => Promise.reject(expected));
            const catchMock = jest.fn();

            try {
                await channel.getComServerStatusInstallationPromise(TIMEOUT_MS);
            } catch (err) {
                catchMock();
            } finally {
                expect(catchMock).toBeCalled();
            }
        });

        test('should retry with fallback port when checkInstallStatus rejects', async () => {
            const expected = '1234';
            const channel = new HTTPChannel(APP_NAME, URL, CHANNEL_NAME);

            channel.checkInstallStatus = jest
                .fn()
                .mockImplementationOnce(() => Promise.reject())
                .mockImplementationOnce(() => Promise.resolve(expected));

            const result = await channel.getComServerStatusInstallationPromise(TIMEOUT_MS);
            expect(result).toEqual(expected);
        });
    });

    // describe('sendComServerRequest()', () => {
    //     test('should return a promise that resolves when its request succeeds', done => {
    //         const fakeXHRInstance = new FakeXHR();
    //         fakeXHRInstance.open('GET', URL, true);
    //         const channel = new HTTPChannel(APP_NAME, URL);
    //         channel.createCORSRequest = jest.fn().returns(fakeXHRInstance);

    //         channel.sendComServerRequest('GET', URL, {}, TIMEOUT_MS).then(result => {
    //             expect(result).toEqual(fakeXHRInstance);
    //             done();
    //         });

    //         clock.tick(1);
    //         fakeXHRInstance.onload();
    //     });

    //     test('should return a promise that rejects when its request errors', done => {
    //         const fakeXHRInstance = new FakeXHR();
    //         fakeXHRInstance.open('GET', URL, true);
    //         const channel = new HTTPChannel(APP_NAME, URL);
    //         channel.createCORSRequest = jest.fn().returns(fakeXHRInstance);

    //         channel.sendComServerRequest('GET', URL, {}, TIMEOUT_MS).catch(result => {
    //             expect(result).toEqual(fakeXHRInstance);
    //             done();
    //         });

    //         fakeXHRInstance.onerror();
    //     });

    //     test('should return a promise that rejects when it times out', done => {
    //         const fakeXHRInstance = new FakeXHR();
    //         fakeXHRInstance.open('GET', URL, true);
    //         const channel = new HTTPChannel(APP_NAME, URL);
    //         channel.createCORSRequest = jest.fn().returns(fakeXHRInstance);

    //         channel.sendComServerRequest('GET', URL, {}, TIMEOUT_MS).catch(result => {
    //             expect(result).toEqual(fakeXHRInstance);
    //             done();
    //         });

    //         fakeXHRInstance.ontimeout();
    //     });
    // });

    // describe('checkInstallStatus()', () => {
    //     test('should return a promise that resolves successfully when its AJAX call succeeds', async () => {
    //         const channel = new HTTPChannel(APP_NAME, URL);

    //         const expectedResponse = {
    //             running: true,
    //         };

    //         channel.sendComServerRequest = jest.fn().resolves({
    //             responseText: JSON.stringify(expectedResponse),
    //         });

    //         const result = await channel.checkInstallStatus(1234, TIMEOUT_MS);

    //         expect(result).toEqual(expectedResponse);
    //     });

    //     test('should return a promise that rejects when its AJAX call fails', async () => {
    //         const channel = new HTTPChannel(APP_NAME, URL);

    //         channel.sendComServerRequest = jest.fn().rejects();

    //         const catchMock = sandbox.mock();

    //         try {
    //             await channel.checkInstallStatus(1234, TIMEOUT_MS);
    //         } catch (err) {
    //             catchMock();
    //         }
    //     });

    //     test('should return a promise that rejects when its AJAX response is invalid ', async () => {
    //         const channel = new HTTPChannel(APP_NAME, URL);

    //         const expectedResponse = {
    //             running: false,
    //         };

    //         channel.sendComServerRequest = jest.fn().resolves({
    //             responseText: JSON.stringify(expectedResponse),
    //         });

    //         try {
    //             await channel.checkInstallStatus(1234, TIMEOUT_MS);
    //         } catch (err) {
    //             expect(err.message).toEqual('notrunning');
    //         }
    //     });
    // });

    // describe('getComChannel()', () => {
    //     test('should return the appropriate cookie when called', () => {
    //         const expected = 'bar';
    //         stubGetCookie.withArgs('foo-bgp-id').returns(expected);

    //         const channel = new HTTPChannel(APP_NAME, URL);
    //         const result = channel.getComChannel('foo');

    //         expect(result).toEqual(expected);
    //     });
    // });

    // describe('setComChannel()', () => {
    //     test('should set the appropriate cookies and return appropriately when called and bgp-id already set', () => {
    //         const channel = new HTTPChannel(APP_NAME, URL);
    //         jest.fn(channel, 'getComChannel').returns('foo-id');

    //         const result = channel.setComChannel('foo');

    //         expect(stubSetCookie.calledWith('foo-bgp-id')).toBe(true);
    //         expect(stubSetCookie.calledWith('bgp-foo-id')).toBe(true);
    //         expect(result).toEqual('bgp-foo-id');
    //     });

    //     test('should set the appropriate cookies and return appropriately when called and bgp-id already set', () => {
    //         const channel = new HTTPChannel(APP_NAME, URL);
    //         jest.fn(channel, 'getComChannel').returns(undefined);
    //         stubGenerateId.returns('bar-id');

    //         const result = channel.setComChannel('foo');

    //         expect(stubSetCookie.calledWith('foo-bgp-id')).toBe(true);
    //         expect(stubSetCookie.calledWith('bgp-bar-id')).toBe(true);
    //         expect(result).toEqual('bgp-bar-id');
    //     });
    // });

    // describe('getComServerStatus()', () => {
    //     test('should set and return the com server installation status when called and comserver installation promise not set', () => {
    //         const expected = { foo: 'bar' };
    //         const channel = new HTTPChannel(APP_NAME, URL);
    //         channel.comServerInstallationPromise = false;
    //         channel.getComServerStatusInstallationPromise = jest
    //             .fn()
    //             .withArgs(1234)
    //             .returns(expected);
    //         const result = channel.getComServerStatus(1234);

    //         expect(channel.comServerInstallationPromise).toEqual(expected);
    //         expect(result).toEqual(expected);
    //     });

    //     test('should return comserver installation promise without reinitializing when called and it is already set', () => {
    //         const expected = { foo: 'bar' };
    //         const channel = new HTTPChannel(APP_NAME, URL);
    //         channel.comServerInstallationPromise = expected;
    //         channel.getComServerStatusInstallationPromise = sandbox.mock().never();

    //         const result = channel.getComServerStatus(111);
    //         expect(result).toEqual(expected);
    //     });
    // });

    // describe('sendRequest()', () => {
    //     test('should return a promise that resolves when its com server request succeeds', async () => {
    //         const expectedResponseText = {
    //             bar: 'baz',
    //         };

    //         const channel = new HTTPChannel(APP_NAME, URL);
    //         channel.sendComServerRequest = jest.fn().resolves({
    //             responseText: JSON.stringify(expectedResponseText),
    //         });

    //         const result = await channel.sendRequest({ foo: 'bar' }, TIMEOUT_MS, TIMEOUT_SECONDS);

    //         expect(result).toEqual(expectedResponseText);
    //     });

    //     test('should return a promise that rejects when the com server response is not well formed', async () => {
    //         const expectedResponseText = {
    //             response_type: 'error',
    //             message: 'blah',
    //         };

    //         const channel = new HTTPChannel(APP_NAME, URL);
    //         channel.sendComServerRequest = jest.fn().resolves({
    //             responseText: JSON.stringify(expectedResponseText),
    //         });

    //         try {
    //             await channel.sendRequest({ foo: 'bar' }, TIMEOUT_MS, TIMEOUT_SECONDS);
    //         } catch (err) {
    //             expect(err.message).toEqual('Communication error: blah');
    //         }
    //     });
    // });

    // describe('sendCommand()', () => {
    //     test('should return a promise that resolves when its com server request succeeds', async () => {
    //         const expected = { firstName: 'greatest', lastName: 'ever' };
    //         const channel = new HTTPChannel(APP_NAME, URL);
    //         channel.sendComServerRequest = jest.fn().resolves({
    //             responseText: JSON.stringify(expected),
    //         });

    //         const result = await channel.sendCommand({}, TIMEOUT_MS, TIMEOUT_SECONDS);

    //         expect(result).toEqual(expected);
    //     });

    //     test('should return a promise that rejects when the com server response is not well formed', async () => {
    //         const channel = new HTTPChannel(APP_NAME, URL);
    //         channel.sendComServerRequest = jest.fn().resolves({
    //             responseText: 'not json',
    //         });

    //         const catchMock = sandbox.mock();

    //         try {
    //             await channel.sendCommand({}, TIMEOUT_MS, TIMEOUT_SECONDS);
    //         } catch (err) {
    //             catchMock();
    //         }
    //     });
    // });
});
