import * as React from 'react';
import { State, Store } from '@sambego/storybook-state';

import RelayPlanet140 from '../../illustration/RelayPlanet140';

import Nudge from './Nudge';
import notes from './Nudge.stories.md';

const onButtonClick = () => {
    // eslint-disable-next-line no-console
    console.log('button clicked');
};

export const regular = () => {
    const componentStore = new Store({
        isShown: true,
    });

    const onNudgeClose = () => componentStore.set({ isShown: false });

    return (
        <State store={componentStore}>
            {state => (
                <Nudge
                    buttonText={<span>Pellentesque in port</span>}
                    content={
                        <span>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque quis rutrum turpis.
                        </span>
                    }
                    illustration={<RelayPlanet140 height={170} width={170} />}
                    isShown={state.isShown}
                    header={<span>Heading goes here</span>}
                    onButtonClick={onButtonClick}
                    onCloseButtonClick={onNudgeClose}
                />
            )}
        </State>
    );
};

export default {
    title: 'Components|Nudge',
    component: Nudge,
    parameters: {
        notes,
    },
};
