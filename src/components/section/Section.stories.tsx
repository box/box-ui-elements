import * as React from 'react';

import Section from './Section';
import notes from './Section.stories.md';

export const basic = () => (
    <Section title="User Info" description="Your account info">
        <input name="textinput" type="email" placeholder="Enter email here" />
    </Section>
);

export default {
    title: 'Components|Section',
    component: Section,
    parameters: {
        notes,
    },
};
