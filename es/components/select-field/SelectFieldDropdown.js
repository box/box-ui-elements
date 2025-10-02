function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import classNames from 'classnames';
export const OVERLAY_SCROLLABLE_CLASS = 'bdl-SelectField-overlay--scrollable';
class SelectFieldDropdown extends React.Component {
  componentDidUpdate({
    selectedValues: prevSelectedValues
  }) {
    const {
      multiple,
      scheduleUpdate,
      selectedValues
    } = this.props;
    if (multiple && scheduleUpdate && prevSelectedValues !== selectedValues) {
      scheduleUpdate();
    }
  }
  render() {
    const {
      children,
      innerRef,
      style,
      placement,
      isScrollable,
      multiple,
      selectFieldID
    } = this.props;
    const listboxProps = {};
    if (multiple) {
      listboxProps['aria-multiselectable'] = true;
    }
    return /*#__PURE__*/React.createElement("ul", _extends({
      ref: innerRef,
      style: style,
      "data-placement": placement,
      className: classNames('bdl-SelectFieldDropdown', 'overlay', {
        [OVERLAY_SCROLLABLE_CLASS]: isScrollable
      }),
      id: selectFieldID,
      role: "listbox"
      // preventDefault on mousedown so blur doesn't happen before click
      ,
      onMouseDown: event => event.preventDefault()
    }, listboxProps), children);
  }
}
export default /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(SelectFieldDropdown, _extends({}, props, {
  innerRef: ref
})));
//# sourceMappingURL=SelectFieldDropdown.js.map