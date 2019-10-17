import React from 'react';

import { ITEM_TYPE_WEBLINK, ITEM_TYPE_FOLDER } from '../../../common/constants';

import { EDITOR, CO_OWNER, PREVIEWER, PREVIEWER_UPLOADER, VIEWER, VIEWER_UPLOADER, UPLOADER } from '../constants';
import InviteePermissionsMenu from '../InviteePermissionsMenu';

describe('features/unified-share-modal/InviteePermissionsMenu', () => {
    const inviteePermissions = [
        { value: 'Editor', text: 'Editor' },
        { value: 'Co-owner', text: 'Co-owner' },
        { value: 'Viewer Uploader', text: 'Viewer Uploader' },
        { value: 'Previewer Uploader', text: 'Previewer Uploader' },
        { value: 'Viewer', text: 'Viewer' },
        { value: 'Previewer', text: 'Previewer' },
        { value: 'Uploader', text: 'Uploader' },
    ];

    const getWrapper = (props = {}) =>
        shallow(
            <InviteePermissionsMenu
                disabled={false}
                inviteePermissionLevel="Editor"
                inviteePermissions={inviteePermissions}
                {...props}
            />,
        );

    // TODO: wrap in a describe-render() block
    describe('render()', () => {
        [
            {
                disabled: true,
                inviteePermissionLevel: EDITOR,
            },
            {
                disabled: false,
                inviteePermissionLevel: EDITOR,
            },
            {
                disabled: true,
                inviteePermissionLevel: CO_OWNER,
            },
            {
                disabled: false,
                inviteePermissionLevel: CO_OWNER,
            },
            {
                disabled: true,
                inviteePermissionLevel: PREVIEWER,
            },
            {
                disabled: false,
                inviteePermissionLevel: PREVIEWER,
            },
            {
                disabled: true,
                inviteePermissionLevel: PREVIEWER_UPLOADER,
            },
            {
                disabled: false,
                inviteePermissionLevel: PREVIEWER_UPLOADER,
            },
            {
                disabled: true,
                inviteePermissionLevel: VIEWER,
            },
            {
                disabled: false,
                inviteePermissionLevel: VIEWER,
            },
            {
                disabled: true,
                inviteePermissionLevel: VIEWER_UPLOADER,
            },
            {
                disabled: false,
                inviteePermissionLevel: VIEWER_UPLOADER,
            },
            {
                disabled: false,
                inviteePermissionLevel: UPLOADER,
            },
            {
                disabled: true,
                inviteePermissionLevel: UPLOADER,
            },
        ].forEach(({ disabled, inviteePermissionLevel }) => {
            test('it should render correct menu', () => {
                const inviteePermissionMenu = getWrapper({
                    disabled,
                    inviteePermissionLevel,
                });
                expect(inviteePermissionMenu).toMatchSnapshot();
            });
        });

        [
            {
                itemType: ITEM_TYPE_WEBLINK,
            },
            {
                itemType: ITEM_TYPE_FOLDER,
            },
        ].forEach(({ itemType }) => {
            test('should render the correct disabled tooltip', () => {
                const inviteePermissionMenu = getWrapper({
                    disabled: true,
                    itemType,
                });
                expect(inviteePermissionMenu.find('Tooltip')).toMatchSnapshot();
            });
        });
    });

    describe('onChangeInviteePermissionsLevel', () => {
        test('should call change handler code on menu change', () => {
            const inviteePermissionLevelSpy = jest.fn();
            const inviteePermissionMenu = getWrapper({
                inviteePermissionLevel: EDITOR,
                changeInviteePermissionLevel: inviteePermissionLevelSpy,
            });

            inviteePermissionMenu.instance().onChangeInviteePermissionsLevel(CO_OWNER);

            expect(inviteePermissionLevelSpy).toBeCalled();
        });

        test('should not call change handler code on menu change to same value', () => {
            const inviteePermissionLevelSpy = jest.fn();
            const inviteePermissionMenu = getWrapper({
                inviteePermissionLevel: CO_OWNER,
                changeInviteePermissionLevel: inviteePermissionLevelSpy,
            });

            inviteePermissionMenu.instance().onChangeInviteePermissionsLevel(CO_OWNER);

            expect(inviteePermissionLevelSpy).not.toBeCalled();
        });
    });
});
