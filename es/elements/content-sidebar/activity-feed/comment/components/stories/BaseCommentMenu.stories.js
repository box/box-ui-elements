function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { BaseCommentMenu } from '../BaseCommentMenu';
import { baseCommmentMenuDefaultProps } from './common';
const getTemplate = customProps => props => /*#__PURE__*/React.createElement("div", {
  style: {
    marginLeft: '12rem',
    marginTop: '10.5rem'
  }
}, /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(BaseCommentMenu, _extends({}, baseCommmentMenuDefaultProps, customProps, props))));
export const AllPermissions = getTemplate();
export const CannotDelete = getTemplate({
  canDelete: false
});
export const CannotResolve = getTemplate({
  canResolve: false
});
export const CannotModify = getTemplate({
  canEdit: false
});
export const ConfirmingDelete = getTemplate({
  isConfirmingDelete: true
});
export default {
  title: 'Components/BaseCommentMenu',
  component: BaseCommentMenu,
  parameters: {
    layout: 'centered'
  }
};
//# sourceMappingURL=BaseCommentMenu.stories.js.map