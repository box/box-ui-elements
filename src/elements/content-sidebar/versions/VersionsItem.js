/**
 * @flow
 * @file Versions Item component
 * @author Box
 */

import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { generatePath, withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';
import DateField from '../../common/date';
import messages from './messages';
import NavButton from '../../common/nav-button';
import sizeUtil from '../../../utils/size';
import {
    PLACEHOLDER_USER,
    VERSION_DELETE_ACTION,
    VERSION_RESTORE_ACTION,
    VERSION_UPLOAD_ACTION,
} from '../../../constants';
import './VersionsItem.scss';

type Props = {
    match: Match,
} & BoxItemVersion;

const ACTION_MAP = {
    [VERSION_DELETE_ACTION]: messages.versionRemovedBy,
    [VERSION_RESTORE_ACTION]: messages.versionRestoredBy,
    [VERSION_UPLOAD_ACTION]: messages.versionUploadedBy,
};

const DATE_FORMAT = {
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'short',
};

const getActionMessage = action => (ACTION_MAP[action] ? ACTION_MAP[action] : ACTION_MAP[VERSION_UPLOAD_ACTION]);

const VersionsItem = ({
    action = VERSION_UPLOAD_ACTION,
    id: versionId,
    match,
    modified_at: modifiedAt,
    modified_by: modifiedBy = PLACEHOLDER_USER,
    size,
    version_number: versionNumber,
}: Props) => {
    const isDeleted = action === VERSION_DELETE_ACTION;
    const className = classNames('bcs-VersionsItem', {
        'bcs-is-disabled': isDeleted,
    });
    const versionName = modifiedBy.name || 'Unknown';
    const versionPath = generatePath(match.path, { ...match.params, versionId });

    return (
        <NavButton
            activeClassName="bcs-is-selected"
            className={className}
            component="button"
            disabled={isDeleted}
            to={versionPath}
            type="button"
        >
            <div className="bcs-VersionsItem-badge">{`V${versionNumber}`}</div>
            <div className="bcs-VersionsItem-details">
                <div className="bcs-VersionsItem-title">
                    <FormattedMessage {...getActionMessage(action)} values={{ name: versionName }} />
                </div>
                <div className="bcs-VersionsItem-info">
                    {modifiedAt && (
                        <time className="bcs-VersionsItem-date" dateTime={modifiedAt}>
                            <DateField date={modifiedAt} dateFormat={DATE_FORMAT} />
                        </time>
                    )}
                    {size && <span className="bcs-VersionsItem-size">{sizeUtil(size)}</span>}
                </div>
            </div>
        </NavButton>
    );
};

export default withRouter(VersionsItem);
