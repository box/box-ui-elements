function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import CONSTANTS from './constants';

/* eslint-disable*/
class Channel {
  constructor(appName) {
    _defineProperty(this, "buildNextRequestID", () => `${CONSTANTS.REQUEST_ID_PRE}${this.window.performance.now()}`);
    _defineProperty(this, "buildDetailsObj", (operationType, data, comServerToApplicationTimeoutSec) => {
      const timeoutSecString = comServerToApplicationTimeoutSec.toString();
      const details = {
        data: undefined,
        operation: operationType,
        properties: {
          application: this.appName,
          timeout: timeoutSecString
        },
        // eslint-disable-next-line camelcase
        req_id: this.buildNextRequestID()
      };
      if (operationType !== CONSTANTS.OPERATION_STATUS) {
        if (!data) {
          throw new TypeError(`Data cannot be undefined for ${operationType}`);
        }
        details.data = data;
      }
      return details;
    });
    this.appName = appName;
    this.window = window;
  }
  sendCommand(requestData, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec) {
    return Promise.resolve('TODO');
  }
  sendRequest(requestData, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec) {
    return Promise.resolve('TODO');
  }
  getComServerStatus(browserToComServerTimeoutMS, comServerToApplicationTimeoutSec) {
    return Promise.resolve('TODO');
  }
  destroy() {}
}
export default Channel;
//# sourceMappingURL=Channel.js.map