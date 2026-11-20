/**
 * @flow
 * @file Maps API versions to the view-model of the shared version experience component.
 *
 * This is where the sidebar's permission, retention, watermark, archive and version-limit rules live,
 * so the shared component only has to render the resulting `capabilities`.
 */
import selectors from '../../common/selectors/version';
import {
    FILE_REQUEST_NAME,
    VERSION_DELETE_ACTION,
    VERSION_PROMOTE_ACTION,
    VERSION_UPLOAD_ACTION,
} from '../../../constants';
import type { BoxItemVersion } from '../../../common/types/core';

const FILE_EXTENSIONS_OFFICE = ['xlsb', 'xlsm', 'xlsx'];

export type VersionEntryCapabilities = {
    canCompare?: boolean,
    canDelete?: boolean,
    canDownload?: boolean,
    canPreview?: boolean,
    canPromote?: boolean,
    canRestore?: boolean,
    isDeleteDisabled?: boolean,
};

export type VersionEntry = {
    action: string,
    authorName: string,
    capabilities: VersionEntryCapabilities,
    id: string,
    isCurrent: boolean,
    promotedFromVersion?: string,
    timestamp: string,
    versionNumber: number,
};

type Options = {
    /** Shown when the author of a version can't be determined. */
    authorFallbackName: string,
    /** Whether Compare should be offered; the host decides, e.g. from a feature flag and a handler. */
    canCompare?: boolean,
    /** Localized name shown in place of the "File Request" service user. */
    fileRequestName: string,
    isArchived?: boolean,
    isWatermarked?: boolean,
    versionCount: number,
    versionLimit: number,
    /** Newest first; the first entry is the current version. */
    versions: Array<BoxItemVersion>,
};

const isRetained = ({ retention }: BoxItemVersion): boolean => {
    const { applied_at: appliedAt, disposition_at: dispositionAt } = retention || {};

    return !!appliedAt && (!dispositionAt || new Date(dispositionAt) > new Date());
};

/**
 * The versions list doesn't say which version an older promoted version came from (only the current version
 * does, via the file's `restored_from`). A promotion copies the content, so the closest older version with
 * the same sha1 is its source. If several older versions share the content, the nearest one is reported.
 */
const findPromotedFromVersion = (versions: Array<BoxItemVersion>, index: number): ?string => {
    const { sha1 } = versions[index];

    if (!sha1) {
        return undefined;
    }

    const source = versions.slice(index + 1).find(({ sha1: candidateSha1 }) => candidateSha1 === sha1);

    return source ? source.version_number : undefined;
};

const getVersionEntries = ({
    authorFallbackName,
    canCompare = false,
    fileRequestName,
    isArchived = false,
    isWatermarked = false,
    versionCount,
    versionLimit,
    versions,
}: Options): Array<VersionEntry> => {
    const { id: currentId } = versions[0] || {};

    return versions.map((version, index) => {
        const {
            created_at: createdAt,
            extension,
            id,
            is_download_available: isDownloadAvailable,
            permissions = {},
            promoted_by: promotedBy,
            restored_at: restoredAt,
            trashed_at: trashedAt,
            version_number: versionNumber,
            version_promoted: versionPromoted,
        } = version;
        const { can_delete, can_download, can_preview, can_upload } = permissions;

        const isCurrent = id === currentId;
        const versionInteger = versionNumber ? parseInt(versionNumber, 10) : 1;
        // Only the current version gets `version_promoted`, but every version carries `promoted_by`, so an older
        // promoted version is recognized by that. Its origin version isn't known then, found by sha1 below.
        const baseAction = selectors.getVersionAction(version);
        const action = baseAction === VERSION_UPLOAD_ACTION && promotedBy ? VERSION_PROMOTE_ACTION : baseAction;
        const isDeleted = action === VERSION_DELETE_ACTION;
        const isLimited = versionCount - versionInteger >= versionLimit;
        const isOffice = FILE_EXTENSIONS_OFFICE.includes(extension);
        const isRestricted = (isOffice || isWatermarked) && !isCurrent;

        const canPreview = !!can_preview && !isDeleted && !isLimited && !isRestricted;

        const authorName = selectors.getVersionUser(version).name || authorFallbackName;

        // Versions over the limit keep their row but offer no actions, like the existing sidebar.
        const capabilities: VersionEntryCapabilities = isLimited
            ? { canPreview }
            : {
                  canCompare: canCompare && canPreview && !isCurrent,
                  canDelete: !!can_delete && !isDeleted && !isArchived && !isCurrent,
                  canDownload: !!can_download && !isDeleted && !!isDownloadAvailable,
                  canPreview,
                  canPromote: !!can_upload && !isDeleted && !isArchived && !isCurrent,
                  canRestore: !!can_delete && isDeleted && !isArchived,
                  isDeleteDisabled: isRetained(version),
              };

        return {
            action,
            authorName: authorName === FILE_REQUEST_NAME ? fileRequestName : authorName,
            capabilities,
            id,
            isCurrent,
            promotedFromVersion:
                versionPromoted ||
                (action === VERSION_PROMOTE_ACTION ? findPromotedFromVersion(versions, index) : undefined),
            timestamp: restoredAt || trashedAt || createdAt,
            versionNumber: versionInteger,
        };
    });
};

export default getVersionEntries;
