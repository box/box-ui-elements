import * as React from 'react';

import RelayPlanet140 from '../../illustration/RelayPlanet140';

import Nudge from './Nudge';
import notes from './Nudge.stories.md';

export const regular = () => (
    <Nudge
        buttonText={<span>Pellentesque in port</span>}
        content={<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque quis rutrum turpis.</p>}
        illustration={<RelayPlanet140 height={170} width={170} />}
        header={<h3>Heading goes here</h3>}
    />
);

export default {
    title: 'Components|Nudge',
    component: Nudge,
    parameters: {
        notes,
    },
};
