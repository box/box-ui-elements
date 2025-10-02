const _excluded = ["inputProps"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { Children, Component } from 'react';
import DatalistItem from '../datalist-item';
import SelectorDropdown from './SelectorDropdown';
import TextInput from '../text-input';
const InputContainer = _ref => {
  let {
      inputProps = {}
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(TextInput, _extends({}, inputProps, rest));
};
class SelectorDropdownContainer extends Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "handleShowTitle", () => {
      this.setState({
        showTitle: !this.state.showTitle
      });
    });
    _defineProperty(this, "handleRemainOpen", () => {
      this.setState({
        remainOpen: !this.state.remainOpen
      });
    });
    _defineProperty(this, "handleUserInput", event => {
      this.filterByItem(event.target.value);
    });
    _defineProperty(this, "handleItemSelection", i => {
      this.setState({
        filterText: this.state.items[i]
      });
    });
    this.state = {
      filterText: '',
      items: props.initialItems,
      showTitle: false,
      remainOpen: false
    };
  }
  filterByItem(item) {
    this.setState({
      filterText: item
    });
    this.filterItems(item);
  }
  filterItems(filterText) {
    const {
      initialItems
    } = this.props;
    const filterTextLowerCase = filterText.toLowerCase();
    const items = initialItems.filter(item => item.toLowerCase().includes(filterTextLowerCase));
    this.setState({
      items
    });
  }
  render() {
    const {
      placeholder,
      title
    } = this.props;
    const {
      filterText,
      items,
      showTitle,
      remainOpen
    } = this.state;
    const dropdownTitle = /*#__PURE__*/React.createElement("div", null, "This is a Title");
    return /*#__PURE__*/React.createElement("div", {
      style: {
        paddingBottom: '330px'
      }
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "title-check"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      name: "title-check",
      id: "title-check",
      checked: showTitle,
      onChange: this.handleShowTitle
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        paddingLeft: '4px'
      }
    }, "Add title to overlay")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "remain-open-check"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      name: "remain-open-check",
      id: "remain-open-check",
      checked: remainOpen,
      onChange: this.handleRemainOpen
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        paddingLeft: '4px'
      }
    }, "Overlay should remain open")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(SelectorDropdown, {
      isAlwaysOpen: remainOpen,
      onSelect: this.handleItemSelection,
      selector: /*#__PURE__*/React.createElement(InputContainer, {
        label: title,
        name: "selectorDropdownInput",
        onInput: this.handleUserInput,
        placeholder: placeholder,
        type: "text",
        value: filterText
      }),
      title: showTitle ? dropdownTitle : undefined
    }, Children.map(items, item => /*#__PURE__*/React.createElement(DatalistItem, {
      key: item
    }, item))));
  }
}
const SelectorDropdownExample = () => /*#__PURE__*/React.createElement(SelectorDropdownContainer, {
  initialItems: ['Illmatic', 'The Marshall Mathers LP', 'All Eyez on Me', 'Ready To Die', 'Enter the Wu-Tang', 'The Eminem Show', 'The Chronic', 'Straight Outta Compton', 'Reasonable Doubt', 'Super long name that should be truncated, we should see the dots at the very end, adding some more text here, should truncate at any second now, please truncate soon'],
  placeholder: "Select an album",
  title: "Album"
});
export default SelectorDropdownExample;
//# sourceMappingURL=SelectorDropdownExample.js.map