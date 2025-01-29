import type {
    Access,
    BoxItemClassification,
    BoxItemPermission,
    Collaboration,
    GroupMini,
    Item,
    ItemType,
    NewCollaboration,
    SharedLink as APISharedLink,
    UserMini,
} from '../../common/types/core';
import type {
    AccessLevelsDisabledReasonType,
    ContactType,
    InviteCollaboratorsRequest,
    SharedLinkType as USMSharedLinkType,
} from '../../features/unified-share-modal/types';
import type { RequestOptions } from '../../common/types/api';

export interface ContentSharingEnterpriseDataType {
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
interface SharedLinkCreatedType
    extends Omit<USMSharedLinkType, keyof SharedLinkNotCreatedType>,
        SharedLinkNotCreatedType {
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
    item: Item;
    sharedLink: ContentSharingSharedLinkType;
}

export interface ContentSharingItemAPIResponse {
    allowed_invitee_roles: string[];
    allowed_shared_link_access_levels?: string[];
    allowed_shared_link_access_levels_disabled_reasons?: AccessLevelsDisabledReasonType;
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
    handleError?: (error: Error) => void;
    handleRemoveSharedLinkError?: (error: Error) => void;
    handleRemoveSharedLinkSuccess?: () => void;
    handleSuccess?: (data: ContentSharingItemDataType) => void;
    handleUpdateSharedLinkError?: (error: Error) => void;
    handleUpdateSharedLinkSuccess?: () => void;
    setIsLoading?: (isLoading: boolean) => void;
    transformAccess?: (access: Access) => Access;
    transformGroups?: (groups: GroupMini[]) => GroupMini[];
    transformItem?: (item: Item) => Item;
    transformPermissions?: (permissions: BoxItemPermission) => BoxItemPermission;
    transformResponse?: (response: ContentSharingItemAPIResponse) => ContentSharingItemAPIResponse;
    transformSettings?: (settings: SharedLinkSettingsOptions) => SharedLinkSettingsOptions;
    transformUsers?: (users: UserMini[]) => UserMini[];
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

export type GetContactsFnType = () => (filterTerm: string) => Promise<Array<ContactType | GroupMini | UserMini>> | null;

export interface ContactByEmailObject {
    [key: string]: ContactType | UserMini | [];
}

export type GetContactsByEmailFnType = () => (filterTerm: {
    [emails: string]: string;
}) => Promise<ContactByEmailObject | Array<UserMini>> | null;

export type SendInvitesFnType = () => (request: InviteCollaboratorsRequest) => Promise<null | Array<() => void>>;

export type ConnectToItemShareFnType = (options: {
    access?: Access;
    errorFn?: (error: Error) => void;
    requestOptions?: RequestOptions;
    successFn?: (data: ContentSharingItemDataType) => void;
}) => () => void;

export interface AvatarURLMap {
    [key: number | string]: string | null;
}

export interface ConvertCollabOptions {
    avatarURLMap?: AvatarURLMap | null;
    collab: Collaboration;
    isCurrentUserOwner: boolean;
    ownerEmail: string | null;
}
