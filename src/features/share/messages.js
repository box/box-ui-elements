import { defineMessages } from 'react-intl';

const messages = defineMessages({
    inviteCollabs: {
        defaultMessage: 'Invite Collaborators',
        description: 'Label for menu option to invite collaborators to item',
        id: 'boxui.shareMenu.inviteCollabs',
    },
    insufficientPermissionsTooltip: {
        defaultMessage: 'You have insufficient permissions to invite collaborators.',
        description: 'Tooltip to show when user does not have permission to invite collaborators to item',
        id: 'boxui.shareMenu.insufficientPermissionsTooltip',
    },
    ownerCoownerOnlyTooltip: {
        defaultMessage:
            'You have insufficient permissions to invite collaborators. Only the owner and co-owners can invite collaborators.',
        description: 'Tooltip to show when only owners and co-owners are allowed to invite collaborators to item',
        id: 'boxui.shareMenu.ownerCoownerOnlyTooltip',
    },
    editAndComment: {
        defaultMessage: 'Edit and Comment',
        description: 'Description of permissions granted when inviting a collab to this item',
        id: 'boxui.shareMenu.editAndComment',
    },
    getSharedLink: {
        defaultMessage: 'Get Shared Link',
        description: 'Label for menu option to get shared link for item (title-case)',
        id: 'boxui.shareMenu.getSharedLink',
    },
    viewAndDownload: {
        defaultMessage: 'View and Download',
        description: 'Description of permissions granted to users who have access to the shared link',
        id: 'boxui.shareMenu.viewAndDownload',
    },
    viewOnly: {
        defaultMessage: 'View Only',
        description: 'Description of permissions granted to users who have access to the shared link',
        id: 'boxui.shareMenu.viewOnly',
    },
    downloadOnly: {
        defaultMessage: 'Download Only',
        description: 'Description of permissions granted to users who have access to the shared link',
        id: 'boxui.shareMenu.downloadOnly',
    },
    shortcutOnly: {
        defaultMessage: 'Shortcut Only',
        description: 'Description of permissions granted to users who have access to the shared link',
        id: 'boxui.shareMenu.shortcutOnly',
    },
    insufficientPermissionsMenuOption: {
        defaultMessage: 'Insufficient sharing permissions. Please contact the folder owner.',
        description: 'Label for disabled menu option when user does not have permission to get shared link for item',
        id: 'boxui.shareMenu.insufficientPermissionsMenuOption',
    },
});

export default messages;
