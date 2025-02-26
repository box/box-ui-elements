import * as React from 'react';
import { defineMessages, injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl';

import classNames from 'classnames';
import noop from 'lodash/noop';
import range from 'lodash/range';
import uniqueId from 'lodash/uniqueId';

// @ts-ignore flow import
import { RESIN_TAG_TARGET } from '../../common/variables';
import AlertBadge16 from '../../icon/fill/AlertBadge16';
import Calendar16 from '../../icon/fill/Calendar16';
import ClearBadge16 from '../../icon/fill/ClearBadge16';

import AccessiblePikaday, { AccessiblePikadayOptions } from './AccessiblePikaday';
import { ButtonType } from '../button';
import Label from '../label';
import PlainButton from '../plain-button';
import Tooltip, { TooltipPosition, TooltipTheme } from '../tooltip';

// @ts-ignore flow import
import { convertDateToUnixMidnightTime } from '../../utils/datetime';

import './DatePicker.scss';

const messages = defineMessages({
    previousMonth: {
        defaultMessage: 'Previous Month',
        description: 'Previous month button for a date picker calendar',
        id: 'boxui.base.previousMonth',
    },
    nextMonth: {
        defaultMessage: 'Next Month',
        description: 'Next month button for a date picker calendar',
        id: 'boxui.base.nextMonth',
    },
    iconAlertText: {
        defaultMessage: 'Invalid Date',
        description: 'Date entered is invalid',
        id: 'boxui.datePicker.iconAlertText',
    },
    dateClearButton: {
        defaultMessage: 'Clear Date',
        description: 'Button for clearing date picker',
        id: 'boxui.datePicker.dateClearButton',
    },
    chooseDate: {
        defaultMessage: 'Choose Date',
        description: 'Button for opening date picker',
        id: 'boxui.datePicker.chooseDate',
    },
    dateInputRangeError: {
        defaultMessage: 'Please enter a date between {minLocaleDate} and {maxLocaleDate}',
        description: 'Error message when date is out of the minimum and maximum range',
        id: 'boxui.datePicker.dateInputRangeError',
    },
    dateInputMaxError: {
        defaultMessage: 'Please enter a date before {maxLocaleDate}',
        description: 'Error message when date is later than the maximum date',
        id: 'boxui.datePicker.dateInputMaxError',
    },
    dateInputMinError: {
        defaultMessage: 'Please enter a date after {minLocaleDate}',
        description: 'Error message when date is earlier than the minimum date',
        id: 'boxui.datePicker.dateInputMinError',
    },
});

const TOGGLE_DELAY_MS = 300;
const ENTER_KEY = 'Enter';
const ESCAPE_KEY = 'Escape';
const TAB_KEY = 'Tab';

const ISO_DATE_FORMAT_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

export enum DateFormat {
    ISO_STRING_DATE_FORMAT = 'isoString',
    LOCALE_DATE_STRING_DATE_FORMAT = 'localeDateString',
    UTC_TIME_DATE_FORMAT = 'utcTime',
    UNIX_TIME_DATE_FORMAT = 'unixTime',
    UTC_ISO_STRING_DATE_FORMAT = 'utcISOString',
}

/**
 * Converts date from being relative to GMT, to being relative to browser
 * timezone. E.g., Thu Jun 29 2017 00:00:00 GMT =>
 * Thu Jun 29 2017 00:00:00 GMT-0700 (PDT)
 * @param {Date} date UTC date
 * @returns {Date} date Local date
 */
function convertUTCToLocal(date: Date) {
    const dateString = date.toUTCString();
    // Remove ` GMT` from the timestamp string
    const dateStringWithoutTimeZone = dateString.slice(0, -4);
    return new Date(dateStringWithoutTimeZone);
}

function getFormattedDate(date: Date | null, format: DateFormat) {
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

export interface DatePickerProps extends WrappedComponentProps {
    /** Add a css class to the component */
    className?: string;
    /** Custom input field */
    customInput?: React.ReactElement;
    /** The format of the date value for form submit */
    dateFormat?: DateFormat;
    /** Some optional description */
    description?: React.ReactNode;
    /**
     * The format of the date displayed in the input field
     * @deprecated, will no longer be supported with accessible mode enabled (isAccessible = true)
     */
    displayFormat?: {
        [key: string]: string;
    };
    /** Error message */
    error?: React.ReactNode;
    /** Position of error message tooltip */
    errorTooltipPosition?: TooltipPosition;
    /** Whether to show or hide the field's label */
    hideLabel?: boolean;
    /** Whether show or hide the 'Optional' label */
    hideOptionalLabel?: boolean;
    /** Props that will be applied on the input element */
    inputProps?: Object;
    /** Does the date input meet accessibility standards */
    isAccessible?: boolean;
    /** Is the calendar always visible */
    isAlwaysVisible?: boolean;
    /** Is input clearable */
    isClearable?: boolean;
    /** Is input disabled */
    isDisabled?: boolean;
    /** Is input required */
    isRequired?: boolean;
    /** Enables pikaday's default keyboard input support */
    isKeyboardInputAllowed?: boolean;
    /** Is user allowed to manually input a value (WARNING: this doesn't work with internationalization) */
    isTextInputAllowed?: boolean;
    /** Label displayed for the text input */
    label: React.ReactNode;
    /** The maximum date allowed to be selected */
    maxDate?: Date;
    /** The minimum date allowed to be selected */
    minDate?: Date;
    /** Name of the text input */
    name?: string;
    /** Called when input loses focus */
    onBlur?: ((event: React.FocusEvent<HTMLInputElement>) => void) | undefined;
    /** Called when input is changed, passed the selected Date */
    onChange?: Function;
    /** Called when input receives focus */
    onFocus?: ((event: React.FocusEvent<HTMLInputElement>) => void) | undefined;
    /** Placeholder for the text input */
    placeholder?: string;
    /** Resin tag */
    resinTarget?: string;
    /** Date to set the input */
    value?: Date | null;
    /** Number of years, or an array containing an upper and lower range */
    yearRange?: number | Array<number>;
}

interface DatePickerState {
    /** Is the date input invalid */
    isDateInputInvalid: boolean;
    /** Shows error message tooltip for invalid date input */
    showDateInputError: boolean;
}

class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
    static defaultProps = {
        className: '',
        dateFormat: DateFormat.UNIX_TIME_DATE_FORMAT,
        displayFormat: {},
        error: '',
        errorTooltipPosition: TooltipPosition.BOTTOM_LEFT,
        inputProps: {},
        isClearable: true,
        isKeyboardInputAllowed: false,
        isTextInputAllowed: false,
        yearRange: 10,
    };

    state = {
        isDateInputInvalid: false,
        showDateInputError: false,
    };

    errorMessageID = uniqueId('errorMessage');

    descriptionID = uniqueId('description');

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
            yearRange,
        } = this.props;
        const { formatDate, formatMessage } = intl;
        const { nextMonth, previousMonth } = messages;
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
        const { timeZone } = displayFormat || {};
        const i18n = {
            previousMonth: formatMessage(previousMonth),
            nextMonth: formatMessage(nextMonth),
            months: range(12).map(month =>
                formatDate(new Date(year, month, 15), {
                    month: 'long',
                    timeZone,
                }),
            ),
            // weekdays must start with Sunday, so array of dates below is May 1st-8th, 2016
            weekdays: range(1, 8).map(date =>
                formatDate(new Date(2016, 4, date), {
                    weekday: 'long',
                    timeZone,
                }),
            ),
            weekdaysShort: range(1, 8).map(date =>
                formatDate(new Date(2016, 4, date), {
                    weekday: 'narrow',
                    timeZone,
                }),
            ),
        };

        // If "bound" is true (default), the DatePicker will be appended at the end of the document, with absolute positioning
        // If "bound" is false, the DatePicker will be appended to the DOM right after the input, with relative positioning
        const datePickerConfig: AccessiblePikadayOptions = {
            bound: !customInput,
            blurFieldOnSelect: false, // Available in pikaday > 1.5.1
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
            toString: this.formatDisplay,
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
    UNSAFE_componentWillReceiveProps(nextProps: DatePickerProps) {
        if (!this.datePicker) return;

        const { value: nextValue = null, minDate: nextMinDate = null, maxDate: nextMaxDate = null } = nextProps;
        const { value, minDate, maxDate, isTextInputAllowed } = this.props;
        const selectedDate = this.datePicker && this.datePicker.getDate();

        // only set date when props change
        if (
            (nextValue && !value) ||
            (!nextValue && value) ||
            (nextValue && value && nextValue.getTime() !== value.getTime())
        ) {
            this.datePicker.setDate(nextValue);
        }
        // If text input is allowed the dateInputEl will act as an uncontrolled input and
        // we need to set formatted value manually.
        if (isTextInputAllowed) {
            this.updateDateInputValue(this.formatDisplay(nextValue));
        }
        if (
            (nextMinDate && !minDate) ||
            (nextMinDate && minDate) ||
            (nextMinDate && minDate && nextMinDate.getTime() !== minDate.getTime())
        ) {
            this.datePicker.setMinDate(nextMinDate);

            if (selectedDate && selectedDate < nextMinDate) {
                this.datePicker.gotoDate(nextMinDate);
            }
        }
        if (
            (nextMaxDate && !maxDate) ||
            (!nextMaxDate && maxDate) ||
            (nextMaxDate && maxDate && nextMaxDate.getTime() !== maxDate.getTime())
        ) {
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

    onSelectHandler = (date: Date | null = null) => {
        const { onChange, isAccessible } = this.props;
        const { isDateInputInvalid } = this.state;

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
            this.setState({ isDateInputInvalid: false, showDateInputError: false });
        }
    };

    updateDateInputValue(value: string) {
        if (this.dateInputEl) {
            this.dateInputEl.value = value;
        }
    }

    dateInputEl: HTMLInputElement | null | undefined;

    datePicker: Pikaday | null = null;

    datePickerButtonEl: HTMLButtonElement | HTMLDivElement | null | undefined;

    // Used to detect when a fallback is necessary when isAccessible is enabled
    canUseDateInputType = true;

    // Used to prevent bad sequences of hide/show when toggling the datepicker button
    shouldStayClosed = false;

    focusDatePicker = () => {
        // This also opens the date picker when isAccessible is disabled
        if (this.dateInputEl) {
            this.dateInputEl.focus();
        }
    };

    getDateInputError = () => {
        const { intl, maxDate = null, minDate = null } = this.props;
        const { showDateInputError } = this.state;
        const { formatMessage } = intl;

        if (!showDateInputError) return '';

        let dateInputError = '';
        const maxLocaleDate = getFormattedDate(maxDate, DateFormat.LOCALE_DATE_STRING_DATE_FORMAT);
        const minLocaleDate = getFormattedDate(minDate, DateFormat.LOCALE_DATE_STRING_DATE_FORMAT);

        if (maxLocaleDate && minLocaleDate) {
            dateInputError = formatMessage(messages.dateInputRangeError, { maxLocaleDate, minLocaleDate });
        } else if (maxLocaleDate) {
            dateInputError = formatMessage(messages.dateInputMaxError, { maxLocaleDate });
        } else if (minLocaleDate) {
            dateInputError = formatMessage(messages.dateInputMinError, { minLocaleDate });
        }

        return dateInputError;
    };

    handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const { isKeyboardInputAllowed, isTextInputAllowed, isAccessible } = this.props;

        if (!isKeyboardInputAllowed && this.datePicker && this.datePicker.isVisible()) {
            event.stopPropagation();
        }

        // Stops up/down arrow & spacebar from moving page scroll position since pikaday does not preventDefault correctly
        if (!(isTextInputAllowed || isAccessible) && event.key !== TAB_KEY) {
            event.preventDefault();
        }

        if ((isTextInputAllowed || (isAccessible && !this.canUseDateInputType)) && event.key === ENTER_KEY) {
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
    };

    handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { isAccessible, maxDate, minDate, onChange } = this.props;
        const { isDateInputInvalid } = this.state;

        if (!isAccessible || !this.canUseDateInputType) {
            return;
        }

        if (this.datePicker && this.datePicker.isVisible()) {
            event.stopPropagation();
        }

        const { value } = event.target;
        if (this.datePicker && value) {
            const parsedDate = this.parseDisplayDateType(value);

            if (parsedDate) {
                if ((minDate && parsedDate < minDate) || (maxDate && parsedDate > maxDate)) {
                    this.datePicker.setDate(null);
                    this.setState({ isDateInputInvalid: true });
                    return;
                }
                // Reset the error styling on valid date input
                if (isDateInputInvalid) {
                    this.setState({ isDateInputInvalid: false, showDateInputError: false });
                }
            } else {
                this.setState({ isDateInputInvalid: true });
            }

            // Set date so Pikaday date picker value stays in sync with input
            this.datePicker.setDate(parsedDate, true);

            if (onChange) {
                const formattedDate = this.formatValue(parsedDate);
                onChange(parsedDate, formattedDate);
            }
        } else if (isDateInputInvalid) {
            this.setState({ isDateInputInvalid: false, showDateInputError: false });
        }
    };

    handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const { isAccessible, isTextInputAllowed, onBlur } = this.props;
        const { isDateInputInvalid } = this.state;
        const nextActiveElement = event.relatedTarget || document.activeElement;

        // This is mostly here to cancel out the pikaday hide() on blur
        if (
            this.datePicker &&
            this.datePicker.isVisible() &&
            nextActiveElement &&
            nextActiveElement === this.datePickerButtonEl
        ) {
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
        let inputDate: Date | null | undefined = null;

        if (this.dateInputEl) {
            let dateInputElVal = null;
            if (isAccessible && !this.canUseDateInputType) {
                dateInputElVal = this.parseDisplayDateType(this.dateInputEl.value);
            }
            inputDate = new Date(dateInputElVal || this.dateInputEl.value);
        }

        if ((isTextInputAllowed || (isAccessible && !this.canUseDateInputType)) && inputDate && inputDate.getDate()) {
            this.onSelectHandler(inputDate);
        }

        if (isAccessible && isDateInputInvalid) this.setState({ showDateInputError: true });
    };

    handleButtonClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const { isAccessible, isDisabled } = this.props;

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
    };

    handleOnClick = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const { isAccessible } = this.props;

        if (isAccessible) {
            // Suppress Firefox default behavior: clicking on input type "date"
            // opens the browser date picker.
            event.preventDefault();
            event.stopPropagation();
        }
    };

    formatDisplay = (date?: Date | null): string => {
        const { displayFormat, intl } = this.props;
        return date ? intl.formatDate(date, displayFormat) : '';
    };

    formatDisplayDateType = (date?: Date | null): string => {
        // Input type "date" only accepts the format YYYY-MM-DD
        return date ? getFormattedDate(date, DateFormat.UTC_ISO_STRING_DATE_FORMAT).slice(0, 10) : '';
    };

    parseDisplayDateType = (dateString?: string | null): Date | null => {
        if (dateString && ISO_DATE_FORMAT_PATTERN.test(dateString)) {
            // Calling new Date('YYYY-MM-DD') without 'T00:00:00' yields undesired results:
            // E.g. new Date('2017-06-01') => May 31 2017
            // E.g. new Date('2017-06-01T00:00:00') => June 01 2017
            // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#parameters
            return new Date(`${dateString}T00:00:00`);
        }
        return null;
    };

    formatValue = (date: Date | null): string | number => {
        const { dateFormat } = this.props;
        return dateFormat ? getFormattedDate(date, dateFormat) : '';
    };

    clearDate = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        // Prevents the date picker from opening after clearing
        event.preventDefault();
        const { isAccessible } = this.props;

        if (this.datePicker) {
            this.datePicker.setDate(null);
        }
        this.onSelectHandler(null);

        if (isAccessible) {
            this.focusDatePicker();
        }
    };

    /** Determines whether a new date input falls back to a text input or not */
    shouldUseAccessibleFallback = (): boolean => {
        const test = document.createElement('input');

        try {
            test.type = 'date';
        } catch (e) {
            // no-op
        }

        // If date input falls back to text input, show the fallback
        return test.type === 'text';
    };

    renderCalendarButton = () => {
        const { intl, isAccessible, isAlwaysVisible, isDisabled } = this.props;
        const { formatMessage } = intl;

        if (isAlwaysVisible) {
            return null;
        }

        // De-emphasizing the Pikaday date picker because it does not meet accessibility standards
        // Screenreaders & navigating via keyboard will no longer pick up on this element
        const accessibleAttrs = isAccessible ? { 'aria-hidden': true, tabIndex: -1 } : {};

        return (
            <PlainButton
                aria-label={formatMessage(messages.chooseDate)}
                className="date-picker-open-btn"
                getDOMRef={ref => {
                    this.datePickerButtonEl = ref;
                }}
                isDisabled={isDisabled}
                onClick={this.handleButtonClick}
                type={ButtonType.BUTTON}
                {...accessibleAttrs}
            >
                <Calendar16 />
            </PlainButton>
        );
    };

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
            value,
        } = this.props;
        const { isDateInputInvalid } = this.state;
        const { formatMessage } = intl;

        const errorMessage = error || this.getDateInputError();
        const hasError = !!errorMessage || isDateInputInvalid;
        const hasValue = !!value || isDateInputInvalid;

        const classes = classNames(className, 'date-picker-wrapper', {
            'show-clear-btn': isClearable && hasValue && !isDisabled,
            'show-error': hasError,
        });

        const ariaAttrs = {
            'aria-invalid': hasError,
            'aria-required': isRequired,
            'aria-errormessage': this.errorMessageID,
            'aria-describedby': description ? this.descriptionID : undefined,
        };

        const resinTargetAttr = resinTarget ? { [RESIN_TAG_TARGET]: resinTarget } : {};

        let valueAttr;
        if (isAccessible) {
            valueAttr = { defaultValue: this.formatDisplayDateType(value) };
        } else if (isTextInputAllowed) {
            valueAttr = { defaultValue: this.formatDisplay(value) };
        } else {
            valueAttr = { value: this.formatDisplay(value) };
        }

        let onChangeAttr;
        if (isAccessible && this.canUseDateInputType) {
            onChangeAttr = { onChange: this.handleOnChange };
        } else if (isTextInputAllowed || (isAccessible && !this.canUseDateInputType)) {
            onChangeAttr = {};
        } else {
            // Fixes prop type error about read-only field
            // Not adding readOnly so constraint validation works
            onChangeAttr = { onChange: noop };
        }

        let additionalAttrs;
        if (isAccessible && this.canUseDateInputType) {
            additionalAttrs = {
                max: this.formatDisplayDateType(maxDate) || '9999-12-31',
                min: this.formatDisplayDateType(minDate) || '0001-01-01',
            };
        } else if (isAccessible && !this.canUseDateInputType) {
            // "name" prop is required for pattern validation to be surfaced on form submit. See components/form-elements/form/Form.js
            // "title" prop is shown during constraint validation as a description of the pattern
            // See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern#usability
            additionalAttrs = { name, pattern: ISO_DATE_FORMAT_PATTERN.source, title: 'YYYY-MM-DD' };
        } else {
            additionalAttrs = {};
        }

        return (
            <div className={classes}>
                <span className="date-picker-icon-holder">
                    <Label hideLabel={hideLabel} showOptionalText={!hideOptionalLabel && !isRequired} text={label}>
                        <>
                            {!!description && (
                                <div id={this.descriptionID} className="date-picker-description">
                                    {description}
                                </div>
                            )}
                            <Tooltip
                                className="date-picker-error-tooltip"
                                isShown={!!errorMessage}
                                position={errorTooltipPosition}
                                text={errorMessage || ''}
                                theme={TooltipTheme.ERROR}
                            >
                                {customInput ? (
                                    React.cloneElement(customInput, {
                                        disabled: isDisabled,
                                        ref: (ref: HTMLInputElement) => {
                                            this.dateInputEl = ref;
                                        },
                                        required: isRequired,
                                        ...resinTargetAttr,
                                        ...ariaAttrs,
                                    } as React.HTMLAttributes<HTMLInputElement>)
                                ) : (
                                    <input
                                        ref={ref => {
                                            this.dateInputEl = ref;
                                        }}
                                        className="date-picker-input"
                                        disabled={isDisabled}
                                        onBlur={this.handleInputBlur}
                                        onClick={this.handleOnClick}
                                        placeholder={placeholder || formatMessage(messages.chooseDate)}
                                        required={isRequired}
                                        type={isAccessible && this.canUseDateInputType ? 'date' : 'text'}
                                        {...onChangeAttr}
                                        onFocus={onFocus}
                                        onKeyDown={this.handleInputKeyDown}
                                        {...resinTargetAttr}
                                        {...ariaAttrs}
                                        {...inputProps}
                                        {...valueAttr}
                                        {...additionalAttrs}
                                    />
                                )}
                            </Tooltip>
                            <span id={this.errorMessageID} className="accessibility-hidden" role="alert">
                                {errorMessage}
                            </span>
                        </>
                    </Label>
                    {isClearable && hasValue && !isDisabled ? (
                        <PlainButton
                            aria-label={formatMessage(messages.dateClearButton)}
                            className="date-picker-clear-btn"
                            onClick={this.clearDate}
                            type={ButtonType.BUTTON}
                        >
                            <ClearBadge16 />
                        </PlainButton>
                    ) : null}
                    {hasError ? (
                        <AlertBadge16
                            className="date-picker-icon-alert"
                            title={<FormattedMessage {...messages.iconAlertText} />}
                        />
                    ) : null}
                    {this.renderCalendarButton()}
                    <input
                        className="date-picker-unix-time-input"
                        name={name}
                        readOnly
                        type="hidden"
                        value={value ? this.formatValue(value) : ''}
                    />
                </span>
            </div>
        );
    }
}

export { DatePicker as DatePickerBase };
export default injectIntl(DatePicker);
