import React from 'react';

import { CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY } from '../constants';
import SharedLinkPermissionMenu from '../SharedLinkPermissionMenu';

describe('features/unified-share-modal/SharedLinkPermissionMenu', () => {
    const allowedPermissionLevels = [CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY];

    describe('render()', () => {
        [
            {
                submitting: true,
                permissionLevel: CAN_VIEW_DOWNLOAD,
            },
            {
                submitting: false,
                permissionLevel: CAN_VIEW_DOWNLOAD,
            },
            {
                submitting: true,
                permissionLevel: CAN_VIEW_ONLY,
            },
            {
                submitting: false,
                permissionLevel: CAN_VIEW_ONLY,
            },
        ].forEach(({ submitting, permissionLevel }) => {
            test('it should render correct menu', () => {
                const sharedLinkPermissionMenu = shallow(
                    <SharedLinkPermissionMenu
                        allowedPermissionLevels={allowedPermissionLevels}
                        canChangePermissionLevel
                        changePermissionLevel={() => {}}
                        permissionLevel={permissionLevel}
                        submitting={submitting}
                    />,
                );

                expect(sharedLinkPermissionMenu).toMatchSnapshot();
            });
        });

        test('should not render if permission level prop is not set', () => {
            const emptySharedLinkPermissionMenu = shallow(
                <SharedLinkPermissionMenu
                    allowedPermissionLevels={allowedPermissionLevels}
                    canChangePermissionLevel
                    changePermissionLevel={() => {}}
                    permissionLevel=""
                    submitting={false}
                />,
            );

            expect(emptySharedLinkPermissionMenu).toMatchSnapshot();
        });
    });

    describe('onChangePermissionLevel()', () => {
        test('should call tracking function and handler on menu change if it is set', () => {
            const changeMenuMock = jest.fn();
            const permissionLevelSpy = jest.fn();
            const sharedLinkPermissionMenu = shallow(
                <SharedLinkPermissionMenu
                    allowedPermissionLevels={allowedPermissionLevels}
                    canChangePermissionLevel={false}
                    changePermissionLevel={permissionLevelSpy}
                    permissionLevel={CAN_VIEW_DOWNLOAD}
                    submitting={false}
                    trackingProps={{
                        onChangeSharedLinkPermissionLevel: changeMenuMock,
                    }}
                />,
            );

            sharedLinkPermissionMenu.instance().onChangePermissionLevel(CAN_VIEW_ONLY);

            expect(changeMenuMock).toBeCalled();
            expect(permissionLevelSpy).toBeCalled();
        });

        test('should not call tracking function or handler on menu change if it is set (when the permissionLevel has not changed)', () => {
            const changeMenuMock = jest.fn();
            const permissionLevelSpy = jest.fn();
            const sharedLinkPermissionMenu = shallow(
                <SharedLinkPermissionMenu
                    allowedPermissionLevels={allowedPermissionLevels}
                    canChangePermissionLevel={false}
                    changePermissionLevel={permissionLevelSpy}
                    permissionLevel={CAN_VIEW_ONLY}
                    submitting={false}
                    trackingProps={{
                        onChangeSharedLinkPermissionLevel: changeMenuMock,
                    }}
                />,
            );

            sharedLinkPermissionMenu.instance().onChangePermissionLevel(CAN_VIEW_ONLY);

            expect(changeMenuMock).not.toBeCalled();
            expect(permissionLevelSpy).not.toBeCalled();
        });
    });
});
