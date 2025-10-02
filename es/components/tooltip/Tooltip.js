function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import getProp from 'lodash/get';
import TetherComponent from 'react-tether';
import TetherPosition from '../../common/tether-positions';
import CloseButton from './CloseButton';
import './Tooltip.scss';
export let TooltipTheme = /*#__PURE__*/function (TooltipTheme) {
  TooltipTheme["CALLOUT"] = "callout";
  TooltipTheme["DEFAULT"] = "default";
  TooltipTheme["ERROR"] = "error";
  return TooltipTheme;
}({});
export let TooltipPosition = /*#__PURE__*/function (TooltipPosition) {
  TooltipPosition["BOTTOM_CENTER"] = "bottom-center";
  TooltipPosition["BOTTOM_LEFT"] = "bottom-left";
  TooltipPosition["BOTTOM_RIGHT"] = "bottom-right";
  TooltipPosition["MIDDLE_LEFT"] = "middle-left";
  TooltipPosition["MIDDLE_RIGHT"] = "middle-right";
  TooltipPosition["TOP_CENTER"] = "top-center";
  TooltipPosition["TOP_LEFT"] = "top-left";
  TooltipPosition["TOP_RIGHT"] = "top-right";
  return TooltipPosition;
}({});
const positions = {
  [TooltipPosition.BOTTOM_CENTER]: {
    attachment: TetherPosition.TOP_CENTER,
    targetAttachment: TetherPosition.BOTTOM_CENTER
  },
  [TooltipPosition.BOTTOM_LEFT]: {
    attachment: TetherPosition.TOP_RIGHT,
    targetAttachment: TetherPosition.BOTTOM_RIGHT
  },
  [TooltipPosition.BOTTOM_RIGHT]: {
    attachment: TetherPosition.TOP_LEFT,
    targetAttachment: TetherPosition.BOTTOM_LEFT
  },
  [TooltipPosition.MIDDLE_LEFT]: {
    attachment: TetherPosition.MIDDLE_RIGHT,
    targetAttachment: TetherPosition.MIDDLE_LEFT
  },
  [TooltipPosition.MIDDLE_RIGHT]: {
    attachment: TetherPosition.MIDDLE_LEFT,
    targetAttachment: TetherPosition.MIDDLE_RIGHT
  },
  [TooltipPosition.TOP_CENTER]: {
    attachment: TetherPosition.BOTTOM_CENTER,
    targetAttachment: TetherPosition.TOP_CENTER
  },
  [TooltipPosition.TOP_LEFT]: {
    attachment: TetherPosition.BOTTOM_RIGHT,
    targetAttachment: TetherPosition.TOP_RIGHT
  },
  [TooltipPosition.TOP_RIGHT]: {
    attachment: TetherPosition.BOTTOM_LEFT,
    targetAttachment: TetherPosition.TOP_LEFT
  }
};
class Tooltip extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "tooltipID", uniqueId('tooltip'));
    _defineProperty(this, "tetherRef", /*#__PURE__*/React.createRef());
    // Instance API: Forces the radar to be repositioned
    _defineProperty(this, "position", () => {
      if (this.tetherRef.current && this.isShown()) {
        this.tetherRef.current.position();
      }
    });
    _defineProperty(this, "closeTooltip", () => {
      const {
        onDismiss
      } = this.props;
      this.setState({
        wasClosedByUser: true
      });
      if (onDismiss) {
        onDismiss();
      }
    });
    _defineProperty(this, "fireChildEvent", (type, event) => {
      const {
        children
      } = this.props;
      const handler = children.props[type];
      if (handler) {
        handler(event);
      }
    });
    _defineProperty(this, "handleTooltipEvent", event => {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
    });
    _defineProperty(this, "handleMouseEnter", event => {
      this.setState({
        isShown: true
      });
      this.fireChildEvent('onMouseEnter', event);
    });
    _defineProperty(this, "handleMouseLeave", event => {
      this.setState({
        isShown: false
      });
      this.fireChildEvent('onMouseLeave', event);
    });
    _defineProperty(this, "handleFocus", event => {
      this.setState({
        isShown: true
      });
      this.fireChildEvent('onFocus', event);
    });
    _defineProperty(this, "handleBlur", event => {
      this.setState({
        isShown: false
      });
      this.fireChildEvent('onBlur', event);
    });
    _defineProperty(this, "isControlled", () => {
      const {
        isShown: isShownProp
      } = this.props;
      return typeof isShownProp !== 'undefined';
    });
    _defineProperty(this, "handleKeyDown", event => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        this.setState({
          isShown: false
        });
      }
      this.fireChildEvent('onKeyDown', event);
    });
    _defineProperty(this, "isShown", () => {
      const {
        isShown: isShownProp
      } = this.props;
      const isControlled = this.isControlled();
      const isShown = isControlled ? isShownProp : this.state.isShown;
      const showTooltip = isShown && !this.state.wasClosedByUser && this.state.hasRendered;
      return showTooltip;
    });
    this.state = {
      isShown: !!props.isShown,
      hasRendered: false,
      wasClosedByUser: false
    };
  }
  componentDidMount() {
    this.setState({
      hasRendered: true
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const isControlled = this.isControlled();

    // Reset wasClosedByUser state when isShown transitions from false to true
    if (isControlled) {
      if (!prevProps.isShown && this.props.isShown) {
        this.setState({
          wasClosedByUser: false
        });
      }
    } else {
      if (!prevState.isShown && this.state.isShown) {
        // capture event so that tooltip closes before any other floating components that can be closed by
        // "Escape" key(e.g. Modal, Menu, etc.)
        document.addEventListener('keydown', this.handleKeyDown, true);
      }
      if (prevState.isShown && !this.state.isShown) {
        document.removeEventListener('keydown', this.handleKeyDown, true);
      }
    }
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, true);
  }
  render() {
    const {
      ariaHidden,
      bodyElement,
      children,
      className,
      constrainToScrollParent,
      constrainToWindow,
      isDisabled,
      isTabbable = true,
      offset,
      position = TooltipPosition.TOP_CENTER,
      showCloseButton,
      stopBubble,
      tetherElementClassName,
      targetWrapperClassName,
      text,
      theme
    } = this.props;
    const childAriaLabel = getProp(children, 'props.aria-label');
    const isLabelMatchingTooltipText = !!childAriaLabel && childAriaLabel === text;

    // If the tooltip is disabled just render the children
    if (isDisabled) {
      return React.Children.only(children);
    }
    const isControlled = this.isControlled();
    const showTooltip = this.isShown();
    const withCloseButton = showCloseButton && isControlled;
    const tetherPosition = typeof position === 'string' ? positions[position] : position;
    const constraints = [];
    const componentProps = {};
    if (constrainToScrollParent) {
      constraints.push({
        to: 'scrollParent',
        attachment: 'together'
      });
    }
    if (constrainToWindow) {
      constraints.push({
        to: 'window',
        attachment: 'together'
      });
    }
    if (showTooltip && !ariaHidden) {
      if (!isLabelMatchingTooltipText || childAriaLabel === undefined) {
        componentProps['aria-describedby'] = this.tooltipID;
      }
      if (theme === TooltipTheme.ERROR) {
        componentProps['aria-errormessage'] = this.tooltipID;
      }
    }
    if (!isControlled) {
      componentProps.onBlur = this.handleBlur;
      componentProps.onFocus = this.handleFocus;
      componentProps.onMouseEnter = this.handleMouseEnter;
      componentProps.onMouseLeave = this.handleMouseLeave;
      if (isTabbable) {
        componentProps.tabIndex = '0';
      }
    }
    const bodyEl = bodyElement instanceof HTMLElement ? bodyElement : document.body;
    const classes = classNames('tooltip', 'bdl-Tooltip', className, {
      'is-callout': theme === TooltipTheme.CALLOUT,
      'is-error': theme === TooltipTheme.ERROR,
      'with-close-button': withCloseButton
    });
    const tetherProps = {
      attachment: tetherPosition.attachment,
      classPrefix: 'tooltip',
      constraints,
      targetAttachment: tetherPosition.targetAttachment,
      renderElementTo: bodyEl
    };
    if (tetherElementClassName) {
      tetherProps.className = tetherElementClassName;
    }
    if (offset) {
      tetherProps.offset = offset;
    }
    const tooltipInner = /*#__PURE__*/React.createElement(React.Fragment, null, text, withCloseButton && /*#__PURE__*/React.createElement(CloseButton, {
      onClick: this.closeTooltip
    }));
    const renderTooltip = ref => {
      if (!showTooltip) {
        return null;
      }
      return stopBubble ? /*#__PURE__*/React.createElement("div", {
        className: classes,
        id: this.tooltipID,
        onClick: this.handleTooltipEvent,
        onContextMenu: this.handleTooltipEvent,
        onKeyPress: this.handleTooltipEvent,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        role: "presentation",
        ref: ref
      }, /*#__PURE__*/React.createElement("div", {
        role: theme === TooltipTheme.ERROR ? undefined : 'tooltip',
        "aria-live": "polite",
        "aria-hidden": ariaHidden || isLabelMatchingTooltipText,
        "data-testid": "bdl-Tooltip"
      }, tooltipInner)) : /*#__PURE__*/React.createElement("div", {
        "aria-live": "polite",
        "aria-hidden": ariaHidden || isLabelMatchingTooltipText,
        className: classes,
        "data-testid": "bdl-Tooltip",
        id: this.tooltipID,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        role: theme === TooltipTheme.ERROR ? undefined : 'tooltip',
        ref: ref
      }, tooltipInner);
    };
    return /*#__PURE__*/React.createElement(TetherComponent, _extends({}, tetherProps, {
      ref: this.tetherRef,
      renderTarget: ref => {
        const child = React.Children.only(children);
        return child ? /*#__PURE__*/React.createElement("div", {
          className: classNames('bdl-Tooltip-target', targetWrapperClassName),
          ref: ref
        }, /*#__PURE__*/React.cloneElement(child, componentProps)) : null;
      },
      renderElement: renderTooltip
    }));
  }
}
_defineProperty(Tooltip, "defaultProps", {
  constrainToScrollParent: false,
  constrainToWindow: true,
  isDisabled: false,
  position: TooltipPosition.TOP_CENTER,
  theme: TooltipTheme.DEFAULT
});
export default Tooltip;
//# sourceMappingURL=Tooltip.js.map