// @flow strict

import { defineMessages } from 'react-intl';

const messages = defineMessages({
    fileRequestDisplayName: {
        defaultMessage: 'File Request',
        description:
            'name of the File Request feature used to translate when a File Request is uploaded by the service',
        id: 'be.sidebarVersions.fileRequestDisplayName',
    },
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
    versionActionDeleteError: {
        id: 'be.sidebarVersions.deleteError',
        defaultMessage: 'File version could not be deleted.',
        description: 'Error message for the version delete action.',
    },
    versionActionDisabledRetention: {
        id: 'be.sidebarVersions.disabledByRetention',
        defaultMessage: 'Disabled by retention policy',
        description: 'Tooltip message for actions disabled by retention policy.',
    },
    versionActionDownload: {
        id: 'be.sidebarVersions.download',
        defaultMessage: 'Download',
        description: 'Label for the version download action.',
    },
    versionActionDownloadError: {
        id: 'be.sidebarVersions.downloadError',
        defaultMessage: 'File version could not be downloaded.',
        description: 'Error message for the version download action.',
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
    versionActionPromoteError: {
        id: 'be.sidebarVersions.promoteError',
        defaultMessage: 'File version could not be made current.',
        description: 'Error message for the version promote action.',
    },
    versionActionRestore: {
        id: 'be.sidebarVersions.restore',
        defaultMessage: 'Restore',
        description: 'Label for the version restore action.',
    },
    versionActionRestoreError: {
        id: 'be.sidebarVersions.restoreError',
        defaultMessage: 'File version could not be restored.',
        description: 'Error message for the version restored action.',
    },
    versionActionToggle: {
        id: 'be.sidebarVersions.toggle',
        defaultMessage: 'Toggle Actions Menu',
        description: 'Label for the version actions dropdown menu toggle button.',
    },
    versionDeletedBy: {
        id: 'be.sidebarVersions.deletedBy',
        defaultMessage: 'Deleted by {name}',
        description: 'Message displayed for a deleted version. {name} is the user who performed the action.',
    },
    versionFetchError: {
        id: 'be.sidebarVersions.fetchError',
        defaultMessage: 'File versions could not be retrieved.',
        description: 'Error message for the versions fetch call.',
    },
    versionNotAvailable: {
        id: 'be.sidebarVersions.notAvailable',
        defaultMessage:
            'Sorry, version history is not available with your current account plan. To access versioning, select from one of our paid plans.',
        description:
            'Error message with upsell for the versions fetch call for users who dont have the version feature.',
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
    versionPromotedBy: {
        id: 'be.sidebarVersions.promotedBy',
        defaultMessage: 'Promoted from v{versionPromoted} by {name}',
        description: 'Message displayed for a restored version. {name} is the user who performed the action.',
    },
    versionRestoredBy: {
        id: 'be.sidebarVersions.restoredBy',
        defaultMessage: 'Restored by {name}',
        description: 'Message displayed for a restored version. {name} is the user who performed the action.',
    },
    versionServerError: {
        id: 'be.sidebarVersions.serverError',
        defaultMessage: 'Server Error',
        description: 'Heading for inline error messages displayed due to a remote server issue.',
    },
    versionUpgradeLink: {
        id: 'be.sidebarVersions.upgradeLink',
        defaultMessage: 'Upgrade Now',
        description: 'Text on the upgrade button shown when user does not have access to Version History',
    },
    versionUploadedBy: {
        id: 'be.sidebarVersions.uploadedBy',
        defaultMessage: 'Uploaded by {name}',
        description: 'Message displayed for an uploaded version. {name} is the user who performed the action.',
    },
    versionUserUnknown: {
        id: 'be.sidebarVersions.versionUserUnknown',
        defaultMessage: 'Unknown',
        description: 'Name displayed for unknown or deleted users.',
    },
    versionMaxEntries: {
        id: 'be.sidebarVersions.versionMaxEntries',
        defaultMessage: 'Version history is limited to the last {maxVersions} entries.',
        description: 'Max supported entries for version history',
    },
    versionRetentionDelete: {
        id: 'be.sidebarVersions.versionRetentionDelete',
        defaultMessage: 'Will be deleted {time} by retention policy.',
        description: 'Message describing when the version will be deleted due to an applied retention policy.',
    },
    versionRetentionIndefinite: {
        id: 'be.sidebarVersions.versionRetentionIndefinite',
        defaultMessage: 'Retained indefinitely by retention policy.',
        description: 'Message describing that the version retention policy is indefinite and will not expire.',
    },
    versionRetentionRemove: {
        id: 'be.sidebarVersions.versionRetentionRemove',
        defaultMessage: 'Retention policy expires on {time}.',
        description: 'Message describing when the version retention policy will expire.',
    },
    versionUpsell: {
        defaultMessage:
            'Sorry, version history is not available with your current account plan. To access versioning, select from one of our paid plans.',
        description: 'Upgrade message shown when user does not have access to Version History',
        id: 'be.sidebarVersions.versionUpsell',
    },
    upgradeButton: {
        defaultMessage: 'Upgrade',
        description: 'Text on the upgrade button shown when user does not have access to Version History',
        id: 'be.sidebarVersions.upgradeButton',
    },
});

export default messages;
