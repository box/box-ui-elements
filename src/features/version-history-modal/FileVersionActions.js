import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import PlainButton from '../../components/plain-button';

import { VersionPropType } from './prop-types';
import messages from './messages';

// @NOTE: Having an identical "key" on the restore and remove button
//    allows browser to maintain focus correctly on the link, otherwise it focuses
//    body after the links swap. This let's the ESCAPE key work correctly.
const REMOVE_RESTORE_BUTTON_KEY = 'remove-restore-button';

const FileVersionActions = ({
    canDelete,
    canUpload,
    isProcessing,
    onDelete,
    onDownload,
    onMakeCurrent,
    onRestore,
    version,
}) => {
    const btnClasses = classNames('lnk', {
        'is-disabled': isProcessing,
    });

    const renderRestoreButton = () => {
        if (version.deleted <= 0 || !onRestore) {
            return null;
        }
        return (
            <PlainButton
                key={REMOVE_RESTORE_BUTTON_KEY}
                className={btnClasses}
                onClick={() => !isProcessing && onRestore(version)}
            >
                <FormattedMessage {...messages.restore} />
            </PlainButton>
        );
    };

    const renderDownloadButton = () => {
        if (!version.canDownload || version.deleted > 0 || !onDownload) {
            return null;
        }

        return (
            <PlainButton className={btnClasses} onClick={() => !isProcessing && onDownload(version)}>
                <FormattedMessage {...messages.download} />
            </PlainButton>
        );
    };

    const renderMakeCurrentButton = () => {
        if (version.isCurrent || version.deleted > 0 || !onMakeCurrent || !canUpload) {
            return null;
        }

        return (
            <PlainButton className={btnClasses} onClick={() => !isProcessing && onMakeCurrent(version)}>
                <FormattedMessage {...messages.makeCurrent} />
            </PlainButton>
        );
    };

    const renderRemoveButton = () => {
        if (version.isCurrent || version.deleted > 0 || version.isRetained || !onDelete || !canDelete) {
            return null;
        }

        return (
            <PlainButton
                key={REMOVE_RESTORE_BUTTON_KEY}
                className={btnClasses}
                onClick={() => !isProcessing && onDelete(version)}
            >
                <FormattedMessage {...messages.remove} />
            </PlainButton>
        );
    };

    return (
        <div className="file-version-actions">
            {renderRestoreButton()}
            {renderDownloadButton()}
            {renderMakeCurrentButton()}
            {renderRemoveButton()}
        </div>
    );
};

FileVersionActions.propTypes = {
    canDelete: PropTypes.bool,
    canUpload: PropTypes.bool,
    isProcessing: PropTypes.bool,
    onDelete: PropTypes.func,
    onDownload: PropTypes.func,
    onMakeCurrent: PropTypes.func,
    onRestore: PropTypes.func,
    version: VersionPropType.isRequired,
};

export default FileVersionActions;
