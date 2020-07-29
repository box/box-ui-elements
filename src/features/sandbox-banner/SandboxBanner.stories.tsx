import * as React from 'react';

import SandboxBanner from './SandboxBanner';

import notes from './SandboxBanner.stories.md';

export const basic = () => (
    <SandboxBanner>
        <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
        </span>
    </SandboxBanner>
);

export default {
    title: 'Features|SandboxBanner',
    component: SandboxBanner,
    parameters: {
        notes,
    },
};
