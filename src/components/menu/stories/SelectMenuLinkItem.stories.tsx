import * as React from 'react';

import Link from '../../link/Link';
import Menu from '../Menu';

import SelectMenuLinkItem from '../SelectMenuLinkItem';
import notes from './SelectMenuLinkItem.stories.md';

export const basic = () => (
    <Menu>
        <SelectMenuLinkItem isSelected>
            <Link href="https://opensource.box.com/box-ui-elements/">View Profile</Link>
        </SelectMenuLinkItem>
        <SelectMenuLinkItem>
            <Link href="https://opensource.box.com/box-ui-elements/">Awesome Link</Link>
        </SelectMenuLinkItem>
    </Menu>
);

export default {
    title: 'Components/SelectMenuLinkItem',
    component: SelectMenuLinkItem,
    parameters: {
        notes,
    },
};
