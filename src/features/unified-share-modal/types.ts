import * as constants from './constants';
import type { BoxItemPermission, Collaboration, ItemType } from '../../common/types/core';

export interface ContactType {
    email?: string;
    id: string;
    isExternalUser?: boolean;
    name?: string;
    text?: string;
    type?: string | null | undefined;
    value?: string;
}

export type AccessLevelType =
    | typeof constants.ANYONE_WITH_LINK
    | typeof constants.ANYONE_IN_COMPANY
    | typeof constants.PEOPLE_IN_ITEM;

export interface AllowedAccessLevelsType {
    peopleInThisItem?: boolean;
    peopleInYourCompany?: boolean;
    peopleWithTheLink?: boolean;
}

export interface AccessLevelsDisabledReasonType {
    peopleInThisItem?:
        | typeof constants.DISABLED_REASON_ACCESS_POLICY
        | typeof constants.DISABLED_REASON_MALICIOUS_CONTENT
        | null;
    peopleInYourCompany?:
        | typeof constants.DISABLED_REASON_ACCESS_POLICY
        | typeof constants.DISABLED_REASON_MALICIOUS_CONTENT
        | null;
    peopleWithTheLink?:
        | typeof constants.DISABLED_REASON_ACCESS_POLICY
        | typeof constants.DISABLED_REASON_MALICIOUS_CONTENT
        | null;
}

export interface Item {
    bannerPolicy?: {
        body: string;
        colorID?: number;
        title?: string;
    };
    canUserSeeClassification: boolean;
    classification?: string;
    description: string;
    extension: string;
    grantedPermissions: {
        itemShare: boolean;
    };
    hideCollaborators: boolean;
    id: string;
    name: string;
    ownerEmail?: string;
    ownerID?: string;
    permissions?: BoxItemPermission;
    type: ItemType;
    typedID: string;
}

export interface SharedLinkType {
    accessLevel: AccessLevelType;
    accessLevelsDisabledReason?: AccessLevelsDisabledReasonType;
    allowedAccessLevels: AllowedAccessLevelsType;
    canChangeAccessLevel: boolean;
    enterpriseName: string;
    expirationTimestamp: number | null;
    isDownloadAllowed: boolean;
    isDownloadSettingAvailable: boolean;
    isEditAllowed: boolean;
    isEditSettingAvailable: boolean;
    isNewSharedLink: boolean;
    isPreviewAllowed: boolean;
    permissionLevel: typeof constants.CAN_EDIT | typeof constants.CAN_VIEW_DOWNLOAD | typeof constants.CAN_VIEW_ONLY;
    url: string;
}

export interface USMConfig {
    collaboratorsList?: {
        name: string;
        id: string;
    }[];
    focusSharedLinkOnLoad?: boolean;
    hasCustomSharedLinkMessages?: boolean;
    isContactsDisabledForExternalUsers?: boolean;
    isUploadsFolderEnabled?: boolean;
    showCalloutForUser?: boolean;
    showUpgradeOptions?: boolean;
    upgradeUrl?: string;
}

export interface CollaboratorListType {
    collaborators: Array<Collaboration>;
    hasNextPage: boolean;
    nextMarker: string | null;
}

export type { InviteCollaboratorsRequest } from './flowTypes';
