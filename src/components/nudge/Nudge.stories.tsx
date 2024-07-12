import * as React from 'react';

import BoxMobile140 from '../../illustration/BoxMobile140';

import Nudge from './Nudge';
import notes from './Nudge.stories.md';

const onButtonClick = () => {
    // eslint-disable-next-line no-console
    console.log('button clicked');
};

export const regular = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isShown, setIsShown] = React.useState(true);

    const onNudgeClose = () => setIsShown(false);

    return (
        <Nudge
            buttonText={<span>Pellentesque port</span>}
            content={
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque quis rutrum turpis.</span>
            }
            illustration={<BoxMobile140 height={140} width={140} />}
            isShown={isShown}
            header={<span>Heading goes here</span>}
            onButtonClick={onButtonClick}
            onCloseButtonClick={onNudgeClose}
        />
    );
};

export default {
    title: 'Components/Nudge',
    component: Nudge,
    parameters: {
        notes,
    },
};
