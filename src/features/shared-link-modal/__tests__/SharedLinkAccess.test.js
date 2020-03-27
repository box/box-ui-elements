import React from 'react';

import SharedLinkAccess from '../SharedLinkAccess';
import { CAN_VIEW, PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from '../constants';

describe('features/shared-link-modal/SharedLinkAccess', () => {
    const accessLevel = PEOPLE_WITH_LINK;
    const allowedAccessLevels = {
        [PEOPLE_WITH_LINK]: true,
        [PEOPLE_IN_COMPANY]: true,
        [PEOPLE_IN_ITEM]: true,
    };
    const changeAccessLevel = () => {};
    const itemType = 'folder';
    const removeLink = () => {};
    const permissionLevel = CAN_VIEW;

    test('should render an AccessDescription, AccessMenu, and PermissionMenu', () => {
        const accessMenuButtonProps = {
            'data-resin-thing': 'menu',
        };
        const removeLinkButtonProps = {
            'data-resin-thing': 'remove',
        };
        const wrapper = shallow(
            <SharedLinkAccess
                accessDropdownMenuProps={{ constrainToWindow: true }}
                accessLevel={accessLevel}
                accessMenuButtonProps={accessMenuButtonProps}
                allowedAccessLevels={allowedAccessLevels}
                changeAccessLevel={changeAccessLevel}
                itemType={itemType}
                permissionLevel={permissionLevel}
                removeLink={removeLink}
                removeLinkButtonProps={removeLinkButtonProps}
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });
});
