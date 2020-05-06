import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import { State, Store } from '@sambego/storybook-state';
import Checkbox from './Checkbox';
import notes from './Checkbox.stories.md';

export const basic = () => (
    <Checkbox
        fieldLabel="Field Label"
        id="1"
        name="checkbox1"
        label="Uncontrolled checkbox"
        description="isChecked is undefined, which makes this an uncontrolled component. You can turn this one on-off whenever you feel like!"
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
                        name="checkbox2"
                        label="Controlled checkbox"
                        isChecked={state.isChecked}
                        onChange={handleChange}
                        description="This is a controlled component."
                    />
                    <Checkbox
                        name="checkbox3"
                        label="Inverted Controlled checkbox"
                        isChecked={!state.isChecked}
                        onChange={handleChange}
                        description="This is a controlled component, whose value is the inverse of the one above."
                    />
                </div>
            )}
        </State>
    );
};

export const disabled = () => (
    <Checkbox
        name="checkbox5"
        label="Disabled"
        isChecked={boolean('isChecked', true)}
        isDisabled={boolean('isDisabled', true)}
    />
);

export const withTooltip = () => (
    <Checkbox name="checkbox6" label="I have a tooltip" tooltip="See? Isn’t this great??" />
);

export const withSubsection = () => (
    <Checkbox
        id="321"
        name="checkbox321"
        label="Checkbox with subsection"
        subsection={
            <Checkbox id="134" name="checkbox134" label="Subsection checkbox" description="Hi I'm a description" />
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
