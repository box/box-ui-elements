function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
// @ts-ignore: no ts definition
import messages from '../messages';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { withAPIContext } from '../api-context';
// @ts-ignore: no ts definition
import { getBadItemError } from '../../../utils/error';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named

// @ts-ignore: no ts definition
// eslint-disable-next-line import/named

// @ts-ignore: no ts definition
// eslint-disable-next-line import/named

export default function withCurrentUser(WrappedComponent) {
  class ComponentWithCurrentUser extends React.Component {
    constructor(props) {
      super(props);
      /**
       * Network error callback
       *
       * @private
       * @param {Error} error - Error object
       * @param {Error} code - the code for the error
       * @param {Object} contextInfo - the context info for the error
       * @return {void}
       */
      _defineProperty(this, "errorCallback", (error, code, contextInfo = {}) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.props.onError(error, code, contextInfo);
      });
      /**
       * Fetches a Users info
       *
       * @private
       * @param {User} [user] - Box User. If missing, gets user that the current token was generated for.
       * @param {boolean} shouldDestroy
       * @return {void}
       */
      _defineProperty(this, "fetchCurrentUser", (user, shouldDestroy = false) => {
        const {
          api,
          file
        } = this.props;
        if (!file) {
          throw getBadItemError();
        }
        if (typeof user === 'undefined') {
          api.getUsersAPI(shouldDestroy).getUser(file.id, this.fetchCurrentUserSuccessCallback, this.fetchCurrentUserErrorCallback);
        } else {
          this.setState({
            currentUser: user,
            currentUserError: undefined
          });
        }
      });
      /**
       * User fetch success callback
       *
       * @private
       * @param {Object} currentUser - User info object
       * @return {void}
       */
      _defineProperty(this, "fetchCurrentUserSuccessCallback", currentUser => {
        this.setState({
          currentUser,
          currentUserError: undefined
        });
      });
      /**
       * Handles a failed file user info fetch
       *
       * @private
       * @param {ElementsXhrError} e - API error
       * @return {void}
       */
      _defineProperty(this, "fetchCurrentUserErrorCallback", (e, code) => {
        this.setState({
          currentUser: undefined,
          currentUserError: {
            maskError: {
              errorHeader: messages.currentUserErrorHeaderMessage,
              errorSubHeader: messages.defaultErrorMaskSubHeaderMessage
            }
          }
        });
        this.errorCallback(e, code, {
          error: e
        });
      });
      const {
        currentUser: _currentUser
      } = props;
      this.state = {
        currentUser: _currentUser
      };
    }
    componentDidMount() {
      const {
        currentUser
      } = this.state;
      this.fetchCurrentUser(currentUser);
    }
    render() {
      const {
        currentUser,
        currentUserError
      } = this.state;
      return /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, this.props, {
        currentUser: currentUser,
        currentUserError: currentUserError
      }));
    }
  }
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentWithCurrentUser.displayName = `WithCurrentUser(${displayName})`;
  return withAPIContext(ComponentWithCurrentUser);
}
//# sourceMappingURL=withCurrentUser.js.map