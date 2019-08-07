import { defineMessages } from 'react-intl';

const messages = defineMessages({
    contentSharedWithExternalCollaborators: {
        defaultMessage: 'This content will be shared with external collaborators.',
        description: 'Text shown in share modal when there is at least one external collaborators',
        id: 'boxui.unifiedShare.contentSharedWithExternalCollaborators',
    },
    disabledShareLinkPermission: {
        defaultMessage: 'This option isn’t available for this item due to a security restriction or classification.',
        description:
            'Tooltip text for when shared permission option is not available due to restriction or classification',
        id: 'boxui.unifiedShare.disabledShareLinkPermission',
    },
    enterAtLeastOneEmailError: {
        defaultMessage: 'Enter at least one valid email',
        description: 'Error message when user tries to send Shared Link as email without entering any recipients',
        id: 'boxui.unifiedShare.enterAtLeastOneEmail',
    },
    contactsExceedLimitError: {
        defaultMessage:
            'Oops! The maximum number of collaborators that can be added at once is {maxContacts} collaborators. Please try again by splitting your invitations into batches.',
        description: 'Error message when more than the maximum number of contacts is entered',
        id: 'boxui.unifiedShare.contactsExceedLimitError',
    },
    enterEmailAddressesCalloutText: {
        defaultMessage: 'Share this item with coworkers by entering their email addresses',
        description:
            'Tooltip text shown in the share modal, encouraging users to enter email addresses to share the item with',
        id: 'boxui.unifiedShare.enterEmailAddressesCalloutText',
    },
    ftuxNewUSMUserTitle: {
        defaultMessage: 'Simplified sharing for files and folders',
        description: 'This title appears in the callout when loading the modal, to let users know about the new UI',
        id: 'boxui.unifiedShare.ftuxNewUsmUserTitle',
    },
    ftuxNewUSMUserBody: {
        defaultMessage:
            "We’ve simplified the sharing experience when you click 'Share'. Invite people to this item here and toggle the link on or off below for easy sharing.",
        description: 'This text describes the purpose of the new UI, using the button label to open the modal',
        id: 'boxui.unifiedShare.ftuxNewUSMUserBody',
    },
    ftuxLinkText: {
        defaultMessage: 'Read more about shared link security here.',
        description: 'Text on the link which allows to learn more about link security',
        id: 'boxui.unifiedShare.ftuxLinkText',
    },
    ftuxConfirmLabel: {
        defaultMessage: 'Got it',
        description: 'This is label for the button so a user understands the new interface',
        id: 'boxui.unifiedShare.ftuxConfirmLabel',
    },
    collaboratorListTitle: {
        defaultMessage: "People in '{itemName}'",
        description: 'Title for collaborator list modal',
        id: 'boxui.unifiedShare.collaboratorListTitle',
    },
    expirationTooltipClickableText: {
        defaultMessage: 'Access expires on {date}. Click for details.',
        description: 'This string is displayed as tooltip on hovering over expire icon for collab',
        id: 'boxui.unifiedShare.collaborators.expirationTooltipClickableText',
    },
    groupLabel: {
        defaultMessage: 'Group',
        description: 'Label for a Group contact type',
        id: 'boxui.unifiedShare.groupLabel',
    },
    modalTitle: {
        defaultMessage: "Share '{itemName}'",
        description: 'Title of the Unified Share Modal. {itemName} is the name of the file / folder being shared',
        id: 'boxui.unifiedShare.modalTitle',
    },
    emailModalTitle: {
        defaultMessage: "Send Link to '{itemName}'",
        description:
            'The message to show when you have clicked the button to send the email to a new collaborator (title case)',
        id: 'boxui.unifiedShare.emailModalTitle',
    },
    inviteDisabledTooltip: {
        defaultMessage: 'You do not have permission to invite collaborators.',
        description: 'Invite Collaborators disabled state tooltip',
        id: 'boxui.unifiedShare.inviteDisabledTooltip',
    },
    inviteDisabledWeblinkTooltip: {
        defaultMessage: 'Collaborators cannot be added to bookmarks.',
        description: 'Invite Collaborators disabled state tooltip due to item being weblink',
        id: 'boxui.unifiedShare.inviteDisabledWeblinkTooltip',
    },
    inviteFieldLabel: {
        defaultMessage: 'Invite People',
        description: 'Label of the field where a user designates who to invite to collaborate on an item',
        id: 'boxui.unifiedShare.inviteFieldLabel',
    },
    sharedLinkSectionLabel: {
        defaultMessage: 'Share Link',
        description: 'Label for the shared link section of the unified share modal',
        id: 'boxui.unifiedShare.sharedLinkSectionLabel',
    },
    settingsButtonLabel: {
        defaultMessage: 'Open shared link settings popup',
        description: 'Accessible label for button that loads share settings popup',
        id: 'boxui.unifiedShare.settingsButtonLabel',
    },
    linkShareOff: {
        defaultMessage: 'Enable shared link',
        description: 'Enable shared link',
        id: 'boxui.unifiedShare.linkShareOff',
    },
    linkShareOn: {
        defaultMessage: 'Shared link is enabled',
        description: 'Link sharing is on',
        id: 'boxui.unifiedShare.linkShareOn',
    },
    messageTitle: {
        defaultMessage: 'Message',
        description: 'Label for "Message" text box to email the Shared Link',
        id: 'boxui.unifiedShare.message',
    },
    suggestedCollabsTitle: {
        defaultMessage: 'Suggested',
        description: 'Title for suggested collaborators that can be added to the form',
        id: 'boxui.unifiedShare.suggestedCollabsTitle',
    },

    // shared link access labels
    peopleInEnterpriseName: {
        defaultMessage: 'People in {enterpriseName}',
        description: 'Label for "People in {enterpriseName}" option',
        id: 'boxui.unifiedShare.peopleInEnterpriseName',
    },
    peopleInYourCompany: {
        defaultMessage: 'People in your company',
        description: 'Label for "People in your company" option',
        id: 'boxui.unifiedShare.peopleInYourCompany',
    },
    peopleInThisFolder: {
        defaultMessage: 'Invited people only',
        description: 'Label for "People in this folder" option',
        id: 'boxui.unifiedShare.peopleInThisFolder',
    },
    peopleInThisFile: {
        defaultMessage: 'Invited people only',
        description: 'Label for "People in this file" option',
        id: 'boxui.unifiedShare.peopleInThisFile',
    },
    peopleWithTheLinkText: {
        defaultMessage: 'People with the link',
        description: 'Text to show that those having the link will have access',
        id: 'boxui.unifiedShare.peopleWithTheLinkText',
    },

    removeLinkConfirmationTitle: {
        defaultMessage: 'Remove Shared Link',
        description: 'Label for confirmation modal to remove a Shared Link',
        id: 'boxui.unifiedShare.removeLinkConfirmationTitle',
    },
    removeLinkConfirmationDescription: {
        defaultMessage:
            'This will permanently remove the shared link. If this item is embedded on other sites it will also become inaccessible. Any custom properties, settings and expirations will be removed as well. Do you want to continue?',
        description: 'Description for confirmation modal to remove a Shared Link',
        id: 'boxui.unifiedShare.removeLinkConfirmationDescription',
    },
    removeLinkTooltip: {
        defaultMessage: 'You do not have permission to remove the link.',
        description: 'Tooltip description for not having access to remove link',
        id: 'boxui.unifiedShare.removeLinkTooltip',
    },
    sendSharedLink: {
        defaultMessage: 'Send Shared Link',
        description: 'Label for text input to enter email addresses to send Shared Link to',
        id: 'boxui.unifiedShare.sendSharedLink',
    },
    sendSharedLinkFieldLabel: {
        defaultMessage: 'Email Shared Link',
        description: 'Label of the field where a user designates who to send shared link to',
        id: 'boxui.unifiedShare.sendSharedLinkFieldLabel',
    },
    sharedLinkExpirationTooltip: {
        defaultMessage: 'This link will expire and be inaccessible on {expiration, date, long}.',
        description:
            'Tooltip describing when this shared link will expire. {expiration, date, long} is the formatted date',
        id: 'boxui.unifiedShare.sharedLinkExpirationTooltip',
    },

    // shared link permissions
    sharedLinkPermissionsViewDownload: {
        defaultMessage: 'Can view and download',
        description: 'Label for a Shared Link permission level',
        id: 'boxui.unifiedShare.sharedLinkPermissionsViewDownload',
    },
    sharedLinkPermissionsViewDownloadDescription: {
        defaultMessage: 'Users can view and download',
        description: 'Description for Can view and download option',
        id: 'boxui.unifiedShare.sharedLinkPermissionsViewDownloadDescription',
    },
    sharedLinkPermissionsViewOnly: {
        defaultMessage: 'Can view only',
        description: 'Label for a Shared Link permission level',
        id: 'boxui.unifiedShare.sharedLinkPermissionsViewOnly',
    },
    sharedLinkPermissionsEdit: {
        defaultMessage: 'Can edit',
        description: 'Label for a Shared Link permission to show for editable box notes',
        id: 'boxui.unifiedShare.sharedLinkPermissionsEdit',
    },
    sharedLinkPermissionsEditTooltip: {
        defaultMessage: 'This permission can only be changed in Box Notes',
        description: 'Text to use in the tooltip when presenting an editable Box Note (DO NOT TRANSLATE "Box Notes")',
        id: 'boxui.unifiedShare.sharedLinkPermissionsEditTooltip',
    },
    sharedLinkPermissionsViewOnlyDescription: {
        defaultMessage: 'Users can view only',
        description: 'Description for Can view only option',
        id: 'boxui.unifiedShare.sharedLinkPermissionsViewOnlyDescription',
    },
    sharedLinkDisabledTooltipCopy: {
        defaultMessage: 'Create and copy link for sharing',
        description: 'This tooltip appears over the shared link toggle, explaining what happens when it is clicked',
        id: 'boxui.unifiedShare.sharedLinkDisabledTooltipCopy',
    },
    sharedLinkSettingsCalloutText: {
        defaultMessage: 'Create a custom URL, enable password protection, enable link expiration, and much more',
        description:
            'Tooltip text shown in the share modal, next to the settings gear, describing what settings can be changed',
        id: 'boxui.unifiedShare.sharedLinkSettingsCalloutText',
    },
    sharedLinkPubliclyAvailable: {
        defaultMessage: 'This content is publicly available to anyone with the link.',
        description: 'Text shown in share modal when shared link is open to public access',
        id: 'boxui.unifiedShare.sharedLinkPubliclyAvailable',
    },
    upgradeGetMoreAccessControlsDescription: {
        defaultMessage:
            '62% of customers on your plan {upgradeGetMoreAccessControlsLink} to manage collaborators’ access and permission settings',
        description: 'Description for cta to upgrade to get more access controls for inviting collaborators to an item',
        id: 'boxui.unifiedShare.upgradeGetMoreAccessControlsDescription',
    },
    upgradeGetMoreAccessControlsLink: {
        defaultMessage: 'upgrade',
        description: 'Label for link to upgrade to get more access controls for inviting collaborators to an item',
        id: 'boxui.unifiedShare.upgradeGetMoreAccessControlsLink',
    },
    sharedLinkSettings: {
        defaultMessage: 'Link Settings',
        description: 'Description of the shared link settings modal entry point. This shows link-specific options.',
        id: 'boxui.unifiedShare.sharedLinkSettings',
    },

    // shared link access descriptions
    peopleWithLinkDescription: {
        defaultMessage: 'Publicly accessible and no sign-in required',
        description: 'Description of an open shared link',
        id: 'boxui.unifiedShare.peopleWithLinkDescription',
    },
    peopleInSpecifiedCompanyCanAccessFolder: {
        defaultMessage: 'Anyone at {company} with the link or people invited to this folder can access',
        description: 'Description of a specific company shared link for a folder. {company} is the company name',
        id: 'boxui.unifiedShare.peopleInSpecifiedCompanyCanAccessFolder',
    },
    peopleInCompanyCanAccessFolder: {
        defaultMessage: 'Anyone in your company with the link or people invited to this folder can access',
        description: 'Description of a company shared link for a folder.',
        id: 'boxui.unifiedShare.peopleInCompanyCanAccessFolder',
    },
    peopleInSpecifiedCompanyCanAccessFile: {
        defaultMessage: 'Anyone at {company} with the link or people invited to this file can access',
        description: 'Description of a specific company shared link for a file. {company} is the company name',
        id: 'boxui.unifiedShare.peopleInSpecifiedCompanyCanAccessFile',
    },
    peopleInCompanyCanAccessFile: {
        defaultMessage: 'Anyone in your company with the link or people invited to this file can access',
        description: 'Description of a company shared link for a file.',
        id: 'boxui.unifiedShare.peopleInCompanyCanAccessFile',
    },
    peopleInItemCanAccessFolder: {
        defaultMessage: 'Only invited people can access this folder',
        description: 'Description of a collaborator-only shared link for a folder',
        id: 'boxui.unifiedShare.peopleInItemCanAccessFolder',
    },
    peopleInItemCanAccessFile: {
        defaultMessage: 'Only invited people can access this file',
        description: 'Description of a collaborator-only shared link for a file',
        id: 'boxui.unifiedShare.peopleInItemCanAccessFile',
    },

    // invite collabs levels
    coownerLevelButtonLabel: {
        defaultMessage: 'Invite as Co-owner',
        description: 'Text used in button label to describe permission level - co-owner',
        id: 'boxui.unifiedShare.coownerLevelButtonLabel',
    },
    coownerLevelText: {
        defaultMessage: 'Co-owner',
        description: 'Text for Co-owner permission level in permissions table',
        id: 'boxui.unifiedShare.coownerLevelText',
    },
    coownerLevelDescription: {
        defaultMessage: 'Manage security, upload, download, preview, share, edit, and delete',
        description: 'Description for Co-owner permission level in permissions table',
        id: 'boxui.unifiedShare.coownerLevelDescription',
    },
    editorLevelButtonLabel: {
        defaultMessage: 'Invite as Editor',
        description: 'Text used in button label to describe permission level - editor',
        id: 'boxui.unifiedShare.editorLevelButtonLabel',
    },
    editorLevelText: {
        defaultMessage: 'Editor',
        description: 'Text for Editor permission level in invitee permission dropdown',
        id: 'boxui.unifiedShare.editorLevelText',
    },
    editorLevelDescription: {
        defaultMessage: 'Upload, download, preview, share, edit, and delete',
        description: 'Description for Editor permission level in invitee permission dropdown',
        id: 'boxui.unifiedShare.editorLevelDescription',
    },
    editorLevelFileDescription: {
        defaultMessage: 'Upload, download, preview, share, and edit',
        description: 'Description for Editor permission level in invitee permission dropdown for files',
        id: 'boxui.unifiedShare.editorLevelFileDescription',
    },
    previewerLevelButtonLabel: {
        defaultMessage: 'Invite as Previewer',
        description: 'Text used in button label to describe permission level - previewer',
        id: 'boxui.unifiedShare.previewerLevelButtonLabel',
    },
    previewerLevelText: {
        defaultMessage: 'Previewer',
        description: 'Text for Previewer permission level in invitee permission dropdown',
        id: 'boxui.unifiedShare.previewerLevelText',
    },
    previewerLevelDescription: {
        defaultMessage: 'Preview only',
        description: 'Description for Previewer permission level in invitee permission dropdown',
        id: 'boxui.unifiedShare.previewerLevelDescription',
    },
    previewerUploaderLevelButtonLabel: {
        defaultMessage: 'Invite as Previewer Uploader',
        description: 'Text used in button label to describe permission level - previewer uploader',
        id: 'boxui.unifiedShare.previewerUploaderLevelButtonLabel',
    },
    previewerUploaderLevelText: {
        defaultMessage: 'Previewer Uploader',
        description: 'Text for Previewer Uploader permission level in invitee permission dropdown',
        id: 'boxui.unifiedShare.previewerUploaderLevelText',
    },
    previewerUploaderLevelDescription: {
        defaultMessage: 'Upload and preview',
        description: 'Description for Previewer Uploader permission level in invitee permission dropdown',
        id: 'boxui.unifiedShare.previewerUploaderLevelDescription',
    },
    viewerLevelButtonLabel: {
        defaultMessage: 'Invite as Viewer',
        description: 'Text used in button label to describe permission level - viewer',
        id: 'boxui.unifiedShare.viewerLevelButtonLabel',
    },
    viewerLevelText: {
        defaultMessage: 'Viewer',
        description: 'Text for Viewer permission level in invitee permission dropdown',
        id: 'boxui.unifiedShare.viewerLevelText',
    },
    viewerLevelDescription: {
        defaultMessage: 'Download, preview, and share',
        description: 'Description for Viewer permission level in invitee permission dropdown',
        id: 'boxui.unifiedShare.viewerLevelDescription',
    },
    viewerUploaderLevelButtonLabel: {
        defaultMessage: 'Invite as Viewer Uploader',
        description: 'Text used in button label to describe permission level - viewer uploader',
        id: 'boxui.unifiedShare.viewerUploaderLevelButtonLabel',
    },
    viewerUploaderLevelText: {
        defaultMessage: 'Viewer Uploader',
        description: 'Text for Viewer Uploader permission level in invitee permission dropdown',
        id: 'boxui.unifiedShare.viewerUploaderLevelText',
    },
    viewerUploaderLevelDescription: {
        defaultMessage: 'Upload, download, preview, share, and edit',
        description: 'Text for Viewer Uploader permission level in invitee permission dropdown',
        id: 'boxui.unifiedShare.viewerUploaderLevelDescription',
    },
    uploaderLevelButtonLabel: {
        defaultMessage: 'Invite as Uploader',
        description: 'Text used in button label to describe permission level - uploader',
        id: 'boxui.unifiedShare.uploaderLevelButtonLabel',
    },
    uploaderLevelText: {
        defaultMessage: 'Uploader',
        description: 'Text for Uploader permission level in invitee permission dropdown',
        id: 'boxui.unifiedShare.uploaderLevelText',
    },
    uploaderLevelDescription: {
        defaultMessage: 'Upload only',
        description: 'Description for Uploader permission level in invitee permission dropdown',
        id: 'boxui.unifiedShare.uploaderLevelDescription',
    },

    // Collaboration group type messages
    userCollabText: {
        defaultMessage: 'User',
        description: 'Text to display for individual users who have accepted an invitation to collaborate',
        id: 'boxui.unifiedShare.collaboration.userCollabText',
    },
    groupCollabText: {
        defaultMessage: 'Group',
        description: 'Text to display for a group of users who have accepted an invitation to collaborate',
        id: 'boxui.unifiedShare.collaboration.groupCollabText',
    },

    // Recommended Sharing Tooltip messages
    recommendedSharingTooltipCalloutText: {
        defaultMessage: 'Based on your usage, we think {fullName} would be interested in this file.',
        description: 'Tooltip description to explain recommendation for sharing tooltip',
        id: 'boxui.unifiedShare.recommendedSharingTooltipCalloutText',
    },
});

export default messages;
