import type {
    Access,
    BoxItemClassification,
    BoxItemPermission,
    Collaboration,
    GroupMini,
    ItemType,
    NewCollaboration,
    SharedLink as APISharedLink,
    UserMini,
} from '../../common/types/core';
import type {
    accessLevelsDisabledReasonType,
    contactType,
    InviteCollaboratorsRequest,
    item,
    sharedLinkType as USMSharedLinkType,
} from '../../features/unified-share-modal/flowTypes';
import type { RequestOptions } from '../../common/types/api';

// "SLS" denotes values that are used in the Shared Link Settings modal
interface ContentSharingEnterpriseDataType {
    enterpriseName?: string;
    serverURL?: string; // SLS
}

export interface ContentSharingUserDataType {
    id: string;
    userEnterpriseData: ContentSharingEnterpriseDataType;
}

// This type is used when an item does not have a shared link.
interface SharedLinkNotCreatedType {
    accessLevel?: string;
    canChangeExpiration?: boolean;
    canInvite: boolean;
    expirationTimestamp?: number | null;
    isDownloadAvailable?: boolean;
}

// This is the full shared link type, which extends the internal USM shared link with
// data necessary for instantiating the Shared Link Settings modal.
interface SharedLinkCreatedType extends USMSharedLinkType, SharedLinkNotCreatedType {
    canChangeDownload: boolean; // SLS
    canChangeExpiration: boolean; // SLS
    canChangePassword: boolean; // SLS
    canChangeVanityName: boolean; // SLS
    directLink: string; // SLS
    isDirectLinkAvailable: boolean; // SLS
    isDownloadAvailable: boolean; // SLS
    isDownloadEnabled: boolean; // SLS
    isPasswordAvailable: boolean; // SLS
    isPasswordEnabled: boolean; // SLS
    vanityName: string;
}

export type ContentSharingSharedLinkType = ContentSharingEnterpriseDataType &
    (SharedLinkNotCreatedType | SharedLinkCreatedType);

export interface ContentSharingItemDataType {
    item: item;
    sharedLink: ContentSharingSharedLinkType;
}

export interface ContentSharingItemAPIResponse {
    allowed_invitee_roles: Array<string>;
    allowed_shared_link_access_levels?: Array<string>;
    allowed_shared_link_access_levels_disabled_reasons?: accessLevelsDisabledReasonType;
    classification: BoxItemClassification | null;
    description: string;
    etag: string;
    extension: string;
    id: string;
    name: string;
    owned_by: {
        id: string;
        login: string;
    };
    permissions: BoxItemPermission;
    shared_link?: APISharedLink;
    shared_link_features: {
        download_url: boolean;
        password: boolean;
        vanity_name: boolean;
    };
    type: ItemType;
}

export interface ContentSharingHooksOptions {
    handleError?: Function;
    handleRemoveSharedLinkError?: Function;
    handleRemoveSharedLinkSuccess?: Function;
    handleSuccess?: Function;
    handleUpdateSharedLinkError?: Function;
    handleUpdateSharedLinkSuccess?: Function;
    setIsLoading?: Function;
    transformAccess?: Function;
    transformGroups?: Function;
    transformItem?: Function;
    transformPermissions?: Function;
    transformResponse?: Function;
    transformSettings?: Function;
    transformUsers?: Function;
}

export interface SharedLinkSettingsOptions {
    expirationTimestamp: number;
    isDownloadEnabled: boolean;
    isExpirationEnabled: boolean;
    isPasswordEnabled: boolean;
    password: string;
    vanityName: string;
}

export interface ContentSharingCollaborationsRequest {
    groups: Array<Partial<NewCollaboration>>;
    users: Array<Partial<NewCollaboration>>;
}

export interface UseInvitesOptions extends ContentSharingHooksOptions {
    transformRequest: (request: InviteCollaboratorsRequest) => ContentSharingCollaborationsRequest;
}

export type SharedLinkUpdateLevelFnType = () => (level: string) => Promise<void>;

export type SharedLinkUpdateSettingsFnType = () => (settings: Partial<APISharedLink>) => Promise<void>;

export type GetContactsFnType = () => (filterTerm: string) => Promise<Array<contactType | GroupMini | UserMini>> | null;

export type ContactByEmailObject = { [key: string]: contactType | UserMini | [] };

export type GetContactsByEmailFnType = () => (filterTerm: {
    emails: string[];
}) => Promise<ContactByEmailObject | Array<UserMini>> | null;

export type SendInvitesFnType = () => (request: InviteCollaboratorsRequest) => Promise<null | Array<Function>>;

export type ConnectToItemShareFnType = (options: {
    access?: Access;
    errorFn?: Function;
    requestOptions?: RequestOptions;
    successFn?: Function;
}) => Function;

export type AvatarURLMap = { [key: number | string]: string | null };

export interface ConvertCollabOptions {
    avatarURLMap?: AvatarURLMap | null;
    collab: Collaboration;
    isCurrentUserOwner: boolean;
    ownerEmail: string | null;
}
