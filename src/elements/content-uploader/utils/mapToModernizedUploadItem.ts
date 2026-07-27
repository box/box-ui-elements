import type { UploadItem, UploadItemStatus } from '@box/uploads-manager';
import {
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
    STATUS_COMPLETE,
    STATUS_ERROR,
    STATUS_CANCELED,
} from '../../../constants';
import { getFileId } from '../../../utils/uploads';
import { UploadItem as LegacyUploadItem, FolderUploadItem } from '../../../common/types/upload';

const STATUS_MAP: Record<string, UploadItemStatus> = {
    [STATUS_PENDING]: 'pending',
    [STATUS_IN_PROGRESS]: 'uploading',
    [STATUS_STAGED]: 'staged',
    [STATUS_COMPLETE]: 'complete',
    [STATUS_ERROR]: 'error',
    [STATUS_CANCELED]: 'canceled',
};

export function getUploadItemKey(item: LegacyUploadItem | FolderUploadItem, rootFolderId: string): string {
    const fileItem = item as LegacyUploadItem;
    if (fileItem.file) {
        const fileWithOptions = fileItem.options ? { file: fileItem.file, options: fileItem.options } : fileItem.file;
        return getFileId(fileWithOptions, rootFolderId);
    }
    const folderId = item.options?.folderId ?? rootFolderId;
    const { uploadInitTimestamp } = item.options ?? {};
    if (uploadInitTimestamp === undefined) {
        return `${item.name}_${folderId}`;
    }
    return `${item.name}_${folderId}_${uploadInitTimestamp}`;
}

export function mapToModernizedUploadItem(
    item: LegacyUploadItem | FolderUploadItem,
    rootFolderId: string,
    isUploadEtaEnabled = false,
): UploadItem {
    const errorMessage = item.error ? (item.error as { message?: string }).message : undefined;
    const fileItem = item as LegacyUploadItem;

    const status = STATUS_MAP[item.status] ?? 'pending';

    const baseItem: UploadItem = {
        id: getUploadItemKey(item, rootFolderId),
        name: item.name,
        extension: item.extension ?? '',
        progress: item.progress ?? 0,
        status,
        isFolder: item.isFolder,
        errorMessage,
        versionNumber: item.boxFile?.version_number,
    };

    // Kill switch: when the ETA/byte-progress treatment is off, omit the fields
    // entirely so the modernized manager falls back to the plain percentage.
    // Folders are queued with a synthetic size of 1 and never receive real byte
    // aggregate progress, so treat them as non-file data and skip the fields too.
    if (!isUploadEtaEnabled || item.isFolder) {
        return baseItem;
    }

    const totalBytes = fileItem.totalBytes ?? item.size;
    const isFullyUploaded = status === STATUS_STAGED || status === STATUS_COMPLETE;
    const bytesUploaded = isFullyUploaded && totalBytes != null ? totalBytes : fileItem.bytesUploaded;
    const remainingMs = !isFullyUploaded ? fileItem.remainingMs : undefined;

    return {
        ...baseItem,
        bytesUploaded,
        totalBytes,
        remainingMs,
    };
}

export function mapToModernizedUploadItems(
    items: Array<LegacyUploadItem | FolderUploadItem>,
    rootFolderId: string,
    isUploadEtaEnabled = false,
): UploadItem[] {
    return items.map(item => mapToModernizedUploadItem(item, rootFolderId, isUploadEtaEnabled));
}
