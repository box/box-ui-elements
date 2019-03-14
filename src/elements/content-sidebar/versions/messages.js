import { defineMessages } from 'react-intl';

const messages = defineMessages({
    versionsEmpty: {
        id: 'be.sidebarVersions.empty',
        description: 'Message to display when no versions are available',
        defaultMessage: 'No prior versions are available for this file.',
    },
    versionsTitle: {
        id: 'be.sidebarVersions.title',
        description: 'Title for the preview versions sidebar',
        defaultMessage: 'Version History',
    },
    versionRemovedBy: {
        id: 'be.sidebarVersions.removedBy',
        defaultMessage: 'Removed by { name }',
        description: 'Message displayed for a deleted version. {name} is the user who performed the action.',
    },
    versionRestoredBy: {
        id: 'be.sidebarVersions.restoredBy',
        defaultMessage: 'Restored by { name }',
        description: 'Message displayed for a restored version. {name} is the user who performed the action.',
    },
    versionUploadedBy: {
        id: 'be.sidebarVersions.uploadedBy',
        defaultMessage: 'Uploaded by { name }',
        description: 'Message displayed for an uploaded version. {name} is the user who performed the action.',
    },
});

export default messages;
