import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { State, Store } from '@sambego/storybook-state';

import TimeInput from './TimeInput';

export const basic = () => {
    const componentStore = new Store({
        value: '',
    });

    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en-US">
                    <div>Time value is {state.value}</div>
                    <TimeInput
                        onBlur={(value: string) => {
                            componentStore.set({ value });
                        }}
                    />
                </IntlProvider>
            )}
        </State>
    );
};

export default {
    title: 'Components|TimeInput',
    component: TimeInput,
};
