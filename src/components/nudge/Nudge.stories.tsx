import * as React from 'react';
import { State, Store } from '@sambego/storybook-state';

import BoxMobile140 from '../../illustration/BoxMobile140';

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
                    buttonText={<span>Pellentesque port</span>}
                    content={
                        <span>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque quis rutrum turpis.
                        </span>
                    }
                    illustration={<BoxMobile140 height={140} width={140} />}
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
