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
    versionCurrent: {
        id: 'be.sidebarVersions.current',
        defaultMessage: 'Current Version',
        description: 'Label for the current version item in the version history list.',
    },
    versionRemovedBy: {
        id: 'be.sidebarVersions.removedBy',
        defaultMessage: 'Removed by { name }',
        description: 'Message displayed for a deleted version. {name} is the user who performed the action.',
    },
    versionNumberBadge: {
        defaultMessage: 'V{versionNumber}',
        description: 'Text to display in the version badge.',
        id: 'be.sidebarVersions.versionNumberBadge',
    },
    versionNumberLabel: {
        defaultMessage: 'Version number {versionNumber}',
        description: 'Label given to the version badge for screen readers.',
        id: 'be.sidebarVersions.versionNumberLabel',
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
    versionUserUnknown: {
        id: 'be.sidebarVersions.versionUserUnknown',
        defaultMessage: 'Unknown',
        description: 'Name displayed for unknown or deleted users.',
    },
});

export default messages;
