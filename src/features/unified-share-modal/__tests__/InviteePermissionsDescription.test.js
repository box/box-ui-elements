import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { EDITOR, CO_OWNER, PREVIEWER, PREVIEWER_UPLOADER, VIEWER, VIEWER_UPLOADER, UPLOADER } from '../constants';
import InviteePermissionsDescription from '../InviteePermissionsDescription';

describe('features/unified-share-modal/InviteePermissionsDescription', () => {
    [
        {
            inviteePermissionLevel: EDITOR,
        },
        {
            inviteePermissionLevel: CO_OWNER,
        },
        {
            inviteePermissionLevel: PREVIEWER,
        },
        {
            inviteePermissionLevel: PREVIEWER_UPLOADER,
        },
        {
            inviteePermissionLevel: VIEWER,
        },
        {
            inviteePermissionLevel: VIEWER_UPLOADER,
        },
        {
            inviteePermissionLevel: UPLOADER,
        },
    ].forEach(({ inviteePermissionLevel }) => {
        test('it should render correct description', () => {
            const inviteePermissionDescription = shallow(
                <InviteePermissionsDescription inviteePermissionLevel={inviteePermissionLevel} itemType="folder" />,
            );

            expect(inviteePermissionDescription).toMatchSnapshot();
        });
    });

    test('it should render correct description for editors of files', () => {
        const inviteePermissionDescription = shallow(
            <InviteePermissionsDescription inviteePermissionLevel={EDITOR} itemType="file" />,
        );
        expect(inviteePermissionDescription.find(FormattedMessage).prop('defaultMessage')).toBe(
            'Upload, download, preview, share, and edit',
        );
    });

    test('should render custom description when supplied', () => {
        const customDescription = 'Upload, download, preview, share, and edit';
        const inviteePermissionDescription = shallow(
            <InviteePermissionsDescription
                inviteePermissionLevel={EDITOR}
                itemType="file"
                customDescription={customDescription}
            />,
        );

        const description = inviteePermissionDescription.find('small').text();

        expect(description).toBe(customDescription);
    });
});
