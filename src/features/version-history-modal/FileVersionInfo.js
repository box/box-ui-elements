import React from 'react';
import { FormattedMessage } from 'react-intl';

import { convertToMs } from 'utils/datetime';

import { DISPOSITION_ACTION_REMOVE_RETENTION_ONLY, DISPOSITION_ACTION_DELETE_ITEMS } from './constants';
import { VersionPropType } from './prop-types';
import messages from './messages';

const FileVersionInfo = ({ version }) => {
    let message = {};
    let values = {};
    if (version.deleted > 0) {
        if (version.deletedPermanentlyBy > 0) {
            // Deleted and will be permanently deleted at some time in the future
            message = messages.deletedPermanentlyByInfo;
            values = {
                deleted: convertToMs(version.deleted),
                deletedPermanentlyBy: convertToMs(version.deletedPermanentlyBy),
                deleterUserName: version.deleterUserName,
            };
        } else {
            // Deleted
            message = messages.deletedByInfo;
            values = {
                deleted: convertToMs(version.deleted),
                deleterUserName: version.deleterUserName,
            };
        }
    } else if (version.restored > 0) {
        // Restored from deleted status
        message = messages.restoredByInfo;
        values = {
            restored: convertToMs(version.restored),
            restorerUserName: version.restorerUserName,
        };
    } else if (version.isCurrent && version.currentFromFileVersionID) {
        if (version.currentFromVersionNumber) {
            // Restored from a specific version
            message = messages.restoredFromVersionInfo;
            values = {
                restored: convertToMs(version.updated),
                restorerUserName: version.currentFromUserName,
                versionNumber: version.currentFromVersionNumber,
            };
        } else {
            // Restored from an unknown version (maybe old version was deleted)
            message = messages.restoredFromPreviousVersionInfo;
            values = {
                restored: convertToMs(version.updated),
                restorerUserName: version.currentFromUserName,
            };
        }
    } else {
        // Both current version and other versions just use the default "Uploaded" info
        message = messages.uploadedInfo;
        values = {
            // Use `updated` time instead of `created` timestamp for the current version of the file
            uploaded: convertToMs(version.isCurrent ? version.updated : version.created),
            uploaderUserName: version.uploaderUserName,
        };
    }

    let retentionMessage = {};
    let retentionValues = {};
    if (version.isRetained) {
        if (version.isIndefinitelyRetained) {
            retentionMessage = messages.retainedIndefinitely;
        } else if (version.dispositionAction === DISPOSITION_ACTION_REMOVE_RETENTION_ONLY) {
            retentionMessage = messages.retainedUntil;
            retentionValues = {
                dispositionDate: convertToMs(version.dispositionDate),
            };
        } else if (version.dispositionAction === DISPOSITION_ACTION_DELETE_ITEMS) {
            retentionMessage = messages.retainedAndDeletedOn;
            retentionValues = {
                dispositionDate: convertToMs(version.dispositionDate),
            };
        }
    }

    return (
        <div className="file-version-info">
            <p>
                <FormattedMessage {...message} values={values} />
            </p>
            {version.isRetained && retentionMessage && retentionMessage.id && (
                <p className="file-version-retention-info">
                    <FormattedMessage {...retentionMessage} values={retentionValues} />
                </p>
            )}
        </div>
    );
};

FileVersionInfo.propTypes = {
    version: VersionPropType.isRequired,
};

export default FileVersionInfo;
