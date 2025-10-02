import Browser from './BrowserUtils';
import ComServerClient from './ComServerClient';
import CONSTANTS from './constants';
const TIMEOUT_MS = 5000;
const EXTENSION_CHECK_DEBOUNCE_TIME = 100;
let extensionRequestTimeout;
function createRequestData(extensions) {
  return JSON.stringify({
    request_type: 'get_default_application',
    extension: extensions
  });
}
function createExecuteData(fileId, token, authCode, tokenScope) {
  const execData = JSON.stringify({
    auth_code: authCode,
    auth_token: token,
    browser_type: Browser.getName(),
    command_type: 'launch_application',
    file_id: fileId.toString(),
    token_scope: tokenScope
  });
  return execData;
}
function isBlacklistedExtension(extension) {
  const {
    EXTENSION_BLACKLIST
  } = CONSTANTS;
  let uppercaseExt = extension.toUpperCase();

  // if ext has a leading ., strip it
  if (uppercaseExt.charAt(0) === '.') {
    uppercaseExt = uppercaseExt.substr(1);
  }
  return uppercaseExt in EXTENSION_BLACKLIST;
}
let BoxEditInstance = null;
class BoxEdit {
  constructor() {
    if (!(BoxEditInstance instanceof BoxEdit)) {
      BoxEditInstance = this;
    }
    this.extensionRequestQueue = new Map();
    // eslint-disable-next-line no-constructor-return
    return BoxEditInstance;
  }
  queueGetNativeAppNameFromLocal(extension) {
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
  checkBoxEditAvailability() {
    return this.getBoxEditAvailability();
  }
  getBoxEditAvailability() {
    this.client = new ComServerClient(CONSTANTS.BOX_EDIT_APP_NAME);
    return this.client.getComServerStatus();
  }
  async canOpenWithBoxEdit(extensions) {
    const extensionToAppTuples = await Promise.all(extensions.map(async ext => {
      try {
        const appName = await this.getAppForExtension(ext);
        const result = [ext, appName];
        return result;
      } catch (err) {
        const result = [ext, ''];
        return result;
      }
    }));
    const resultMap = new Map();
    extensionToAppTuples.forEach(tuple => resultMap.set(...tuple));
    return Promise.resolve(resultMap);
  }
  openFile(fileID, token) {
    // @NOTE. canOpenWithBoxEdit, create token taken care of higher levels
    // therefore not ported into React library

    // TODO is token the right name?
    const executeDataAsString = createExecuteData(fileID, token.data.token, token.data.auth_code, token.data.token_scope);
    return this.client.sendCommand(executeDataAsString, TIMEOUT_MS);
  }
  getAppForExtension(extension) {
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
  processExtensionRequestQueue() {
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
//# sourceMappingURL=BoxEdit.js.map