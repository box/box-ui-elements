/**
 * @flow
 * @file Versions Item component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import selectors from '../../common/selectors/version';
import sizeUtil from '../../../utils/size';
import VersionsItemActions from './VersionsItemActions';
import VersionsItemButton from './VersionsItemButton';
import VersionsItemBadge from './VersionsItemBadge';
import { ReadableTime } from '../../../components/time';
import {
    VERSION_DELETE_ACTION,
    VERSION_PROMOTE_ACTION,
    VERSION_RESTORE_ACTION,
    VERSION_UPLOAD_ACTION,
    VERSION_RETENTION_DELETE_ACTION,
    VERSION_RETENTION_REMOVE_ACTION,
} from '../../../constants';
import type { VersionActionCallback } from './flowTypes';
import './VersionsItem.scss';

type Props = {
    fileId: string,
    isCurrent?: boolean,
    isSelected?: boolean,
    isWatermarked?: boolean,
    onDelete?: VersionActionCallback,
    onDownload?: VersionActionCallback,
    onPreview?: VersionActionCallback,
    onPromote?: VersionActionCallback,
    onRestore?: VersionActionCallback,
    version: BoxItemVersion,
    versionCount: number,
    versionLimit: number,
};

const ACTION_MAP = {
    [VERSION_DELETE_ACTION]: messages.versionDeletedBy,
    [VERSION_RESTORE_ACTION]: messages.versionRestoredBy,
    [VERSION_PROMOTE_ACTION]: messages.versionPromotedBy,
    [VERSION_UPLOAD_ACTION]: messages.versionUploadedBy,
};
const RETENTION_MAP = {
    [VERSION_RETENTION_DELETE_ACTION]: messages.versionRetentionDelete,
    [VERSION_RETENTION_REMOVE_ACTION]: messages.versionRetentionRemove,
};
const FIVE_MINUTES_MS = 5 * 60 * 1000;

const VersionsItem = ({
    fileId,
    isCurrent = false,
    isSelected = false,
    isWatermarked = false,
    onDelete,
    onDownload,
    onPreview,
    onPromote,
    onRestore,
    version,
    versionCount,
    versionLimit,
}: Props) => {
    const {
        created_at: createdAt,
        id: versionId,
        is_download_available,
        permissions = {},
        restored_at: restoredAt,
        retention,
        size,
        trashed_at: trashedAt,
        version_number: versionNumber,
        version_promoted: versionPromoted,
    } = version;
    const { can_delete, can_download, can_preview, can_upload } = permissions;
    const {
        disposition_action: retentionDispositionAction,
        disposition_at: retentionDispositionTime,
        applied_at: retentionAppliedTime,
    } = retention || {};
    const retentionDispositionTimestamp = retentionDispositionTime && new Date(retentionDispositionTime).getTime();

    // Version info helpers
    const versionAction = selectors.getVersionAction(version);
    const versionInteger = versionNumber ? parseInt(versionNumber, 10) : 1;
    const versionTime = restoredAt || trashedAt || createdAt;
    const versionTimestamp = versionTime && new Date(versionTime).getTime();
    const versionUserName = selectors.getVersionUser(version).name || (
        <FormattedMessage {...messages.versionUserUnknown} />
    );

    // Version state helpers
    const isDeleted = versionAction === VERSION_DELETE_ACTION;
    const isDownloadable = !!is_download_available;
    const isLimited = versionCount - versionInteger >= versionLimit;
    const isRestricted = isWatermarked && !isCurrent; // Watermarked files do not support prior version preview
    const isRetained =
        !!retentionAppliedTime &&
        (!retentionDispositionTimestamp || retentionDispositionTimestamp > new Date().getTime());

    // Version action helpers
    const canPreview = can_preview && !isDeleted && !isLimited && !isRestricted;
    const showDelete = can_delete && !isDeleted && !isCurrent;
    const showDownload = can_download && !isDeleted && isDownloadable;
    const showPromote = can_upload && !isDeleted && !isCurrent;
    const showRestore = can_delete && isDeleted;
    const showPreview = canPreview && !isSelected;
    const hasActions = showDelete || showDownload || showPreview || showPromote || showRestore;

    // Version action callback helper
    const handleAction = (handler?: VersionActionCallback) => (): void => {
        if (handler) {
            handler(versionId);
        }
    };

    return (
        <div className="bcs-VersionsItem">
            <VersionsItemButton
                fileId={fileId}
                isCurrent={isCurrent}
                isDisabled={!canPreview}
                isSelected={isSelected}
                onClick={handleAction(onPreview)}
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

                    <div className="bcs-VersionsItem-log" data-testid="bcs-VersionsItem-log" title={versionUserName}>
                        <FormattedMessage
                            {...ACTION_MAP[versionAction]}
                            values={{ name: versionUserName, versionPromoted }}
                        />
                    </div>

                    <div className="bcs-VersionsItem-info">
                        {versionTimestamp && (
                            <time className="bcs-VersionsItem-date" dateTime={versionTime}>
                                <ReadableTime
                                    alwaysShowTime
                                    relativeThreshold={FIVE_MINUTES_MS}
                                    timestamp={versionTimestamp}
                                />
                            </time>
                        )}
                        {!!size && <span className="bcs-VersionsItem-size">{sizeUtil(size)}</span>}
                    </div>

                    {retentionDispositionTimestamp && (
                        <div className="bcs-VersionsItem-retention">
                            <FormattedMessage
                                {...RETENTION_MAP[retentionDispositionAction]}
                                values={{
                                    time: <ReadableTime timestamp={retentionDispositionTimestamp} showWeekday />,
                                }}
                            />
                        </div>
                    )}

                    {isLimited && hasActions && (
                        <div className="bcs-VersionsItem-footer">
                            <FormattedMessage {...messages.versionLimitExceeded} values={{ versionLimit }} />
                        </div>
                    )}
                </div>
            </VersionsItemButton>

            {!isLimited && hasActions && (
                <VersionsItemActions
                    enableDelete={!isRetained}
                    fileId={fileId}
                    isCurrent={isCurrent}
                    onDelete={handleAction(onDelete)}
                    onDownload={handleAction(onDownload)}
                    onPreview={handleAction(onPreview)}
                    onPromote={handleAction(onPromote)}
                    onRestore={handleAction(onRestore)}
                    showDelete={showDelete}
                    showDownload={showDownload}
                    showPreview={showPreview}
                    showPromote={showPromote}
                    showRestore={showRestore}
                />
            )}
        </div>
    );
};
export default VersionsItem;
