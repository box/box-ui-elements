import * as React from 'react';
import { defineMessages, injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl';

import classNames from 'classnames';
import Pikaday, { PikadayOptions } from 'pikaday';
import noop from 'lodash/noop';
import range from 'lodash/range';
import uniqueId from 'lodash/uniqueId';

// @ts-ignore flow import
import { RESIN_TAG_TARGET } from '../../common/variables';
import IconAlert from '../../icons/general/IconAlert';
import IconCalendar from '../../icons/general/IconCalendar';
import IconClear from '../../icons/general/IconClear';

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
});

const TOGGLE_DELAY_MS = 300;
const ENTER_KEY = 'Enter';
const ESCAPE_KEY = 'Escape';
const TAB_KEY = 'Tab';

export enum DateFormat {
    ISO_STRING_DATE_FORMAT = 'isoString',
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
    /** The format of the date displayed in the input field */
    displayFormat?: Object;
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
    /** isTextInputAllowedWithDateType */
    isTextInputAllowedWithDateType?: boolean;
    /** Date to set the input */
    value?: Date | null;
    /** Number of years, or an array containing an upper and lower range */
    yearRange?: number | Array<number>;
}

class DatePicker extends React.Component<DatePickerProps> {
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

    errorMessageID = uniqueId('errorMessage');

    descriptionID = uniqueId('description');

    componentDidMount() {
        const {
            customInput,
            dateFormat,
            intl,
            isAlwaysVisible,
            isTextInputAllowed,
            maxDate,
            minDate,
            isTextInputAllowedWithDateType,
            value,
            yearRange,
        } = this.props;
        const { formatDate, formatMessage } = intl;
        const { nextMonth, previousMonth } = messages;
        let defaultValue = value;

        if (isTextInputAllowedWithDateType) {
            // test whether a new date input falls back to a text input or not
            const test = document.createElement('input');

            try {
                test.type = 'date';
            } catch (e) {
                // no-op
            }

            if (test.type === 'text') {
                // if date input falls back to text input, show the fallback
                this.canUseDateInputType = false;
            }
        }

        // When date format is utcTime, initial date needs to be converted from being relative to GMT to being
        // relative to browser timezone
        if (dateFormat === DateFormat.UTC_TIME_DATE_FORMAT && value) {
            defaultValue = convertUTCToLocal(value);
        }
        // Make sure the DST detection algorithm in browsers is up-to-date
        const year = new Date().getFullYear();

        const i18n = {
            previousMonth: formatMessage(previousMonth),
            nextMonth: formatMessage(nextMonth),
            months: range(12).map(month => formatDate(new Date(year, month, 15), { month: 'long' })),
            // weekdays must start with Sunday, so array of dates below is May 1st-8th, 2016
            weekdays: range(1, 8).map(date => formatDate(new Date(2016, 4, date), { weekday: 'long' })),
            weekdaysShort: range(1, 8).map(date => formatDate(new Date(2016, 4, date), { weekday: 'narrow' })),
        };

        // If "bound" is true (default), the DatePicker will be appended at the end of the document, with absolute positioning
        // If "bound" is false, the DatePicker will be appended to the DOM right after the input, with relative positioning
        const datePickerConfig: PikadayOptions = {
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
        if (isTextInputAllowedWithDateType && this.canUseDateInputType) {
            delete datePickerConfig.field;
            datePickerConfig.keyboardInput = false; // TODO: Re-check if this config is necessary
            datePickerConfig.parse = this.parseDisplayDateType; // TODO: Re-check if this config is necessary
            datePickerConfig.toString = this.formatDisplayDateType;
            datePickerConfig.trigger = this.dateInputEl; // TODO: Re-check if this config is necessary
        }
        this.datePicker = new Pikaday(datePickerConfig);

        if (isTextInputAllowedWithDateType && this.canUseDateInputType) {
            if (this.dateInputEl && this.dateInputEl.parentNode) {
                this.datePicker.hide();
                this.dateInputEl.parentNode.insertBefore(this.datePicker.el, this.dateInputEl.nextSibling);
            }
        }

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
        const { onChange, isTextInputAllowedWithDateType } = this.props;
        if (onChange) {
            const formattedDate = this.formatValue(date); // TODO: need a formatValue equivalent of formatDisplayDateType
            onChange(date, formattedDate);
        }

        if (isTextInputAllowedWithDateType && this.canUseDateInputType && this.dateInputEl && this.datePicker) {
            this.dateInputEl.value = this.datePicker.toString();
        }
    };

    updateDateInputValue(value: string) {
        if (this.dateInputEl) {
            this.dateInputEl.value = value;
        }
    }

    dateInputEl: HTMLInputElement | null | undefined;

    datePicker: Pikaday | null = null;

    datePickerButtonEl: HTMLButtonElement | null | undefined;

    // Used to detect when a fallback is necessary when isTextInputAllowedWithDateType is enabled
    canUseDateInputType = true;

    // Used to prevent bad sequences of hide/show when toggling the datepicker button
    shouldStayClosed = false;

    focusDatePicker = () => {
        // By default, this will open the datepicker too
        if (this.dateInputEl) {
            this.dateInputEl.focus();
        }
    };

    handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const { isKeyboardInputAllowed, isTextInputAllowed, isTextInputAllowedWithDateType } = this.props;

        if (isTextInputAllowedWithDateType && !this.canUseDateInputType) {
            return;
        }

        if (!isKeyboardInputAllowed && this.datePicker && this.datePicker.isVisible()) {
            event.stopPropagation();
        }

        // Stops up/down arrow & spacebar from moving page scroll position since pikaday does not preventDefault correctly
        if (!(isTextInputAllowed || isTextInputAllowedWithDateType) && event.key !== TAB_KEY) {
            event.preventDefault();
        }

        if (isTextInputAllowed && event.key === ENTER_KEY) {
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
        const { isTextInputAllowedWithDateType } = this.props;
        if (isTextInputAllowedWithDateType && this.canUseDateInputType) {
            if (this.datePicker && this.datePicker.isVisible()) {
                event.stopPropagation();
            }

            if (this.datePicker && event.target.value) {
                this.datePicker.setDate(this.parseDisplayDateType(event.target.value), true);
            }
        }
    };

    handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const { onBlur, isTextInputAllowed } = this.props;

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

        // Since we Fire parent onChange event if isTextInputAllowed
        // fire it on blur if the user typed a correct date format
        let inputDate: Date | null | undefined = null;

        if (this.dateInputEl) {
            inputDate = new Date(this.dateInputEl.value);
        }

        if (isTextInputAllowed && inputDate && inputDate.getDate()) {
            this.onSelectHandler(inputDate);
        }
    };

    handleButtonClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        const { isTextInputAllowedWithDateType } = this.props;
        event.preventDefault();
        event.stopPropagation();

        if (isTextInputAllowedWithDateType && this.canUseDateInputType) {
            if (this.datePicker && this.datePicker.isVisible()) {
                this.datePicker.hide();
            } else if (this.datePicker) {
                this.datePicker.show();
            }
        } else if (!this.shouldStayClosed) {
            // TODO: Determine correct isTextInputAllowedWithDateType behavior for shouldStayClosed
            this.focusDatePicker();
        }
    };

    formatDisplay = (date?: Date | null): string => {
        const { displayFormat, intl } = this.props;
        return date ? intl.formatDate(date, displayFormat) : '';
    };

    formatDisplayDateType = (date?: Date | null): string => {
        return date ? date.toISOString().slice(0, 10) : '';
    };

    parseDisplayDateType = (dateString?: string | null): Date | null => {
        if (dateString) {
            const parts = dateString.split('-');
            const day = parseInt(parts[2], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[0], 10);
            return new Date(year, month, day);
        }
        return null;
    };

    formatValue = (date: Date | null): string | number => {
        const { dateFormat } = this.props;
        return dateFormat ? getFormattedDate(date, dateFormat) : '';
    };

    clearDate = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault(); // so datepicker doesn't open after clearing
        if (this.datePicker) {
            this.datePicker.setDate(null);
        }
        this.onSelectHandler(null);
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
            isAlwaysVisible,
            isClearable,
            isDisabled,
            isRequired,
            isTextInputAllowed,
            isTextInputAllowedWithDateType,
            label,
            name,
            onFocus,
            placeholder,
            resinTarget,
            value,
        } = this.props;

        const { formatMessage } = intl;
        const classes = classNames(className, 'date-picker-wrapper', {
            'show-clear-btn': !!value,
            'show-error': !!error,
        });

        const hasError = !!error;

        const ariaAttrs = {
            'aria-invalid': hasError,
            'aria-required': isRequired,
            'aria-errormessage': this.errorMessageID,
            'aria-describedby': description ? this.descriptionID : undefined,
        };

        const resinTargetAttr = resinTarget ? { [RESIN_TAG_TARGET]: resinTarget } : {};

        let valueAttr;
        if (isTextInputAllowedWithDateType && this.canUseDateInputType) {
            valueAttr = { defaultValue: this.formatDisplayDateType(value) };
        } else if (isTextInputAllowed) {
            valueAttr = { defaultValue: this.formatDisplay(value) };
        } else {
            valueAttr = { value: this.formatDisplay(value) };
        }

        let onChangeAttr;
        if (isTextInputAllowedWithDateType && this.canUseDateInputType) {
            onChangeAttr = { onChange: this.handleOnChange };
        } else if (isTextInputAllowed) {
            onChangeAttr = {};
        } else {
            onChangeAttr = { onChange: noop };
        }
        /* fixes proptype error about readonly field (not adding readonly so constraint validation works) */

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
                                isShown={!!error}
                                position={errorTooltipPosition}
                                text={error || ''}
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
                                    })
                                ) : (
                                    <input
                                        ref={ref => {
                                            this.dateInputEl = ref;
                                        }}
                                        className="date-picker-input"
                                        disabled={isDisabled}
                                        onBlur={this.handleInputBlur}
                                        placeholder={placeholder || formatMessage(messages.chooseDate)}
                                        required={isRequired}
                                        type={isTextInputAllowedWithDateType ? 'date' : 'text'}
                                        {...onChangeAttr}
                                        onFocus={onFocus}
                                        onKeyDown={this.handleInputKeyDown}
                                        {...resinTargetAttr}
                                        {...ariaAttrs}
                                        {...inputProps}
                                        {...valueAttr}
                                    />
                                )}
                            </Tooltip>
                            <span id={this.errorMessageID} className="accessibility-hidden" role="alert">
                                {error}
                            </span>
                        </>
                    </Label>
                    {isClearable && !!value && !isDisabled ? (
                        <PlainButton
                            aria-label={formatMessage(messages.dateClearButton)}
                            className="date-picker-clear-btn"
                            onClick={this.clearDate}
                            type={ButtonType.BUTTON}
                        >
                            <IconClear height={12} width={12} />
                        </PlainButton>
                    ) : null}
                    {error ? (
                        <IconAlert
                            className="date-picker-icon-alert"
                            height={13}
                            title={<FormattedMessage {...messages.iconAlertText} />}
                            width={13}
                        />
                    ) : null}
                    {!isAlwaysVisible && (
                        <PlainButton
                            aria-label={formatMessage(messages.chooseDate)}
                            className="date-picker-open-btn"
                            getDOMRef={ref => {
                                this.datePickerButtonEl = ref;
                            }}
                            isDisabled={isDisabled}
                            onClick={this.handleButtonClick}
                            type={ButtonType.BUTTON}
                        >
                            <IconCalendar height={17} width={16} />
                        </PlainButton>
                    )}
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
