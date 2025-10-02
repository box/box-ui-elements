function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import noop from 'lodash/noop';
import range from 'lodash/range';
import uniqueId from 'lodash/uniqueId';

// @ts-ignore flow import
import { RESIN_TAG_TARGET } from '../../common/variables';
import AlertBadge16 from '../../icon/fill/AlertBadge16';
import Calendar16 from '../../icon/fill/Calendar16';
import ClearBadge16 from '../../icon/fill/ClearBadge16';
import AccessiblePikaday from './AccessiblePikaday';
import { ButtonType } from '../button';
import Label from '../label';
import PlainButton from '../plain-button';
import Tooltip, { TooltipPosition, TooltipTheme } from '../tooltip';

// @ts-ignore flow import
import { convertDateToUnixMidnightTime } from '../../utils/datetime';
import './DatePicker.scss';
const messages = defineMessages({
  previousMonth: {
    "id": "boxui.base.previousMonth",
    "defaultMessage": "Previous Month"
  },
  nextMonth: {
    "id": "boxui.base.nextMonth",
    "defaultMessage": "Next Month"
  },
  iconAlertText: {
    "id": "boxui.datePicker.iconAlertText",
    "defaultMessage": "Invalid Date"
  },
  dateClearButton: {
    "id": "boxui.datePicker.dateClearButton",
    "defaultMessage": "Clear Date"
  },
  chooseDate: {
    "id": "boxui.datePicker.chooseDate",
    "defaultMessage": "Choose Date"
  },
  dateInputRangeError: {
    "id": "boxui.datePicker.dateInputRangeError",
    "defaultMessage": "Please enter a date between {minLocaleDate} and {maxLocaleDate}"
  },
  dateInputMaxError: {
    "id": "boxui.datePicker.dateInputMaxError",
    "defaultMessage": "Please enter a date before {maxLocaleDate}"
  },
  dateInputMinError: {
    "id": "boxui.datePicker.dateInputMinError",
    "defaultMessage": "Please enter a date after {minLocaleDate}"
  }
});
const TOGGLE_DELAY_MS = 300;
const ENTER_KEY = 'Enter';
const ESCAPE_KEY = 'Escape';
const TAB_KEY = 'Tab';
const ISO_DATE_FORMAT_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
export let DateFormat = /*#__PURE__*/function (DateFormat) {
  DateFormat["ISO_STRING_DATE_FORMAT"] = "isoString";
  DateFormat["LOCALE_DATE_STRING_DATE_FORMAT"] = "localeDateString";
  DateFormat["UTC_TIME_DATE_FORMAT"] = "utcTime";
  DateFormat["UNIX_TIME_DATE_FORMAT"] = "unixTime";
  DateFormat["UTC_ISO_STRING_DATE_FORMAT"] = "utcISOString";
  return DateFormat;
}({});

/**
 * Converts date from being relative to GMT, to being relative to browser
 * timezone. E.g., Thu Jun 29 2017 00:00:00 GMT =>
 * Thu Jun 29 2017 00:00:00 GMT-0700 (PDT)
 * @param {Date} date UTC date
 * @returns {Date} date Local date
 */
function convertUTCToLocal(date) {
  const dateString = date.toUTCString();
  // Remove ` GMT` from the timestamp string
  const dateStringWithoutTimeZone = dateString.slice(0, -4);
  return new Date(dateStringWithoutTimeZone);
}
function getFormattedDate(date, format) {
  if (!date) {
    return '';
  }
  let utcDate;
  switch (format) {
    case DateFormat.ISO_STRING_DATE_FORMAT:
      return date.toISOString();
    case DateFormat.LOCALE_DATE_STRING_DATE_FORMAT:
      return date.toLocaleDateString();
    case DateFormat.UTC_TIME_DATE_FORMAT:
      return convertDateToUnixMidnightTime(date);
    case DateFormat.UTC_ISO_STRING_DATE_FORMAT:
      utcDate = new Date(convertDateToUnixMidnightTime(date));
      return utcDate.toISOString();
    default:
      return date.getTime();
  }
}
const localesWhereWeekStartsOnSunday = ['en-US', 'en-CA', 'jp-JP'];
class DatePicker extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isDateInputInvalid: false,
      showDateInputError: false
    });
    _defineProperty(this, "errorMessageID", uniqueId('errorMessage'));
    _defineProperty(this, "descriptionID", uniqueId('description'));
    _defineProperty(this, "onSelectHandler", (date = null) => {
      const {
        onChange,
        isAccessible
      } = this.props;
      const {
        isDateInputInvalid
      } = this.state;
      if (onChange) {
        const formattedDate = this.formatValue(date);
        onChange(date, formattedDate);
      }
      if (isAccessible) {
        if (this.dateInputEl && this.datePicker) {
          // Required because Pikaday instance is unbound
          // See https://github.com/Pikaday/Pikaday#usage
          this.dateInputEl.value = this.datePicker.toString();
        }
        if (this.datePicker && this.datePicker.isVisible()) {
          this.datePicker.hide();
          this.focusDatePicker();
        }
      }
      if (isDateInputInvalid) {
        this.setState({
          isDateInputInvalid: false,
          showDateInputError: false
        });
      }
    });
    _defineProperty(this, "datePicker", null);
    // Used to detect when a fallback is necessary when isAccessible is enabled
    _defineProperty(this, "canUseDateInputType", true);
    // Used to prevent bad sequences of hide/show when toggling the datepicker button
    _defineProperty(this, "shouldStayClosed", false);
    _defineProperty(this, "focusDatePicker", () => {
      // This also opens the date picker when isAccessible is disabled
      if (this.dateInputEl) {
        this.dateInputEl.focus();
      }
    });
    _defineProperty(this, "getDateInputError", () => {
      const {
        intl,
        maxDate = null,
        minDate = null
      } = this.props;
      const {
        showDateInputError
      } = this.state;
      const {
        formatMessage
      } = intl;
      if (!showDateInputError) return '';
      let dateInputError = '';
      const maxLocaleDate = getFormattedDate(maxDate, DateFormat.LOCALE_DATE_STRING_DATE_FORMAT);
      const minLocaleDate = getFormattedDate(minDate, DateFormat.LOCALE_DATE_STRING_DATE_FORMAT);
      if (maxLocaleDate && minLocaleDate) {
        dateInputError = formatMessage(messages.dateInputRangeError, {
          maxLocaleDate,
          minLocaleDate
        });
      } else if (maxLocaleDate) {
        dateInputError = formatMessage(messages.dateInputMaxError, {
          maxLocaleDate
        });
      } else if (minLocaleDate) {
        dateInputError = formatMessage(messages.dateInputMinError, {
          minLocaleDate
        });
      }
      return dateInputError;
    });
    _defineProperty(this, "handleInputKeyDown", event => {
      const {
        isKeyboardInputAllowed,
        isTextInputAllowed,
        isAccessible
      } = this.props;
      if (!isKeyboardInputAllowed && this.datePicker && this.datePicker.isVisible()) {
        event.stopPropagation();
      }

      // Stops up/down arrow & spacebar from moving page scroll position since pikaday does not preventDefault correctly
      if (!(isTextInputAllowed || isAccessible) && event.key !== TAB_KEY) {
        event.preventDefault();
      }
      if ((isTextInputAllowed || isAccessible && !this.canUseDateInputType) && event.key === ENTER_KEY) {
        event.preventDefault();
      }

      // Stops enter & spacebar from opening up the browser's default date picker
      if (isAccessible && (event.key === ENTER_KEY || event.key === ' ')) {
        event.preventDefault();
      }
      if (event.key === ENTER_KEY || event.key === ESCAPE_KEY || event.key === ' ') {
        // Since pikaday auto-selects when you move the select box, enter/space don't do anything but close the date picker
        if (this.datePicker && this.datePicker.isVisible()) {
          this.datePicker.hide();
        }
      }
    });
    _defineProperty(this, "handleOnChange", event => {
      const {
        isAccessible,
        maxDate,
        minDate,
        onChange
      } = this.props;
      const {
        isDateInputInvalid
      } = this.state;
      if (!isAccessible || !this.canUseDateInputType) {
        return;
      }
      if (this.datePicker && this.datePicker.isVisible()) {
        event.stopPropagation();
      }
      const {
        value
      } = event.target;
      if (this.datePicker && value) {
        const parsedDate = this.parseDisplayDateType(value);
        if (parsedDate) {
          if (minDate && parsedDate < minDate || maxDate && parsedDate > maxDate) {
            this.datePicker.setDate(null);
            this.setState({
              isDateInputInvalid: true
            });
            return;
          }
          // Reset the error styling on valid date input
          if (isDateInputInvalid) {
            this.setState({
              isDateInputInvalid: false,
              showDateInputError: false
            });
          }
        } else {
          this.setState({
            isDateInputInvalid: true
          });
        }

        // Set date so Pikaday date picker value stays in sync with input
        this.datePicker.setDate(parsedDate, true);
        if (onChange) {
          const formattedDate = this.formatValue(parsedDate);
          onChange(parsedDate, formattedDate);
        }
      } else if (isDateInputInvalid) {
        this.setState({
          isDateInputInvalid: false,
          showDateInputError: false
        });
      }
    });
    _defineProperty(this, "handleInputBlur", event => {
      const {
        isAccessible,
        isTextInputAllowed,
        onBlur
      } = this.props;
      const {
        isDateInputInvalid
      } = this.state;
      const nextActiveElement = event.relatedTarget || document.activeElement;

      // This is mostly here to cancel out the pikaday hide() on blur
      if (this.datePicker && this.datePicker.isVisible() && nextActiveElement && nextActiveElement === this.datePickerButtonEl) {
        this.shouldStayClosed = true;
        setTimeout(() => {
          this.shouldStayClosed = false;
        }, TOGGLE_DELAY_MS);
      }
      if (onBlur) {
        onBlur(event);
      }

      // Since we fire parent onChange event if isTextInputAllowed,
      // fire it on blur if the user typed a correct date format
      let inputDate = null;
      if (this.dateInputEl) {
        let dateInputElVal = null;
        if (isAccessible && !this.canUseDateInputType) {
          dateInputElVal = this.parseDisplayDateType(this.dateInputEl.value);
        }
        inputDate = new Date(dateInputElVal || this.dateInputEl.value);
      }
      if ((isTextInputAllowed || isAccessible && !this.canUseDateInputType) && inputDate && inputDate.getDate()) {
        this.onSelectHandler(inputDate);
      }
      if (isAccessible && isDateInputInvalid) this.setState({
        showDateInputError: true
      });
    });
    _defineProperty(this, "handleButtonClick", event => {
      event.preventDefault();
      event.stopPropagation();
      const {
        isAccessible,
        isDisabled
      } = this.props;
      if (isAccessible) {
        if (isDisabled || !this.datePicker) {
          return;
        }
        if (this.datePicker.isVisible()) {
          this.datePicker.hide();
          this.focusDatePicker();
        } else {
          this.datePicker.show();
        }
        return;
      }
      if (!this.shouldStayClosed) {
        this.focusDatePicker();
      }
    });
    _defineProperty(this, "handleOnClick", event => {
      const {
        isAccessible
      } = this.props;
      if (isAccessible) {
        // Suppress Firefox default behavior: clicking on input type "date"
        // opens the browser date picker.
        event.preventDefault();
        event.stopPropagation();
      }
    });
    _defineProperty(this, "formatDisplay", date => {
      const {
        displayFormat,
        intl
      } = this.props;
      return date ? intl.formatDate(date, displayFormat) : '';
    });
    _defineProperty(this, "formatDisplayDateType", date => {
      // Input type "date" only accepts the format YYYY-MM-DD
      return date ? getFormattedDate(date, DateFormat.UTC_ISO_STRING_DATE_FORMAT).slice(0, 10) : '';
    });
    _defineProperty(this, "parseDisplayDateType", dateString => {
      if (dateString && ISO_DATE_FORMAT_PATTERN.test(dateString)) {
        // Calling new Date('YYYY-MM-DD') without 'T00:00:00' yields undesired results:
        // E.g. new Date('2017-06-01') => May 31 2017
        // E.g. new Date('2017-06-01T00:00:00') => June 01 2017
        // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#parameters
        return new Date(`${dateString}T00:00:00`);
      }
      return null;
    });
    _defineProperty(this, "formatValue", date => {
      const {
        dateFormat
      } = this.props;
      return dateFormat ? getFormattedDate(date, dateFormat) : '';
    });
    _defineProperty(this, "clearDate", event => {
      // Prevents the date picker from opening after clearing
      event.preventDefault();
      const {
        isAccessible
      } = this.props;
      if (this.datePicker) {
        this.datePicker.setDate(null);
      }
      this.onSelectHandler(null);
      if (isAccessible) {
        this.focusDatePicker();
      }
    });
    /** Determines whether a new date input falls back to a text input or not */
    _defineProperty(this, "shouldUseAccessibleFallback", () => {
      const test = document.createElement('input');
      try {
        test.type = 'date';
      } catch (e) {
        // no-op
      }

      // If date input falls back to text input, show the fallback
      return test.type === 'text';
    });
    _defineProperty(this, "renderCalendarButton", () => {
      const {
        intl,
        isAccessible,
        isAlwaysVisible,
        isDisabled
      } = this.props;
      const {
        formatMessage
      } = intl;
      if (isAlwaysVisible) {
        return null;
      }

      // De-emphasizing the Pikaday date picker because it does not meet accessibility standards
      // Screenreaders & navigating via keyboard will no longer pick up on this element
      const accessibleAttrs = isAccessible ? {
        'aria-hidden': true,
        tabIndex: -1
      } : {};
      return /*#__PURE__*/React.createElement(PlainButton, _extends({
        "aria-label": formatMessage(messages.chooseDate),
        className: "date-picker-open-btn",
        getDOMRef: ref => {
          this.datePickerButtonEl = ref;
        },
        isDisabled: isDisabled,
        onClick: this.handleButtonClick,
        type: ButtonType.BUTTON
      }, accessibleAttrs), /*#__PURE__*/React.createElement(Calendar16, null));
    });
  }
  componentDidMount() {
    const {
      customInput,
      dateFormat,
      displayFormat,
      intl,
      isAccessible,
      isAlwaysVisible,
      isTextInputAllowed,
      maxDate,
      minDate,
      onChange,
      value,
      yearRange
    } = this.props;
    const {
      formatDate,
      formatMessage
    } = intl;
    const {
      nextMonth,
      previousMonth
    } = messages;
    let defaultValue = value;
    if (isAccessible && this.shouldUseAccessibleFallback()) {
      this.canUseDateInputType = false;
    }

    // When date format is utcTime, initial date needs to be converted from being relative to GMT to being
    // relative to browser timezone
    if (dateFormat === DateFormat.UTC_TIME_DATE_FORMAT && value) {
      defaultValue = convertUTCToLocal(value);
      if (onChange) {
        const formattedDate = this.formatValue(defaultValue);
        onChange(defaultValue, formattedDate);
      }
    }
    // Make sure the DST detection algorithm in browsers is up-to-date
    const year = new Date().getFullYear();
    const {
      timeZone
    } = displayFormat || {};
    const i18n = {
      previousMonth: formatMessage(previousMonth),
      nextMonth: formatMessage(nextMonth),
      months: range(12).map(month => formatDate(new Date(year, month, 15), {
        month: 'long',
        timeZone
      })),
      // weekdays must start with Sunday, so array of dates below is May 1st-8th, 2016
      weekdays: range(1, 8).map(date => formatDate(new Date(2016, 4, date), {
        weekday: 'long',
        timeZone
      })),
      weekdaysShort: range(1, 8).map(date => formatDate(new Date(2016, 4, date), {
        weekday: 'narrow',
        timeZone
      }))
    };

    // If "bound" is true (default), the DatePicker will be appended at the end of the document, with absolute positioning
    // If "bound" is false, the DatePicker will be appended to the DOM right after the input, with relative positioning
    const datePickerConfig = {
      bound: !customInput,
      blurFieldOnSelect: false,
      // Available in pikaday > 1.5.1
      setDefaultDate: true,
      defaultDate: defaultValue === null ? undefined : defaultValue,
      field: this.dateInputEl,
      firstDay: localesWhereWeekStartsOnSunday.includes(intl.locale) ? 0 : 1,
      maxDate,
      minDate,
      position: 'bottom left',
      i18n,
      showDaysInNextAndPreviousMonths: true,
      onSelect: this.onSelectHandler,
      yearRange,
      toString: this.formatDisplay
    };
    if (isAccessible) {
      if (this.canUseDateInputType) {
        delete datePickerConfig.field;
        datePickerConfig.trigger = this.dateInputEl;
        datePickerConfig.accessibleFieldEl = this.dateInputEl;
        datePickerConfig.datePickerButtonEl = this.datePickerButtonEl;
      }
      datePickerConfig.parse = this.parseDisplayDateType;
      datePickerConfig.toString = this.formatDisplayDateType;
      datePickerConfig.keyboardInput = false;
    }
    this.datePicker = new AccessiblePikaday(datePickerConfig);
    if (isTextInputAllowed) {
      this.updateDateInputValue(this.formatDisplay(defaultValue));
    }
    if (isAlwaysVisible) {
      this.datePicker.show();
      this.datePicker.hide = noop;
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.datePicker) return;
    const {
      value: nextValue = null,
      minDate: nextMinDate = null,
      maxDate: nextMaxDate = null
    } = nextProps;
    const {
      value,
      minDate,
      maxDate,
      isTextInputAllowed
    } = this.props;
    const selectedDate = this.datePicker && this.datePicker.getDate();

    // only set date when props change
    if (nextValue && !value || !nextValue && value || nextValue && value && nextValue.getTime() !== value.getTime()) {
      this.datePicker.setDate(nextValue);
    }
    // If text input is allowed the dateInputEl will act as an uncontrolled input and
    // we need to set formatted value manually.
    if (isTextInputAllowed) {
      this.updateDateInputValue(this.formatDisplay(nextValue));
    }
    if (nextMinDate && !minDate || nextMinDate && minDate || nextMinDate && minDate && nextMinDate.getTime() !== minDate.getTime()) {
      this.datePicker.setMinDate(nextMinDate);
      if (selectedDate && selectedDate < nextMinDate) {
        this.datePicker.gotoDate(nextMinDate);
      }
    }
    if (nextMaxDate && !maxDate || !nextMaxDate && maxDate || nextMaxDate && maxDate && nextMaxDate.getTime() !== maxDate.getTime()) {
      this.datePicker.setMaxDate(nextMaxDate);
      if (selectedDate && nextMaxDate && selectedDate > nextMaxDate) {
        this.datePicker.gotoDate(nextMaxDate);
      }
    }
  }
  componentWillUnmount() {
    if (this.datePicker) {
      this.datePicker.destroy();
    }
  }
  updateDateInputValue(value) {
    if (this.dateInputEl) {
      this.dateInputEl.value = value;
    }
  }
  render() {
    const {
      className,
      customInput,
      description,
      error,
      errorTooltipPosition,
      hideLabel,
      hideOptionalLabel,
      inputProps,
      intl,
      isAccessible,
      isClearable,
      isDisabled,
      isRequired,
      isTextInputAllowed,
      label,
      maxDate,
      minDate,
      name,
      onFocus,
      placeholder,
      resinTarget,
      value
    } = this.props;
    const {
      isDateInputInvalid
    } = this.state;
    const {
      formatMessage
    } = intl;
    const errorMessage = error || this.getDateInputError();
    const hasError = !!errorMessage || isDateInputInvalid;
    const hasValue = !!value || isDateInputInvalid;
    const classes = classNames(className, 'date-picker-wrapper', {
      'show-clear-btn': isClearable && hasValue && !isDisabled,
      'show-error': hasError
    });
    const ariaAttrs = {
      'aria-invalid': hasError,
      'aria-required': isRequired,
      'aria-errormessage': this.errorMessageID,
      'aria-describedby': description ? this.descriptionID : undefined
    };
    const resinTargetAttr = resinTarget ? {
      [RESIN_TAG_TARGET]: resinTarget
    } : {};
    let valueAttr;
    if (isAccessible) {
      valueAttr = {
        defaultValue: this.formatDisplayDateType(value)
      };
    } else if (isTextInputAllowed) {
      valueAttr = {
        defaultValue: this.formatDisplay(value)
      };
    } else {
      valueAttr = {
        value: this.formatDisplay(value)
      };
    }
    let onChangeAttr;
    if (isAccessible && this.canUseDateInputType) {
      onChangeAttr = {
        onChange: this.handleOnChange
      };
    } else if (isTextInputAllowed || isAccessible && !this.canUseDateInputType) {
      onChangeAttr = {};
    } else {
      // Fixes prop type error about read-only field
      // Not adding readOnly so constraint validation works
      onChangeAttr = {
        onChange: noop
      };
    }
    let additionalAttrs;
    if (isAccessible && this.canUseDateInputType) {
      additionalAttrs = {
        max: this.formatDisplayDateType(maxDate) || '9999-12-31',
        min: this.formatDisplayDateType(minDate) || '0001-01-01'
      };
    } else if (isAccessible && !this.canUseDateInputType) {
      // "name" prop is required for pattern validation to be surfaced on form submit. See components/form-elements/form/Form.js
      // "title" prop is shown during constraint validation as a description of the pattern
      // See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern#usability
      additionalAttrs = {
        name,
        pattern: ISO_DATE_FORMAT_PATTERN.source,
        title: 'YYYY-MM-DD'
      };
    } else {
      additionalAttrs = {};
    }
    return /*#__PURE__*/React.createElement("div", {
      className: classes
    }, /*#__PURE__*/React.createElement("span", {
      className: "date-picker-icon-holder"
    }, /*#__PURE__*/React.createElement(Label, {
      hideLabel: hideLabel,
      showOptionalText: !hideOptionalLabel && !isRequired,
      text: label
    }, /*#__PURE__*/React.createElement(React.Fragment, null, !!description && /*#__PURE__*/React.createElement("div", {
      id: this.descriptionID,
      className: "date-picker-description"
    }, description), /*#__PURE__*/React.createElement(Tooltip, {
      className: "date-picker-error-tooltip",
      isShown: !!errorMessage,
      position: errorTooltipPosition,
      text: errorMessage || '',
      theme: TooltipTheme.ERROR
    }, customInput ? (/*#__PURE__*/React.cloneElement(customInput, _objectSpread(_objectSpread({
      disabled: isDisabled,
      ref: ref => {
        this.dateInputEl = ref;
      },
      required: isRequired
    }, resinTargetAttr), ariaAttrs))) : /*#__PURE__*/React.createElement("input", _extends({
      ref: ref => {
        this.dateInputEl = ref;
      },
      className: "date-picker-input",
      disabled: isDisabled,
      onBlur: this.handleInputBlur,
      onClick: this.handleOnClick,
      placeholder: placeholder || formatMessage(messages.chooseDate),
      required: isRequired,
      type: isAccessible && this.canUseDateInputType ? 'date' : 'text'
    }, onChangeAttr, {
      onFocus: onFocus,
      onKeyDown: this.handleInputKeyDown
    }, resinTargetAttr, ariaAttrs, inputProps, valueAttr, additionalAttrs))), /*#__PURE__*/React.createElement("span", {
      id: this.errorMessageID,
      className: "accessibility-hidden",
      role: "alert"
    }, errorMessage))), isClearable && hasValue && !isDisabled ? /*#__PURE__*/React.createElement(PlainButton, {
      "aria-label": formatMessage(messages.dateClearButton),
      className: "date-picker-clear-btn",
      onClick: this.clearDate,
      type: ButtonType.BUTTON
    }, /*#__PURE__*/React.createElement(ClearBadge16, null)) : null, hasError ? /*#__PURE__*/React.createElement(AlertBadge16, {
      className: "date-picker-icon-alert",
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.iconAlertText)
    }) : null, this.renderCalendarButton(), /*#__PURE__*/React.createElement("input", {
      className: "date-picker-unix-time-input",
      name: name,
      readOnly: true,
      type: "hidden",
      value: value ? this.formatValue(value) : ''
    })));
  }
}
_defineProperty(DatePicker, "defaultProps", {
  className: '',
  dateFormat: DateFormat.UNIX_TIME_DATE_FORMAT,
  displayFormat: {},
  error: '',
  errorTooltipPosition: TooltipPosition.BOTTOM_LEFT,
  inputProps: {},
  isClearable: true,
  isKeyboardInputAllowed: false,
  isTextInputAllowed: false,
  yearRange: 10
});
export { DatePicker as DatePickerBase };
export default injectIntl(DatePicker);
//# sourceMappingURL=DatePicker.js.map