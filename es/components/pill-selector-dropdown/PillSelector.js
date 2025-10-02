const _excluded = ["allowInvalidPills", "className", "disabled", "error", "errorTooltipPosition", "getPillClassName", "getPillImageUrl", "inputProps", "isInputDisabled", "isInputFocusedNextLine", "onInput", "onRemove", "onSuggestedPillAdd", "placeholder", "innerRef", "selectedOptions", "showAvatars", "showRoundedPills", "suggestedPillsData", "suggestedPillsFilter", "suggestedPillsTitle", "validator"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import { List } from 'immutable';
import Tooltip from '../tooltip';
import { KEYS } from '../../constants';
import RoundPill from './RoundPill';
import Pill from './Pill';
import SuggestedPillsRow from './SuggestedPillsRow';
function stopDefaultEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}
class PillSelectorBase extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isFocused: false,
      selectedIndex: -1
    });
    _defineProperty(this, "getNumSelected", () => {
      const {
        selectedOptions
      } = this.props;
      return typeof selectedOptions.size === 'number' ? selectedOptions.size : selectedOptions.length;
    });
    _defineProperty(this, "getPillsByKey", key => {
      const {
        selectedOptions
      } = this.props;
      return selectedOptions.map(option => option[key]);
    });
    _defineProperty(this, "handleClick", () => {
      this.inputEl.focus();
    });
    _defineProperty(this, "handleFocus", () => {
      this.setState({
        isFocused: true
      });
    });
    _defineProperty(this, "handleBlur", () => {
      this.setState({
        isFocused: false
      });
    });
    _defineProperty(this, "handleKeyDown", event => {
      const inputValue = this.inputEl.value;
      const numPills = this.getNumSelected();
      const {
        selectedIndex
      } = this.state;
      switch (event.key) {
        case KEYS.backspace:
          {
            let index = -1;
            if (selectedIndex >= 0) {
              // remove selected pill
              index = selectedIndex;
              this.resetSelectedIndex();
              this.inputEl.focus();
            } else if (inputValue === '') {
              // remove last pill
              index = numPills - 1;
            }
            if (index >= 0) {
              const {
                onRemove,
                selectedOptions
              } = this.props;
              const selectedOption =
              // $FlowFixMe
              typeof selectedOptions.get === 'function' ? selectedOptions.get(index) : selectedOptions[index];
              onRemove(selectedOption, index);
              stopDefaultEvent(event);
            }
            break;
          }
        case KEYS.arrowLeft:
          if (selectedIndex >= 0) {
            // select previous pill
            this.setState({
              selectedIndex: Math.max(selectedIndex - 1, 0)
            });
            stopDefaultEvent(event);
          } else if (inputValue === '' && numPills > 0) {
            // select last pill
            this.hiddenEl.focus();
            this.setState({
              selectedIndex: numPills - 1
            });
            stopDefaultEvent(event);
          }
          break;
        case KEYS.arrowRight:
          {
            if (selectedIndex >= 0) {
              const index = selectedIndex + 1;
              if (index >= numPills) {
                // deselect last pill
                this.resetSelectedIndex();
                this.inputEl.focus();
              } else {
                // select next pill
                this.setState({
                  selectedIndex: index
                });
              }
              stopDefaultEvent(event);
            }
            break;
          }
        // no default
      }
    });
    _defineProperty(this, "errorMessageID", uniqueId('errorMessage'));
    _defineProperty(this, "hiddenRef", hiddenEl => {
      if (hiddenEl) {
        this.hiddenEl = hiddenEl;
      }
    });
    _defineProperty(this, "resetSelectedIndex", () => {
      if (this.state.selectedIndex !== -1) {
        this.setState({
          selectedIndex: -1
        });
      }
    });
  }
  render() {
    const {
      isFocused,
      selectedIndex
    } = this.state;
    const _this$props = this.props,
      {
        allowInvalidPills,
        className,
        disabled,
        error,
        errorTooltipPosition,
        getPillClassName,
        getPillImageUrl,
        inputProps,
        isInputDisabled,
        isInputFocusedNextLine,
        onInput,
        onRemove,
        onSuggestedPillAdd,
        placeholder,
        innerRef,
        selectedOptions,
        showAvatars,
        showRoundedPills,
        suggestedPillsData,
        suggestedPillsFilter,
        suggestedPillsTitle,
        validator
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const suggestedPillsEnabled = suggestedPillsData && suggestedPillsData.length > 0;
    const hasError = !!error;
    const classes = classNames('bdl-PillSelector', 'pill-selector-input-wrapper', {
      'is-disabled': disabled,
      'bdl-is-disabled': disabled,
      'is-focused': isFocused,
      'show-error': hasError,
      'pill-selector-suggestions-enabled': suggestedPillsEnabled,
      'bdl-PillSelector--suggestionsEnabled': suggestedPillsEnabled
    });
    const ariaAttrs = {
      'aria-invalid': hasError,
      'aria-errormessage': this.errorMessageID,
      'aria-describedby': this.errorMessageID
    };
    return /*#__PURE__*/React.createElement(Tooltip, {
      isShown: hasError,
      text: error || '',
      position: errorTooltipPosition,
      theme: "error"
    }, /*#__PURE__*/React.createElement("span", {
      className: classes,
      onBlur: this.handleBlur,
      onClick: this.handleClick,
      onFocus: this.handleFocus,
      onKeyDown: this.handleKeyDown,
      ref: innerRef
    }, showRoundedPills ? selectedOptions.map((option, index) => {
      return /*#__PURE__*/React.createElement(RoundPill, {
        className: getPillClassName ? getPillClassName(option) : undefined,
        getPillImageUrl: getPillImageUrl,
        isValid: allowInvalidPills ? validator(option) : true,
        isDisabled: disabled,
        isSelected: index === selectedIndex,
        key: option.value,
        onRemove: onRemove.bind(this, option, index)
        // $FlowFixMe option.text is for backwards compatibility
        ,
        text: option.displayText || option.text,
        showAvatar: showAvatars,
        id: option.id,
        hasWarning: option.hasWarning,
        isExternal: option.isExternalUser,
        type: option.type
      });
    }) : selectedOptions.map((option, index) => {
      // TODO: This and associated types will be removed once all views are updates with round pills.
      return /*#__PURE__*/React.createElement(Pill, {
        isValid: allowInvalidPills ? validator(option) : true,
        isDisabled: disabled,
        isSelected: index === selectedIndex,
        key: option.value,
        onRemove: onRemove.bind(this, option, index)
        // $FlowFixMe option.text is for backwards compatibility
        ,
        text: option.displayText || option.text
      });
    }), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      className: "accessibility-hidden",
      onBlur: this.resetSelectedIndex,
      ref: this.hiddenRef,
      tabIndex: -1,
      "data-testid": "pill-selection-helper"
    }), /*#__PURE__*/React.createElement("textarea", _extends({}, ariaAttrs, rest, inputProps, {
      autoComplete: "off",
      className: classNames('bdl-PillSelector-input', 'pill-selector-input', className, {
        'bdl-PillSelector-input--nextLine': isInputFocusedNextLine
      }),
      disabled: disabled || isInputDisabled,
      onInput: onInput,
      placeholder: this.getNumSelected() === 0 ? placeholder : '',
      ref: input => {
        this.inputEl = input;
      }
    })), /*#__PURE__*/React.createElement(SuggestedPillsRow, {
      onSuggestedPillAdd: onSuggestedPillAdd,
      selectedPillsValues: this.getPillsByKey('value'),
      suggestedPillsFilter: suggestedPillsFilter,
      suggestedPillsData: suggestedPillsData,
      title: suggestedPillsTitle
    }), /*#__PURE__*/React.createElement("span", {
      id: this.errorMessageID,
      className: "accessibility-hidden",
      role: "alert"
    }, error)));
  }
}
_defineProperty(PillSelectorBase, "defaultProps", {
  allowInvalidPills: false,
  disabled: false,
  error: '',
  errorTooltipPosition: 'bottom-left',
  inputProps: {},
  placeholder: '',
  selectedOptions: [],
  validator: () => true
});
export { PillSelectorBase };
const PillSelector = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(PillSelectorBase, _extends({}, props, {
  innerRef: ref
})));
PillSelector.displayName = 'PillSelector';
export default PillSelector;
//# sourceMappingURL=PillSelector.js.map