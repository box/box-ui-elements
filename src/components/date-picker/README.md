### Examples
**Basic**
```
const MAX_TIME = new Date('3000-01-01T00:00:00.000Z');
const MIN_TIME = new Date(0);
const TODAY = new Date();
const yearRange = [MIN_TIME.getFullYear(), TODAY.getFullYear()];

initialState = {
    date: new Date(),
    fromDate: null,
    toDate: null,
};

<DatePicker
    className="date-picker-example"
    displayFormat={ {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    } }
    label="Date"
    name="datepicker"
    onChange={ date => {
        setState({ date });
    } }
    placeholder="Date"
    value={ state.date }
    yearRange={ yearRange }
/>
```
**Disabled with description**
```
<DatePicker
    placeholder="Date"
    description="date for your birth"
    label="Date Picker"
/>
```
**Manually editable date picker**
```
<DatePicker
    isTextInputAllowed
    placeholder="Date"
    label="Date Picker"
/>
```
**Disabled with Error Message**
```
<DatePicker
    isDisabled
    error="Error Message"
    placeholder="Date"
    name="datepicker"
    label="Disabled Date Picker"
/>
```
**Custom Error Tooltip Position**
```
<DatePicker
    error="Error Message"
    errorTooltipPosition="middle-right"
    placeholder="Date"
    name="datepicker"
    label="Disabled Date Picker"
/>
```
**Range**
```
const MAX_TIME = new Date('3000-01-01T00:00:00.000Z');
const MIN_TIME = new Date(0);
const TODAY = new Date();

initialState = {
    date: new Date(),
    fromDate: null,
    toDate: null,
};

<div>
    <DatePicker
        className="date-picker-example"
        displayFormat={ {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        } }
        hideOptionalLabel
        label="From Date"
        maxDate={ state.toDate || MAX_TIME }
        name="datepicker-from"
        onChange={ date => {
            setState({ fromDate: date });
        } }
        placeholder="Choose a Date"
        value={ state.fromDate }
    />
    <DatePicker
        className="date-picker-example"
        displayFormat={ {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        } }
        hideOptionalLabel
        label="To Date"
        minDate={ state.fromDate || MIN_TIME }
        maxDate={ TODAY }
        name="datepicker-to"
        onChange={ date => {
            setState({ toDate: date });
        } }
        placeholder="Choose a Date"
        value={ state.toDate }
    />
</div>
```
