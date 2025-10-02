function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import LocalStore from '../../utils/LocalStore';
import Channel from './Channel';
import { get as getCookie, set as setCookie } from './cookies';
const GET = 'GET';
const POST = 'POST';
const YEAR_MS = 31536000000;
const DEFAULT_PRIMARY_PORT = 17223;
const DEFAULT_FALLBACK_PORT = 17224;
const CONTENT_TYPE_HEADER = 'Content-Type';
const CONTENT_TYPE_VALUE = 'text/plain; charset=UTF-8';
const STATUS_NOT_RUNNING = 'notrunning';
const localStore = new LocalStore();
function shouldUseFallbackFirst() {
  return !!localStore.getItem('comUseFallback');
}
function saveFallbackPortPreference() {
  localStore.setItem('comUseFallback', 1);
}
function clearFallbackPortPreference() {
  localStore.removeItem('comUseFallback');
}
function getPreferredPortOrdering() {
  if (shouldUseFallbackFirst()) {
    return {
      primary: DEFAULT_FALLBACK_PORT,
      fallback: DEFAULT_PRIMARY_PORT
    };
  }
  return {
    primary: DEFAULT_PRIMARY_PORT,
    fallback: DEFAULT_FALLBACK_PORT
  };
}
class HTTPChannel extends Channel {
  constructor(_appName, _url, channelName) {
    super(_appName);
    _defineProperty(this, "createCORSRequest", (method, url) => {
      let xhr;
      try {
        const {
          XMLHttpRequest
        } = this.window;
        xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        return xhr;
      } catch (ex) {
        if (this.retryCounter < 3) {
          this.retryCounter += 1;
          return this.createCORSRequest(method, url);
        }
        throw new Error('could not create xhr');
      }
    });
    _defineProperty(this, "getComServerStatusInstallationPromise", timeoutMS => {
      let resolve;
      let reject;
      const comServerInstallationPromise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      const resolveWithValidPort = (port, res) => {
        this.currentPort = port;
        if (port === DEFAULT_PRIMARY_PORT) {
          clearFallbackPortPreference();
        } else {
          saveFallbackPortPreference();
        }
        this.comServerInstallationPromiseRejected = false;
        resolve(res);
      };
      const portPreferences = getPreferredPortOrdering();
      const primaryPort = portPreferences.primary;
      const fallbackPort = portPreferences.fallback;

      // Try primary port first
      this.checkInstallStatus(primaryPort, timeoutMS).then(resolveWithValidPort.bind(this, primaryPort)).catch(err => {
        // If com server returned that the port is available but the app is not running, reject
        if (err === STATUS_NOT_RUNNING) {
          this.comServerInstallationPromiseRejected = true;
          reject();
          return;
        }

        // Only check secondary, if necessary, otherwise this throws a browser error in console
        this.checkInstallStatus(fallbackPort, timeoutMS).then(resolveWithValidPort.bind(this, fallbackPort)).catch(() => {
          this.comServerInstallationPromiseRejected = true;
          reject();
        });
      });
      return comServerInstallationPromise;
    });
    _defineProperty(this, "sendComServerRequest", (method, url, data, timeoutMS) => {
      return new Promise((resolve, reject) => {
        try {
          const request = this.createCORSRequest(method, url);
          request.setRequestHeader(CONTENT_TYPE_HEADER, CONTENT_TYPE_VALUE);
          request.onload = () => {
            resolve(request);
          };
          request.onerror = () => {
            reject(request);
          };
          if (timeoutMS > 0) {
            request.timeout = timeoutMS;
            request.ontimeout = () => {
              reject(request);
            };
          }
          setTimeout(() => {
            request.send(data);
          }, 0);
        } catch (err) {
          reject();
        }
      });
    });
    _defineProperty(this, "checkInstallStatus", (port, timeoutMS) => {
      return this.sendComServerRequest(GET, `${this.url}${port}/status`, null, timeoutMS).then(request => {
        const response = JSON.parse(request.responseText);
        if (response.running) {
          return response;
        }
        this.comServerInstallationPromiseRejected = true;
        throw new Error(STATUS_NOT_RUNNING);
      });
    });
    _defineProperty(this, "getComChannel", appName => getCookie(`${appName}-bgp-id`));
    _defineProperty(this, "setComChannel", appName => {
      const bgpId = this.getComChannel(appName) || this.generateId();
      const comChannelName = `bgp-${bgpId}`;
      const aYearFromNow = new Date().getTime() + YEAR_MS;
      setCookie(`${appName}-bgp-id`, bgpId, aYearFromNow);
      setCookie(`bgp-${bgpId}`, 'generic', aYearFromNow);
      return comChannelName;
    });
    _defineProperty(this, "getComServerStatus", timeoutMS => {
      if (!this.comServerInstallationPromise || this.comServerInstallationPromiseRejected) {
        // Null out the promise and fetch status again (handles the case where user installed box edit within the same page load)
        this.comServerInstallationPromise = null;
        this.comServerInstallationPromise = this.getComServerStatusInstallationPromise(timeoutMS);
        return this.comServerInstallationPromise;
      }
      return this.comServerInstallationPromise;
    });
    _defineProperty(this, "sendRequest", (data, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec) => {
      const url = `${this.url}${this.currentPort}/application_request?application=${this.appName}&com=${this.comChannelName}&timeout=${comServerToApplicationTimeoutSec}`;
      return this.sendComServerRequest(POST, url, data, browserToComServerTimeoutMS).then(results => {
        // TODO: does the error object need to be richer?
        const response = JSON.parse(results.responseText);
        if (response.response_type && response.response_type === 'error') {
          throw new Error(`Communication error: ${response.message}`);
        }
        return response;
      });
    });
    _defineProperty(this, "sendCommand", (data, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec) => {
      const url = `${this.url}${this.currentPort}/application_command?application=${this.appName}&com=${this.comChannelName}&timeout=${comServerToApplicationTimeoutSec}`;
      return this.sendComServerRequest(POST, url, data, browserToComServerTimeoutMS).then(results => {
        return JSON.parse(results.responseText);
      });
    });
    _defineProperty(this, "generateId", () => {
      const time = new Date().getTime();
      return 'xxxxxxxx'.replace(/x/g, () => {
        // Generate random number between 1 and 16.
        // Using time for added entropy.
        const rand = Math.floor((time + Math.random() * 16) % 16);
        // Convert number to a HEX
        return rand.toString(16);
      });
    });
    this.url = _url;
    this.comChannelName = this.setComChannel(_appName);
    this.channelName = channelName;
    this.comServerInstallationPromise = null;
    this.comServerInstallationPromiseRejected = false;
    this.retryCounter = 0;
    this.sendCount = 0;
    this.currentPort = getPreferredPortOrdering().primary;
    this.window = window;
  }
}
export default HTTPChannel;
//# sourceMappingURL=HTTPChannel.js.map