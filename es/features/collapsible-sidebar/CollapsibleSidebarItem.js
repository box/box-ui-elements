/**
 * 
 * @file CollapsibleSidebar item component that will render stylized collapsedElement or expanded depending on the expanded prop.
 * @author Box
 *
 * CollapsibleSidebar item component that will render stylized collapsedElement or expanded depending on the expanded prop.
 */
import * as React from 'react';
import Tooltip from '../../components/tooltip';
import LeftSidebarLinkCallout from '../left-sidebar/LeftSidebarLinkCallout';
function CollapsibleSidebarItem(props) {
  const {
    callout,
    collapsedElement,
    expanded,
    expandedElement,
    shouldHideTooltip = false,
    tooltipMessage
  } = props;
  if (callout) {
    const calloutChildren = expanded ? expandedElement : collapsedElement;
    return /*#__PURE__*/React.createElement(LeftSidebarLinkCallout, {
      attachmentPosition: "bottom left",
      callout: callout,
      targetAttachmentPosition: "bottom right"
    }, calloutChildren);
  }
  const wrappedCollapsedElement = /*#__PURE__*/React.createElement(Tooltip, {
    isTabbable: false,
    position: "middle-right",
    text: tooltipMessage,
    isDisabled: !tooltipMessage,
    isShown: shouldHideTooltip ? false : undefined
  }, collapsedElement);
  return expanded ? expandedElement : wrappedCollapsedElement;
}
export default CollapsibleSidebarItem;
//# sourceMappingURL=CollapsibleSidebarItem.js.map