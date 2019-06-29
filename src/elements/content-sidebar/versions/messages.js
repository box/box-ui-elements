import { defineMessages } from 'react-intl';

const messages = defineMessages({
    versionsEmpty: {
        id: 'be.sidebarVersions.empty',
        description: 'Message to display when no versions are available',
        defaultMessage: 'No prior versions are available for this file.',
    },
    versionsPriorWeek: {
        id: 'be.sidebarVersions.priorWeek',
        description: 'Header to display for group of versions created in the prior week',
        defaultMessage: 'Last Week',
    },
    versionsThisMonth: {
        id: 'be.sidebarVersions.thisMonth',
        description: 'Header to display for group of versions created in the current month',
        defaultMessage: 'This Month',
    },
    versionsToday: {
        id: 'be.sidebarVersions.today',
        description: 'Header to display for group of versions created yesterday',
        defaultMessage: 'Today',
    },
    versionsYesterday: {
        id: 'be.sidebarVersions.yesterday',
        description: 'Header to display for group of versions created today',
        defaultMessage: 'Yesterday',
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
    versionActionDelete: {
        id: 'be.sidebarVersions.delete',
        defaultMessage: 'Delete',
        description: 'Label for the version delete action.',
    },
    versionActionDownload: {
        id: 'be.sidebarVersions.download',
        defaultMessage: 'Download',
        description: 'Label for the version download action.',
    },
    versionActionPreview: {
        id: 'be.sidebarVersions.preview',
        defaultMessage: 'Preview',
        description: 'Label for the version preview action.',
    },
    versionActionPromote: {
        id: 'be.sidebarVersions.promote',
        defaultMessage: 'Make Current',
        description: 'Label for the version promote action.',
    },
    versionActionRestore: {
        id: 'be.sidebarVersions.restore',
        defaultMessage: 'Restore',
        description: 'Label for the version restore action.',
    },
    versionActionToggle: {
        id: 'be.sidebarVersions.toggle',
        defaultMessage: 'Toggle Actions Menu',
        description: 'Label for the version actions dropdown menu toggle button.',
    },
    versionDeletedBy: {
        id: 'be.sidebarVersions.deletedBy',
        defaultMessage: 'Deleted by { name }',
        description: 'Message displayed for a deleted version. {name} is the user who performed the action.',
    },
    versionLimitExceeded: {
        id: 'be.sidebarVersions.versionLimitExceeded',
        defaultMessage:
            'You are limited to the last {versionLimit, number} {versionLimit, plural, one {version} other {versions}}.',
        description: "Text displayed if a version exceeds the user's maximum allowed version count",
    },
    versionNumberBadge: {
        id: 'be.sidebarVersions.versionNumberBadge',
        defaultMessage: 'V{versionNumber}',
        description: 'Text to display in the version badge.',
    },
    versionNumberLabel: {
        id: 'be.sidebarVersions.versionNumberLabel',
        defaultMessage: 'Version number {versionNumber}',
        description: 'Label given to the version badge for screen readers.',
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
