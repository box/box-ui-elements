import { defineMessages } from 'react-intl';

const messages = defineMessages({
    contentSharedWithExternalCollaborators: {
        defaultMessage: 'This content will be shared with external collaborators.',
        description: 'Text shown in share modal when there is at least one external collaborators',
        id: 'boxui.unifiedShare.contentSharedWithExternalCollaborators',
    },
    disabledShareLinkPermission: {
        defaultMessage: 'This option is not available due to a security policy.',
        description:
            'Tooltip text for when shared permission option is not available due to restriction or classification',
        id: 'boxui.unifiedShare.disabledShareLinkPermission',
    },
    disabledMaliciousContentShareLinkPermission: {
        defaultMessage: 'This option isn’t available for this item due to a security policy.',
        description: 'Tooltip text for when shared permission option is not available due to security policy',
        id: 'boxui.unifiedShare.disabledMaliciousContentShareLinkPermission',
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
    ftuxEditPermissionTooltipBody: {
        defaultMessage: 'Select the new edit option to easily share your file with people or groups.',
        description:
            'Text for the body of the tooltip for the ftux experience when the edit option is available for the user',
        id: 'boxui.unifiedShare.ftuxEditPermissionTooltipBody',
    },
    ftuxEditPermissionTooltipTitle: {
        defaultMessage: 'Collaboration made easy',
        description:
            'Text for the title of the tooltip for the ftux experience when the edit option is available for the user',
        id: 'boxui.unifiedShare.ftuxEditPermissionTooltipTitle',
    },
    collaboratorListTitle: {
        defaultMessage: 'People in ‘{itemName}’',
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
        defaultMessage: 'Share ‘{itemName}’',
        description: 'Title of the Unified Share Modal. {itemName} is the name of the file / folder being shared',
        id: 'boxui.unifiedShare.modalTitle',
    },
    emailModalTitle: {
        defaultMessage: 'Send Link to ‘{itemName}’',
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
    sharedLinkURLLabel: {
        defaultMessage: 'URL',
        description: 'Accessible label for shared link input field',
        id: 'boxui.share.sharedLinkURLLabel',
    },
    linkShareOff: {
        defaultMessage: 'Create shared link',
        description: 'Call to action text for allowing the user to create a new shared link',
        id: 'boxui.unifiedShare.linkShareOff',
    },
    linkShareOn: {
        defaultMessage: 'Shared link is created',
        description: 'Call to action text for allowing the user to remove an existing shared link',
        id: 'boxui.unifiedShare.linkShareOn',
    },
    messageTitle: {
        defaultMessage: 'Message',
        description: 'Label for "Message" text box to email the shared Link',
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
        description: 'Label for confirmation modal to remove a shared link (title-case)',
        id: 'boxui.unifiedShare.removeLinkConfirmationTitle',
    },
    removeCollaboratorConfirmationTitle: {
        defaultMessage: 'Remove Collaborator',
        description: 'Label for confirmation modal to remove a collaborator (title-case)',
        id: 'boxui.unifiedShare.removeCollaboratorConfirmationTitle',
    },
    removeLinkConfirmationDescription: {
        defaultMessage:
            'This will permanently remove the shared link. If this item is embedded on other sites it will also become inaccessible. Any custom properties, settings and expirations will be removed as well. Do you want to continue?',
        description: 'Description for confirmation modal to remove a shared link',
        id: 'boxui.unifiedShare.removeLinkConfirmationDescription',
    },
    removeCollaboratorConfirmationDescription: {
        defaultMessage: 'Are you sure you want to remove {name} as a collaborator on this App?',
        description: 'Description for confirmation modal to remove a collaborator',
        id: 'boxui.unifiedShare.removeCollaboratorConfirmationDescription',
    },
    removeLinkTooltip: {
        defaultMessage: 'You do not have permission to remove the link.',
        description: 'Tooltip description for not having access to remove link',
        id: 'boxui.unifiedShare.removeLinkTooltip',
    },
    disabledCreateLinkTooltip: {
        defaultMessage: 'You do not have permission to create the link.',
        description: 'Tooltip description for users who do not have permission for link creation',
        id: 'boxui.unifiedShare.disabledCreateLinkTooltip',
    },
    sendSharedLink: {
        defaultMessage: 'Send Shared Link',
        description: 'Tooltip text for email shared link button (title-case)',
        id: 'boxui.unifiedShare.sendSharedLink',
    },
    sendSharedLinkFieldLabel: {
        defaultMessage: 'Email Shared Link',
        description: 'Field label for shared link recipient list (title-case)',
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
        description: 'Label for a shared link permission level',
        id: 'boxui.unifiedShare.sharedLinkPermissionsViewDownload',
    },
    sharedLinkPermissionsViewOnly: {
        defaultMessage: 'Can view only',
        description: 'Label for a shared link permission level',
        id: 'boxui.unifiedShare.sharedLinkPermissionsViewOnly',
    },
    ftuxSharedLinkPermissionsEditTag: {
        defaultMessage: 'NEW',
        description:
            'Label for the LabelPill that is shown when the user first opens the SharedLinkPermissions dropdown and sees the Can Edit option',
        id: 'boxui.unifiedShare.ftuxSharedLinkPermissionsEditTag',
    },
    sharedLinkPermissionsEdit: {
        defaultMessage: 'Can edit',
        description: 'Label for a shared link permission to show for an editable box note / file',
        id: 'boxui.unifiedShare.sharedLinkPermissionsEdit',
    },
    sharedLinkPermissionsEditTooltip: {
        defaultMessage: 'This permission can only be changed in Box Notes',
        description: 'Text to use in the tooltip when presenting an editable Box Note (DO NOT TRANSLATE "Box Notes")',
        id: 'boxui.unifiedShare.sharedLinkPermissionsEditTooltip',
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
    sharedLinkEditablePubliclyAvailable: {
        defaultMessage:
            'Publicly available for anyone to view and download. Any logged in users with the link can edit.',
        description: 'Text shown in share modal when shared link is editable and is open to public access',
        id: 'boxui.unifiedShare.sharedLinkEditablePubliclyAvailable',
    },
    sharedLinkElevatedEditableCompanyAvailable: {
        defaultMessage: 'People who have access to this link can edit.',
        description: 'Text shown in share modal when shared link is editable and is open to company access',
        id: 'boxui.unifiedShare.sharedLinkElevatedEditableCompanyAvailable',
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
    upgradeLink: {
        defaultMessage: 'Upgrade now',
        description: 'Label for link to upgrade account',
        id: 'boxui.unifiedShare.upgradeLink',
    },
    upgradeInlineNoticeTitle: {
        defaultMessage: 'Upgrade Your Plan',
        description: 'Title for the upgrade inline notice for upgrade user plan',
        id: 'boxui.unifiedShare.upgradeInlineNoticeTitle',
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
    peopleInSpecifiedCompanyCanAccessHub: {
        defaultMessage: 'Anyone at {company} with the link or people invited to this hub can access',
        description: 'Description of a specific company shared link for a hub. {company} is the company name',
        id: 'boxui.unifiedShare.peopleInSpecifiedCompanyCanAccessHub',
    },
    peopleInCompanyCanAccessHub: {
        defaultMessage: 'Anyone in your company with the link or people invited to this hub can access',
        description: 'Description of a company shared link for a hub.',
        id: 'boxui.unifiedShare.peopleInCompanyCanAccessHub',
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
    peopleInItemCanAccessHub: {
        defaultMessage: 'Only invited people can access this hub',
        description: 'Description of a collaborator-only shared link for a hub',
        id: 'boxui.unifiedShare.peopleInItemCanAccessHub',
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

    // Information Barrier restrictions, external collab restrictions and business justifications
    justificationSelectPlaceholder: {
        defaultMessage: 'Select Justification',
        description: 'The placeholder text of the select field that allows selecting a business justification reason',
        id: 'boxui.unifiedShare.justificationSelectPlaceholder',
    },
    justificationRequiredError: {
        defaultMessage: 'Select a justification or remove to continue',
        description:
            'The error message that is displayed when a user tries to send invitations to external collaborators, but a business justification is required before proceeding',
        id: 'boxui.unifiedShare.justificationRequiredError',
    },
    restrictedContactsError: {
        defaultMessage: 'Remove to continue',
        description:
            'The error message that is displayed when a user tries to send invitations to external collaborators, but restricted contacts need to be removed before proceeding',
        id: 'boxui.unifiedShare.restrictedContactsError',
    },
    justifiableContactRestrictionNotice: {
        defaultMessage:
            'This content requires a business justification for {count, plural, one {{count} invitation} other {{count} invitations}}. Please select a business justification below.',
        description:
            'Text for the notice that is displayed when there are collaboration restrictions that apply to one or more of the selected contacts and business justifications are allowed for bypassing restrictions',
        id: 'boxui.unifiedShare.justifiableContactRestrictionNotice',
    },
    justifiableContactRestrictionNoticeSingular: {
        defaultMessage:
            'This content requires a business justification to invite {email}. Please select a business justification below.',
        description:
            'Text for the notice that is displayed when there are collaboration restrictions that apply to one or more of the selected contacts and business justifications are allowed for bypassing restrictions',
        id: 'boxui.unifiedShare.justifiableContactRestrictionNoticeSingular',
    },
    justifiableContactRestrictionRemoveButtonLabel: {
        defaultMessage: 'Alternatively, remove to continue',
        description:
            'Label for the button that removes restricted contacts on the contact restriction notice when business justifications are allowed for bypassing restrictions',
        id: 'boxui.unifiedShare.justifiableContactRestrictionRemoveButtonLabel',
    },
    contactRestrictionNotice: {
        defaultMessage:
            '{count, plural, one {{count} invitation} other {{count} invitations}} cannot be sent because external collaboration is restricted due to the applied security policy.',
        description:
            'Text for the notice that is displayed when there are collaboration restrictions that apply to one or more of the selected contacts',
        id: 'boxui.unifiedShare.contactRestrictionNotice',
    },
    contactRestrictionNoticeSingular: {
        defaultMessage:
            'Invitations cannot be sent to {email} because external collaboration is restricted due to the applied security policy.',
        description:
            'Text for the notice that is displayed when there are collaboration restrictions that apply to one or more of the selected contacts',
        id: 'boxui.unifiedShare.contactRestrictionNoticeSingular',
    },
    contactRestrictionNoticeInformationBarrier: {
        defaultMessage:
            '{count, plural, one {{count} invitation} other {{count} invitations}} cannot be sent due to a security policy.',
        description:
            'Text for the notice that is displayed when there are Information Barrier collaboration restrictions that apply to one or more of the selected contacts',
        id: 'boxui.unifiedShare.contactRestrictionNoticeInformationBarrier',
    },
    contactRestrictionNoticeInformationBarrierSingular: {
        defaultMessage: 'Invitations cannot be sent to {email} due to a security policy.',
        description:
            'Text for the notice that is displayed when there are Information Barrier collaboration restrictions that apply to only one of the selected contacts',
        id: 'boxui.unifiedShare.contactRestrictionNoticeInformationBarrierSingular',
    },
    contactRestrictionNoticeInformationBarrierSingularGroup: {
        defaultMessage: 'Invitations cannot be sent to "{groupName}" due to a security policy.',
        description:
            'Text for the notice that is displayed when there are Information Barrier collaboration restrictions that apply to only one of the selected contacts, which is a group',
        id: 'boxui.unifiedShare.contactRestrictionNoticeInformationBarrierSingularGroup',
    },
    contactRestrictionRemoveButtonLabel: {
        defaultMessage: 'Remove to continue',
        description: 'Label for the button that removes restricted contacts on the contact restriction notice',
        id: 'boxui.unifiedShare.contactRestrictionRemoveButtonLabel',
    },
    contactEmailsTooltipText: {
        defaultMessage: '{emails}, and {remainingEmailsCount} more',
        description:
            'Text to show when the number of contact email addresses displayed on a tooltip exceeds the maximum amount that can be displayed',
        id: 'boxui.unifiedShare.contactEmailsTooltipText',
    },
    expiresMessage: {
        defaultMessage: 'Expires',
        description: 'Label for tooltips or other components that display expiration icons',
        id: 'boxui.unifiedShare.expiresMessage',
    },
    setLevelOfCollabAccess: {
        defaultMessage:
            'Set the level of {collaboratorAccess} and increase security through one of our paid plans. {upgradeLink}',
        description:
            'Used in a dialog box that urges the user to upgrade. The collaboratorAccess variable is replaced with the words "collaborator access" from the string with the id boxui.unifiedShare.collabAccess',
        id: 'boxui.unifiedShare.levelOfCollabAccess',
    },
    collabAccess: {
        defaultMessage: 'collaborator access',
        description:
            'Used in a dialog box that urges the user to upgrade. This is substituted into the middle of the sentence in the string with id boxui.unifiedShare.levelOfCollabAccess',
        id: 'boxui.unifiedShare.collabAccess',
    },
});

export default messages;
