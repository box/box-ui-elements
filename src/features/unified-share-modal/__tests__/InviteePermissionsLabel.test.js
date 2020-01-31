import React from 'react';

import { EDITOR, CO_OWNER, PREVIEWER, PREVIEWER_UPLOADER, VIEWER, VIEWER_UPLOADER, UPLOADER } from '../constants';
import InviteePermissionsLabel from '../InviteePermissionsLabel';

describe('features/unified-share-modal/InviteePermissionsLabel', () => {
    [
        {
            hasDescription: true,
            inviteePermissionLevel: EDITOR,
        },
        {
            hasDescription: false,
            inviteePermissionLevel: EDITOR,
        },
        {
            hasDescription: true,
            inviteePermissionLevel: CO_OWNER,
        },
        {
            hasDescription: false,
            inviteePermissionLevel: CO_OWNER,
        },
        {
            hasDescription: true,
            inviteePermissionLevel: PREVIEWER,
        },
        {
            hasDescription: false,
            inviteePermissionLevel: PREVIEWER,
        },
        {
            hasDescription: true,
            inviteePermissionLevel: PREVIEWER_UPLOADER,
        },
        {
            hasDescription: false,
            inviteePermissionLevel: PREVIEWER_UPLOADER,
        },
        {
            hasDescription: true,
            inviteePermissionLevel: VIEWER,
        },
        {
            hasDescription: false,
            inviteePermissionLevel: VIEWER,
        },
        {
            hasDescription: true,
            inviteePermissionLevel: VIEWER_UPLOADER,
        },
        {
            hasDescription: false,
            inviteePermissionLevel: VIEWER_UPLOADER,
        },
        {
            hasDescription: true,
            inviteePermissionLevel: UPLOADER,
        },
        {
            hasDescription: false,
            inviteePermissionLevel: UPLOADER,
        },
    ].forEach(({ hasDescription, inviteePermissionLevel }) => {
        test('it should render correct label and description (if applicable)', () => {
            const inviteePermissionLabel = shallow(
                <InviteePermissionsLabel
                    hasDescription={hasDescription}
                    inviteePermissionLevel={inviteePermissionLevel}
                />,
            );

            expect(inviteePermissionLabel).toMatchSnapshot();
        });
    });
});
