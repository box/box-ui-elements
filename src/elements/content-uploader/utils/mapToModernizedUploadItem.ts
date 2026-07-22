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
    const totalBytes = fileItem.totalBytes ?? item.size;
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
