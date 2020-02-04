// @flow
import * as React from 'react';

import Avatar from '../../avatar/Avatar';
import MenuItem from '../../menu/MenuItem';

import Media from '../Media';
import MediaMenu from '../MediaMenu';
import notes from './MediaMenu.stories.md';

import { bdlWatermelonRed, bdlYellorange } from '../../../styles/variables';

export const example = () => (
    <Media style={{ width: 300 }}>
        <Media.Figure>
            <Avatar size="large" />
        </Media.Figure>

        <Media.Body style={{ boxShadow: `0 0 2px 3px ${bdlYellorange}` }}>
            <Media.Menu style={{ boxShadow: `0 0 2px 3px ${bdlWatermelonRed}` }}>
                <MenuItem>Edit</MenuItem>
                <MenuItem>Delete</MenuItem>
            </Media.Menu>
            <div>
                <b>Yo Yo Ma</b> commented on this file
            </div>
            <div>
                Please review the notes
                <br />a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
            </div>
        </Media.Body>
    </Media>
);

export default {
    title: 'Components|Media/MediaMenu',
    component: MediaMenu,
    parameters: {
        notes,
    },
};
