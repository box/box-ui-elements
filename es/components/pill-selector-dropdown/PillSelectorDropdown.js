function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import { List } from 'immutable';
import noop from 'lodash/noop';
import parseCSV from '../../utils/parseCSV';
import Label from '../label';
import SelectorDropdown from '../selector-dropdown';
import PillSelector from './PillSelector';
import './PillSelectorDropdown.scss';
class PillSelectorDropdown extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      inputValue: '',
      isInCompositionMode: false
    });
    _defineProperty(this, "parsePills", inputValue => {
      const {
        allowInvalidPills,
        parseItems,
        validator
      } = this.props;
      let pills = parseItems ? parseItems(inputValue) : parseCSV(inputValue);
      if (!pills) {
        return [];
      }
      if (!allowInvalidPills) {
        pills = pills.filter(pill => validator(pill));
      }
      const normalizedPills = pills.map(pill => typeof pill === 'string' ? {
        displayText: pill,
        text: pill,
        // deprecated, left for backwards compatibility
        value: pill
      } : pill);
      return normalizedPills;
    });
    _defineProperty(this, "addPillsFromInput", inputValue => {
      const {
        allowCustomPills,
        onPillCreate,
        onSelect,
        selectedOptions,
        shouldClearUnmatchedInput,
        validateForError
      } = this.props;

      // Do nothing if custom pills are not allowed
      if (!allowCustomPills) {
        return;
      }

      // Parse pills from input
      const pills = this.parsePills(inputValue);

      // "Select" the pills
      if (pills.length > 0) {
        onSelect(pills);
        onPillCreate(pills);
        this.resetInputValue();
      } else {
        if (validateForError && (inputValue !== '' || selectedOptions.length === 0)) {
          /**
           * If no pills were added, but an inputValue exists or
           * there are no pills selected, check for errors
           */
          validateForError(inputValue);
        }
        if (shouldClearUnmatchedInput) {
          this.resetInputValue();
        }
      }
    });
    _defineProperty(this, "handleBlur", event => {
      const {
        onBlur
      } = this.props;
      const {
        inputValue
      } = this.state;
      this.addPillsFromInput(inputValue);
      onBlur(event);
    });
    _defineProperty(this, "handleInput", event => {
      const {
        target
      } = event;
      const {
        value
      } = target;
      this.setState({
        inputValue: value
      });
      this.props.onInput(value, event);
    });
    _defineProperty(this, "handleEnter", event => {
      const {
        isInCompositionMode,
        inputValue
      } = this.state;
      if (!isInCompositionMode) {
        event.preventDefault();
        this.addPillsFromInput(inputValue);
      }
    });
    _defineProperty(this, "handlePaste", event => {
      event.preventDefault();
      const inputValue = event.clipboardData.getData('text');
      this.setState({
        inputValue
      });
      this.props.onInput(inputValue, event);
      this.addPillsFromInput(inputValue);
    });
    _defineProperty(this, "handleSelect", (index, event) => {
      const {
        onPillCreate,
        onSelect,
        selectorOptions
      } = this.props;
      const selectedOption =
      // $FlowFixMe
      typeof selectorOptions.get === 'function' ? selectorOptions.get(index) : selectorOptions[index];
      onSelect([selectedOption], event);
      onPillCreate([selectedOption]);
      this.handleInput({
        target: {
          value: ''
        }
      });
    });
    _defineProperty(this, "handleCompositionStart", () => {
      this.setState({
        isInCompositionMode: true
      });
    });
    _defineProperty(this, "handleCompositionEnd", () => {
      this.setState({
        isInCompositionMode: false
      });
    });
    _defineProperty(this, "resetInputValue", () => {
      const {
        onInput
      } = this.props;
      this.setState({
        inputValue: ''
      });
      onInput('');
    });
  }
  render() {
    const {
      allowInvalidPills,
      children,
      className,
      disabled,
      dividerIndex,
      dropdownScrollBoundarySelector,
      error,
      errorTooltipPosition,
      getPillClassName,
      getPillImageUrl,
      inputProps,
      isPositionDynamic,
      label,
      onRemove,
      onSuggestedPillAdd,
      overlayTitle,
      placeholder,
      selectedOptions,
      showAvatars,
      showRoundedPills,
      suggestedPillsData,
      suggestedPillsFilter,
      suggestedPillsTitle,
      shouldSetActiveItemOnOpen,
      validator
    } = this.props;
    const selectorDropdownElement = /*#__PURE__*/React.createElement(SelectorDropdown, {
      className: classNames('bdl-PillSelectorDropdown', 'pill-selector-wrapper', className),
      dividerIndex: dividerIndex,
      isPositionDynamic: isPositionDynamic,
      onEnter: this.handleEnter,
      onSelect: this.handleSelect,
      overlayTitle: overlayTitle,
      scrollBoundarySelector: dropdownScrollBoundarySelector,
      shouldSetActiveItemOnOpen: shouldSetActiveItemOnOpen,
      selector: /*#__PURE__*/React.createElement(PillSelector, _extends({
        onChange: noop // fix console error
        ,
        onCompositionEnd: this.handleCompositionEnd,
        onCompositionStart: this.handleCompositionStart
      }, inputProps, {
        allowInvalidPills: allowInvalidPills,
        disabled: disabled,
        error: error,
        errorTooltipPosition: errorTooltipPosition,
        getPillClassName: getPillClassName,
        getPillImageUrl: getPillImageUrl,
        onBlur: this.handleBlur,
        onInput: this.handleInput,
        onPaste: this.handlePaste,
        onRemove: onRemove,
        onSuggestedPillAdd: onSuggestedPillAdd,
        placeholder: placeholder,
        selectedOptions: selectedOptions,
        showAvatars: showAvatars && showRoundedPills,
        showRoundedPills: showRoundedPills,
        suggestedPillsData: suggestedPillsData,
        suggestedPillsFilter: suggestedPillsFilter,
        suggestedPillsTitle: suggestedPillsTitle,
        validator: validator,
        value: this.state.inputValue
      }))
    }, children);
    return label ? /*#__PURE__*/React.createElement(Label, {
      text: label
    }, selectorDropdownElement) : selectorDropdownElement;
  }
}
_defineProperty(PillSelectorDropdown, "defaultProps", {
  allowCustomPills: false,
  allowInvalidPills: false,
  disabled: false,
  error: '',
  inputProps: {},
  label: '',
  onBlur: noop,
  onPillCreate: noop,
  placeholder: '',
  selectedOptions: [],
  selectorOptions: [],
  shouldClearUnmatchedInput: false,
  shouldSetActiveItemOnOpen: false,
  validator: () => true
});
export default PillSelectorDropdown;
//# sourceMappingURL=PillSelectorDropdown.js.map