import { CONSTANTS } from './constants';

class Channel {
    constructor(appName) {
        this.appName = appName;
        this.window = window;
    }

    buildNextRequestID = () => `${CONSTANTS.REQUEST_ID_PRE}${this.window.performance.now()}`;

    buildDetailsObj = (operationType, data, comServerToApplicationTimeoutSec) => {
        const timeoutSecString = comServerToApplicationTimeoutSec.toString();
        const details = {
            data: undefined,
            operation: operationType,
            properties: {
                application: this.appName,
                timeout: timeoutSecString,
            },
            requestId: this.buildNextRequestID(),
        };

        if (operationType !== CONSTANTS.OPERATION_STATUS) {
            if (!data) {
                throw new TypeError(`Data cannot be undefined for ${operationType}`);
            }

            details.data = data;
        }

        return details;
    };

    sendCommand(requestData, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec) {
        const details = this.buildDetailsObj(
            CONSTANTS.OPERATION_COMMAND,
            requestData,
            comServerToApplicationTimeoutSec,
        );
        return Promise.resolve(details);
    }

    sendRequest(requestData, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec) {
        const details = this.buildDetailsObj(
            CONSTANTS.OPERATION_REQUEST,
            requestData,
            comServerToApplicationTimeoutSec,
        );
        return Promise.resolve(details);
    }

    getComServerStatus(browserToComServerTimeoutMS, comServerToApplicationTimeoutSec) {
        const details = this.buildDetailsObj(CONSTANTS.OPERATION_STATUS, null, comServerToApplicationTimeoutSec);
        return Promise.resolve(details);
    }

    destroy() {}
}

export default Channel;
