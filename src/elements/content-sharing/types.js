// @flow
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
type ContentSharingEnterpriseDataType = {
    enterpriseName?: string,
    serverURL?: string, // SLS
};

export type ContentSharingUserDataType = {
    id: string,
    userEnterpriseData: ContentSharingEnterpriseDataType,
};

// This type is used when an item does not have a shared link.
type SharedLinkNotCreatedType = {
    accessLevel?: string,
    canChangeExpiration?: boolean,
    canInvite: boolean,
    expirationTimestamp?: ?number,
    isDownloadAvailable?: boolean,
};

// This is the full shared link type, which extends the internal USM shared link with
// data necessary for instantiating the Shared Link Settings modal.
type SharedLinkCreatedType = USMSharedLinkType &
    SharedLinkNotCreatedType & {
        canChangeDownload: boolean, // SLS
        canChangeExpiration: boolean, // SLS
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
    allowed_shared_link_access_levels?: Array<string>,
    allowed_shared_link_access_levels_disabled_reasons?: accessLevelsDisabledReasonType,
    classification: ?BoxItemClassification,
    description: string,
    etag: string,
    extension: string,
    id: string,
    name: string,
    owned_by: {
        id: string,
        login: string,
    },
    permissions: BoxItemPermission,
    shared_link?: APISharedLink,
    shared_link_features: {
        download_url: boolean,
        password: boolean,
        vanity_name: boolean,
    },
    type: ItemType,
};

export type ContentSharingHooksOptions = {
    handleError?: Function,
    handleRemoveSharedLinkError?: Function,
    handleRemoveSharedLinkSuccess?: Function,
    handleSuccess?: Function,
    handleUpdateSharedLinkError?: Function,
    handleUpdateSharedLinkSuccess?: Function,
    setIsLoading?: Function,
    transformAccess?: Function,
    transformGroups?: Function,
    transformItem?: Function,
    transformPermissions?: Function,
    transformResponse?: Function,
    transformSettings?: Function,
    transformUsers?: Function,
};

export type SharedLinkSettingsOptions = {
    expirationTimestamp: number,
    isDownloadEnabled: boolean,
    isExpirationEnabled: boolean,
    isPasswordEnabled: boolean,
    password: string,
    vanityName: string,
};

export type ContentSharingCollaborationsRequest = {
    groups: Array<$Shape<NewCollaboration>>,
    users: Array<$Shape<NewCollaboration>>,
};

export type UseInvitesOptions = ContentSharingHooksOptions & {
    transformRequest: InviteCollaboratorsRequest => ContentSharingCollaborationsRequest,
};

export type SharedLinkUpdateLevelFnType = () => (level: string) => Promise<void>;

export type SharedLinkUpdateSettingsFnType = () => ($Shape<APISharedLink>) => Promise<void>;

export type GetContactsFnType = () => (filterTerm: string) => Promise<Array<contactType | GroupMini | UserMini>> | null;

export type ContactByEmailObject = { [string]: contactType | UserMini | [] };

export type GetContactsByEmailFnType = () => (filterTerm: {
    [emails: string]: string,
}) => Promise<ContactByEmailObject | Array<UserMini>> | null;

export type SendInvitesFnType = () => InviteCollaboratorsRequest => Promise<null | Array<Function>>;

export type ConnectToItemShareFnType = ({
    access?: Access,
    errorFn?: Function,
    requestOptions?: RequestOptions,
    successFn?: Function,
}) => Function;

export type AvatarURLMap = { [number | string]: ?string };

export type ConvertCollabOptions = {
    avatarURLMap?: ?AvatarURLMap,
    collab: Collaboration,
    isCurrentUserOwner: boolean,
    ownerEmail: ?string,
};

// ContentSharingV2 types
interface Enterprise {
    name?: string;
}

export interface User {
    id: string;
    enterprise: Enterprise;
}

export interface SharedLink {
    /**
     * The access level of the shared link.
     */
    access?: AccessLevelType;
    /**
     * The available access levels for the shared link. The allowed levels are dependent on the Enterprise settings.
     */
    accessLevels?: (AccessLevel | AccessLevelType)[];
    /**
     * The expiration timestamp of the shared link to indicate when the item will be unshared.
     */
    expiresAt?: number;
    /**
     * The permission level of the shared link.
     */
    permission?: PermissionLevelType;
    /**
     * The available permission levels for the shared link. The allowed levels are dependent on the Item and Enterprise settings.
     */
    permissionLevels?: (PermissionLevel | PermissionLevelType)[];
    /**
     * The configuration options and permissions for managing the shared link settings.
     */
    settings?: SharedLinkSettings;
    /**
     * The URL that can be used to access the shared item.
     */
    url: string;
    /**
     * The static domain portion of the shared link. Used with `vanityName` to preview the custom URL.
     */
    vanityDomain?: string;
    /**
     * The custom name of the shared link. Used with `vanityDomain` to preview the custom URL.
     */
    vanityName?: string;
}

export interface CollaborationRole {
    /**
     * The description for the role. Supported roles have default descriptions.
     */
    description?: string;
    /**
     * The ID of the role. The value must be one of the supported roles within the Enterprise.
     *
     * If the value does not match a supported role, the role is treated as a custom collaboration role.
     */
    id: InvitationRole | string;
    /**
     * When `true`, the role will be the default selected collaboration role.
     */
    isDefault?: boolean;
    /**
     * When `true`, the role will be disabled when selecting a collaboration role.
     */
    isDisabled?: boolean;
    /**
     * The label for the role. Supported roles have default labels.
     */
    label?: string;
}

export interface Classification {
    colorId: number;
    definition: string;
    name: string;
    restrictions?: string;
}

export interface Item {
    /**
     * The classification of the item.
     */
    classification?: Classification;
    /**
     * The ID of the item.
     */
    id: string;
    /**
     * The name of the item.
     */
    name: string;
    /**
     * The permissions that the current user has for the item.
     */
    permissions?: {
        /**
         * When `true`, the user can invite collaborators on the item.
         */
        canInviteCollaborator?: boolean,
        /**
         * When `true`, the user can change the access level of the shared link.
         */
        canSetShareAccess?: boolean,
        /**
         * When `true`, the user can create a shared link for the item.
         */
        canShare?: boolean,
    };
    /**
     * The type of the item.
     */
    type: ItemType;
}

export interface ItemData {
    collaborationRoles: CollaborationRole[];
    item: Item;
    sharedLink: SharedLink;
}
