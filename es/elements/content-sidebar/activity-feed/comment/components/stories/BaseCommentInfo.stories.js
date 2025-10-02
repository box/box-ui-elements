function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { BaseCommentInfo } from '../BaseCommentInfo';
import AnnotationActivityLinkProvider from '../../../activity-feed/AnnotationActivityLinkProvider';
import { annotationActivityLinkProviderProps } from '../../stories/common';
import { baseCommmentInfoDefaultProps } from './common';
const getTemplate = customProps => props => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(BaseCommentInfo, _extends({}, baseCommmentInfoDefaultProps, customProps, props)));
export const Annotation = getTemplate({
  annotationActivityLink: /*#__PURE__*/React.createElement(AnnotationActivityLinkProvider, annotationActivityLinkProviderProps)
});
export const Comment = getTemplate();
export default {
  title: 'Components/BaseCommentInfo',
  component: BaseCommentInfo,
  parameters: {
    layout: 'centered'
  }
};
//# sourceMappingURL=BaseCommentInfo.stories.js.map