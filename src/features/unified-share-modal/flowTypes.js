// @flow
import type { ItemType } from '../../common/types/core';
import * as constants from './constants';

// DRY: Invert the constants so that we can construct the appropriate enum types
const accessLevelValues = {
    [constants.ANYONE_WITH_LINK]: 'ANYONE_WITH_LINK',
    [constants.ANYONE_IN_COMPANY]: 'ANYONE_IN_COMPANY',
    [constants.PEOPLE_IN_ITEM]: 'PEOPLE_IN_ITEM',
};
export type accessLevelType = $Keys<typeof accessLevelValues>;

const permissionLevelValues = {
    [constants.CAN_VIEW_DOWNLOAD]: 'CAN_VIEW_DOWNLOAD',
    [constants.CAN_VIEW_ONLY]: 'CAN_VIEW_ONLY',
};
export type permissionLevelType = $Keys<typeof permissionLevelValues>;

const collaboratorGroupValues = {
    [constants.COLLAB_GROUP_TYPE]: 'COLLAB_GROUP_TYPE',
    [constants.COLLAB_USER_TYPE]: 'COLLAB_USER_TYPE',
    [constants.COLLAB_PENDING_TYPE]: 'COLLAB_PENDING_TYPE',
};
export type collaboratorGroupType = $Keys<typeof collaboratorGroupValues>;

export type allowedAccessLevelsType = {
    peopleInThisItem?: boolean,
    peopleInYourCompany?: boolean,
    peopleWithTheLink?: boolean,
};

export type accessLevelsDisabledReasonType = {
    peopleInThisItem?: 'access_policy' | null,
    peopleInYourCompany?: 'access_policy' | null,
    peopleWithTheLink?: 'access_policy' | null,
};

export type contactType = {
    email?: string,
    id: number | string,
    isExternalUser?: boolean,
    name?: string,
    text?: string,
    type: string,
    value?: number | string,
};

export type inviteePermissionType = {
    default: boolean,
    disabled?: boolean,
    text: string,
    value: string,
};

export type item = {
    bannerPolicy?: {
        body: string,
        title: string,
    },
    classification?: string,
    description: string,
    extension: string,
    grantedPermissions: {
        itemShare: boolean,
    },
    hideCollaborators: boolean,
    id: number,
    name: string,
    type: ItemType,
    typedID: string,
};

export type emailFormTrackingType = {
    cancelButtonProps?: Object,
    messageProps?: Object,
    onContactAdd?: Function,
    onContactRemove?: Function,
    onSendClick?: Function,
};

export type sharedLinkTrackingType = {
    copyButtonProps?: Object,
    onChangeSharedLinkAccessLevel?: Function,
    onChangeSharedLinkPermissionLevel?: Function,
    onSharedLinkAccessMenuOpen?: Function,
    onSharedLinkCopy?: Function,
    onToggleLink?: Function,
    sendSharedLinkButtonProps?: Object,
    sharedLinkAccessMenuButtonProps?: Object,
    sharedLinkPermissionsMenuButtonProps?: Object,
    sharedLinkSettingsButtonProps?: Object,
};

export type collaboratorListTrackingType = {
    doneButtonProps?: Object,
    emailProps?: Object,
    manageLinkProps?: Object,
    usernameProps?: Object,
    viewAdditionalProps?: Object,
};

export type trackingPropsType = {
    collaboratorListTracking: collaboratorListTrackingType,
    inviteCollabTracking: {
        inviteePermissionsButtonProps?: Object,
        onEnterInviteCollabs?: Function,
        onInviteePermissionChange?: Function,
    },
    inviteCollabsEmailTracking: {
        ...emailFormTrackingType,
        upgradeLinkProps?: Object,
    },
    modalTracking: {
        collaboratorAvatarsProps?: Object,
        ftuxConfirmButtonProps?: Object,
        modalProps?: Object,
        onLoad?: Function,
    },
    removeLinkConfirmModalTracking: {
        cancelButtonProps?: Object,
        modalProps?: Object,
        okayButtonProps?: Object,
        onLoad?: Function,
    },
    sharedLinkEmailTracking: emailFormTrackingType,
    sharedLinkTracking: sharedLinkTrackingType,
};

// this type is a strict subset of the SharedLinkRecord data returned from the server
export type sharedLinkType = {
    accessLevel: accessLevelType,
    accessLevelsDisabledReason?: accessLevelsDisabledReasonType,
    allowedAccessLevels: allowedAccessLevelsType,
    canChangeAccessLevel: boolean,
    enterpriseName: string,
    expirationTimestamp: ?number,
    isDownloadAllowed: boolean,
    isDownloadSettingAvailable: boolean,
    isEditAllowed: boolean,
    isNewSharedLink: boolean,
    isPreviewAllowed: boolean,
    permissionLevel: permissionLevelType,
    url: string,
};

export type collaboratorType = {
    collabID: number,
    hasCustomAvatar: boolean,
    imageURL: ?string,
    name: string,
    type: collaboratorGroupType,
    userID: ?number,
};

export type collaboratorsListType = {
    collaborators: Array<collaboratorType>,
};

export type tooltipComponentIdentifierType =
    | 'shared-link-access-menu'
    | 'shared-link-copy-button'
    | 'shared-link-settings'
    | 'shared-link-toggle';

export type suggestedCollaboratorsType = { [id: string]: { id: string, userScore: number } };
