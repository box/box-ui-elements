import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import Link from '../../link/Link';
import Menu from '../Menu';

import SelectMenuLinkItem from '../SelectMenuLinkItem';
import notes from './SelectMenuLinkItem.stories.md';

export const basic = () => (
    <Menu>
        <SelectMenuLinkItem isSelected={boolean('isSelected', true)}>
            <Link href="http://opensource.box.com/box-ui-elements/storybook">View Profile</Link>
        </SelectMenuLinkItem>
        <SelectMenuLinkItem>
            <Link href="http://opensource.box.com/box-ui-elements/storybook">Awesome Link</Link>
        </SelectMenuLinkItem>
    </Menu>
);

export default {
    title: 'Components|SelectMenuLinkItem',
    component: SelectMenuLinkItem,
    parameters: {
        notes,
    },
};
