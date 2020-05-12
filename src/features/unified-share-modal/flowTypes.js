// @flow
import * as React from 'react';
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

export type SuggestedCollab = contactType & {
    userScore: number,
};

export type SuggestedCollabLookup = {
    [id: string]: SuggestedCollab,
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
        colorID?: number,
        title: string,
    },
    canUserSeeClassification: boolean,
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

type BaseUSMProps = {
    /** Inline message */
    allShareRestrictionWarning?: React.Node,
    /** Flag to determine whether to enable invite collaborators section */
    canInvite: boolean,
    /** Handler function that changes shared link access level */
    changeSharedLinkAccessLevel: (newAccessLevel: accessLevelType) => Promise<{ accessLevel: accessLevelType }>,
    /** Handler function that changes shared link permission level */
    changeSharedLinkPermissionLevel: (
        newPermissionLevel: permissionLevelType,
    ) => Promise<{ permissionLevel: permissionLevelType }>,
    /** Message warning about restrictions regarding inviting collaborators to the item */
    collaborationRestrictionWarning: React.Node,
    /** List of existing collaborators */
    collaboratorsList?: collaboratorsListType,
    /** Used to limit the number of contacts that can be added in the contacts field */
    contactLimit?: number,
    /** Whether the form should create a shared link on load */
    createSharedLinkOnLoad?: boolean,
    /** User ID of currently logged in user */
    currentUserID: string,
    /** Whether the form should focus the shared link after the URL is resolved */
    focusSharedLinkOnLoad?: boolean,
    /** Handler function for when the user types into invite collaborators field to fetch contacts. */
    getCollaboratorContacts: (query: string) => Promise<Array<contactType>>,
    /** Handler function that gets contacts by a list of emails */
    getContactsByEmail?: ({ emails: Array<string>, itemTypedID?: string }) => Promise<Object>,
    /** Handler function for getting intial data for form */
    getInitialData: Function,
    /** Handler function for when the user types into email shared link field to fetch contacts. */
    getSharedLinkContacts: (query: string) => Promise<Array<contactType>>,
    /** An array of initially selected contacts. If none are initially selected, an empty array. */
    initiallySelectedContacts: Array<contactType>,
    intl: any,
    /** An array of invitee permissions */
    inviteePermissions: Array<inviteePermissionType>,
    /** Item data */
    item: item,
    /** Handler function that adds the shared link */
    onAddLink: () => void,
    /** Handler for when there is an error copying to clipboard */
    onCopyError?: () => void,
    /** Handler for when we initiate copying from to clipboard */
    onCopyInit?: () => void,
    /** Handler for when successfully copying to clipboard */
    onCopySuccess?: () => void,
    /** Handler function that gets called whenever the user dismisses a tooltip on the given component identifier */
    onDismissTooltip?: (componentIdentifier: tooltipComponentIdentifierType) => void,
    /** Handler function that removes the shared link */
    onRemoveLink: () => void,
    /** Handler function for clicks on the settings icon. If not provided, the settings icon won't be rendered. */
    onSettingsClick?: Function,
    /** Shows a callout tooltip next to the names / email addresses input field explaining pre-populated recommendation */
    recommendedSharingTooltipCalloutName: ?string,
    /**
     * Function to send collab invitations based on the given parameters object.
     * This function should return a Promise.
     */
    sendInvites: (params: Object) => Promise<Object>,
    /** Message indicating an error occurred while sending the invites. */
    sendInvitesError: React.Node,
    /**
     * Function to send shared link email based on the given parameters object.
     * This function should return a Promise.
     */
    sendSharedLink: (params: Object) => Promise<Object>,
    /** Message indicating an error occurred while sending the shared link. */
    sendSharedLinkError: React.Node,
    /** Function hoists contact data upon updates to the parent component. Only needed for suggested collabs. */
    setUpdatedContacts?: (inviteCollabsContacts: Array<contactType>) => void,
    /** Shared link data */
    sharedLink: sharedLinkType,
    /** Determine whether to show the First-time experience tooltip on load */
    showCalloutForUser?: boolean,
    /** Shows a callout tooltip next to the names / email addresses input field encouraging users to fill out coworkers contact info */
    showEnterEmailsCallout?: boolean,
    /** Whether only the USF should be rendered */
    showFormOnly?: boolean,
    /** Shows a callout tooltip next gear icon with info about what can be customized */
    showSharedLinkSettingsCallout?: boolean,
    /**
     * Flag to show link to upgrade and get more access controls.
     * Only applicable to non-file item types.
     */
    showUpgradeOptions: boolean,
    /** Whether or not a request is in progress */
    submitting: boolean,
    /** Data for suggested collaborators shown at bottom of input box. UI doesn't render when this has length of 0. */
    suggestedCollaborators?: SuggestedCollabLookup,
    /** Mapping of components to the content that should be rendered in their tooltips */
    tooltips?: { [componentIdentifier: tooltipComponentIdentifierType]: React.Node },
    /** Object with props and handlers for tracking interactions */
    trackingProps: trackingPropsType,
};

// Prop types for the Unified Share Modal
export type USMProps = BaseUSMProps & {
    /** Whether the USM is open */
    isOpen?: boolean,
    /** ID for the item being shared - for use with V2 APIs only */
    itemID?: string,
    /** Type of the item being shared - for use with V2 APIs only */
    itemType?: string,
    /** Language for the USM/USF */
    language?: string,
    /** Handler function for when the USM is closed */
    onRequestClose?: Function,
    /** Access token - for use with V2 APIs only */
    token?: string,
};

// Prop types for the Unified Share Form
export type USFProps = BaseUSMProps & {
    closeConfirmModal: () => void,
    /** Function for closing the FTUX tooltip */
    handleFtuxCloseClick: () => void,
    /** Whether the data for the USM/USF is being fetched */
    isFetching: boolean,
    openConfirmModal: () => void,
    /** Whether the shared link has loaded */
    sharedLinkLoaded: boolean,
    /** Whether the FTUX tooltip should be rendered */
    shouldRenderFTUXTooltip: boolean,
};
