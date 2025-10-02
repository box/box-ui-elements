// @flow
import Channel from './Channel';
import CONSTANTS from './constants';

const INPUT_EVENT = 'box_extension_input';
const OUTPUT_EVENT = 'box_extension_output';

class SafariChannel extends Channel {
    isAppExtensionListenerAttached: boolean;

    reqIdToPromiseMap: Map<string, Object>;

    window: any;

    document: Document;

    constructor(appName: string) {
        super(appName);
        this.reqIdToPromiseMap = new Map();
        this.channelName = CONSTANTS.SAFARI_CHANNEL_NAME;
        this.window = window;
        this.document = document;
        this.setupSafariExtensionCommunication();
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
            this.createAndDispatchAppExtensionEvent({ detail: details });
        });
    };

    setupSafariExtensionCommunication = () => {
        if (!this.isAppExtensionListenerAttached) {
            this.isAppExtensionListenerAttached = true;
            this.document.addEventListener(OUTPUT_EVENT, this.appExtensionEventResponseHandler);
        }
    };

    tearDownSafariExtensionCommunication = () => {
        if (this.isAppExtensionListenerAttached) {
            this.isAppExtensionListenerAttached = false;
            this.document.removeEventListener(OUTPUT_EVENT, this.appExtensionEventResponseHandler);
        }
    };

    appExtensionEventResponseHandler = (responseVal: any) => {
        const response = typeof responseVal.detail === 'string' ? JSON.parse(responseVal.detail) : responseVal.detail;

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

    createAndDispatchAppExtensionEvent = (payload: Object) => {
        const { CustomEvent } = this.window;

        const eventInstance = new CustomEvent(INPUT_EVENT, payload);
        this.document.dispatchEvent(eventInstance);
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
        this.tearDownSafariExtensionCommunication();
    };
}

export default SafariChannel;
