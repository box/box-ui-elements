// @flow

import { ComServerClient } from './ComServerClient';
import { CONSTANTS } from './constants';
import { createRequestData, createExecuteData, isBlacklistedExtension } from './boxEditUtils';

const TIMEOUT_MS = 5000;
const EXTENSION_CHECK_DEBOUNCE_TIME = 100;

let extensionRequestTimeout = null;
let instance = null;

type ExtensionRequestQueueItem = {|
    promise: Promise<string>,
    reject: Function,
    resolve: Function,
|};

type TokenData = {|
    data: {|
        token: string,
        auth_code: string,
        token_scope: string,
    |},
|};
class BoxEdit {
    client: ComServerClient;

    extensionRequestQueue: Map<string, ExtensionRequestQueueItem>;

    constructor() {
        this.extensionRequestQueue = new Map();
        if (!instance) {
            instance = this;
        }
    }

    static getInstance(): any {
        if (!instance) {
            instance = new BoxEdit();
        }
        return instance;
    }

    queueGetNativeAppNameFromLocal(extension: string): Promise<string> {
        // There's already a pending or fulfilled request for the appname
        if (this.extensionRequestQueue.has(extension)) {
            const queueItem = this.extensionRequestQueue.get(extension);
            if (!queueItem) {
                throw new Error('Race condition re: queueGetNativeAppNameFromLocal');
            }
            return queueItem.promise;
        }

        const extensionRequest = {};
        const appNameRequestPromise = new Promise((resolve, reject) => {
            extensionRequest.resolve = resolve;
            extensionRequest.reject = reject;
        });
        extensionRequest.promise = appNameRequestPromise;
        this.extensionRequestQueue.set(extension, extensionRequest);

        return appNameRequestPromise;
    }

    checkBoxEditAvailability = (): Promise<any> => {
        return this.getBoxEditAvailability();
    };

    getBoxEditAvailability = (): Promise<any> => {
        this.client = new ComServerClient(CONSTANTS.BOX_EDIT_APP_NAME);
        return this.client.getComServerStatus();
    };

    canOpenWithBoxEdit = async (extensions: Array<string>): Promise<Map<string, string>> => {
        const extensionToAppTuples = await Promise.all(
            extensions.map(async ext => {
                try {
                    const appName = await this.getAppForExtension(ext);
                    return [ext, appName];
                } catch (err) {
                    return [ext, ''];
                }
            }),
        );

        const resultMap = new Map();
        extensionToAppTuples.forEach(tuple => resultMap.set(...tuple));

        return resultMap;
    };

    openFile = (fileID: string, token: TokenData): Promise<any> => {
        const executeDataAsString = createExecuteData(
            fileID,
            token.data.token,
            token.data.auth_code,
            token.data.token_scope,
        );

        return this.client.sendCommand(executeDataAsString, TIMEOUT_MS);
    };

    getAppForExtension = (extension: string): Promise<string> => {
        try {
            if (isBlacklistedExtension(extension)) {
                throw new Error('blacklisted');
            }

            const applicationSupportRequest = this.queueGetNativeAppNameFromLocal(extension);

            if (!extensionRequestTimeout) {
                extensionRequestTimeout = setTimeout(() => {
                    this.processExtensionRequestQueue();
                }, EXTENSION_CHECK_DEBOUNCE_TIME);
            }

            return applicationSupportRequest;
        } catch (err) {
            return Promise.reject();
        }
    };

    processExtensionRequestQueue = (): Promise<any> => {
        const copyQueue = new Map();

        const extensions = [];
        this.extensionRequestQueue.forEach((value, key) => {
            copyQueue.set(key, value);
            extensions.push(key);
        });

        this.extensionRequestQueue.clear();

        extensionRequestTimeout = null;

        const requestData = createRequestData(extensions);

        return this.client.sendRequest(requestData).then(data => {
            if (data && data.default_application_name) {
                let defaultApplicationName = data.default_application_name;

                // @TODO. Reassess.
                // This is an odd construction that may not be necessary.
                if (Object.prototype.toString.call(defaultApplicationName) === '[object Object]') {
                    defaultApplicationName = [defaultApplicationName];
                }

                defaultApplicationName.forEach(extensionAppObj => {
                    const extension = Object.keys(extensionAppObj)[0];
                    const appName = decodeURIComponent(extensionAppObj[extension]);
                    if (appName) {
                        const queueItem = copyQueue.get(extension);
                        if (queueItem) {
                            queueItem.resolve(appName);
                            copyQueue.delete(extension);
                        }
                    }
                });
            }

            // Reject all remaining items in the queue
            extensions.forEach(extension => {
                const queueItem = copyQueue.get(extension);
                if (queueItem) {
                    queueItem.reject();
                }
            });
        });
    };
}

// Export singleton instance
export default BoxEdit.getInstance();
