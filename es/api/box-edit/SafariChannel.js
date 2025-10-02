function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import Channel from './Channel';
import CONSTANTS from './constants';
const INPUT_EVENT = 'box_extension_input';
const OUTPUT_EVENT = 'box_extension_output';
class SafariChannel extends Channel {
  constructor(appName) {
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
        this.createAndDispatchAppExtensionEvent({
          detail: details
        });
      });
    });
    _defineProperty(this, "setupSafariExtensionCommunication", () => {
      if (!this.isAppExtensionListenerAttached) {
        this.isAppExtensionListenerAttached = true;
        this.document.addEventListener(OUTPUT_EVENT, this.appExtensionEventResponseHandler);
      }
    });
    _defineProperty(this, "tearDownSafariExtensionCommunication", () => {
      if (this.isAppExtensionListenerAttached) {
        this.isAppExtensionListenerAttached = false;
        this.document.removeEventListener(OUTPUT_EVENT, this.appExtensionEventResponseHandler);
      }
    });
    _defineProperty(this, "appExtensionEventResponseHandler", responseVal => {
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
    _defineProperty(this, "createAndDispatchAppExtensionEvent", payload => {
      const {
        CustomEvent
      } = this.window;
      const eventInstance = new CustomEvent(INPUT_EVENT, payload);
      this.document.dispatchEvent(eventInstance);
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
      this.tearDownSafariExtensionCommunication();
    });
    this.reqIdToPromiseMap = new Map();
    this.channelName = CONSTANTS.SAFARI_CHANNEL_NAME;
    this.window = window;
    this.document = document;
    this.setupSafariExtensionCommunication();
  }
}
export default SafariChannel;
//# sourceMappingURL=SafariChannel.js.map