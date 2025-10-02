/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import { TooltipPosition } from '../tooltip';
import DatePicker from './DatePicker';
import notes from './DatePicker.stories.md';
import { bdlGray10 } from '../../styles/variables';
export const basic = () => {
  const MIN_TIME = new Date(0);
  const TODAY = new Date('July 18, 2018');
  const yearRange = [MIN_TIME.getFullYear(), TODAY.getFullYear()];
  const [date, setDate] = React.useState(new Date('July 9, 2018'));
  return /*#__PURE__*/React.createElement(DatePicker, {
    className: "date-picker-example",
    displayFormat: {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    },
    label: "Date",
    name: "datepicker",
    onChange: newDate => {
      setDate(newDate);
    },
    placeholder: "Date",
    value: date,
    yearRange: yearRange
  });
};
export const basicWithKeyboardInput = () => {
  const MIN_TIME = new Date(0);
  const TODAY = new Date('July 18, 2018');
  const yearRange = [MIN_TIME.getFullYear(), TODAY.getFullYear()];
  const [date, setDate] = React.useState(new Date('July 9, 2018'));
  return /*#__PURE__*/React.createElement(DatePicker, {
    className: "date-picker-example",
    displayFormat: {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    },
    isKeyboardInputAllowed: true,
    label: "Date",
    name: "datepicker",
    onChange: newDate => {
      setDate(newDate);
    },
    placeholder: "Date",
    value: date,
    yearRange: yearRange
  });
};
export const withDescription = () => /*#__PURE__*/React.createElement(DatePicker, {
  placeholder: "Date",
  description: "Date of your birth",
  label: "Date Picker"
});
export const manuallyEditable = () => /*#__PURE__*/React.createElement(DatePicker, {
  isTextInputAllowed: true,
  placeholder: "Date",
  label: "Date Picker",
  value: new Date('September 27, 2019')
});
export const manuallyEditableAndAccessible = () => /*#__PURE__*/React.createElement(DatePicker, {
  isAccessible: true,
  placeholder: "Date",
  label: "Date Picker",
  value: new Date('August 10, 2021')
});
export const withLimitedDateRange = () => {
  const maxDate = new Date('February 25, 2021');
  const sixDays = 1000 * 60 * 60 * 24 * 6;
  const minDate = new Date(maxDate.valueOf() - sixDays);
  return /*#__PURE__*/React.createElement(DatePicker, {
    isTextInputAllowed: true,
    placeholder: "Date",
    label: "Date Picker",
    minDate: minDate,
    maxDate: maxDate,
    value: maxDate
  });
};
export const alwaysVisibleWithCustomInputField = () => {
  const [date, setDate] = React.useState(new Date('February 26, 2021'));
  const customInput = /*#__PURE__*/React.createElement("input", {
    style: {
      display: 'none'
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(DatePicker, {
    className: "date-picker-example",
    customInput: customInput,
    displayFormat: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    },
    hideLabel: true,
    isAlwaysVisible: true,
    isClearable: false,
    label: "Date",
    name: "datepicker",
    onChange: newDate => {
      setDate(newDate);
    },
    placeholder: "Date",
    value: date
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '20px 30px',
      width: '400px'
    }
  }, /*#__PURE__*/React.createElement("p", null, "In this example, the DatePicker is bound to a custom hidden input field. The right panel retains the same state as the DatePicker, but is not contained within the DatePicker component."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "date-picker-custom-input",
    style: {
      position: 'absolute',
      left: '10px',
      top: '6px',
      zIndex: 100
    }
  }, "Start Date"), /*#__PURE__*/React.createElement("input", {
    disabled: true,
    name: "date-picker-custom-input",
    style: {
      background: bdlGray10,
      border: 0,
      borderRadius: '4px',
      padding: '.5em .8em',
      width: '19em',
      height: '2.5em',
      top: 0,
      outline: 'none',
      textAlign: 'right'
    },
    value: date.toDateString()
  }))));
};
export const disabledWithErrorMessage = () => /*#__PURE__*/React.createElement(DatePicker, {
  isDisabled: true,
  error: "Error Message",
  placeholder: "Date",
  name: "datepicker",
  label: "Disabled Date Picker"
});
export const customErrorTooltipPosition = () => /*#__PURE__*/React.createElement(DatePicker, {
  error: "Error Message",
  errorTooltipPosition: TooltipPosition.MIDDLE_RIGHT,
  placeholder: "Date",
  name: "datepicker",
  label: "Disabled Date Picker"
});
export const withRange = () => {
  const MAX_TIME = new Date('3000-01-01T00:00:00.000Z');
  const MIN_TIME = new Date(0);
  const TODAY = new Date();
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DatePicker, {
    className: "date-picker-example",
    displayFormat: {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    },
    hideOptionalLabel: true,
    label: "From Date",
    maxDate: toDate || MAX_TIME,
    name: "datepicker-from",
    onChange: newDate => {
      setFromDate(newDate);
    },
    placeholder: "Choose a Date",
    value: fromDate
  }), /*#__PURE__*/React.createElement(DatePicker, {
    className: "date-picker-example",
    displayFormat: {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    },
    hideOptionalLabel: true,
    label: "To Date",
    minDate: fromDate || MIN_TIME,
    maxDate: TODAY,
    name: "datepicker-to",
    onChange: newDate => {
      setToDate(newDate);
    },
    placeholder: "Choose a Date",
    value: toDate
  }));
};
export const withRangeAndKeyboardInput = () => {
  const MAX_TIME = new Date('3000-01-01T00:00:00.000Z');
  const MIN_TIME = new Date(0);
  const TODAY = new Date();
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DatePicker, {
    className: "date-picker-example",
    displayFormat: {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    },
    hideOptionalLabel: true,
    isKeyboardInputAllowed: true,
    label: "From Date",
    maxDate: toDate || MAX_TIME,
    name: "datepicker-from",
    onChange: date => {
      setFromDate(date);
    },
    placeholder: "Choose a Date",
    value: fromDate
  }), /*#__PURE__*/React.createElement(DatePicker, {
    className: "date-picker-example",
    displayFormat: {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    },
    hideOptionalLabel: true,
    isKeyboardInputAllowed: true,
    label: "To Date",
    minDate: fromDate || MIN_TIME,
    maxDate: TODAY,
    name: "datepicker-to",
    onChange: date => {
      setToDate(date);
    },
    placeholder: "Choose a Date",
    value: toDate
  }));
};
export default {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    notes
  }
};
//# sourceMappingURL=DatePicker.stories.js.map