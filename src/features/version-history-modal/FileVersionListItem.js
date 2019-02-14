import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';

import Badge from '../../components/badge';
import FileIcon from '../../icons/file-icon';

import { VersionPropType } from './prop-types';
import FileVersionActions from './FileVersionActions';
import FileVersionInfo from './FileVersionInfo';
import messages from './messages';

const FileVersionListItem = ({
    canDelete,
    canUpload,
    intl,
    isOverVersionLimit = false,
    isProcessing = false,
    onDelete,
    onDownload,
    onMakeCurrent,
    onRestore,
    style,
    version,
    versionLimit,
}) => {
    const classes = classNames('file-version-row', {
        'is-deleted': version.deleted > 0,
    });

    return (
        <div className={classes} style={style}>
            <div className="file-version-icon">
                <FileIcon extension={version.extension} />
            </div>
            <div className="file-version-content">
                <div className="file-version-title">
                    <Badge
                        aria-label={intl.formatMessage(messages.versionNumberLabel, {
                            versionNumber: version.versionNumber,
                        })}
                        className="file-version-badge"
                    >
                        <FormattedMessage
                            {...messages.versionNumberBadge}
                            values={{ versionNumber: version.versionNumber }}
                        />
                    </Badge>
                    <span className="file-version-name">{version.itemName}</span>
                    {version.isCurrent && (
                        <Badge aria-label={intl.formatMessage(messages.currentVersionLabel)} type="highlight">
                            <FormattedMessage {...messages.current} />
                        </Badge>
                    )}
                </div>
                <FileVersionInfo version={version} />
                {isOverVersionLimit ? (
                    <span className="file-version-limit-exceeded-message">
                        <FormattedMessage {...messages.versionLimitExceeded} values={{ versionLimit }} />
                    </span>
                ) : (
                    <FileVersionActions
                        canDelete={canDelete}
                        canUpload={canUpload}
                        isProcessing={isProcessing}
                        onDelete={onDelete}
                        onDownload={onDownload}
                        onMakeCurrent={onMakeCurrent}
                        onRestore={onRestore}
                        version={version}
                    />
                )}
            </div>
        </div>
    );
};

FileVersionListItem.propTypes = {
    intl: intlShape.isRequired,
    isOverVersionLimit: PropTypes.bool, // This value cannot be computed within this component
    isProcessing: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
    onMakeCurrent: PropTypes.func.isRequired,
    onRestore: PropTypes.func.isRequired,
    style: PropTypes.any,
    version: VersionPropType.isRequired,
    versionLimit: PropTypes.number.isRequired,
};

export { FileVersionListItem as FileVersionListItemBase };
export default injectIntl(FileVersionListItem);
