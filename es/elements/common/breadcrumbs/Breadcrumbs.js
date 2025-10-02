import * as React from 'react';
import { useIntl } from 'react-intl';
import Breadcrumb from './Breadcrumb';
import BreadcrumbDropdown from './BreadcrumbDropdown';
import BreadcrumbDelimiter from './BreadcrumbDelimiter';
import { DELIMITER_CARET, DEFAULT_ROOT, DELIMITER_SLASH } from '../../../constants';
import './Breadcrumbs.scss';
import messages from '../messages';
/**
 * Filters out ancestors to root from the crumbs.
 * This is useful when the root is not All Files.
 *
 * @private
 * @param {string} rootId the root folder id
 * @param {Array} crumbs list of crumbs
 * @return {Array} crumbs
 */
function filterCrumbs(rootId, crumbs) {
  const rootIndex = crumbs.findIndex(crumb => crumb.id === rootId);
  return rootIndex === -1 ? crumbs : crumbs.slice(rootIndex);
}

/**
 * Creates an individual breadcrumb
 *
 * @private
 * @param {Object} crumb single crumb data
 * @param {boolean} isLast is this the last crumb
 * @return {Element}
 */
function getBreadcrumb(crumbs, isLast, onCrumbClick, delimiter, portalElement) {
  if (Array.isArray(crumbs)) {
    const condensed = delimiter !== DELIMITER_CARET;
    return /*#__PURE__*/React.createElement("span", {
      className: "be-breadcrumb-more"
    }, /*#__PURE__*/React.createElement(BreadcrumbDropdown, {
      crumbs: crumbs,
      onCrumbClick: onCrumbClick,
      portalElement: portalElement
    }), /*#__PURE__*/React.createElement(BreadcrumbDelimiter, {
      delimiter: condensed ? DELIMITER_SLASH : DELIMITER_CARET
    }));
  }
  const {
    id,
    name
  } = crumbs;
  return /*#__PURE__*/React.createElement(Breadcrumb, {
    delimiter: delimiter,
    isLast: isLast,
    name: name,
    onClick: () => onCrumbClick(id)
  });
}
const Breadcrumbs = ({
  crumbs,
  delimiter,
  isSmall = false,
  onCrumbClick,
  portalElement,
  rootId
}) => {
  const {
    formatMessage
  } = useIntl();
  if (!rootId || crumbs.length === 0) {
    return /*#__PURE__*/React.createElement("span", null);
  }

  // The crumbs given may have ancestors higher than the root. We need to filter them out.
  const filteredCrumbs = filterCrumbs(rootId, crumbs);

  // Make sure "All Files" crumb is localized
  const defaultRootCrumb = filteredCrumbs.find(({
    id
  }) => id === DEFAULT_ROOT);
  if (defaultRootCrumb) {
    defaultRootCrumb.name = formatMessage(messages.rootBreadcrumb);
  }
  const {
    length
  } = filteredCrumbs;

  // Always show the last/leaf breadcrumb.
  const crumb = filteredCrumbs[length - 1];
  const onClick = crumb.id ? () => onCrumbClick(crumb.id) : undefined;
  const lastBreadcrumb = /*#__PURE__*/React.createElement(Breadcrumb, {
    isLast: true,
    name: crumb.name,
    onClick: onClick
  });

  // Always show the second last/parent breadcrumb when there are at least 2 crumbs.
  const secondLastBreadcrumb = length > 1 ? getBreadcrumb(filteredCrumbs[length - 2], false, onCrumbClick, delimiter, portalElement) : null;

  // Only show the more dropdown when there were at least 4 crumbs.
  const moreBreadcrumbs = length > 3 ? getBreadcrumb(filteredCrumbs.slice(1, length - 2), false, onCrumbClick, delimiter, portalElement) : null;

  // Only show the root breadcrumb when there are at least 3 crumbs.
  const firstBreadcrumb = length > 2 ? getBreadcrumb(filteredCrumbs[0], false, onCrumbClick, delimiter, portalElement) : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "be-breadcrumbs"
  }, isSmall ? null : firstBreadcrumb, isSmall ? null : moreBreadcrumbs, secondLastBreadcrumb, lastBreadcrumb);
};
export default Breadcrumbs;
//# sourceMappingURL=Breadcrumbs.js.map