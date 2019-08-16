// @flow
import React from 'react';

import IconAdminConsole from '../IconAdminConsole';
import IconAllFiles from '../IconAllFiles';
import IconAutomations from '../IconAutomations';
import IconBoxRelay from '../IconBoxRelay';
import IconDevConsole from '../IconDevConsole';
import IconFavorites from '../IconFavorites';
import IconFeed from '../IconFeed';
import IconNotes from '../IconNotes';
import IconNotifications from '../IconNotifications';
import IconOwnedByMe from '../IconOwnedByMe';
import IconRecents from '../IconRecents';
import IconRelay from '../IconRelay';
import IconSharedWithMe from '../IconSharedWithMe';
import IconSynced from '../IconSynced';
import IconTrash from '../IconTrash';

describe('icons/left-sidebar', () => {
    [
        {
            Icon: IconAdminConsole,
        },
        {
            Icon: IconAutomations,
        },
        {
            Icon: IconBoxRelay,
        },
        {
            Icon: IconAllFiles,
        },
        {
            Icon: IconDevConsole,
        },
        {
            Icon: IconFavorites,
        },
        {
            Icon: IconFeed,
        },
        {
            Icon: IconNotes,
        },
        {
            Icon: IconNotifications,
        },
        {
            Icon: IconOwnedByMe,
        },
        {
            Icon: IconRecents,
        },
        {
            Icon: IconRelay,
        },
        {
            Icon: IconSharedWithMe,
        },
        {
            Icon: IconSynced,
        },
        {
            Icon: IconTrash,
        },
    ].forEach(({ Icon }) => {
        test('should correctly render default icon', () => {
            const wrapper = shallow(<Icon />);

            expect(wrapper).toMatchSnapshot();
        });

        test('should correctly render icon with specified color', () => {
            const color = '#ffffff';
            const wrapper = shallow(<Icon color={color} />);
            expect(wrapper).toMatchSnapshot();
        });

        test('should correctly render icon with specified width and height', () => {
            const width = 16;
            const wrapper = shallow(<Icon width={width} />);

            expect(wrapper).toMatchSnapshot();
        });

        test('should correctly render icon with title', () => {
            const title = 'fool';
            const wrapper = shallow(<Icon title={title} />);

            expect(wrapper).toMatchSnapshot();
        });

        test('should respect selected state', () => {
            const title = 'pity';
            const isSelected = true;
            const wrapper = shallow(<Icon selected={isSelected} title={title} />);

            expect(wrapper).toMatchSnapshot();
        });
    });
});
