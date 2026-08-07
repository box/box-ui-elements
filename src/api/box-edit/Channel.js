// @flow
import CONSTANTS from './constants';

/* eslint-disable*/
class Channel {
    channelName: string;
    appName: string;
    window: any;

    constructor(appName: string) {
        this.appName = appName;
        this.window = window;
    }

    buildNextRequestID = () => `${CONSTANTS.REQUEST_ID_PRE}${this.window.performance.now()}`;

    buildDetailsObj = (operationType: string, data: ?Object, comServerToApplicationTimeoutSec: number) => {
        const timeoutSecString = comServerToApplicationTimeoutSec.toString();
        const details = {
            data: undefined,
            operation: operationType,
            properties: {
                application: this.appName,
                timeout: timeoutSecString,
            },
            // eslint-disable-next-line camelcase
            req_id: this.buildNextRequestID(),
        };

        if (operationType !== CONSTANTS.OPERATION_STATUS) {
            if (!data) {
                throw new TypeError(`Data cannot be undefined for ${operationType}`);
            }

            details.data = data;
        }

        return details;
    };

    sendCommand(
        requestData: any,
        browserToComServerTimeoutMS: number,
        comServerToApplicationTimeoutSec: number,
    ): Promise<any> {
        return Promise.reject(new Error('sendCommand is not implemented'));
    }

    sendRequest(
        requestData: any,
        browserToComServerTimeoutMS: number,
        comServerToApplicationTimeoutSec: number,
    ): Promise<any> {
        return Promise.reject(new Error('sendRequest is not implemented'));
    }

    getComServerStatus(browserToComServerTimeoutMS: number, comServerToApplicationTimeoutSec: number): Promise<any> {
        return Promise.reject(new Error('getComServerStatus is not implemented'));
    }

    destroy(): void {}
}

export default Channel;
