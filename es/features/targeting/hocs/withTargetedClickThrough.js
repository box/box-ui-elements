const _excluded = ["children", "closeOnClickOutside", "shouldTarget", "useTargetingApi", "onDismiss"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { useOnClickBody } from '../utils';
function withTargetedClickThrough(WrappedComponent) {
  const WrapperComponent = _ref => {
    let {
        children,
        closeOnClickOutside,
        shouldTarget,
        useTargetingApi,
        onDismiss
      } = _ref,
      rest = _objectWithoutProperties(_ref, _excluded);
    const {
      canShow,
      onComplete,
      onClose,
      onShow
    } = useTargetingApi();
    const handleClose = () => {
      onClose();
      if (onDismiss) {
        // $FlowFixMe onDismiss should be declared in both inferred types, which is not true, because we declare props types as Union of Config & TargetedComponentProps
        onDismiss();
      }
    };
    const handleOnComplete = () => {
      if (shouldTarget && canShow) {
        onComplete();
      }
    };
    const shouldShow = shouldTarget && canShow;
    useOnClickBody(onClose, !!(shouldShow && closeOnClickOutside));
    React.useEffect(() => {
      if (shouldShow) {
        onShow();
      }
    }, [shouldShow, onShow]);
    return /*#__PURE__*/React.createElement(WrappedComponent, _extends({
      showCloseButton: true,
      stopBubble: true
    }, rest, {
      isShown: shouldShow,
      onDismiss: handleClose
    }), /*#__PURE__*/React.createElement("span", {
      className: "bdl-targeted-click-through",
      "data-targeting": "click-through",
      "data-testid": "with-targeted-click-span",
      onClickCapture: handleOnComplete,
      onKeyPressCapture: handleOnComplete,
      tabIndex: -1
    }, children));
  };
  WrapperComponent.displayName = `withTargetedClickThrough(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WrapperComponent;
}
export default withTargetedClickThrough;
//# sourceMappingURL=withTargetedClickThrough.js.map