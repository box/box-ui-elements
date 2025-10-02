const _excluded = ["className", "content", "icon", "linkClassName", "overflowAction", "showOverflowAction", "text", "shouldHideTooltip"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import Tooltip from '../../components/tooltip';
import { useIsContentOverflowed } from '../../utils/dom';
import CollapsibleSidebarContext from './CollapsibleSidebarContext';
const StyledMenuItem = styled.div.withConfig({
  displayName: "CollapsibleSidebarMenuItem__StyledMenuItem",
  componentId: "sc-1fmdq8m-0"
})(["position:relative;&:hover a{background-color:", ";}&:hover a.is-currentPage{background-color:", ";}body.is-move-dragging & a:hover{background-color:", ";.bdl-CollapsibleSidebar-menuItemIcon{opacity:0.7;}}.bdl-CollapsibleSidebar-menuItemActionContainer{position:absolute;top:12px;right:8px;padding:0;opacity:0;&:hover,&:focus-within{opacity:1;}}"], ({
  theme
}) => theme.primary.backgroundHover, ({
  theme
}) => theme.primary.backgroundActive, ({
  theme
}) => theme.primary.background);
const StyledIconWrapper = styled.span.withConfig({
  displayName: "CollapsibleSidebarMenuItem__StyledIconWrapper",
  componentId: "sc-1fmdq8m-1"
})(["line-height:0;opacity:0.7;& path,& .fill-color{fill:", ";}a:active &,a:hover &,a:focus &,a.is-currentPage &{opacity:1;}"], ({
  theme
}) => theme.primary.foreground);
const StyledMenuItemLabel = styled.span.withConfig({
  displayName: "CollapsibleSidebarMenuItem__StyledMenuItemLabel",
  componentId: "sc-1fmdq8m-2"
})(["flex-grow:1;overflow:hidden;color:", ";text-overflow:ellipsis;opacity:0.85;&.overflow-action{margin-right:12px;}a:active &,a:hover &,a:focus &,a.is-currentPage &{opacity:1;}"], ({
  theme
}) => theme.primary.foreground);

// {...rest} props will go here, such as `as` prop to adjust the component name.
// In most cases the consumer will want the tag to use a `Link` instead of `a`.
const StyledLink = styled.a.withConfig({
  displayName: "CollapsibleSidebarMenuItem__StyledLink",
  componentId: "sc-1fmdq8m-3"
})(["display:flex;align-items:center;height:", "px;padding:0 ", "px;overflow-x:hidden;color:", ";font-weight:bold;white-space:nowrap;border:1px solid transparent;border-radius:", "px;transition:background-color 0.15s cubic-bezier(0.215,0.61,0.355,1);&:hover,&:active,&:focus,&.is-currentPage{.bdl-CollapsibleSidebar-menuItemIcon,.bdl-CollapsibleSidebar-menuItemLabel{opacity:1;}}&:focus{border-color:", ";outline:none;}&:focus:active{border-color:transparent;}&.is-currentPage{background-color:", ";}&.is-currentPage:active{border-color:", ";}.bdl-CollapsibleSidebar-menuItemIcon + .bdl-CollapsibleSidebar-menuItemLabel{margin-left:16px;}&.show-overflowAction + .bdl-CollapsibleSidebar-menuItemActionContainer,&:focus + .bdl-CollapsibleSidebar-menuItemActionContainer,&:hover + .bdl-CollapsibleSidebar-menuItemActionContainer{opacity:1;}"], ({
  theme
}) => theme.base.gridUnitPx * 10, ({
  theme
}) => theme.base.gridUnitPx * 3, ({
  theme
}) => theme.primary.foreground, ({
  theme
}) => theme.base.gridUnitPx * 2, ({
  theme
}) => theme.primary.foreground, ({
  theme
}) => theme.primary.backgroundActive, ({
  theme
}) => theme.primary.foreground);
function CollapsibleSidebarMenuItem(props) {
  const {
      className,
      content,
      icon,
      linkClassName,
      overflowAction,
      showOverflowAction,
      text,
      shouldHideTooltip = false
    } = props,
    rest = _objectWithoutProperties(props, _excluded);
  const textRef = React.useRef(null);
  const isTextOverflowed = useIsContentOverflowed(textRef);
  const {
    isScrolling
  } = React.useContext(CollapsibleSidebarContext);
  const isShowOverflowActionOnHover = showOverflowAction === 'hover';
  const menuItemClassName = classNames('bdl-CollapsibleSidebar-menuItem', className);
  const menuItemLinkClassName = classNames('bdl-CollapsibleSidebar-menuItemLink', linkClassName, {
    'show-overflowAction': !isShowOverflowActionOnHover
  });
  const menuItemLabelClassName = classNames('bdl-CollapsibleSidebar-menuItemLabel', {
    'overflow-action': overflowAction
  });
  const renderMenuItem = () => {
    return /*#__PURE__*/React.createElement(StyledMenuItem, {
      className: menuItemClassName
    }, /*#__PURE__*/React.createElement(StyledLink, _extends({
      className: menuItemLinkClassName
    }, rest), icon && /*#__PURE__*/React.createElement(StyledIconWrapper, {
      className: "bdl-CollapsibleSidebar-menuItemIcon"
    }, icon), text && /*#__PURE__*/React.createElement(StyledMenuItemLabel, {
      ref: textRef,
      className: menuItemLabelClassName
    }, text), content), overflowAction && /*#__PURE__*/React.createElement("span", {
      className: "bdl-CollapsibleSidebar-menuItemActionContainer"
    }, overflowAction));
  };
  if (isScrolling) {
    return renderMenuItem();
  }
  return /*#__PURE__*/React.createElement(Tooltip, {
    className: classNames('bdl-CollapsibleSidebar-menuItemToolTip'),
    targetWrapperClassName: "bdl-CollapsibleSidebar-menuItemToolTipTarget",
    isDisabled: !isTextOverflowed,
    isShown: isScrolling || shouldHideTooltip ? false : undefined,
    isTabbable: false,
    position: "middle-right",
    text: text
  }, renderMenuItem());
}
export default CollapsibleSidebarMenuItem;
//# sourceMappingURL=CollapsibleSidebarMenuItem.js.map