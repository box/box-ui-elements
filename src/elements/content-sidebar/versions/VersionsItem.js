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
import VersionsItemRetention from './VersionsItemRetention';
import { getVersionItemActionVisibility } from './versionItemActionVisibility';
import { ReadableTime } from '../../../components/time';
import {
    FILE_REQUEST_NAME,
    VERSION_DELETE_ACTION,
    VERSION_PROMOTE_ACTION,
    VERSION_RESTORE_ACTION,
    VERSION_UPLOAD_ACTION,
} from '../../../constants';
import type { BoxItemVersion } from '../../../common/types/core';
import type { VersionActionCallback } from './flowTypes';
import './VersionsItem.scss';

type Props = {
    fileId: string,
    isArchived?: boolean,
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
const FIVE_MINUTES_MS = 5 * 60 * 1000;

const VersionsItem = ({
    fileId,
    isArchived = false,
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
        restored_at: restoredAt,
        retention,
        size,
        trashed_at: trashedAt,
        version_number: versionNumber,
        version_promoted: versionPromoted,
    } = version;

    // Version info helpers
    const versionAction = selectors.getVersionAction(version);
    const versionTime = restoredAt || trashedAt || createdAt;
    const versionTimestamp = versionTime && new Date(versionTime).getTime();
    const versionUserName = selectors.getVersionUser(version).name || (
        <FormattedMessage {...messages.versionUserUnknown} />
    );
    const versionDisplayName =
        versionUserName !== FILE_REQUEST_NAME ? (
            versionUserName
        ) : (
            <FormattedMessage {...messages.fileRequestDisplayName} />
        );
    const {
        canPreview,
        hasActions,
        isLimited,
        isRetained,
        showDelete,
        showDownload,
        showPreview,
        showPromote,
        showRestore,
    } = getVersionItemActionVisibility({
        isArchived,
        isCurrent,
        isSelected,
        isWatermarked,
        version,
        versionAction,
        versionCount,
        versionLimit,
    });

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
                    <VersionsItemBadge isCurrent={isCurrent} versionNumber={versionNumber} />
                </div>

                <div className="bcs-VersionsItem-details">
                    {isCurrent && (
                        <div className="bcs-VersionsItem-current">
                            <FormattedMessage {...messages.versionCurrent} />
                        </div>
                    )}

                    <div className="bcs-VersionsItem-log" data-testid="bcs-VersionsItem-log" title={versionDisplayName}>
                        <FormattedMessage
                            {...ACTION_MAP[versionAction]}
                            values={{ name: versionDisplayName, versionPromoted }}
                        />
                    </div>

                    <div className="bcs-VersionsItem-info" data-testid="bcs-VersionsItem-info">
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

                    {isRetained && (
                        <div className="bcs-VersionsItem-retention" data-testid="bcs-VersionsItem-retention">
                            <VersionsItemRetention retention={retention} />
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
                    fileId={fileId}
                    isCurrent={isCurrent}
                    isRetained={isRetained}
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
