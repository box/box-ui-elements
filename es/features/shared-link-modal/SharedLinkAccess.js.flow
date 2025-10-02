/* @flow */
import * as React from 'react';

import AccessDescription from './AccessDescription';
import AccessMenu from './AccessMenu';
import PermissionMenu from './PermissionMenu';

import { accessLevelPropType, allowedAccessLevelsPropType, permissionLevelPropType } from './propTypes';

type Props = {
    accessDropdownMenuProps?: Object,
    accessLevel?: accessLevelPropType,
    accessMenuButtonProps?: Object,
    allowedAccessLevels?: allowedAccessLevelsPropType,
    canRemoveLink?: boolean,
    changeAccessLevel: Function,
    changePermissionLevel?: Function,
    enterpriseName?: string,
    isDownloadAllowed?: boolean,
    isEditAllowed?: boolean,
    isPreviewAllowed?: boolean,
    itemType: string,
    permissionLevel?: permissionLevelPropType,
    removeLink: Function,
    removeLinkButtonProps?: Object,
    submitting?: boolean,
};

const SharedLinkAccess = (props: Props) => {
    const {
        accessDropdownMenuProps,
        accessLevel,
        accessMenuButtonProps,
        allowedAccessLevels,
        canRemoveLink,
        changeAccessLevel,
        changePermissionLevel,
        enterpriseName,
        isDownloadAllowed,
        isEditAllowed,
        isPreviewAllowed,
        itemType,
        permissionLevel,
        removeLink,
        removeLinkButtonProps,
        submitting,
    } = props;

    return (
        <div className="shared-link-access">
            <AccessDescription
                accessLevel={accessLevel}
                enterpriseName={enterpriseName}
                isDownloadAllowed={isDownloadAllowed}
                isEditAllowed={isEditAllowed}
                isPreviewAllowed={isPreviewAllowed}
                itemType={itemType}
            />
            <AccessMenu
                accessDropdownMenuProps={accessDropdownMenuProps}
                accessLevel={accessLevel}
                accessMenuButtonProps={accessMenuButtonProps}
                allowedAccessLevels={allowedAccessLevels}
                canRemoveLink={canRemoveLink}
                changeAccessLevel={changeAccessLevel}
                enterpriseName={enterpriseName}
                isDownloadAllowed={isDownloadAllowed}
                isEditAllowed={isEditAllowed}
                isPreviewAllowed={isPreviewAllowed}
                itemType={itemType}
                removeLink={removeLink}
                removeLinkButtonProps={removeLinkButtonProps}
                submitting={submitting}
            />
            <PermissionMenu
                changePermissionLevel={changePermissionLevel}
                permissionLevel={permissionLevel}
                submitting={submitting}
            />
        </div>
    );
};

export default SharedLinkAccess;
