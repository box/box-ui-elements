// @flow

import Browser from './BrowserUtils';
import ComServerClient from './ComServerClient';
import CONSTANTS from './constants';

type stringTuple = [string, string];
type extensionRequestQueueItem = {
    promise: Promise<string>,
    reject: Function,
    resolve: Function,
};

const TIMEOUT_MS = 5000;
const EXTENSION_CHECK_DEBOUNCE_TIME = 100;

let extensionRequestTimeout: ?TimeoutID;

function createRequestData(extensions: Array<string>): string {
    return JSON.stringify({
        request_type: 'get_default_application',
        extension: extensions,
    });
}

function createExecuteData(fileId, token, authCode, tokenScope): string {
    const execData = JSON.stringify({
        auth_code: authCode,
        auth_token: token,
        browser_type: Browser.getName(),
        command_type: 'launch_application',
        file_id: fileId.toString(),
        token_scope: tokenScope,
    });
    return execData;
}

function isBlacklistedExtension(extension): boolean {
    const { EXTENSION_BLACKLIST } = CONSTANTS;
    let uppercaseExt = extension.toUpperCase();

    // if ext has a leading ., strip it
    if (uppercaseExt.charAt(0) === '.') {
        uppercaseExt = uppercaseExt.substr(1);
    }

    return uppercaseExt in EXTENSION_BLACKLIST;
}

let BoxEditInstance = null;

class BoxEdit {
    client: ComServerClient;

    extensionRequestQueue: Map<string, extensionRequestQueueItem>;

    constructor() {
        if (!(BoxEditInstance instanceof BoxEdit)) {
            BoxEditInstance = this;
        }
        this.extensionRequestQueue = new Map();
        // eslint-disable-next-line no-constructor-return
        return BoxEditInstance;
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

    checkBoxEditAvailability(): Promise<any> {
        return this.getBoxEditAvailability();
    }

    getBoxEditAvailability(): Promise<any> {
        this.client = new ComServerClient(CONSTANTS.BOX_EDIT_APP_NAME);

        return this.client.getComServerStatus();
    }

    async canOpenWithBoxEdit(extensions: string[]): Promise<any> {
        const extensionToAppTuples: Array<stringTuple> = await Promise.all(
            extensions.map(async ext => {
                try {
                    const appName = await this.getAppForExtension(ext);
                    const result: stringTuple = [ext, appName];
                    return result;
                } catch (err) {
                    const result: stringTuple = [ext, ''];
                    return result;
                }
            }),
        );

        const resultMap: Map<string, string> = new Map();
        extensionToAppTuples.forEach(tuple => resultMap.set(...tuple));

        return Promise.resolve(resultMap);
    }

    openFile(fileID: string, token: Object): Promise<any> {
        // @NOTE. canOpenWithBoxEdit, create token taken care of higher levels
        // therefore not ported into React library

        // TODO is token the right name?
        const executeDataAsString = createExecuteData(
            fileID,
            token.data.token,
            token.data.auth_code,
            token.data.token_scope,
        );

        return this.client.sendCommand(executeDataAsString, TIMEOUT_MS);
    }

    getAppForExtension(extension: string): Promise<any> {
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
    }

    processExtensionRequestQueue(): void {
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
    }
}

export default BoxEdit;
