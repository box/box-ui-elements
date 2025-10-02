function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import { scrollIntoView } from '../../utils/dom';
import PopperComponent from '../popper';
import { PLACEMENT_BOTTOM_START } from '../popper/constants';
import ScrollWrapper from '../scroll-wrapper';
import { OVERLAY_WRAPPER_CLASS } from '../../constants';
import './SelectorDropdown.scss';
function stopDefaultEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}
class SelectorDropdown extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "setActiveItem", index => {
      this.setState({
        activeItemIndex: index
      });
      if (index === -1) {
        this.setActiveItemID(null);
      }
    });
    _defineProperty(this, "setActiveItemID", id => {
      const {
        scrollBoundarySelector
      } = this.props;
      const itemEl = id ? document.getElementById(id) : null;
      const scrollOptions = {
        block: 'nearest'
      };

      // Allow null in case we want to clear the default
      // boundary from scrollIntoView
      if (typeof scrollBoundarySelector !== 'undefined') {
        scrollOptions.boundary = document.querySelector(scrollBoundarySelector);
      }
      this.setState({
        activeItemID: id
      }, () => {
        scrollIntoView(itemEl, scrollOptions);
      });
    });
    _defineProperty(this, "haveChildrenChanged", prevChildren => {
      const {
        children
      } = this.props;
      const childrenCount = React.Children.count(children);
      const prevChildrenCount = React.Children.count(prevChildren);
      if (childrenCount !== prevChildrenCount) {
        return true;
      }
      if (childrenCount === 0) {
        return false;
      }
      const childrenKeys = React.Children.map(children, child => child.key);
      const prevChildrenKeys = React.Children.map(prevChildren, child => child.key);
      return childrenKeys.some((childKey, index) => childKey !== prevChildrenKeys[index]);
    });
    _defineProperty(this, "resetActiveItem", () => {
      this.setState({
        activeItemID: null,
        activeItemIndex: -1
      });
    });
    _defineProperty(this, "handleFocus", () => {
      this.openDropdown();
    });
    _defineProperty(this, "handleDocumentClick", event => {
      const container = this.selectorDropdownRef.current;
      const isInside = container && event.target instanceof Node && container.contains(event.target) || container === event.target;
      if (!isInside) {
        this.closeDropdown();
      }
    });
    _defineProperty(this, "handleInput", () => {
      this.openDropdown();
    });
    _defineProperty(this, "handleKeyDown", event => {
      const {
        children,
        isAlwaysOpen,
        onEnter
      } = this.props;
      const {
        activeItemIndex
      } = this.state;
      const childrenCount = React.Children.count(children);
      switch (event.key) {
        case 'ArrowDown':
          if (this.isDropdownOpen()) {
            if (childrenCount) {
              stopDefaultEvent(event);
            }
            const nextIndex = activeItemIndex === childrenCount - 1 ? -1 : activeItemIndex + 1;
            this.setActiveItem(nextIndex);
          } else {
            this.openDropdown();
          }
          break;
        case 'ArrowUp':
          if (this.isDropdownOpen()) {
            if (childrenCount) {
              stopDefaultEvent(event);
            }
            const prevIndex = activeItemIndex === -1 ? childrenCount - 1 : activeItemIndex - 1;
            this.setActiveItem(prevIndex);
          } else {
            this.openDropdown();
          }
          break;
        case 'Enter':
          if (activeItemIndex !== -1 && this.isDropdownOpen()) {
            stopDefaultEvent(event);
            this.selectItem(activeItemIndex, event);
          } else if (onEnter) {
            onEnter(event);
          }
          break;
        case 'Tab':
          if (this.isDropdownOpen()) {
            this.closeDropdown();
            this.resetActiveItem();
          }
          break;
        case 'Escape':
          if (!isAlwaysOpen && this.isDropdownOpen()) {
            stopDefaultEvent(event);
            this.closeDropdown();
            this.resetActiveItem();
          }
          break;
        default:
          this.handleInput();
      }
    });
    _defineProperty(this, "isDropdownOpen", () => {
      const {
        children,
        isAlwaysOpen
      } = this.props;
      const {
        shouldOpen
      } = this.state;
      const childrenCount = React.Children.count(children);
      return childrenCount > 0 && (!!isAlwaysOpen || shouldOpen);
    });
    _defineProperty(this, "openDropdown", () => {
      if (!this.state.shouldOpen) {
        const {
          shouldSetActiveItemOnOpen
        } = this.props;
        if (shouldSetActiveItemOnOpen) {
          this.setActiveItem(0);
        }
        this.setState({
          shouldOpen: true
        });
        document.addEventListener('click', this.handleDocumentClick, true);
      }
    });
    _defineProperty(this, "closeDropdown", () => {
      this.setState({
        shouldOpen: false
      });
      document.removeEventListener('click', this.handleDocumentClick, true);
    });
    _defineProperty(this, "selectItem", (index, event) => {
      const {
        onSelect
      } = this.props;
      if (onSelect) {
        onSelect(index, event);
      }
      this.closeDropdown();
    });
    this.listboxID = uniqueId('listbox');
    this.state = {
      activeItemID: null,
      activeItemIndex: -1,
      shouldOpen: false
    };
    this.selectorDropdownRef = /*#__PURE__*/React.createRef();
  }
  componentDidUpdate({
    shouldSetActiveItemOnOpen,
    children
  }) {
    if (this.haveChildrenChanged(children)) {
      // For UX purposes filtering the items is equivalent
      // to re-opening the dropdown. In such cases we highlight
      // the first item when configured to do so
      if (shouldSetActiveItemOnOpen) {
        this.setActiveItem(0);
      } else {
        this.resetActiveItem();
      }
    }
  }
  componentWillUnmount() {
    // just in case event listener was added during openDropdown() but the component
    // gets unmounted without closeDropdown()
    document.removeEventListener('click', this.handleDocumentClick, true);
  }
  render() {
    const {
      listboxID,
      selectItem,
      setActiveItem,
      setActiveItemID,
      closeDropdown
    } = this;
    const {
      dividerIndex,
      overlayTitle,
      children,
      className,
      isPositionDynamic,
      title,
      selector,
      shouldScroll
    } = this.props;
    const {
      activeItemID,
      activeItemIndex
    } = this.state;
    const isOpen = this.isDropdownOpen();
    const inputProps = {
      'aria-activedescendant': activeItemID,
      'aria-autocomplete': 'list',
      'aria-expanded': isOpen,
      role: 'combobox'
    };
    if (isOpen) {
      inputProps['aria-owns'] = listboxID;
    }
    const list = /*#__PURE__*/React.createElement("ul", {
      className: classNames('overlay', overlayTitle ? overlayTitle.toLowerCase() : ''),
      id: listboxID,
      role: "listbox"
    }, overlayTitle && /*#__PURE__*/React.createElement("h5", {
      className: "SelectorDropdown-title"
    }, overlayTitle), React.Children.map(children, (item, index) => {
      const itemProps = {
        onClick: event => {
          selectItem(index, event);
        },
        /* preventDefault on mousedown so blur doesn't happen before click */
        onMouseDown: event => {
          event.preventDefault();
        },
        onMouseEnter: () => {
          setActiveItem(index);
        },
        closeDropdown: () => {
          closeDropdown();
        },
        setActiveItemID
      };
      if (index === activeItemIndex) {
        itemProps.isActive = true;
      }
      const hasDivider = index === dividerIndex;
      return /*#__PURE__*/React.createElement(React.Fragment, null, hasDivider && /*#__PURE__*/React.createElement("hr", {
        className: "SelectorDropdown-divider"
      }), /*#__PURE__*/React.cloneElement(item, itemProps));
    }));

    // change onPaste back to onInput when React fixes this IE11 bug: https://github.com/facebook/react/issues/7280

    // We're simulating the blur event with the tab key listener and the
    // click listener as a proxy because IE will trigger a blur when
    // using the scrollbar in the dropdown which indavertently closes the dropdown.
    return (
      /*#__PURE__*/
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      React.createElement("div", {
        className: classNames('SelectorDropdown', className),
        onFocus: this.handleFocus,
        onKeyDown: this.handleKeyDown,
        onPaste: this.handleInput,
        ref: this.selectorDropdownRef
      }, /*#__PURE__*/React.createElement(PopperComponent, {
        isPositionDynamic: isPositionDynamic,
        isOpen: isOpen,
        placement: PLACEMENT_BOTTOM_START
      }, /*#__PURE__*/React.cloneElement(selector, {
        inputProps
      }), /*#__PURE__*/React.createElement("div", {
        className: `SelectorDropdown-overlay ${OVERLAY_WRAPPER_CLASS} is-visible`
      }, title, shouldScroll ? /*#__PURE__*/React.createElement(ScrollWrapper, null, list) : list)))
    );
  }
}
_defineProperty(SelectorDropdown, "defaultProps", {
  isPositionDynamic: false
});
export default SelectorDropdown;
//# sourceMappingURL=SelectorDropdown.js.map