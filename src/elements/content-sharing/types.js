// @flow
import type { BoxItemPermission, ItemType, SharedLink as APISharedLink } from '../../common/types/core';
import type { item, sharedLinkType as USMSharedLinkType } from '../../features/unified-share-modal/flowTypes';

// "SLS" denotes values that are used in the Shared Link Settings modal
type ContentSharingEnterpriseDataType = {
    enterpriseName?: string,
    serverURL?: string, // SLS
};

export type ContentSharingUserDataType = {
    id: string,
    userEnterpriseData: ContentSharingEnterpriseDataType,
};

// This type is used when an item does not have a shared link.
type SharedLinkNotCreatedType = { canInvite: boolean };

// This is the full shared link type, which extends the internal USM shared link with
// data necessary for instantiating the Shared Link Settings modal.
type SharedLinkCreatedType = USMSharedLinkType &
    SharedLinkNotCreatedType & {
        canChangeDownload: boolean, // SLS
        canChangePassword: boolean, // SLS
        canChangeVanityName: boolean, // SLS
        directLink: string, // SLS
        isDirectLinkAvailable: boolean, // SLS
        isDownloadAvailable: boolean, // SLS
        isDownloadEnabled: boolean, // SLS
        isPasswordAvailable: boolean, // SLS
        isPasswordEnabled: boolean, // SLS
        vanityName: string,
    };

export type ContentSharingSharedLinkType = ContentSharingEnterpriseDataType &
    (SharedLinkNotCreatedType | SharedLinkCreatedType);

export type ContentSharingItemDataType = {
    item: item,
    sharedLink: ContentSharingSharedLinkType,
};

export type ContentSharingItemAPIResponse = {
    allowed_invitee_roles: Array<string>,
    description: string,
    etag: string,
    extension: string,
    id: string,
    name: string,
    permissions: BoxItemPermission,
    shared_link?: APISharedLink,
    shared_link_features: {
        download_url: boolean,
        password: boolean,
        vanity_name: boolean,
    },
    type: ItemType,
};
