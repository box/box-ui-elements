import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import { State, Store } from '@sambego/storybook-state';
import Checkbox from './Checkbox';
import notes from './Checkbox.stories.md';

export const basic = () => (
    <Checkbox
        description="isChecked is undefined, which makes this an uncontrolled component. You can turn this one on-off whenever you feel like!"
        fieldLabel="Field Label"
        id="1"
        label="Uncontrolled checkbox"
        name="checkbox1"
    />
);

export const controlled = () => {
    const componentStore = new Store({ isChecked: false });
    const handleChange = () => componentStore.set({ isChecked: !componentStore.get('isChecked') });

    return (
        <State store={componentStore}>
            {state => (
                <div>
                    <Checkbox
                        description="This is a controlled component."
                        isChecked={state.isChecked}
                        label="Controlled checkbox"
                        name="checkbox2"
                        onChange={handleChange}
                    />
                    <Checkbox
                        description="This is a controlled component, whose value is the inverse of the one above."
                        isChecked={!state.isChecked}
                        label="Inverted Controlled checkbox"
                        name="checkbox3"
                        onChange={handleChange}
                    />
                </div>
            )}
        </State>
    );
};

export const disabled = () => (
    <Checkbox
        isChecked={boolean('isChecked', true)}
        isDisabled={boolean('isDisabled', true)}
        label="Disabled"
        name="checkbox5"
    />
);

export const withTooltip = () => (
    <Checkbox label="I have a tooltip" name="checkbox6" tooltip="See? Isn’t this great??" />
);

export const withSubsection = () => (
    <Checkbox
        id="321"
        label="Checkbox with subsection"
        name="checkbox321"
        subsection={
            <Checkbox description="Hi I'm a description" id="134" label="Subsection checkbox" name="checkbox134" />
        }
    />
);

export default {
    title: 'Components|Checkbox',
    component: Checkbox,
    parameters: {
        notes,
    },
};
