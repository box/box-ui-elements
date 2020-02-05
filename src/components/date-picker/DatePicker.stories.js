// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { State, Store } from '@sambego/storybook-state';

import DatePicker from './DatePicker';
import notes from './DatePicker.stories.md';

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
                        onChange={date => {
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
            errorTooltipPosition="middle-right"
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
    const componentStore = new Store({
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
                            onChange={date => {
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
                            onChange={date => {
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
