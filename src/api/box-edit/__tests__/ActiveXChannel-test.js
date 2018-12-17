import ActiveXChannel, { MAX_RETRY_ATTEMPTS } from '../ActiveXChannel';
import Browser from '../BrowserUtils';

import CONSTANTS from '../constants';

const APP_NAME = 'AppName';

describe('lib/box-edit/ActiveXChannel', () => {
    beforeEach(() => {
        jest.useFakeTimers();

        document.addEventListener = jest.fn();
        document.removeEventListener = jest.fn();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.restoreAllMocks();
    });

    // TODO. implement
    describe('constructor()', () => {});

    // TODO. implement.
    describe('executeOperation()', () => {});

    describe('repairActiveXConnection()', () => {
        test('should not call executeActiveXEvent if isIEAndSpecificBrowserPluginSupported returns false', () => {
            Browser.isIEAndSpecificBrowserPluginSupported = jest.fn().mockReturnValue(false);
            const channel = new ActiveXChannel(APP_NAME, false);
            const stubExecuteActiveXEvent = jest.fn(channel, 'executeActiveXEvent');
            channel.repairActiveXConnection({ foo: 'bar' });
            jest.advanceTimersByTime(100);
            expect(stubExecuteActiveXEvent).not.toBeCalled();
        });

        test('should call executeActiveXEvent if isIEAndSpecificBrowserPluginSupported returns true', () => {
            Browser.isIEAndSpecificBrowserPluginSupported = jest.fn().mockReturnValue(true);
            const channel = new ActiveXChannel(APP_NAME, false);
            channel.executeActiveXEvent = jest.fn();
            channel.repairActiveXConnection({ foo: 'bar' });
            jest.advanceTimersByTime(100);
            expect(channel.executeActiveXEvent).toBeCalledWith({ foo: 'bar' });
        });

        test('should not call executeActiveXEvent after MAX_RETRY_ATTEMPTS', () => {
            Browser.isIEAndSpecificBrowserPluginSupported = jest.fn().mockReturnValue(true);
            const channel = new ActiveXChannel(APP_NAME, false);
            channel.executeActiveXEvent = jest.fn();
            let retryCount = 0;
            while (retryCount <= MAX_RETRY_ATTEMPTS + 1) {
                channel.repairActiveXConnection({ foo: 'bar' });
                jest.advanceTimersByTime(100);
                retryCount += 1;
            }
            expect(channel.executeActiveXEvent).toBeCalledTimes(2);
        });
    });

    describe('executeActiveXEvent()', () => {
        test('should call activeX.ExecuteSync if isSynchronous is true and hasExecuteSyncAPI is true', () => {
            const payload = { foo: 'bar' };
            const channel = new ActiveXChannel(APP_NAME, true);
            const stubExecuteSync = jest.fn();
            channel.createActiveXObjectJSRef = jest.fn().mockReturnValue({
                ExecuteSync: stubExecuteSync,
            });
            channel.executeActiveXEvent(payload);
            expect(stubExecuteSync).toBeCalledWith(JSON.stringify(payload));
        });

        test('should call activeXExecute if isSynchronous is false and hasExecuteSyncAPI is false', () => {
            const payload = { foo: 'bar' };
            const channel = new ActiveXChannel(APP_NAME, false);
            const stubExecute = jest.fn();
            channel.createActiveXObjectJSRef = jest.fn().mockReturnValue({
                Execute: stubExecute,
            });
            channel.executeActiveXEvent(payload);
            expect(stubExecute).toBeCalledWith(JSON.stringify(payload));
        });

        test('should call repairActiveXConnection if ExecuteSync throws exception', () => {
            const payload = { foo: 'bar' };
            const channel = new ActiveXChannel(APP_NAME, true);
            const stubExecuteSync = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            channel.createActiveXObjectJSRef = jest.fn().mockReturnValue({
                ExecuteSync: stubExecuteSync,
            });
            channel.repairActiveXConnection = jest.fn();
            channel.executeActiveXEvent(payload);
            expect(channel.repairActiveXConnection).toBeCalledWith(payload);
        });

        test('should call repairActiveXConnection if Execute throws exception', () => {
            const payload = { foo: 'bar' };
            const channel = new ActiveXChannel(APP_NAME, false);
            const stubExecute = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            channel.createActiveXObjectJSRef = jest.fn().mockReturnValue({
                Execute: stubExecute,
            });
            channel.repairActiveXConnection = jest.fn();
            channel.executeActiveXEvent(payload);
            expect(channel.repairActiveXConnection).toBeCalledWith(payload);
        });
    });

    describe('createActiveXObjectJSRef()', () => {
        test('should create a new ActiveX object when called', () => {
            const stubActiveXObjectConstructor = jest.fn();
            window.ActiveXObject = stubActiveXObjectConstructor;
            const channel = new ActiveXChannel(APP_NAME, false);
            channel.createActiveXObjectJSRef();
            expect(stubActiveXObjectConstructor).toBeCalledWith(CONSTANTS.BOX_TOOLS_PLUGIN_NAME);
        });
    });

    describe('setupActiveXCommunication()', () => {
        let channel;
        let stubAppExtensionEventResponseHandler;

        beforeEach(() => {
            stubAppExtensionEventResponseHandler = jest.fn();

            channel = new ActiveXChannel(APP_NAME, false);
            channel.appExtensionEventResponseHandler = stubAppExtensionEventResponseHandler;

            document.addEventListener.mockClear();
            document.removeEventListener.mockClear();
        });

        test('should not call addEventListener with CONSTANTS.OUTPUT_EVENT and this.appExtensionEventResponseHandler if isActiveXExtensionListenerAttached is true', () => {
            channel.isActiveXExtensionListenerAttached = true;
            channel.setupActiveXCommunication();
            expect(document.addEventListener).not.toBeCalledWith(
                CONSTANTS.OUTPUT_EVENT,
                stubAppExtensionEventResponseHandler,
            );
        });

        test('should call addEventListener with CONSTANTS.OUTPUT_EVENT and this.appExtensionEventResponseHandler if isActiveXExtensionListenerAttached is false', () => {
            channel.isActiveXExtensionListenerAttached = false;
            channel.setupActiveXCommunication();
            expect(document.addEventListener).toBeCalledWith(
                CONSTANTS.OUTPUT_EVENT,
                stubAppExtensionEventResponseHandler,
            );
        });
    });

    describe('tearDownActiveXCommunication()', () => {
        let channel;
        let stubAppExtensionEventResponseHandler;

        beforeEach(() => {
            stubAppExtensionEventResponseHandler = jest.fn();
            channel = new ActiveXChannel(APP_NAME, false);
            channel.appExtensionEventResponseHandler = stubAppExtensionEventResponseHandler;
        });

        test('should call removeEventListener with CONSTANTS.OUTPUT_EVENT and this.appExtensionEventResponseHandler if isActiveXExtensionListenerAttached is true', () => {
            channel.tearDownActiveXCommunication();
            expect(document.removeEventListener).toBeCalledWith(
                CONSTANTS.OUTPUT_EVENT,
                stubAppExtensionEventResponseHandler,
            );
        });

        test('should not call removeEventListener with CONSTANTS.OUTPUT_EVENT and this.appExtensionEventResponseHandler if isActiveXExtensionListenerAttached is false', () => {
            channel.isActiveXExtensionListenerAttached = false;
            channel.tearDownActiveXCommunication();
            expect(document.removeEventListener).not.toBeCalledWith(
                CONSTANTS.OUTPUT_EVENT,
                stubAppExtensionEventResponseHandler,
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
            channel = new ActiveXChannel(APP_NAME, false);
            channel.reqIdToPromiseMap = reqIdToPromiseMap;
            channel.appExtensionEventResponseHandler(responseVal);
            expect(resolveStub).toBeCalledWith({ foo: 'bar' });
        });
    });

    describe('getComServerStatus()', () => {
        test('should call executeOperation with OPERATION_STATUS and timeout params', () => {
            const channel = new ActiveXChannel(APP_NAME, false);
            channel.executeOperation = jest.fn();
            channel.getComServerStatus(0, 0);
            expect(channel.executeOperation).toBeCalledWith(CONSTANTS.OPERATION_STATUS, null, 0, 0);
        });
    });

    describe('sendRequest()', () => {
        test('should call executeOperation with OPERATION_REQUEST and timeout params', () => {
            const channel = new ActiveXChannel(APP_NAME, false);
            channel.executeOperation = jest.fn();
            channel.sendRequest({ foo: 'bar' }, 0, 0);
            expect(channel.executeOperation).toBeCalledWith(CONSTANTS.OPERATION_REQUEST, { foo: 'bar' }, 0, 0);
        });
    });

    describe('sendCommand()', () => {
        test('should call executeOperation with OPERATION_COMMAND and timeout params', () => {
            const channel = new ActiveXChannel(APP_NAME, false);
            channel.executeOperation = jest.fn();
            channel.sendCommand({ foo: 'bar' }, 0, 0);
            expect(channel.executeOperation).toBeCalledWith(CONSTANTS.OPERATION_COMMAND, { foo: 'bar' }, 0, 0);
        });
    });

    describe('destroy()', () => {
        test('should call tearDownActiveXCommunication', () => {
            const channel = new ActiveXChannel(APP_NAME, false);
            channel.tearDownActiveXCommunication = jest.fn();
            channel.destroy();
            expect(channel.tearDownActiveXCommunication).toBeCalled();
        });
    });
});
