import * as React from 'react';

import Section from './Section';
import notes from './Section.stories.md';

export const basic = () => (
    <Section description="Your account info" title="User Info">
        <input name="textinput" placeholder="Enter email here" type="email" />
    </Section>
);

export default {
    title: 'Components|Section',
    component: Section,
    parameters: {
        notes,
    },
};
