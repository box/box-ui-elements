function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import classNames from 'classnames';
import LinkBase from '../../components/link/LinkBase';
import Tooltip from '../../components/tooltip';
import LeftSidebarLinkCallout from './LeftSidebarLinkCallout';
import RemoveButton from './RemoveButton';
import './styles/LeftSidebarLink.scss';
class LeftSidebarLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTextOverflowed: false
    };
  }
  componentDidMount() {
    if (!this.leftSidebarLinkText) {
      return;
    }
    const {
      offsetWidth,
      scrollWidth
    } = this.leftSidebarLinkText;
    if (offsetWidth < scrollWidth) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        isTextOverflowed: true
      });
    }
  }
  render() {
    const {
      callout,
      className = '',
      customTheme = {},
      htmlAttributes = {},
      icon,
      isScrolling = false,
      message,
      newItemBadge,
      onClickRemove,
      removeButtonHtmlAttributes = {},
      routerLink: RouterLink,
      routerProps = {},
      selected = false,
      showTooltip = true
    } = this.props;
    const {
      secondaryColor
    } = customTheme;
    const LinkComponent = RouterLink || LinkBase;
    const routerLinkProps = RouterLink ? routerProps : {};
    const linkComponent = /*#__PURE__*/React.createElement(LinkComponent, _extends({
      className: className
    }, htmlAttributes, routerLinkProps, {
      style: selected && customTheme ? {
        boxShadow: secondaryColor ? `inset 2px 0 0 ${secondaryColor}` : undefined
      } : {}
    }), icon, /*#__PURE__*/React.createElement("span", {
      ref: leftSidebarLinkText => {
        this.leftSidebarLinkText = leftSidebarLinkText;
      },
      className: "left-sidebar-link-text"
    }, message), newItemBadge);
    let component = linkComponent;
    if (callout) {
      component = /*#__PURE__*/React.createElement(LeftSidebarLinkCallout, {
        callout: callout
      }, linkComponent);
    } else if (showTooltip) {
      component = /*#__PURE__*/React.createElement(Tooltip, {
        className: classNames('nav-link-tooltip', {
          'is-visible': this.state.isTextOverflowed && !isScrolling
        }),
        isTabbable: false,
        position: "middle-right",
        text: message
      }, linkComponent);
    }
    return onClickRemove ? /*#__PURE__*/React.createElement("div", {
      className: "left-sidebar-removeable-link-container"
    }, component, /*#__PURE__*/React.createElement(RemoveButton, {
      onClickRemove: onClickRemove,
      removeButtonHtmlAttributes: removeButtonHtmlAttributes
    })) : component;
  }
}
export default LeftSidebarLink;
//# sourceMappingURL=LeftSidebarLink.js.map