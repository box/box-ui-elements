import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { State, Store } from '@sambego/storybook-state';

import { TooltipPosition } from '../tooltip';
import Label from '../label';
import DatePicker from './DatePicker';
import notes from './DatePicker.stories.md';

import { bdlGray10 } from '../../styles/variables';

export const basic = () => {
    const MIN_TIME = new Date(0);
    const TODAY = new Date('July 18, 2018');
    const yearRange = [MIN_TIME.getFullYear(), TODAY.getFullYear()];
    const componentStore = new Store({
        date: new Date('July 9, 2018'),
        fromDate: null,
        toDate: null,
    });
    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en-US">
                    <DatePicker
                        className="date-picker-example"
                        displayFormat={{
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        }}
                        label="Date"
                        name="datepicker"
                        onChange={(date: Date) => {
                            componentStore.set({ date });
                        }}
                        placeholder="Date"
                        value={state.date}
                        yearRange={yearRange}
                    />
                </IntlProvider>
            )}
        </State>
    );
};

export const withDescription = () => (
    <IntlProvider locale="en-US">
        <DatePicker placeholder="Date" description="Date of your birth" label="Date Picker" />
    </IntlProvider>
);

export const manuallyEditable = () => (
    <IntlProvider locale="en-US">
        <DatePicker isTextInputAllowed placeholder="Date" label="Date Picker" value={new Date('September 27, 2019')} />
    </IntlProvider>
);

export const withLimitedDateRange = () => {
    const maxDate = new Date('February 25, 2021');
    const sixDays = 1000 * 60 * 60 * 24 * 6;
    const minDate = new Date(maxDate.valueOf() - sixDays);
    const componentStore = new Store({
        date: maxDate,
        fromDate: null,
        toDate: null,
    });
    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en-US">
                    <DatePicker
                        isTextInputAllowed
                        placeholder="Date"
                        label="Date Picker"
                        minDate={minDate}
                        maxDate={maxDate}
                        value={state.date}
                    />
                </IntlProvider>
            )}
        </State>
    );
};

export const alwaysVisibleWithHiddenInput = () => {
    const componentStore = new Store({
        date: new Date('February 26, 2021'),
        fromDate: null,
        toDate: null,
    });
    const customInput = (
        <input
            aria-disabled
            disabled
            style={{
                background: bdlGray10,
                border: 0,
                borderRadius: '4px',
                padding: '.5em .8em',
            }}
        />
    );
    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en-US">
                    <DatePicker
                        className="date-picker-example"
                        displayFormat={{
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        }}
                        hideDefaultInput
                        isAlwaysVisible
                        isClearable={false}
                        label="Date"
                        name="datepicker"
                        onChange={(date: Date) => {
                            componentStore.set({ date });
                        }}
                        placeholder="Date"
                        value={state.date}
                    />
                </IntlProvider>
            )}
        </State>
    );
};

export const alwaysVisibleWithSeparateInputField = () => {
    const componentStore = new Store({
        date: new Date('February 26, 2021'),
        fromDate: null,
        toDate: null,
    });

    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en-US">
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'top',
                            justifyContent: 'space-around',
                            width: '650px',
                        }}
                    >
                        <DatePicker
                            className="date-picker-example"
                            displayFormat={{
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            }}
                            hideDefaultInput
                            hideLabel
                            isAlwaysVisible
                            isClearable={false}
                            label="Date"
                            name="datepicker"
                            onChange={(date: Date) => {
                                componentStore.set({ date });
                            }}
                            placeholder="Date"
                            value={state.date}
                        />
                        <Label
                            text={
                                <span>
                                    This input field displays the selected date,
                                    <br />
                                    but it is not contained within the Date Picker
                                </span>
                            }
                        >
                            <input
                                aria-disabled
                                disabled
                                name="date-picker-separate-input"
                                style={{
                                    background: bdlGray10,
                                    border: 0,
                                    borderRadius: '4px',
                                    padding: '.5em .8em',
                                    width: '19em',
                                    height: '2.5em',
                                }}
                                value={state.date.toDateString()}
                            />
                        </Label>
                    </div>
                </IntlProvider>
            )}
        </State>
    );
};

export const disabledWithErrorMessage = () => (
    <IntlProvider locale="en-US">
        <DatePicker
            isDisabled
            error="Error Message"
            placeholder="Date"
            name="datepicker"
            label="Disabled Date Picker"
        />
    </IntlProvider>
);

export const customErrorTooltipPosition = () => (
    <IntlProvider locale="en-US">
        <DatePicker
            error="Error Message"
            errorTooltipPosition={TooltipPosition.MIDDLE_RIGHT}
            placeholder="Date"
            name="datepicker"
            label="Disabled Date Picker"
        />
    </IntlProvider>
);

export const withRange = () => {
    const MAX_TIME = new Date('3000-01-01T00:00:00.000Z');
    const MIN_TIME = new Date(0);
    const TODAY = new Date();
    const componentStore: Store<{ date: Date; fromDate: Date | null; toDate: Date | null }> = new Store({
        date: new Date(),
        fromDate: null,
        toDate: null,
    });
    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en-US">
                    <div>
                        <DatePicker
                            className="date-picker-example"
                            displayFormat={{
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            }}
                            hideOptionalLabel
                            label="From Date"
                            maxDate={state.toDate || MAX_TIME}
                            name="datepicker-from"
                            onChange={(date: Date) => {
                                componentStore.set({ fromDate: date });
                            }}
                            placeholder="Choose a Date"
                            value={state.fromDate}
                        />
                        <DatePicker
                            className="date-picker-example"
                            displayFormat={{
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            }}
                            hideOptionalLabel
                            label="To Date"
                            minDate={state.fromDate || MIN_TIME}
                            maxDate={TODAY}
                            name="datepicker-to"
                            onChange={(date: Date) => {
                                componentStore.set({ toDate: date });
                            }}
                            placeholder="Choose a Date"
                            value={state.toDate}
                        />
                    </div>
                </IntlProvider>
            )}
        </State>
    );
};

export default {
    title: 'Components|DatePicker',
    component: DatePicker,
    parameters: {
        notes,
    },
};
