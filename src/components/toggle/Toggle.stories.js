// @flow
import * as React from 'react';
import { State, Store } from '@sambego/storybook-state';
import { boolean } from '@storybook/addon-knobs';

import Toggle from './Toggle';
import notes from './Toggle.stories.md';

export const basic = () => (
    <Toggle
        description="isOn is undefined, which makes this an uncontrolled component. You can turn this one on or off whenever you want."
        label="Uncontrolled toggle"
        name="toggle1"
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
                        description="This is a controlled component."
                        isOn={state.isOn}
                        label="Controlled toggle"
                        name="toggle2"
                        onChange={onToggle}
                    />
                    <Toggle
                        description="This is a controlled component, whose value is the inverse of the one above."
                        isOn={!state.isOn}
                        label="Inverted controlled toggle"
                        name="toggle3"
                        onChange={onToggle}
                    />
                </div>
            )}
        </State>
    );
};

export const disabled = () => <Toggle isDisabled={boolean('isDisabled', true)} label="Disabled" name="toggle4" />;

export default {
    title: 'Components|Toggle',
    component: Toggle,
    parameters: {
        notes,
    },
};
