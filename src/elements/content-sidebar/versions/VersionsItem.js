/**
 * @flow
 * @file Versions Item component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import sizeUtil from '../../../utils/size';
import VersionsItemActions from './VersionsItemActions';
import VersionsItemButton from './VersionsItemButton';
import VersionsItemBadge from './VersionsItemBadge';
import { ReadableTime } from '../../../components/time';
import type { VersionActionCallback } from './Versions';
import {
    PLACEHOLDER_USER,
    VERSION_DELETE_ACTION,
    VERSION_RESTORE_ACTION,
    VERSION_UPLOAD_ACTION,
} from '../../../constants';
import './VersionsItem.scss';

type Props = {
    isCurrent: boolean,
    isSelected: boolean,
    onDelete?: VersionActionCallback,
    onDownload?: VersionActionCallback,
    onPreview?: VersionActionCallback,
    onPromote?: VersionActionCallback,
    onRestore?: VersionActionCallback,
    permissions: BoxItemPermission,
    version: BoxItemVersion,
};

const ACTION_MAP = {
    [VERSION_DELETE_ACTION]: messages.versionDeletedBy,
    [VERSION_RESTORE_ACTION]: messages.versionRestoredBy,
    [VERSION_UPLOAD_ACTION]: messages.versionUploadedBy,
};
const FIVE_MINUTES_MS = 5 * 60 * 1000;

const getActionMessage = action => ACTION_MAP[action] || ACTION_MAP[VERSION_UPLOAD_ACTION];

const VersionsItem = ({
    isCurrent,
    isSelected,
    onDelete,
    onDownload,
    onPreview,
    onPromote,
    onRestore,
    permissions,
    version,
}: Props) => {
    const {
        action = VERSION_UPLOAD_ACTION,
        created_at: createdAt,
        id: versionId,
        modified_by: modifiedBy = PLACEHOLDER_USER,
        size,
        version_number: versionNumber,
    } = version;
    const isDeleted = action === VERSION_DELETE_ACTION;
    const isDisabled = isDeleted || !permissions.can_preview;

    // Version info helpers
    const versionSize = sizeUtil(size);
    const versionTimestamp = createdAt && new Date(createdAt).getTime();
    const versionUser = modifiedBy.name || <FormattedMessage {...messages.versionUserUnknown} />;

    // Version action helper
    const handleAction = (handler?: VersionActionCallback) => (): void => {
        if (handler) {
            handler(versionId);
        }
    };

    return (
        <VersionsItemButton
            className="bcs-VersionsItem"
            isDisabled={isDisabled}
            isSelected={isSelected}
            onActivate={handleAction(onPreview)}
        >
            <div className="bcs-VersionsItem-badge">
                <VersionsItemBadge isDisabled={isDeleted} versionNumber={versionNumber} />
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
                    {!!size && (
                        <span className="bcs-VersionsItem-size" title={versionSize}>
                            {versionSize}
                        </span>
                    )}
                </div>
            </div>

            <VersionsItemActions
                isCurrent={isCurrent}
                isDeleted={isDeleted}
                onDelete={handleAction(onDelete)}
                onDownload={handleAction(onDownload)}
                onPreview={handleAction(onPreview)}
                onPromote={handleAction(onPromote)}
                onRestore={handleAction(onRestore)}
                permissions={permissions}
            />
        </VersionsItemButton>
    );
};

export default VersionsItem;
