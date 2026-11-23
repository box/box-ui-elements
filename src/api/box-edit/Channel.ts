import CONSTANTS from './constants';

interface ChannelDetails {
    data: unknown;
    operation: string;
    properties: {
        application: string;
        timeout: string;
    };
    req_id: string;
}

class Channel {
    channelName: string;

    appName: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Subclasses use browser-specific globals such as ActiveXObject.
    window: any;

    constructor(appName: string) {
        this.appName = appName;
        this.window = window;
    }

    buildNextRequestID = (): string => `${CONSTANTS.REQUEST_ID_PRE}${this.window.performance.now()}`;

    buildDetailsObj = (
        operationType: string,
        data: unknown,
        comServerToApplicationTimeoutSec: number,
    ): ChannelDetails => {
        const timeoutSecString = comServerToApplicationTimeoutSec.toString();
        const details: ChannelDetails = {
            data: undefined,
            operation: operationType,
            properties: {
                application: this.appName,
                timeout: timeoutSecString,
            },
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

    /* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function -- Placeholders overridden by channel subclasses. */
    sendCommand(
        requestData: any,
        browserToComServerTimeoutMS: number,
        comServerToApplicationTimeoutSec: number,
    ): Promise<any> {
        return Promise.resolve('TODO');
    }

    sendRequest(
        requestData: any,
        browserToComServerTimeoutMS: number,
        comServerToApplicationTimeoutSec: number,
    ): Promise<any> {
        return Promise.resolve('TODO');
    }

    getComServerStatus(browserToComServerTimeoutMS: number, comServerToApplicationTimeoutSec: number): Promise<any> {
        return Promise.resolve('TODO');
    }

    destroy(): void {}
    /* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
}

export default Channel;
