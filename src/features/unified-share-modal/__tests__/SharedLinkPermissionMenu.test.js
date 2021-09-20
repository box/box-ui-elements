import React from 'react';

import { CAN_EDIT, CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY } from '../constants';
import SharedLinkPermissionMenu from '../SharedLinkPermissionMenu';

describe('features/unified-share-modal/SharedLinkPermissionMenu', () => {
    const allowedPermissionLevels = [CAN_EDIT, CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY];
    const defaultSharedLinkEditTagTargetingApi = {
        canShow: false,
    };

    describe('render()', () => {
        [
            {
                submitting: true,
                permissionLevel: CAN_EDIT,
            },
            {
                submitting: false,
                permissionLevel: CAN_EDIT,
            },
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
                        sharedLinkEditTagTargetingApi={defaultSharedLinkEditTagTargetingApi}
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
                    sharedLinkEditTagTargetingApi={defaultSharedLinkEditTagTargetingApi}
                    submitting={false}
                />,
            );

            expect(emptySharedLinkPermissionMenu).toMatchSnapshot();
        });

        test.each`
            canShow  | length | should
            ${true}  | ${1}   | ${'should render LabelPillText if canShow is true'}
            ${false} | ${0}   | ${'should not render LabelPillText if canShow is false'}
        `('$should ', ({ canShow, length }) => {
            const wrapper = shallow(
                <SharedLinkPermissionMenu
                    allowedPermissionLevels={allowedPermissionLevels}
                    changePermissionLevel={() => {}}
                    permissionLevel={CAN_EDIT}
                    sharedLinkEditTagTargetingApi={{ canShow }}
                    submitting={false}
                />,
            );

            expect(wrapper.find('LabelPillText')).toHaveLength(length);
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
                    sharedLinkEditTagTargetingApi={defaultSharedLinkEditTagTargetingApi}
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
                    sharedLinkEditTagTargetingApi={defaultSharedLinkEditTagTargetingApi}
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
