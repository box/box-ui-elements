function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { useContext, useMemo } from 'react';
import { MESSAGE_STATES } from './constants';
import MessageContext from './MessageContext';
function useMessage(name) {
  const messageContext = useContext(MessageContext);
  return useMemo(() => {
    const {
      messageApi: {
        eligibleMessageIDMap,
        markMessageAsSeen,
        markMessageAsClosed
      },
      messageStateMap,
      setMessageStateMap
    } = messageContext;
    const canShow = name in eligibleMessageIDMap && messageStateMap[name] !== MESSAGE_STATES.CLOSED;
    function onShow() {
      if (canShow && !messageStateMap[name]) {
        setMessageStateMap(_objectSpread(_objectSpread({}, messageStateMap), {}, {
          [name]: MESSAGE_STATES.SHOWING
        }));
        // FIXME markMessageAsSeen action was currently throttled to prevent we make multiple
        // backend call if onShow is called multiple times before setMessageStateMap
        // actually alter the messageState. But it is preferrable to prevent
        // markMessageAsSeen from being called multiple times instead of throttling
        // after it is called.
        markMessageAsSeen(eligibleMessageIDMap[name]);
      }
    }
    function onClose() {
      if (canShow && messageStateMap[name] === MESSAGE_STATES.SHOWING) {
        setMessageStateMap(_objectSpread(_objectSpread({}, messageStateMap), {}, {
          [name]: MESSAGE_STATES.CLOSED
        }));
        markMessageAsClosed(eligibleMessageIDMap[name]);
      }
    }
    function onComplete() {
      if (canShow && messageStateMap[name] === MESSAGE_STATES.SHOWING) {
        setMessageStateMap(_objectSpread(_objectSpread({}, messageStateMap), {}, {
          [name]: MESSAGE_STATES.CLOSED
        }));
        markMessageAsClosed(eligibleMessageIDMap[name]);
      }
    }
    return {
      canShow,
      onShow,
      onClose,
      onComplete
    };
  }, [messageContext, name]);
}
export default useMessage;
//# sourceMappingURL=useMessage.js.map