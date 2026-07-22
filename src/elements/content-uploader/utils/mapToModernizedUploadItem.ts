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

export function mapToModernizedUploadItem(item: LegacyUploadItem | FolderUploadItem, rootFolderId: string): UploadItem {
    const errorMessage = item.error ? (item.error as { message?: string }).message : undefined;
    const fileItem = item as LegacyUploadItem;

    const status = STATUS_MAP[item.status] ?? 'pending';
    // Fall back to the file size so the "X / TOTAL" line shows before the
    // first progress event lands.
    const totalBytes = fileItem.totalBytes ?? item.size;

    // Progress rounds to 100% at ~99.5%, which flips the item to "staged" and
    // stops further progress events — so bytesUploaded can freeze a hair below
    // the total and the "X / TOTAL" line looks stuck ~1 unit short. Once the
    // bytes are all in, report the full size and drop the ETA: there's nothing
    // left to wait for, and the smoothed estimate otherwise lags a few seconds
    // behind and shows a stale "time left".
    const isFullyUploaded = status === 'staged' || status === 'complete';
    const bytesUploaded = isFullyUploaded && totalBytes != null ? totalBytes : fileItem.bytesUploaded;
    const remainingMs = !isFullyUploaded ? fileItem.remainingMs : undefined;

    return {
        id: getUploadItemKey(item, rootFolderId),
        name: item.name,
        extension: item.extension ?? '',
        progress: item.progress ?? 0,
        status,
        isFolder: item.isFolder,
        errorMessage,
        versionNumber: item.boxFile?.version_number,
        bytesUploaded,
        totalBytes,
        remainingMs,
    };
}

export function mapToModernizedUploadItems(
    items: Array<LegacyUploadItem | FolderUploadItem>,
    rootFolderId: string,
): UploadItem[] {
    return items.map(item => mapToModernizedUploadItem(item, rootFolderId));
}
