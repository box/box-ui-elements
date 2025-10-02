import * as React from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { MenuLinkItem } from '../menu';
import EllipsisCrumb from './EllipsisCrumb';
import Crumb from './Crumb';
import messages from './messages';
import './Breadcrumb.scss';
const Breadcrumb = ({
  children,
  className = '',
  hasReverseOverflowOrder = false,
  intl,
  numItemsBeforeOverflow = 1,
  overflowMenuButton,
  threshold = 4
}) => {
  const breadcrumbs = React.Children.toArray(children);
  const constructChildren = () => {
    const overflowItems = breadcrumbs.slice(numItemsBeforeOverflow, breadcrumbs.length + 1 - threshold);
    const dotDotDotItems = hasReverseOverflowOrder ? overflowItems : overflowItems.reverse();
    const menuCrumbsItems = /*#__PURE__*/React.createElement(EllipsisCrumb, {
      menuButton: overflowMenuButton
    }, dotDotDotItems.map((crumb, index) => /*#__PURE__*/React.createElement(MenuLinkItem, {
      key: index
    }, crumb)));
    return [...breadcrumbs.slice(0, numItemsBeforeOverflow), menuCrumbsItems, ...breadcrumbs.slice(1 - threshold)];
  };
  const renderBreadcrumbs = () => {
    let newChildren = breadcrumbs;
    let {
      length
    } = breadcrumbs;
    let hasEllipsis = false;
    if (length > threshold) {
      newChildren = constructChildren();
      length = newChildren.length;
      hasEllipsis = true;
    }
    return React.Children.map(newChildren, (item, i) => {
      const isLastCrumb = length === 0 || i === length - 1;
      return /*#__PURE__*/React.createElement(Crumb, {
        className: classNames({
          'no-shrink': hasEllipsis && i === numItemsBeforeOverflow
        }),
        isLastCrumb: isLastCrumb,
        key: `breadcrumb-${i}`
      }, item);
    });
  };
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": intl.formatMessage(messages.breadcrumbLabel),
    className: classNames('breadcrumbs', className)
  }, /*#__PURE__*/React.createElement("ol", null, renderBreadcrumbs()));
};
export { Breadcrumb as BreadcrumbBase };
export default injectIntl(Breadcrumb);
//# sourceMappingURL=Breadcrumb.js.map