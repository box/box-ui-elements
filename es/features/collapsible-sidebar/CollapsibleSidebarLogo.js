function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import { bdlGridUnit, bdlBorderRadiusSizeLarge } from '../../styles/variables';
import Logo from '../../icon/logo/BoxLogo';
import PlainButton from '../../components/plain-button/PlainButton';
import LinkBase from '../../components/link/LinkBase';
import IconHamburger from '../../icons/general/IconHamburger';
import CollapsibleSidebarItem from './CollapsibleSidebarItem';
import messages from './messages';
const StyledLogo = styled(Logo).withConfig({
  displayName: "CollapsibleSidebarLogo__StyledLogo",
  componentId: "sc-6amevi-0"
})(["padding:", ";border:1px solid transparent;border-radius:", ";& path,& .fill-color{fill:", ";}a:focus &{border-color:", ";outline:none;}"], bdlGridUnit, bdlBorderRadiusSizeLarge, props => props.theme?.primary?.foreground, props => props.theme?.primary?.foreground);
const StyledIconHamburger = styled(IconHamburger).withConfig({
  displayName: "CollapsibleSidebarLogo__StyledIconHamburger",
  componentId: "sc-6amevi-1"
})(["position:relative;top:1px;& .fill-color{fill:", ";}"], props => props.theme.primary.foreground);
const StyledToggleButton = styled(PlainButton).withConfig({
  displayName: "CollapsibleSidebarLogo__StyledToggleButton",
  componentId: "sc-6amevi-2"
})(["&,&:focus,&:active,&:hover{padding:8px 12px;line-height:1;border-color:transparent;border-style:solid;border-width:1px;border-radius:", ";}&:focus{border-color:", ";outline:none;}"], bdlBorderRadiusSizeLarge, props => props?.theme?.primary?.foreground);
function CollapsibleSidebarLogo(props) {
  const {
    badge,
    buttonProps,
    className,
    expanded,
    isLogoVisible = true,
    linkProps,
    onToggle,
    intl
  } = props;
  const classes = classNames('bdl-CollapsibleSidebar-logo', className);
  const toggleButton = /*#__PURE__*/React.createElement(StyledToggleButton, _extends({
    className: "bdl-CollapsibleSidebar-toggleButton",
    onClick: onToggle,
    "aria-label": intl.formatMessage(expanded ? messages.collapseButtonLabel : messages.expandButtonLabel),
    type: "button"
  }, buttonProps), /*#__PURE__*/React.createElement(StyledIconHamburger, {
    height: 20,
    width: 20
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: classes
  }, /*#__PURE__*/React.createElement(CollapsibleSidebarItem, {
    collapsedElement: toggleButton,
    expanded: expanded,
    expandedElement: /*#__PURE__*/React.createElement(React.Fragment, null, toggleButton, isLogoVisible && /*#__PURE__*/React.createElement(LinkBase, _extends({
      className: "bdl-CollapsibleSidebar-logoLink"
    }, linkProps), /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(StyledLogo, {
      className: "bdl-CollapsibleSidebar-logoIcon",
      height: 32 + 2 * 1 /* border */ + 2 * 4 /* padding */,
      width: 61 + 2 * 1 /* border */ + 2 * 4 /* padding */
    }), badge)))
  }));
}
export default injectIntl(CollapsibleSidebarLogo);
//# sourceMappingURL=CollapsibleSidebarLogo.js.map