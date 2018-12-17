import SafariChannel from '../SafariChannel';
import CONSTANTS from '../constants';

const APP_NAME = 'AppName';

describe('lib/box-edit/SafariChannel', () => {
    beforeEach(() => {
        document.addEventListener = jest.fn();
        document.removeEventListener = jest.fn();
        document.dispatchEvent = jest.fn();
        window.CustomEvent = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // TODO. implement
    describe('constructor()', () => {});

    // TODO. implement.
    describe('executeOperation()', () => {});

    describe('setupSafariExtensionCommunication()', () => {
        let channel;

        beforeEach(() => {
            channel = new SafariChannel(APP_NAME);
            channel.appExtensionEventResponseHandler = jest.fn();
            // Reset mock because it gets called in the constructor;
            document.addEventListener.mockClear();
        });

        test('should not set an event listener on the document when called with one already set', () => {
            channel.setupSafariExtensionCommunication();
            expect(document.addEventListener).not.toBeCalledWith(
                CONSTANTS.OUTPUT_EVENT,
                channel.appExtensionEventResponseHandler,
            );
        });

        test('should set an event listener on the document when called and none is already set', () => {
            channel.isAppExtensionListenerAttached = false;
            channel.setupSafariExtensionCommunication();
            expect(document.addEventListener).toBeCalledWith(
                CONSTANTS.OUTPUT_EVENT,
                channel.appExtensionEventResponseHandler,
            );
        });
    });

    describe('tearDownSafariExtensionCommunication()', () => {
        let channel;

        beforeEach(() => {
            channel = new SafariChannel(APP_NAME, false);
            channel.appExtensionEventResponseHandler = jest.fn();
        });

        test('should remove event listener on the document when called and one is already set', () => {
            channel.isAppExtensionListenerAttached = true;
            channel.tearDownSafariExtensionCommunication();
            expect(document.removeEventListener).toBeCalledWith(
                CONSTANTS.OUTPUT_EVENT,
                channel.appExtensionEventResponseHandler,
            );
        });

        test('should not remove event listener on the document when called and none is set', () => {
            channel.isAppExtensionListenerAttached = false;
            channel.tearDownSafariExtensionCommunication();
            expect(document.removeEventListener).not.toBeCalledWith(
                CONSTANTS.OUTPUT_EVENT,
                channel.appExtensionEventResponseHandler,
            );
        });
    });

    describe('appExtensionEventResponseHandler()', () => {
        let responseVal;
        let reqIdToPromiseMap;
        let resolveStub;
        let channel;

        beforeEach(() => {
            responseVal = {
                detail: {
                    req_id: 'id',
                    com_server_response: {
                        data: {
                            foo: 'bar',
                        },
                    },
                },
            };

            reqIdToPromiseMap = new Map();
            resolveStub = jest.fn();
            reqIdToPromiseMap.set('id', {
                rejectTimeout: 123,
                resolve: resolveStub,
            });
        });

        test('should call resolve with response if reqIdToPromiseMap has req_id', () => {
            channel = new SafariChannel(APP_NAME, false);
            channel.reqIdToPromiseMap = reqIdToPromiseMap;
            channel.appExtensionEventResponseHandler(responseVal);
            expect(resolveStub).toBeCalledWith({ foo: 'bar' });
        });
    });

    describe('createAndDispatchAppExtensionEvent()', () => {
        test('should dispatch an event to the document when called', () => {
            const payload = {
                foo: 'bar',
            };
            const stubCustomEventInstance = {};

            window.CustomEvent.mockReturnValue(stubCustomEventInstance);

            const channel = new SafariChannel(APP_NAME);
            channel.createAndDispatchAppExtensionEvent(payload);

            expect(document.dispatchEvent).toBeCalledWith(stubCustomEventInstance);
        });
    });

    describe('getComServerStatus()', () => {
        test('should call executeOperation with OPERATION_STATUS and timeout params', () => {
            const channel = new SafariChannel(APP_NAME, false);
            channel.executeOperation = jest.fn();
            channel.getComServerStatus(0, 0);
            expect(channel.executeOperation).toBeCalledWith(CONSTANTS.OPERATION_STATUS, null, 0, 0);
        });
    });

    describe('sendRequest()', () => {
        test('should call executeOperation with OPERATION_REQUEST and timeout params', () => {
            const channel = new SafariChannel(APP_NAME, false);
            channel.executeOperation = jest.fn();
            channel.sendRequest({ foo: 'bar' }, 0, 0);
            expect(channel.executeOperation).toBeCalledWith(CONSTANTS.OPERATION_REQUEST, { foo: 'bar' }, 0, 0);
        });
    });

    describe('sendCommand()', () => {
        test('should call executeOperation with OPERATION_COMMAND and timeout params', () => {
            const channel = new SafariChannel(APP_NAME, false);
            channel.executeOperation = jest.fn();
            channel.sendCommand({ foo: 'bar' }, 0, 0);
            expect(channel.executeOperation).toBeCalledWith(CONSTANTS.OPERATION_COMMAND, { foo: 'bar' }, 0, 0);
        });
    });

    describe('destroy()', () => {
        test('should call teardown function when called', () => {
            const channel = new SafariChannel(APP_NAME);
            channel.tearDownSafariExtensionCommunication = jest.fn();

            channel.destroy();

            expect(channel.tearDownSafariExtensionCommunication).toBeCalled();
        });
    });
});
