import { defineMessages } from 'react-intl';

const messages = defineMessages({
    title: {
        defaultMessage: 'Version History',
        description: 'Title of the version history modal',
        id: 'boxui.versionHistoryModal.title',
    },
    versionNumberBadge: {
        defaultMessage: 'V{versionNumber}',
        description: 'Badge text showing current version number',
        id: 'boxui.versionHistoryModal.versionNumberBadge',
    },
    versionNumberLabel: {
        defaultMessage: 'Version number {versionNumber}',
        description: 'Label given to the version badge for screen readers',
        id: 'boxui.versionHistoryModal.versionNumberLabel',
    },
    current: {
        defaultMessage: 'current',
        description: 'Badge text indicating version is the current version (must be lower case)',
        id: 'boxui.versionHistoryModal.current',
    },
    currentVersionLabel: {
        defaultMessage: 'This is the current version of the file',
        description: 'Label given to the current badge for screen readers',
        id: 'boxui.versionHistoryModal.currentVersionLabel',
    },
    deletedPermanentlyByInfo: {
        defaultMessage:
            'Removed on {deleted, date, full} by {deleterUserName}. Per your company settings, this version will be removed permanently on {deletedPermanentlyBy, date, full}.',
        description: 'Description of a version that will be permanently deleted',
        id: 'boxui.versionHistoryModal.deletedPermanentlyByInfo',
    },
    deletedByInfo: {
        defaultMessage: 'Removed on {deleted, date, full} by {deleterUserName}.',
        description: 'Description of a version that has been deleted',
        id: 'boxui.versionHistoryModal.deletedByInfo',
    },
    restoredByInfo: {
        defaultMessage: 'Restored on {restored, date, full} by {restorerUserName}.',
        description: 'Description of a version that has been restored',
        id: 'boxui.versionHistoryModal.restoredByInfo',
    },
    restoredFromVersionInfo: {
        defaultMessage: 'Restored on {restored, date, full} from V{versionNumber} by {restorerUserName}.',
        description:
            'Description of a version that has been restored. {versionNumber} is the version number of the original file version restored.',
        id: 'boxui.versionHistoryModal.restoredFromVersionInfo',
    },
    restoredFromPreviousVersionInfo: {
        defaultMessage: 'Restored on {restored, date, full} from a previous version by {restorerUserName}.',
        description: 'Description of a version that has been restored from a now unavailable previous version.',
        id: 'boxui.versionHistoryModal.restoredFromPreviousVersionInfo',
    },
    uploadedInfo: {
        defaultMessage: 'Uploaded on {uploaded, date, full} at {uploaded, time, short} by {uploaderUserName}.',
        description: 'Description of a version that has been uploaded',
        id: 'boxui.versionHistoryModal.uploadedInfo',
    },
    restore: {
        defaultMessage: 'Restore',
        description: 'Button text for restoring a version',
        id: 'boxui.versionHistoryModal.restore',
    },
    download: {
        defaultMessage: 'Download',
        description: 'Button text for downloading a version',
        id: 'boxui.versionHistoryModal.download',
    },
    makeCurrent: {
        defaultMessage: 'Make Current',
        description: 'Button text for restoring a version as current',
        id: 'boxui.versionHistoryModal.makeCurrent',
    },
    remove: {
        defaultMessage: 'Remove',
        description: 'Button text for removing/deleting a version',
        id: 'boxui.versionHistoryModal.remove',
    },
    versionLimitExceeded: {
        defaultMessage: 'You can restore the most recent {versionLimit} versions of any file.',
        description: 'Text displayed instead of button actions',
        id: 'boxui.versionHistoryModal.versionLimitExceeded',
    },
    retainedIndefinitely: {
        defaultMessage: 'Retained indefinitely by retention policy.',
        description: 'Text displayed when a version is retained indefinitely',
        id: 'boxui.versionHistoryModal.retainedIndefinitely',
    },
    retainedUntil: {
        defaultMessage: 'Retained until {dispositionDate, date, full} by retention policy.',
        description: 'Text displayed when a version is retained until a certain date',
        id: 'boxui.versionHistoryModal.retainedUntil',
    },
    retainedAndDeletedOn: {
        defaultMessage: 'Will be deleted {dispositionDate, date, full} by retention policy.',
        description: 'Text displayed when a version is retained and will be deleted on a certain date',
        id: 'boxui.versionHistoryModal.retainedAndDeletedOn',
    },
});

export default messages;
