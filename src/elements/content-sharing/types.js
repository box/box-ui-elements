// @flow
import type { ItemType } from '../../common/types/core';
import type { item, sharedLinkType } from '../../features/unified-share-modal/flowTypes';

// "SLS" denotes values that are used in the Shared Link Settings modal
type ContentSharingEnterpriseDataType = {
    enterpriseName: string,
    serverURL: string, // SLS
};

export type ContentSharingUserDataType = {
    id: string,
    userEnterpriseData: ContentSharingEnterpriseDataType,
};

export type ContentSharingSharedLinkType =
    | { canInvite: boolean }
    | (sharedLinkType &
          ContentSharingEnterpriseDataType & {
              canChangeDownload: boolean, // SLS
              canChangePassword: boolean, // SLS
              canChangeVanityName: boolean, // SLS
              canInvite: boolean,
              directLink: string, // SLS
              isDirectLinkAvailable: boolean, // SLS
              isDownloadAvailable: boolean, // SLS
              isDownloadEnabled: boolean, // SLS
              isPasswordAvailable: boolean, // SLS
              isPasswordEnabled: boolean, // SLS
              vanityName: string,
          });

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
    permissions: {
        can_annotate: boolean,
        can_comment: boolean,
        can_delete: boolean,
        can_download: boolean,
        can_invite_collaborator: boolean,
        can_preview: boolean,
        can_rename: boolean,
        can_set_share_access: boolean,
        can_share: boolean,
        can_upload: boolean,
        can_view_annotations_all: boolean,
        can_view_annotations_self: boolean,
    },
    shared_link?: {
        access: string,
        download_count: number,
        download_url: string,
        effective_access: string,
        effective_permission: string,
        is_password_enabled: boolean,
        permissions: {
            can_download: boolean,
            can_preview: boolean,
        },
        preview_count: number,
        unshared_at: ?string,
        url: string,
        vanity_name: ?string,
        vanity_url: ?string,
    },
    shared_link_features: {
        download_url: boolean,
        password: boolean,
        vanity_name: boolean,
    },
    type: ItemType,
};
