function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import findIndex from 'lodash/findIndex';
import { FormattedMessage, injectIntl } from 'react-intl';
import { scrollIntoView } from '../../utils/dom';
import IconCheck from '../../icons/general/IconCheck';
import SelectButton from '../select-button';
import DatalistItem from '../datalist-item';
import PopperComponent from '../popper';
import SelectFieldDropdown from './SelectFieldDropdown';
import { PLACEMENT_BOTTOM_END, PLACEMENT_BOTTOM_START } from '../popper/constants';
import SearchForm from '../search-form/SearchForm';
import CLEAR from './constants';
import { ARROW_DOWN, ARROW_UP, ENTER, ESCAPE, SPACE, TAB } from '../../common/keyboard-events';
import messages from './messages';
import './SelectField.scss';
function stopDefaultEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}
function toggleOption(options, value) {
  const index = options.indexOf(value);
  if (index === -1) {
    options.push(value);
  } else {
    options.splice(index, 1);
  }
}
function defaultOptionRenderer({
  displayText
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "bdl-SelectField-optionText",
    title: displayText
  }, displayText);
}
class BaseSelectField extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "updateSearchText", text => {
      const {
        options
      } = this.props;
      const optionIndex = findIndex(options, element => element.displayText.toLowerCase().includes(text.toLowerCase()));
      if (optionIndex >= 0) {
        this.setActiveItem(optionIndex);
      }
      this.setState({
        searchText: text
      });
    });
    _defineProperty(this, "handleDocumentClick", event => {
      const container = this.selectFieldContainerRef.current;
      const isInside = container && event.target instanceof Node && container.contains(event.target) || container === event.target;
      if (!isInside) {
        this.closeDropdown();
      }
    });
    _defineProperty(this, "setActiveItem", (index, shouldScrollIntoView = true) => {
      this.setState({
        activeItemIndex: index,
        shouldScrollIntoView
      });
      if (index === -1) {
        this.setActiveItemID(null);
      }
    });
    _defineProperty(this, "setActiveItemID", id => {
      const {
        shouldScrollIntoView
      } = this.state;
      const itemEl = id ? document.getElementById(id) : null;
      this.setState({
        activeItemID: id,
        shouldScrollIntoView: false
      }, () => {
        if (shouldScrollIntoView) {
          scrollIntoView(itemEl, {
            block: 'nearest'
          });
        }
      });
    });
    _defineProperty(this, "handleChange", selectedItems => {
      const {
        onChange
      } = this.props;
      if (onChange) {
        onChange(selectedItems);
      }
    });
    _defineProperty(this, "handleOptionSelect", selectedItem => {
      const {
        onOptionSelect
      } = this.props;
      if (onOptionSelect) {
        onOptionSelect(selectedItem);
      }
    });
    _defineProperty(this, "handleButtonClick", () => {
      if (this.state.isOpen) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    });
    _defineProperty(this, "handleClearClick", () => {
      this.handleChange([]);
    });
    _defineProperty(this, "handleButtonKeyDown", event => {
      const {
        activeItemIndex
      } = this.state;

      // If user is interacting with the select dropdown, don't close on space/enter (i.e. prevent click event)
      if ((event.key === SPACE || event.key === ENTER) && activeItemIndex !== -1) {
        event.preventDefault();
      }
    });
    _defineProperty(this, "handleBlur", event => {
      const {
        isOpen
      } = this.state;
      const {
        blurExceptionClassNames = []
      } = this.props;
      const exceptionClasses = ['search-input', 'select-button', ...blurExceptionClassNames];
      if (isOpen && event && event.relatedTarget && exceptionClasses.every(className => event && !event.relatedTarget.classList.contains(className))) {
        this.closeDropdown();
      }
    });
    _defineProperty(this, "handleKeyDown", event => {
      const {
        key
      } = event;
      const {
        options,
        shouldShowClearOption,
        shouldShowSearchInput
      } = this.props;
      const {
        activeItemIndex,
        isOpen
      } = this.state;
      const itemCount = options.length;
      switch (key) {
        case ARROW_DOWN:
          stopDefaultEvent(event);
          if (isOpen) {
            const nextIndex = activeItemIndex === itemCount - 1 ? -1 : activeItemIndex + 1;
            this.setActiveItem(nextIndex);
          } else {
            this.openDropdown();
          }
          break;
        case ARROW_UP:
          stopDefaultEvent(event);
          if (isOpen) {
            const prevIndex = activeItemIndex === -1 ? itemCount - 1 : activeItemIndex - 1;
            this.setActiveItem(prevIndex);
          } else {
            this.openDropdown();
          }
          break;
        case ENTER:
        case SPACE:
          if (shouldShowSearchInput) {
            // Allow space key presses in the search string when search field is active
            if (key === SPACE) {
              break;
            }

            // Enter presses should be ignored when no item is active
            if (key === ENTER && activeItemIndex === -1) {
              stopDefaultEvent(event);
              break;
            }
          }
          if (activeItemIndex !== -1 && isOpen) {
            stopDefaultEvent(event);
            const isClearOption = shouldShowClearOption && activeItemIndex === 0;
            if (isClearOption) {
              this.handleClearClick();
            } else {
              this.selectOption(activeItemIndex);
            }
            // Enter always closes dropdown (even for multiselect)
            if (key === ENTER) {
              this.closeDropdown();
            }
          }
          break;
        case ESCAPE:
          if (isOpen) {
            stopDefaultEvent(event);
            this.closeDropdown();
          }
          break;
        case TAB:
          if (isOpen) {
            this.closeDropdown();
          }
          break;
        default:
          {
            if (!shouldShowSearchInput) {
              stopDefaultEvent(event);
              const lowerCaseKey = key.toLowerCase();
              const optionIndex = findIndex(options, option => option.displayText.toLowerCase().indexOf(lowerCaseKey) === 0);
              if (optionIndex >= 0) {
                this.setActiveItem(optionIndex);
              }
            }
          }
      }
    });
    _defineProperty(this, "openDropdown", () => {
      const {
        shouldShowSearchInput
      } = this.props;
      if (!this.state.isOpen) {
        this.setState({
          isOpen: true
        }, () => shouldShowSearchInput && this.searchInputRef && this.searchInputRef.focus());
        document.addEventListener('click', this.handleDocumentClick);
      }
    });
    _defineProperty(this, "closeDropdown", () => {
      if (this.state.isOpen) {
        this.setState({
          activeItemID: null,
          activeItemIndex: -1,
          isOpen: false,
          searchText: ''
        });
        document.removeEventListener('click', this.handleDocumentClick);
      }
    });
    _defineProperty(this, "selectOption", index => {
      const {
        multiple
      } = this.props;
      if (multiple) {
        this.selectMultiOption(index);
      } else {
        this.selectSingleOption(index);
        this.closeDropdown(); // Close dropdown for single select fields
      }
    });
    _defineProperty(this, "getFilteredOptions", () => {
      const {
        options
      } = this.props;
      const {
        searchText
      } = this.state;
      return options.filter(option => {
        const isSubstring = option.displayText.toLowerCase().includes(searchText.toLowerCase());
        const isClearOption = option.value === CLEAR;
        return searchText ? isSubstring && !isClearOption : true;
      });
    });
    _defineProperty(this, "selectMultiOption", index => {
      const {
        defaultValue,
        options,
        selectedValues
      } = this.props;
      const hasDefaultValue = defaultValue != null; // Checks if not undefined or null
      const item = this.getFilteredOptions()[index];

      // If we are already using the default option, just return without firing onChange
      if (hasDefaultValue && defaultValue === item.value) {
        this.selectSingleOption(index);
        return;
      }

      // Copy the array so we can freely modify it
      const newSelectedValues = selectedValues.slice(0);
      toggleOption(newSelectedValues, item.value);

      // Apply constraints if a defaultValue is specified
      if (hasDefaultValue) {
        const defaultOptionIndex = findIndex(options, option => option.value === defaultValue);
        if (defaultOptionIndex !== -1) {
          if (newSelectedValues.length === 0) {
            // If nothing is selected, we should select the default option
            this.selectSingleOption(defaultOptionIndex);
            return;
          }
          if (newSelectedValues.length > 1 && newSelectedValues.includes(defaultValue)) {
            // Remove the default option from the selected values when more than one thing is selected
            newSelectedValues.splice(defaultOptionIndex, 1);
          }
        }
      }

      // Fire onchange event with selected items
      this.handleChange(options.filter(option => newSelectedValues.includes(option.value)));
      this.handleOptionSelect(item);
    });
    _defineProperty(this, "renderButtonText", () => {
      const {
        options,
        placeholder,
        selectedValues,
        title
      } = this.props;
      const selectedItemCount = selectedValues.length;

      // When there are no options selected, render placeholder
      if (selectedItemCount === 0 && placeholder) {
        return placeholder;
      }

      // User-specified title when options are selected
      if (title) {
        return title;
      }

      // Auto-generate button title based on selected options
      const selectedOptions = options.filter(option => selectedValues.includes(option.value));
      return selectedOptions.map(option => option.displayText).join(', ');
    });
    _defineProperty(this, "renderSearchInput", () => {
      const {
        intl
      } = this.props;
      const {
        searchText
      } = this.state;
      const getSearchInput = element => {
        this.searchInputRef = element;
      };
      return /*#__PURE__*/React.createElement(SearchForm, {
        className: "select-field-search-container",
        getSearchInput: getSearchInput,
        onChange: this.updateSearchText,
        placeholder: intl.formatMessage(messages.searchPlaceholder),
        value: searchText
      });
    });
    _defineProperty(this, "renderSelectButton", () => {
      const {
        activeItemID,
        isOpen
      } = this.state;
      const {
        buttonProps: buttonElProps,
        isDisabled,
        className,
        error,
        errorTooltipPosition,
        tooltipTetherClassName
      } = this.props;
      const buttonText = this.renderButtonText();
      const buttonProps = _objectSpread(_objectSpread({}, buttonElProps), {}, {
        'aria-activedescendant': activeItemID,
        'aria-autocomplete': 'list',
        'aria-expanded': isOpen,
        'aria-owns': this.selectFieldID,
        className,
        isDisabled,
        onClick: this.handleButtonClick,
        onKeyDown: this.handleButtonKeyDown,
        // @NOTE: Technically, only text inputs should be combo-boxes but ARIA specs do not cover custom select dropdowns
        role: 'listbox',
        title: buttonText
      });
      return (
        /*#__PURE__*/
        // Need to store the select button reference so we can calculate the button width
        // in order to set it as the min width of the dropdown list
        React.createElement(SelectButton, _extends({}, buttonProps, {
          error: error,
          errorTooltipPosition: errorTooltipPosition,
          tooltipTetherClassName: tooltipTetherClassName
        }), buttonText)
      );
    });
    _defineProperty(this, "renderSelectOptions", () => {
      const {
        optionRenderer,
        selectedValues,
        separatorIndices,
        shouldShowClearOption
      } = this.props;
      const {
        activeItemIndex
      } = this.state;
      const filteredOptions = this.getFilteredOptions();
      if (filteredOptions.length === 0) {
        return /*#__PURE__*/React.createElement(DatalistItem, {
          className: "select-option is-disabled"
        }, /*#__PURE__*/React.createElement(FormattedMessage, messages.noResults));
      }
      const selectOptions = filteredOptions.map((item, index) => {
        const {
          value
        } = item;
        const isSelected = selectedValues.includes(value);
        const isClearOption = shouldShowClearOption && value === CLEAR;
        const itemProps = {
          className: classNames('select-option', {
            'is-clear-option': isClearOption
          }),
          key: index,
          /* preventDefault on click to prevent wrapping label from re-triggering the select button */
          onClick: event => {
            event.preventDefault();
            if (isClearOption) {
              this.handleClearClick();
            } else {
              this.selectOption(index);
            }
          },
          onMouseEnter: () => {
            this.setActiveItem(index, false);
          },
          setActiveItemID: this.setActiveItemID
        };
        if (index === activeItemIndex) {
          itemProps.isActive = true;
        }
        itemProps.isSelected = isSelected;

        // The below actually does have a key, but eslint can't catch that
        /* eslint-disable react/jsx-key */
        return /*#__PURE__*/React.createElement(DatalistItem, itemProps, /*#__PURE__*/React.createElement("div", {
          className: "select-option-check-icon"
        }, isSelected ? /*#__PURE__*/React.createElement(IconCheck, {
          height: 16,
          width: 16
        }) : null), optionRenderer(item));
        /* eslint-enable react/jsx-key */
      });
      separatorIndices.forEach((separatorIndex, index) => {
        selectOptions.splice(separatorIndex + index, 0, /*#__PURE__*/React.createElement("li", {
          key: `separator${separatorIndex}`,
          role: "separator"
        }));
      });
      return selectOptions;
    });
    this.selectFieldID = uniqueId('selectfield');
    this.selectFieldContainerRef = /*#__PURE__*/React.createRef();
    this.state = {
      activeItemID: null,
      activeItemIndex: -1,
      isOpen: false,
      searchText: '',
      shouldScrollIntoView: false
    };
  }
  componentWillUnmount() {
    if (this.state.isOpen) {
      // Clean-up global click handlers
      document.removeEventListener('click', this.handleDocumentClick);
    }
  }
  selectSingleOption(index) {
    const {
      selectedValues
    } = this.props;
    const item = this.getFilteredOptions()[index];
    // If item not previously selected, fire change handler
    if (!selectedValues.includes(item.value)) {
      this.handleChange([item]);
    }
    this.handleOptionSelect(item);
  }
  render() {
    const {
      className,
      multiple,
      isEscapedWithReference,
      isRightAligned,
      isScrollable,
      selectedValues,
      shouldShowSearchInput
    } = this.props;
    const {
      isOpen
    } = this.state;

    // @TODO: Need invariants on specific conditions.
    // 1) # of options should be non-zero
    // 2) selectedValues, if defined, should all exist in options
    // 3) defaultValue, if defined, should exist in options
    // 4) defaultValue, if defined, should mean selectedValues is never empty
    // 5) defaultValue, if defined, cannot be selected in addition to other options (must be exclusive)

    const dropdownPlacement = isRightAligned ? PLACEMENT_BOTTOM_END : PLACEMENT_BOTTOM_START;
    // popper.js modifier to allow dropdown to overflow its boundaries and remain attached to its reference
    const dropdownModifiers = isEscapedWithReference ? {
      preventOverflow: {
        escapeWithReference: true
      }
    } : {};
    return (
      /*#__PURE__*/
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      React.createElement("div", {
        className: classNames(className, 'bdl-SelectField', 'select-container'),
        onBlur: this.handleBlur,
        onKeyDown: this.handleKeyDown,
        ref: this.selectFieldContainerRef
      }, /*#__PURE__*/React.createElement(PopperComponent, {
        placement: dropdownPlacement,
        isOpen: isOpen,
        modifiers: dropdownModifiers
      }, this.renderSelectButton(), /*#__PURE__*/React.createElement(SelectFieldDropdown, {
        isScrollable: isScrollable,
        multiple: multiple,
        selectedValues: selectedValues,
        selectFieldID: this.selectFieldID
      }, shouldShowSearchInput && this.renderSearchInput(), this.renderSelectOptions())))
    );
  }
}
_defineProperty(BaseSelectField, "defaultProps", {
  buttonProps: {},
  isDisabled: false,
  isRightAligned: false,
  isScrollable: false,
  multiple: false,
  optionRenderer: defaultOptionRenderer,
  options: [],
  selectedValues: [],
  separatorIndices: [],
  shouldShowClearOption: false,
  shouldShowSearchInput: false
});
export { BaseSelectField as BaseSelectFieldBase };
export default injectIntl(BaseSelectField);
//# sourceMappingURL=BaseSelectField.js.map