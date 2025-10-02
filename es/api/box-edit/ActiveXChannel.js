function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import Browser from './BrowserUtils';
import Channel from './Channel';
import CONSTANTS from './constants';
const MAX_RETRY_ATTEMPTS = 2;
class ActiveXChannel extends Channel {
  constructor(appName, isSynchronous) {
    super(appName);
    _defineProperty(this, "executeOperation", (operationType = '', data = {}, browserToComServerTimeoutMS = 0, comServerToApplicationTimeoutSec = 0) => {
      return new Promise((resolve, reject) => {
        const details = this.buildDetailsObj(operationType, data, comServerToApplicationTimeoutSec);
        const timeoutId = setTimeout(() => {
          reject(new Error({
            status_code: CONSTANTS.REQUEST_TIMEOUT_RESPONSE_CODE
          }));
        }, browserToComServerTimeoutMS);
        this.reqIdToPromiseMap.set(details.req_id, {
          resolve,
          rejectTimeout: timeoutId
        });
        this.executeActiveXEvent({
          detail: details
        });
      });
    });
    _defineProperty(this, "repairActiveXConnection", payload => {
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
    });
    _defineProperty(this, "executeActiveXEvent", payload => {
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
    });
    _defineProperty(this, "createActiveXObjectJSRef", () => {
      const {
        ActiveXObject
      } = this.window;
      return new ActiveXObject(CONSTANTS.BOX_TOOLS_PLUGIN_NAME);
    });
    _defineProperty(this, "setupActiveXCommunication", () => {
      if (!this.isActiveXExtensionListenerAttached) {
        // attach the event listener to App Extension output events
        this.document.addEventListener(CONSTANTS.OUTPUT_EVENT, this.appExtensionEventResponseHandler);
        this.isActiveXExtensionListenerAttached = true;
      }
    });
    _defineProperty(this, "tearDownActiveXCommunication", () => {
      if (this.isActiveXExtensionListenerAttached) {
        // remove the event listener for App Extension output events
        this.document.removeEventListener(CONSTANTS.OUTPUT_EVENT, this.appExtensionEventResponseHandler);
        this.isActiveXExtensionListenerAttached = false;
      }
    });
    _defineProperty(this, "appExtensionEventResponseHandler", responseVal => {
      if (this.retryAttempt > 0) {
        this.retryAttempt = 0;
      }
      const response = typeof responseVal.detail === 'string' ? JSON.parse(responseVal.detail) : responseVal.detail;
      if (this.reqIdToPromiseMap.has(response.req_id)) {
        const resolveObj = this.reqIdToPromiseMap.get(response.req_id);
        if (resolveObj) {
          clearTimeout(resolveObj.rejectTimeout);
          this.reqIdToPromiseMap.delete(response.req_id);
          const responseData = typeof response.com_server_response.data === 'string' ? JSON.parse(response.com_server_response.data) : response.com_server_response.data;
          resolveObj.resolve(responseData);
        }
      }
    });
    _defineProperty(this, "getComServerStatus", (browserToComServerTimeoutMS, comServerToApplicationTimeoutSec) => {
      return this.executeOperation(CONSTANTS.OPERATION_STATUS, null, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec);
    });
    _defineProperty(this, "sendRequest", (data, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec) => {
      return this.executeOperation(CONSTANTS.OPERATION_REQUEST, data, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec);
    });
    _defineProperty(this, "sendCommand", (data, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec) => {
      return this.executeOperation(CONSTANTS.OPERATION_COMMAND, data, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec);
    });
    _defineProperty(this, "destroy", () => {
      this.tearDownActiveXCommunication();
    });
    this.isSynchronous = isSynchronous;
    this.channelName = CONSTANTS.ACTIVEX_CHANNEL_NAME;
    this.reqIdToPromiseMap = new Map();
    this.isActiveXExtensionListenerAttached = false;
    this.retryAttempt = 0;
    this.document = document;
    this.window = window;
    this.setupActiveXCommunication();
  }
}
export { MAX_RETRY_ATTEMPTS };
export default ActiveXChannel;
//# sourceMappingURL=ActiveXChannel.js.map