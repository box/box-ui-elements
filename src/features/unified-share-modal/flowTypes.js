// @flow
import * as React from 'react';
import * as constants from './constants';
import type { BoxItemPermission, ItemType } from '../../common/types/core';

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
    id: string,
    isExternalUser?: boolean,
    name?: string,
    text?: string,
    type: string,
    value?: string,
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
        title?: string,
    },
    canUserSeeClassification: boolean,
    classification?: string,
    description: string,
    extension: string,
    grantedPermissions: {
        itemShare: boolean,
    },
    hideCollaborators: boolean,
    id: string,
    name: string,
    ownerEmail?: string,
    ownerID?: string,
    permissions?: BoxItemPermission,
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
    expiration?: {
        executeAt: string,
    },
    hasCustomAvatar: boolean,
    imageURL: ?string,
    isExternalCollab?: boolean,
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

// Prop types used in the invite section of the Unified Share Form
type InviteSectionTypes = {
    /** Message warning about restrictions regarding inviting collaborators to the item */
    collaborationRestrictionWarning: React.Node,
    /** Used to limit the number of contacts that can be added in the contacts field */
    contactLimit?: number,
    /** Handler function for when the user types into invite collaborators field to fetch contacts. */
    getCollaboratorContacts: (query: string) => Promise<Array<contactType>>,
    /** Shows a callout tooltip next to the names / email addresses input field explaining pre-populated recommendation */
    recommendedSharingTooltipCalloutName: ?string,
    /**
     * Function to send collab invitations based on the given parameters object.
     * This function should return a Promise.
     */
    sendInvites: (params: Object) => Promise<Object>,
    /** Message indicating an error occurred while sending the invites. */
    sendInvitesError: React.Node,
    /** Function hoists contact data upon updates to the parent component. Only needed for suggested collabs. */
    setUpdatedContacts?: (inviteCollabsContacts: Array<contactType>) => void,
    /** Determine whether to show the First-time experience tooltip on load */
    showCalloutForUser?: boolean,
    /**
     * Flag to show link to upgrade and get more access controls.
     * Only applicable to non-file item types.
     */
    showUpgradeOptions: boolean,
    /** Data for suggested collaborators shown at bottom of input box. UI doesn't render when this has length of 0. */
    suggestedCollaborators?: SuggestedCollabLookup,
};

// Prop types used in the shared link section of the Unified Share Form
// (Note: while there is an overlap between these types and the props passed to the Shared Link Section component,
// they are different. See the render() function of the Unified Share Form for details.)
type SharedLinkSectionTypes = {
    /** Handler function that changes shared link access level */
    changeSharedLinkAccessLevel: (newAccessLevel: accessLevelType) => Promise<{ accessLevel: accessLevelType }>,
    /** Handler function that changes shared link permission level */
    changeSharedLinkPermissionLevel: (
        newPermissionLevel: permissionLevelType,
    ) => Promise<{ permissionLevel: permissionLevelType }>,
    /** Whether the form should create a shared link on load */
    createSharedLinkOnLoad?: boolean,
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
    /** Handler function for clicks on the settings icon. If not provided, the settings icon won't be rendered. */
    onSettingsClick?: Function,
    /** Shared link data */
    sharedLink: sharedLinkType,
    /** Shows a callout tooltip next gear icon with info about what can be customized */
    showSharedLinkSettingsCallout?: boolean,
    /** Mapping of components to the content that should be rendered in their tooltips */
    tooltips?: { [componentIdentifier: tooltipComponentIdentifierType]: React.Node },
};

// Prop types used in the collaborator avatars section of the Unified Share Form
type CollaboratorAvatarsTypes = {
    /** List of existing collaborators */
    collaboratorsList?: collaboratorsListType,
    /** User ID of currently logged in user */
    currentUserID: string,
};

type EmailFormTypes = {
    /** Function to retrieve the URL for an avatar, given contact details */
    getContactAvatarUrl?: (contact: contactType) => string,
    /** Handler function for when the user types into email shared link field to fetch contacts. */
    getSharedLinkContacts: (query: string) => Promise<Array<contactType>>,
    /**
     * Function to send shared link email based on the given parameters object.
     * This function should return a Promise.
     */
    sendSharedLink: (params: Object) => Promise<Object>,
    /** Message indicating an error occurred while sending the shared link. */
    sendSharedLinkError: React.Node,
};

export type USMConfig = {
    /** Whether the "Email Shared Link" button and form should be rendered in the USM/USF */
    showEmailSharedLinkForm: boolean,
};

// Prop types shared by both the Unified Share Modal and the Unified Share Form
type BaseUnifiedShareProps = CollaboratorAvatarsTypes &
    EmailFormTypes &
    InviteSectionTypes &
    SharedLinkSectionTypes & {
        /** Inline message */
        allShareRestrictionWarning?: React.Node,
        /** Flag to determine whether to enable invite collaborators section */
        canInvite: boolean,
        /** Configuration object for hiding parts of the USM */
        config?: USMConfig,
        /** Whether the full USM should be rendered */
        displayInModal?: boolean,
        /** Whether the form should focus the shared link after the URL is resolved */
        focusSharedLinkOnLoad?: boolean,
        /** Handler function that gets contacts by a list of emails */
        getContactsByEmail?: ({ emails: Array<string>, itemTypedID?: string }) => Promise<Object>,
        /** Handler function for getting intial data for form */
        getInitialData: Function,
        /** An array of initially selected contacts. If none are initially selected, an empty array. */
        initiallySelectedContacts: Array<contactType>,
        /** Intl object */
        intl: any,
        /** An array of invitee permissions */
        inviteePermissions: Array<inviteePermissionType>,
        /** Item data */
        item: item,
        /** Shows a callout tooltip next to the names / email addresses input field encouraging users to fill out coworkers contact info */
        showEnterEmailsCallout?: boolean,
        /** Whether or not a request is in progress */
        submitting: boolean,
        /** Object with props and handlers for tracking interactions */
        trackingProps: trackingPropsType,
    };

// Prop types for the Unified Share Modal
export type USMProps = BaseUnifiedShareProps & {
    /** Function for closing the Remove Link Confirm Modal */
    closeConfirmModal: () => void,
    /** Whether initial data for the USM has already been received */
    initialDataReceived: boolean,
    /** Whether the USM is open */
    isOpen?: boolean,
    /** Handler function that removes the shared link, used in the Remove Link Confirm Modal */
    onRemoveLink: () => void,
    /** Handler function for when the USM is closed */
    onRequestClose?: Function,
};

// Prop types for the Unified Share Form, passed from the Unified Share Modal
export type USFProps = BaseUnifiedShareProps & {
    /** Function for closing the FTUX tooltip */
    handleFtuxCloseClick: () => void,
    /** Whether the data for the USM/USF is being fetched */
    isFetching: boolean,
    /** Function for opening the Remove Link Confirm Modal */
    openConfirmModal: () => void,
    /** Whether the shared link has loaded */
    sharedLinkLoaded: boolean,
    /** Whether the FTUX tooltip should be rendered */
    shouldRenderFTUXTooltip: boolean,
};

export type InviteCollaboratorsRequest = {
    emailMessage: string,
    emails: string,
    groupIDs: string,
    numOfInviteeGroups: number,
    numsOfInvitees: number,
    permission: string,
};
