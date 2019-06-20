// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';

import type { ItemType } from '../../common/types/core';

import { EDITOR, CO_OWNER, PREVIEWER, PREVIEWER_UPLOADER, VIEWER, VIEWER_UPLOADER, UPLOADER } from './constants';
import InviteePermissionsDescription from './InviteePermissionsDescription';
import messages from './messages';

type Props = {
    hasDescription?: boolean,
    inviteePermissionLevel: string,
    itemType: ItemType,
};

const InviteePermissionsLabel = ({ hasDescription, inviteePermissionLevel, itemType }: Props) => {
    const permissionOptionsTexts = {
        [EDITOR]: messages.editorLevelText,
        [CO_OWNER]: messages.coownerLevelText,
        [VIEWER_UPLOADER]: messages.viewerUploaderLevelText,
        [PREVIEWER_UPLOADER]: messages.previewerUploaderLevelText,
        [VIEWER]: messages.viewerLevelText,
        [PREVIEWER]: messages.previewerLevelText,
        [UPLOADER]: messages.uploaderLevelText,
    };

    const permissionLabelTexts = {
        [EDITOR]: messages.editorLevelButtonLabel,
        [CO_OWNER]: messages.coownerLevelButtonLabel,
        [VIEWER_UPLOADER]: messages.viewerUploaderLevelButtonLabel,
        [PREVIEWER_UPLOADER]: messages.previewerUploaderLevelButtonLabel,
        [VIEWER]: messages.viewerLevelButtonLabel,
        [PREVIEWER]: messages.previewerLevelButtonLabel,
        [UPLOADER]: messages.uploaderLevelButtonLabel,
    };

    return hasDescription ? (
        <span>
            <strong>
                <FormattedMessage {...permissionOptionsTexts[inviteePermissionLevel]} />{' '}
            </strong>
            <InviteePermissionsDescription inviteePermissionLevel={inviteePermissionLevel} itemType={itemType} />
        </span>
    ) : (
        <FormattedMessage {...permissionLabelTexts[inviteePermissionLevel]} />
    );
};

export default InviteePermissionsLabel;
