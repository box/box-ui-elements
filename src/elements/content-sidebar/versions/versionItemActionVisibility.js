/**
 * @flow
 * @file Which version-row actions are available. The comparison banner derives its handlers from the same result.
 * @author Box
 */

import selectors from '../../common/selectors/version';
import { VERSION_DELETE_ACTION } from '../../../constants';
import type { BoxItemVersion } from '../../../common/types/core';
import type { ComparisonBannerVersionActions, ComparisonVersionActions } from './flowTypes';

const FILE_EXTENSIONS_OFFICE = ['xlsb', 'xlsm', 'xlsx'];

export type VersionItemActionVisibility = {|
    canPreview: boolean,
    hasActions: boolean,
    isLimited: boolean,
    isRetained: boolean,
    showDelete: boolean,
    showDownload: boolean,
    showPreview: boolean,
    showPromote: boolean,
    showRestore: boolean,
|};

type VisibilityArgs = {|
    isArchived?: boolean,
    isCurrent?: boolean,
    isSelected?: boolean,
    isWatermarked?: boolean,
    version: BoxItemVersion,
    versionAction: string,
    versionCount: number,
    versionLimit: number,
|};

export function getVersionItemActionVisibility({
    isArchived = false,
    isCurrent = false,
    isSelected = false,
    isWatermarked = false,
    version,
    versionAction,
    versionCount,
    versionLimit,
}: VisibilityArgs): VersionItemActionVisibility {
    const {
        extension,
        is_download_available: isDownloadAvailable,
        permissions = {},
        retention,
        version_number: versionNumber,
    } = version;
    const {
        can_delete: canDelete,
        can_download: canDownload,
        can_preview: canPreviewPermission,
        can_upload: canUpload,
    } = permissions;
    const { applied_at: retentionAppliedAt, disposition_at: retentionDispositionAt } = retention || {};
    const retentionDispositionAtDate = retentionDispositionAt && new Date(retentionDispositionAt);
    const versionInteger = versionNumber ? parseInt(versionNumber, 10) : 1;
    const isDeleted = versionAction === VERSION_DELETE_ACTION;
    const isLimited = versionCount - versionInteger >= versionLimit;
    const isOffice = FILE_EXTENSIONS_OFFICE.includes(extension);
    const isRestricted = (isOffice || isWatermarked) && !isCurrent;
    const isRetained = !!retentionAppliedAt && (!retentionDispositionAtDate || retentionDispositionAtDate > new Date());
    const canPreview = canPreviewPermission && !isDeleted && !isLimited && !isRestricted;
    const showDelete = !!(canDelete && !isDeleted && !isArchived && !isCurrent);
    const showDownload = !!(canDownload && !isDeleted && isDownloadAvailable);
    const showPromote = !!(canUpload && !isDeleted && !isArchived && !isCurrent);
    const showRestore = !!(canDelete && isDeleted && !isArchived);
    const showPreview = !!(canPreview && !isSelected);
    const hasActions = showDelete || showDownload || showPreview || showPromote || showRestore;

    return {
        canPreview: !!canPreview,
        hasActions,
        isLimited,
        isRetained,
        showDelete,
        showDownload,
        showPreview,
        showPromote,
        showRestore,
    };
}

/**
 * Handlers for the comparison banner. An action is omitted when the row would not offer it, and Delete is
 * also omitted for retained versions (the row disables it).
 */
export function selectComparisonBannerActions(
    versionActions: ComparisonVersionActions,
    versionId: string,
): ComparisonBannerVersionActions {
    const { isArchived, isWatermarked, versionCount, versionLimit, versions } = versionActions;
    const version = versions.find(item => item.id === versionId);

    if (!version) {
        return {};
    }

    const currentId = versions[0] ? versions[0].id : undefined;
    const { isLimited, isRetained, showDelete, showDownload, showPromote } = getVersionItemActionVisibility({
        isArchived,
        isCurrent: currentId === version.id,
        isWatermarked,
        version,
        versionAction: selectors.getVersionAction(version),
        versionCount,
        versionLimit,
    });

    if (isLimited) {
        return {};
    }

    return {
        ...(showDelete && !isRetained ? { onDelete: () => versionActions.delete(versionId) } : {}),
        ...(showDownload ? { onDownload: () => versionActions.download(versionId) } : {}),
        ...(showPromote ? { onMakeCurrent: () => versionActions.promote(versionId) } : {}),
    };
}
