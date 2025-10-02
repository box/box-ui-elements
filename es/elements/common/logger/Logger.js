const _excluded = ["children", "onMetric", "startMarkName"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import noop from 'lodash/noop';
import { v4 as uuidv4 } from 'uuid';
import { isMarkSupported } from '../../../utils/performance';
import { EVENT_DATA_READY, EVENT_JS_READY } from './constants';
import { METRIC_TYPE_PREVIEW, METRIC_TYPE_ELEMENTS_LOAD_METRIC, METRIC_TYPE_UAA_PARITY_METRIC } from '../../../constants';
const SESSION_ID = uuidv4();
const uniqueEvents = new Set();
class Logger extends React.Component {
  constructor(props) {
    super(props);
    /**
     * Preview metric handler
     *
     * @param {Object} data - the metric data
     * @returns {void}
     */
    _defineProperty(this, "handlePreviewMetric", data => {
      const {
        onMetric
      } = this.props;
      if (data.type === METRIC_TYPE_UAA_PARITY_METRIC) {
        onMetric(_objectSpread(_objectSpread({}, data), {}, {
          type: METRIC_TYPE_UAA_PARITY_METRIC
        }));
      } else {
        onMetric(_objectSpread(_objectSpread({}, data), {}, {
          type: METRIC_TYPE_PREVIEW
        }));
      }
    });
    /**
     * Data ready metric handler
     *
     * @param {Object} data - the metric data
     * @returns {void}
     */
    _defineProperty(this, "handleDataReadyMetric", (data, uniqueId) => {
      if (!isMarkSupported) {
        return;
      }
      this.logUniqueMetric(METRIC_TYPE_ELEMENTS_LOAD_METRIC, EVENT_DATA_READY, data, uniqueId);
    });
    /**
     * JS ready metric handler
     *
     * @param {Object} data - the metric data
     * @returns {void}
     */
    _defineProperty(this, "handleReadyMetric", data => {
      if (!isMarkSupported) {
        return;
      }
      const {
        startMarkName
      } = this.props;
      const metricData = _objectSpread(_objectSpread({}, data), {}, {
        startMarkName
      });
      this.logUniqueMetric(METRIC_TYPE_ELEMENTS_LOAD_METRIC, EVENT_JS_READY, metricData);
    });
    this.loggerProps = {
      onDataReadyMetric: this.handleDataReadyMetric,
      onPreviewMetric: this.handlePreviewMetric,
      onReadyMetric: this.handleReadyMetric
    };
  }
  get uniqueEvents() {
    return uniqueEvents;
  }
  get sessionId() {
    return SESSION_ID;
  }

  /**
   * Creates an event name meant for use with an event which is unique and meant to be logged only once
   *
   * @param {string} name - The event name
   * @param {string} [uniqueId] - an optional unique id
   * @returns {string} A string containing the component and event name and optional unique id
   */
  createEventName(name, uniqueId) {
    const {
      source
    } = this.props;
    const eventName = `${source}::${name}`;
    return uniqueId ? `${eventName}::${uniqueId}` : eventName;
  }

  /**
   * Checks to see if the specified event for the component has already been fired.
   *
   * @param {string} component - the component name
   * @param {string} name - the event name
   * @returns {boolean} True if the event has already been fired
   */
  hasLoggedEvent(name) {
    return this.uniqueEvents.has(name);
  }

  /**
   * Invokes the provided metric logging callback.
   *
   * @param {string} type - the type of the event
   * @param {string} name - the name of the event
   * @param {Object} data  - the event data
   */
  logMetric(type, name, data) {
    const {
      onMetric,
      source
    } = this.props;
    const metric = _objectSpread(_objectSpread({}, data), {}, {
      component: source,
      name,
      timestamp: this.getTimestamp(),
      sessionId: this.sessionId,
      type
    });
    onMetric(metric);
  }

  /**
   * Logs a unique metric event. Prevents duplicate events from being logged in the session.
   *
   * @param {string} type - the type of the event
   * @param {string} name - the name of the event
   * @param {Object} data  - the event data
   * @param {string} [uniqueId] - an optional unique id
   * @returns {void}
   */
  logUniqueMetric(type, name, data, uniqueId) {
    const eventName = this.createEventName(name, uniqueId);
    if (this.hasLoggedEvent(eventName)) {
      return;
    }
    this.logMetric(type, name, data);
    this.uniqueEvents.add(eventName);
  }
  /**
   * Create an ISO Timestamp for right now.
   *
   * @returns {string}
   */
  getTimestamp() {
    return new Date().toISOString();
  }
  render() {
    const _this$props = this.props,
      {
        children,
        onMetric,
        startMarkName
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    return /*#__PURE__*/React.cloneElement(children, _objectSpread(_objectSpread({}, rest), {}, {
      logger: this.loggerProps
    }));
  }
}
_defineProperty(Logger, "defaultProps", {
  onMetric: noop
});
export default Logger;
//# sourceMappingURL=Logger.js.map