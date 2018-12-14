// @flow
import Browser from './BrowserUtils';
import Channel from './Channel';
import CONSTANTS from './constants';

const MAX_RETRY_ATTEMPTS = 2;

class ActiveXChannel extends Channel {
    isSynchronous: boolean;

    isActiveXExtensionListenerAttached: boolean;

    retryAttempt: number;

    reqIdToPromiseMap: Map<string, Object>;

    window: any;

    document: Document;

    constructor(appName: string, isSynchronous: boolean) {
        super(appName);
        this.isSynchronous = isSynchronous;
        this.channelName = CONSTANTS.ACTIVEX_CHANNEL_NAME;
        this.reqIdToPromiseMap = new Map();
        this.isActiveXExtensionListenerAttached = false;
        this.retryAttempt = 0;
        this.document = document;
        this.window = window;
        this.setupActiveXCommunication();
    }

    executeOperation = (
        operationType: string = '',
        data: ?Object = {},
        browserToComServerTimeoutMS: number = 0,
        comServerToApplicationTimeoutSec: number = 0,
    ): Promise<any> => {
        return new Promise((resolve, reject) => {
            const details = this.buildDetailsObj(operationType, data, comServerToApplicationTimeoutSec);

            const timeoutId = setTimeout(() => {
                reject(
                    new Error({
                        status_code: CONSTANTS.REQUEST_TIMEOUT_RESPONSE_CODE,
                    }),
                );
            }, browserToComServerTimeoutMS);

            this.reqIdToPromiseMap.set(details.req_id, {
                resolve,
                rejectTimeout: timeoutId,
            });
            this.executeActiveXEvent({ detail: details });
        });
    };

    repairActiveXConnection = (payload: Object) => {
        if (!Browser.isIEAndSpecificBrowserPluginSupported(CONSTANTS.BOX_TOOLS_PLUGIN_NAME)) {
            return;
        }

        if (this.retryAttempt >= MAX_RETRY_ATTEMPTS) {
            return;
        }

        this.retryAttempt += 1;

        setTimeout(() => {
            this.executeActiveXEvent(payload);
        }, 100);
    };

    executeActiveXEvent = (payload: Object) => {
        const activeX = this.createActiveXObjectJSRef();
        const hasExecuteSyncAPI = 'ExecuteSync' in activeX;

        try {
            if (this.isSynchronous && hasExecuteSyncAPI) {
                activeX.ExecuteSync(JSON.stringify(payload));
            } else {
                activeX.Execute(JSON.stringify(payload));
            }
        } catch (ex) {
            this.repairActiveXConnection(payload);
        }
    };

    createActiveXObjectJSRef = () => {
        const { ActiveXObject } = this.window;
        return new ActiveXObject(CONSTANTS.BOX_TOOLS_PLUGIN_NAME);
    };

    setupActiveXCommunication = () => {
        if (!this.isActiveXExtensionListenerAttached) {
            // attach the event listener to App Extension output events
            this.document.addEventListener(CONSTANTS.OUTPUT_EVENT, this.appExtensionEventResponseHandler);
            this.isActiveXExtensionListenerAttached = true;
        }
    };

    tearDownActiveXCommunication = () => {
        if (this.isActiveXExtensionListenerAttached) {
            // remove the event listener for App Extension output events
            this.document.removeEventListener(CONSTANTS.OUTPUT_EVENT, this.appExtensionEventResponseHandler);
            this.isActiveXExtensionListenerAttached = false;
        }
    };

    appExtensionEventResponseHandler = (responseVal: any) => {
        if (this.retryAttempt > 0) {
            this.retryAttempt = 0;
        }

        const response: Object =
            typeof responseVal.detail === 'string' ? JSON.parse(responseVal.detail) : responseVal.detail;

        if (this.reqIdToPromiseMap.has(response.req_id)) {
            const resolveObj = this.reqIdToPromiseMap.get(response.req_id);
            if (resolveObj) {
                clearTimeout(resolveObj.rejectTimeout);
                this.reqIdToPromiseMap.delete(response.req_id);

                const responseData =
                    typeof response.com_server_response.data === 'string'
                        ? JSON.parse(response.com_server_response.data)
                        : response.com_server_response.data;

                resolveObj.resolve(responseData);
            }
        }
    };

    getComServerStatus = (browserToComServerTimeoutMS: number, comServerToApplicationTimeoutSec: number) => {
        return this.executeOperation(
            CONSTANTS.OPERATION_STATUS,
            null,
            browserToComServerTimeoutMS,
            comServerToApplicationTimeoutSec,
        );
    };

    sendRequest = (data: Object, browserToComServerTimeoutMS: number, comServerToApplicationTimeoutSec: number) => {
        return this.executeOperation(
            CONSTANTS.OPERATION_REQUEST,
            data,
            browserToComServerTimeoutMS,
            comServerToApplicationTimeoutSec,
        );
    };

    sendCommand = (data: Object, browserToComServerTimeoutMS: number, comServerToApplicationTimeoutSec: number) => {
        return this.executeOperation(
            CONSTANTS.OPERATION_COMMAND,
            data,
            browserToComServerTimeoutMS,
            comServerToApplicationTimeoutSec,
        );
    };

    destroy = () => {
        this.tearDownActiveXCommunication();
    };
}

export { MAX_RETRY_ATTEMPTS };
export default ActiveXChannel;
