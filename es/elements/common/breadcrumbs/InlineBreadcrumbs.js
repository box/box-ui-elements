import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Breadcrumbs from './Breadcrumbs';
import { DELIMITER_SLASH } from '../../../constants';
import './InlineBreadcrumbs.scss';
import messages from '../messages';
const InlineBreadcrumbs = ({
  item,
  onItemClick,
  rootId
}) => {
  const {
    path_collection
  } = item;
  const {
    entries: breadcrumbs = []
  } = path_collection || {};
  return /*#__PURE__*/React.createElement("span", {
    className: "be-inline-breadcrumbs"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.in), "\xA0", /*#__PURE__*/React.createElement(Breadcrumbs, {
    crumbs: breadcrumbs,
    delimiter: DELIMITER_SLASH,
    onCrumbClick: onItemClick,
    rootId: rootId
  }));
};
export default InlineBreadcrumbs;
//# sourceMappingURL=InlineBreadcrumbs.js.map