import * as React from 'react';

import Link from '../Link';

import LinkGroup from '../LinkGroup';
import notes from './LinkGroup.stories.md';

export const basic = () => (
    <LinkGroup>
        <Link href="https://www.box.com/platform">A Link</Link>
        <Link href="https://developer.box.com">B Link</Link>
        <Link href="https://github.com/box/box-ui-elements">C Link</Link>
    </LinkGroup>
);

export default {
    title: 'Components|Links/LinkGroup',
    component: LinkGroup,
    parameters: {
        notes,
    },
};
