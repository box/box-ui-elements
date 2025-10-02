function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Base class for the Box UI Elements ES6 wrapper
 * @author Box
 */

import EventEmitter from 'events';
import ReactDOM from 'react-dom';
import i18n from '../common/i18n';
import { DEFAULT_CONTAINER } from '../../constants';
class ES6Wrapper extends EventEmitter {
  constructor(...args) {
    super(...args);
    /**
     * @property {Function}
     */
    /**
     * @property {HTMLElement}
     */
    /**
     * @property {string}
     */
    /**
     * @property {string}
     */
    /**
     * @property {string}
     */
    /**
     * @property {string}
     */
    _defineProperty(this, "language", i18n.language);
    /**
     * @property {Object}
     */
    _defineProperty(this, "messages", i18n.messages);
    /**
     * Sets reference to the inner component
     *
     * @protected
     * @return {void}
     */
    _defineProperty(this, "setComponent", component => {
      this.component = component;
    });
    /**
     * Callback for interaction events
     *
     * @return {void}
     */
    _defineProperty(this, "onInteraction", data => {
      this.emit('interaction', data);
    });
  }
  /**
   * @property {Element}
   */

  /**
   * Shows the content picker.
   *
   * @public
   * @param {string} id - The folder or file id.
   * @param {string} token - The API access token.
   * @param {Object|void} [options] Optional options.
   * @return {void}
   */
  show(id, token, options = {}) {
    this.id = id;
    this.token = token;
    this.options = options;
    this.emit = this.emit.bind(this);
    const container = options.container || DEFAULT_CONTAINER;
    this.container = container instanceof HTMLElement ? container : document.querySelector(container);
    this.render();
  }

  /**
   * Hides the content picker.
   * Removes all event listeners.
   * Clears out the DOM inside container.
   *
   * @public
   * @return {void}
   */
  hide() {
    this.removeAllListeners();
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(this.container);
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Renders the component.
   * Should be overriden.
   *
   * @protected
   * @return {void}
   */
  render() {
    throw new Error('Unimplemented!');
  }
  /**
   * Gets reference to the inner component
   *
   * @public
   * @return {Element}
   */
  getComponent() {
    return this.component;
  }

  /**
   * Clears out the cache used by the component
   *
   * @public
   * @return {Element}
   */
  clearCache() {
    const component = this.getComponent();
    if (component && typeof component.clearCache === 'function') {
      component.clearCache();
    }
  }
  /**
   * Wrapper for emit to prevent JS exceptions
   * in the listeners own code.
   *
   * @public
   * @param {string} eventName - name of the event
   * @param {Object} data - event data
   * @return {boolean} true if the event had listeners, false otherwise.
   */
  // eslint-disable-next-line no-dupe-class-members
  emit(eventName, data) {
    try {
      return super.emit(eventName, data);
    } catch (e) {
      // do nothing
    }
    return false;
  }
}
export default ES6Wrapper;
//# sourceMappingURL=ES6Wrapper.js.map