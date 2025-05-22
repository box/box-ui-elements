// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import type { ItemType } from '../../common/types/core';

import { EDITOR, CO_OWNER, PREVIEWER, PREVIEWER_UPLOADER, VIEWER, VIEWER_UPLOADER, UPLOADER } from './constants';
import messages from './messages';

type Props = {
    description?: string,
    inviteePermissionLevel: string,
    itemType: ItemType,
};

const InviteePermissionDescription = ({ description, inviteePermissionLevel, itemType }: Props) => {
    if (description) {
        return <small className="usm-menu-description">{description}</small>;
    }

    const permissionDescriptions = {
        [EDITOR]: itemType === 'folder' ? messages.editorLevelDescription : messages.editorLevelFileDescription,
        [CO_OWNER]: messages.coownerLevelDescription,
        [VIEWER_UPLOADER]: messages.viewerUploaderLevelDescription,
        [PREVIEWER_UPLOADER]: messages.previewerUploaderLevelDescription,
        [VIEWER]: messages.viewerLevelDescription,
        [PREVIEWER]: messages.previewerLevelDescription,
        [UPLOADER]: messages.uploaderLevelDescription,
    };

    const defaultDescription = permissionDescriptions[inviteePermissionLevel];

    return (
        <small className="usm-menu-description">
            <FormattedMessage {...defaultDescription} />
        </small>
    );
};

export default InviteePermissionDescription;
