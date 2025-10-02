function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import PropTypes from 'prop-types';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import Button from '../../../components/button';
import Breadcrumb from '../../../components/breadcrumb';
import IconChevron from '../../../icons/general/IconChevron';
import IconAllFiles from '../../../icons/general/IconAllFiles';
import PlainButton from '../../../components/plain-button';
import { FoldersPathPropType } from '../prop-types';
import messages from '../messages';
const ContentExplorerBreadcrumbs = ({
  breadcrumbIcon,
  breadcrumbProps,
  foldersPath,
  intl: {
    formatMessage
  },
  isUpButtonDisabled = false,
  onUpButtonClick,
  onBreadcrumbClick
}) => /*#__PURE__*/React.createElement("div", {
  className: "content-explorer-breadcrumbs-container"
}, /*#__PURE__*/React.createElement(Button, {
  "aria-label": formatMessage(messages.clickToGoBack),
  className: "content-explorer-breadcrumbs-up-button",
  type: "button",
  onClick: onUpButtonClick,
  isDisabled: isUpButtonDisabled
}, /*#__PURE__*/React.createElement(IconChevron, {
  direction: "left",
  size: "6px",
  color: "#333"
})), /*#__PURE__*/React.createElement(Breadcrumb, _extends({
  label: formatMessage(messages.breadcrumb)
}, breadcrumbProps), foldersPath.map((folder, i) => /*#__PURE__*/React.createElement("div", {
  key: folder.id,
  className: "lnk"
}, /*#__PURE__*/React.createElement(PlainButton, {
  className: "bdl-ContentExplorerBreadcrumbs-crumbLink",
  "data-testid": "breadcrumb-lnk",
  onClick: event => onBreadcrumbClick(i, event),
  title: folder.name
}, i === 0 && (breadcrumbIcon || /*#__PURE__*/React.createElement(IconAllFiles, null)), /*#__PURE__*/React.createElement("span", null, folder.name))))));
ContentExplorerBreadcrumbs.propTypes = {
  breadcrumbProps: PropTypes.object,
  foldersPath: FoldersPathPropType.isRequired,
  intl: PropTypes.any,
  isUpButtonDisabled: PropTypes.bool,
  onUpButtonClick: PropTypes.func,
  onBreadcrumbClick: PropTypes.func
};
export { ContentExplorerBreadcrumbs as ContentExplorerBreadcrumbsBase };
export default injectIntl(ContentExplorerBreadcrumbs);
//# sourceMappingURL=ContentExplorerBreadcrumbs.js.map