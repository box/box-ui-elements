import type { UploadItem, UploadItemStatus } from '@box/uploads-manager';
import { STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_STAGED, STATUS_COMPLETE, STATUS_ERROR } from '../../../constants';
import { getFileId } from '../../../utils/uploads';
import { UploadItem as LegacyUploadItem, FolderUploadItem } from '../../../common/types/upload';

const STATUS_MAP: Record<string, UploadItemStatus> = {
    [STATUS_PENDING]: 'pending',
    [STATUS_IN_PROGRESS]: 'uploading',
    [STATUS_STAGED]: 'staged',
    [STATUS_COMPLETE]: 'complete',
    [STATUS_ERROR]: 'error',
};

export function getModernizedItemId(item: LegacyUploadItem | FolderUploadItem, rootFolderId: string): string {
    const fileItem = item as LegacyUploadItem;
    if (fileItem.file) {
        const fileWithOptions = fileItem.options ? { file: fileItem.file, options: fileItem.options } : fileItem.file;
        return getFileId(fileWithOptions, rootFolderId);
    }
    const folderId = item.options?.folderId ?? rootFolderId;
    return `${item.name}_${folderId}`;
}

export function mapToModernizedUploadItem(item: LegacyUploadItem | FolderUploadItem, rootFolderId: string): UploadItem {
    const errorMessage = item.error ? (item.error as { message?: string }).message : undefined;

    return {
        id: getModernizedItemId(item, rootFolderId),
        name: item.name,
        extension: item.extension ?? '',
        progress: item.progress ?? 0,
        status: STATUS_MAP[item.status] ?? 'pending',
        isFolder: item.isFolder,
        errorMessage,
    };
}

export function mapToModernizedUploadItems(
    items: Array<LegacyUploadItem | FolderUploadItem>,
    rootFolderId: string,
): UploadItem[] {
    return items.map(item => mapToModernizedUploadItem(item, rootFolderId));
}
