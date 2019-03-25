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
import messages from './messages';
import NavButton from '../../common/nav-button';
import sizeUtil from '../../../utils/size';
import VersionsItemBadge from './VersionsItemBadge';
import { ReadableTime } from '../../../components/time';
import {
    PLACEHOLDER_USER,
    VERSION_DELETE_ACTION,
    VERSION_RESTORE_ACTION,
    VERSION_UPLOAD_ACTION,
} from '../../../constants';
import './VersionsItem.scss';

type Props = {
    isCurrent: boolean,
    match: Match,
} & BoxItemVersion;

const ACTION_MAP = {
    [VERSION_DELETE_ACTION]: messages.versionRemovedBy,
    [VERSION_RESTORE_ACTION]: messages.versionRestoredBy,
    [VERSION_UPLOAD_ACTION]: messages.versionUploadedBy,
};
const FIVE_MINUTES_MS = 5 * 60 * 1000;

const getActionMessage = action => ACTION_MAP[action] || ACTION_MAP[VERSION_UPLOAD_ACTION];

const VersionsItem = ({
    action = VERSION_UPLOAD_ACTION,
    created_at: createdAt,
    id: versionId,
    isCurrent,
    match,
    modified_by: modifiedBy = PLACEHOLDER_USER,
    size,
    version_number: versionNumber,
}: Props) => {
    const isDeleted = action === VERSION_DELETE_ACTION;
    const className = classNames('bcs-VersionsItem', {
        'bcs-is-disabled': isDeleted,
    });
    const versionPath = generatePath(match.path, { ...match.params, versionId });
    const versionUser = modifiedBy.name || <FormattedMessage {...messages.versionUserUnknown} />;
    const versionTimestamp = createdAt && new Date(createdAt).getTime();

    return (
        <NavButton
            activeClassName="bcs-is-selected"
            className={className}
            component="button"
            data-resin-target="versions-item"
            data-testid="versions-item"
            disabled={isDeleted}
            to={versionPath}
            type="button"
        >
            <div className="bcs-VersionsItem-badge">
                <VersionsItemBadge versionNumber={versionNumber} />
            </div>

            <div className="bcs-VersionsItem-details">
                {isCurrent && (
                    <div className="bcs-VersionsItem-current">
                        <FormattedMessage {...messages.versionCurrent} />
                    </div>
                )}
                <div className="bcs-VersionsItem-log">
                    <FormattedMessage {...getActionMessage(action)} values={{ name: versionUser }} />
                </div>
                <div className="bcs-VersionsItem-info">
                    {versionTimestamp && (
                        <time className="bcs-VersionsItem-date" dateTime={createdAt}>
                            <ReadableTime
                                alwaysShowTime
                                relativeThreshold={FIVE_MINUTES_MS}
                                timestamp={versionTimestamp}
                            />
                        </time>
                    )}
                    {size && <span className="bcs-VersionsItem-size">{sizeUtil(size)}</span>}
                </div>
            </div>
        </NavButton>
    );
};

export default withRouter(VersionsItem);
