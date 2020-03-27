// @flow
import * as React from 'react';
import { State, Store } from '@sambego/storybook-state';
import { boolean } from '@storybook/addon-knobs';

import Toggle from './Toggle';
import notes from './Toggle.stories.md';

export const basic = () => (
    <Toggle
        name="toggle1"
        label="Uncontrolled toggle"
        description="isOn is undefined, which makes this an uncontrolled component. You can turn this one on or off whenever you want."
    />
);

export const rightAligned = () => (
    <Toggle
        description="isOn is undefined, which makes this an uncontrolled component. You can turn this one on or off whenever you want."
        isToggleRightAligned={boolean('isToggleRightAligned', true)}
        label="Uncontrolled toggle right aligned"
        name="toggle1"
    />
);

export const controlled = () => {
    const componentStore = new Store({ isOn: false });
    const onToggle = () => componentStore.set({ isOn: !componentStore.get('isOn') });

    return (
        <State store={componentStore}>
            {state => (
                <div>
                    <Toggle
                        name="toggle2"
                        label="Controlled toggle"
                        isOn={state.isOn}
                        onChange={onToggle}
                        description="This is a controlled component."
                    />
                    <Toggle
                        name="toggle3"
                        label="Inverted controlled toggle"
                        isOn={!state.isOn}
                        onChange={onToggle}
                        description="This is a controlled component, whose value is the inverse of the one above."
                    />
                </div>
            )}
        </State>
    );
};

export const disabled = () => <Toggle name="toggle4" label="Disabled" isDisabled={boolean('isDisabled', true)} />;

export default {
    title: 'Components|Toggle',
    component: Toggle,
    parameters: {
        notes,
    },
};
