function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { isFeatureEnabled } from '../feature-checking';
export default function withAnnotatorContext(WrappedComponent) {
  return /*#__PURE__*/React.forwardRef((props, ref) => {
    if (props?.routerDisabled === true || isFeatureEnabled(props?.features, 'routerDisabled.value')) {
      return /*#__PURE__*/React.createElement(AnnotatorContext.Consumer, null, ({
        emitActiveAnnotationChangeEvent,
        emitAnnotationRemoveEvent,
        emitAnnotationReplyCreateEvent,
        emitAnnotationReplyDeleteEvent,
        emitAnnotationReplyUpdateEvent,
        emitAnnotationUpdateEvent,
        state
      }) => /*#__PURE__*/React.createElement(WrappedComponent, _extends({
        ref: ref
      }, props, {
        annotatorState: state,
        emitActiveAnnotationChangeEvent: emitActiveAnnotationChangeEvent,
        emitAnnotationRemoveEvent: emitAnnotationRemoveEvent,
        emitAnnotationReplyCreateEvent: emitAnnotationReplyCreateEvent,
        emitAnnotationReplyDeleteEvent: emitAnnotationReplyDeleteEvent,
        emitAnnotationReplyUpdateEvent: emitAnnotationReplyUpdateEvent,
        emitAnnotationUpdateEvent: emitAnnotationUpdateEvent
      })));
    }
    return /*#__PURE__*/React.createElement(AnnotatorContext.Consumer, null, ({
      emitActiveAnnotationChangeEvent,
      emitAnnotationRemoveEvent,
      emitAnnotationReplyCreateEvent,
      emitAnnotationReplyDeleteEvent,
      emitAnnotationReplyUpdateEvent,
      emitAnnotationUpdateEvent,
      getAnnotationsMatchPath,
      getAnnotationsPath,
      state
    }) => /*#__PURE__*/React.createElement(WrappedComponent, _extends({
      ref: ref
    }, props, {
      annotatorState: state,
      emitActiveAnnotationChangeEvent: emitActiveAnnotationChangeEvent,
      emitAnnotationRemoveEvent: emitAnnotationRemoveEvent,
      emitAnnotationReplyCreateEvent: emitAnnotationReplyCreateEvent,
      emitAnnotationReplyDeleteEvent: emitAnnotationReplyDeleteEvent,
      emitAnnotationReplyUpdateEvent: emitAnnotationReplyUpdateEvent,
      emitAnnotationUpdateEvent: emitAnnotationUpdateEvent,
      getAnnotationsMatchPath: getAnnotationsMatchPath,
      getAnnotationsPath: getAnnotationsPath
    })));
  });
}
//# sourceMappingURL=withAnnotatorContext.js.map