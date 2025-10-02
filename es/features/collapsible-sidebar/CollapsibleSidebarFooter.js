import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
const StyledFooter = styled.div.withConfig({
  displayName: "CollapsibleSidebarFooter__StyledFooter",
  componentId: "sc-cp762h-0"
})(["& .bdl-CollapsibleSidebar-menuItemLink{background-color:", ";}& .bdl-CollapsibleSidebar-menuItem:hover .bdl-CollapsibleSidebar-menuItemLink,& .bdl-CollapsibleSidebar-menuItem:hover:not(.is-currentPage) .bdl-CollapsibleSidebar-menuItemLink{background-color:", ";color:", ";}.is-currentPage & .bdl-CollapsibleSidebar-menuItemLink,& .bdl-CollapsibleSidebar-menuItemLink:active{background-color:", ";color:", ";}"], props => props.theme.primary.backgroundHover, props => props.theme.primary.backgroundActive, props => props.theme.primary.foreground, props => props.theme.primary.backgroundActive, props => props.theme.primary.foreground);
function CollapsibleSidebarFooter(props) {
  const {
    className,
    children
  } = props;
  const classes = classNames('bdl-CollapsibleSidebar-footer', className);
  return /*#__PURE__*/React.createElement(StyledFooter, {
    className: classes
  }, children);
}
export default CollapsibleSidebarFooter;
//# sourceMappingURL=CollapsibleSidebarFooter.js.map