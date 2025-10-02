import * as React from 'react';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { TooltipPosition } from '../tooltip';
import { parseTimeFromString } from './TimeInputUtils';
// @ts-ignore flow import
import TextInput from '../text-input';
import ClockBadge16 from '../../icon/line/ClockBadge16';
// @ts-ignore flow import
import { DEFAULT_FORMAT_DEBOUNCE } from '../../constants';
import './TimeInput.scss';
const messages = defineMessages({
  invalidTimeError: {
    "id": "boxui.timeInput.invalidTimeError",
    "defaultMessage": "Invalid time format. Enter a time in the format HH:MM A."
  },
  emptyTimeError: {
    "id": "boxui.timeInput.emptyTimeError",
    "defaultMessage": "Required field. Enter a time in the format HH:MM A."
  }
});
const TimeInput = ({
  className,
  errorTooltipPosition = TooltipPosition.MIDDLE_RIGHT,
  hideLabel = true,
  initialDate,
  innerRef,
  intl,
  isRequired = true,
  label,
  onBlur,
  onChange,
  onError
}) => {
  const [displayTime, setDisplayTime] = React.useState(initialDate ? intl.formatTime(initialDate) : '');
  const [error, setError] = React.useState(undefined);

  /**
   * Handle blur events.
   * Parse and reformat the current display time (as entered by the user).
   * @param latestValue - string
   * @returns
   */
  const formatDisplayTime = (latestValue = displayTime) => {
    try {
      const {
        hours: parsedHours,
        minutes: parsedMinutes
      } = parseTimeFromString(latestValue, isRequired);
      const date = new Date();
      date.setHours(parsedHours);
      date.setMinutes(parsedMinutes);
      const newDisplayTime = intl.formatTime(date);
      setDisplayTime(newDisplayTime);
      if (onBlur) onBlur({
        displayTime: newDisplayTime,
        hours: parsedHours,
        minutes: parsedMinutes
      });
      if (onChange) onChange({
        displayTime: newDisplayTime,
        hours: parsedHours,
        minutes: parsedMinutes
      });
    } catch (e) {
      const errorMessage = latestValue ? messages.invalidTimeError : messages.emptyTimeError;
      const updatedError = /*#__PURE__*/React.createElement(FormattedMessage, errorMessage);
      setError(updatedError);
      if (onError) onError(updatedError);
    }
  };

  /**
   * Debounce formatDisplayTime() for use in handleChange().
   * useCallback() memoizes the debounced function, so that the debounced function
   * is not recreated on every re-render triggered by handleChange().
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFormatDisplayTime = React.useCallback(debounce(latestValue => formatDisplayTime(latestValue), DEFAULT_FORMAT_DEBOUNCE), []);

  /**
   * Handle change events.
   * Clear errors, update the value of the display time to match what the user typed,
   * and call the debounced version of formatDisplayTime().
   * @param event - ChangeEvent
   */
  const handleChange = event => {
    const {
      target: {
        value: updatedValue
      }
    } = event;
    setDisplayTime(updatedValue);
    if (error) setError(undefined);
    debouncedFormatDisplayTime(updatedValue);
  };

  /**
   * Handle blur events.
   */
  const handleBlur = () => {
    formatDisplayTime(displayTime);
  };
  return /*#__PURE__*/React.createElement(TextInput, {
    className: classnames('bdl-TimeInput', className),
    error: error,
    hideLabel: hideLabel,
    icon: /*#__PURE__*/React.createElement(ClockBadge16, {
      className: "bdl-TimeInput-icon"
    }),
    inputRef: innerRef,
    isRequired: isRequired,
    label: label,
    onBlur: handleBlur,
    onChange: handleChange,
    position: errorTooltipPosition,
    type: "text",
    value: displayTime
  });
};
export { TimeInput as TimeInputComponent };
export default injectIntl(TimeInput);
//# sourceMappingURL=TimeInput.js.map