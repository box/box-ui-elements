import {
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
    STATUS_COMPLETE,
    STATUS_ERROR,
} from '../../../constants';
import { getFileId } from '../../../utils/uploads';
import { UploadItem as LegacyUploadItem } from '../../../common/types/upload';

type ModernizedStatus = 'pending' | 'uploading' | 'staged' | 'complete' | 'error' | 'canceled';

export interface ModernizedUploadItem {
    id: string;
    name: string;
    extension: string;
    progress: number;
    status: ModernizedStatus;
    isFolder?: boolean;
    errorMessage?: string;
}

const STATUS_MAP: Record<string, ModernizedStatus> = {
    [STATUS_PENDING]: 'pending',
    [STATUS_IN_PROGRESS]: 'uploading',
    [STATUS_STAGED]: 'staged',
    [STATUS_COMPLETE]: 'complete',
    [STATUS_ERROR]: 'error',
};

export function mapToModernizedUploadItem(item: LegacyUploadItem, rootFolderId: string): ModernizedUploadItem {
    const errorMessage = item.error ? (item.error as { message?: string }).message : undefined;

    return {
        id: getFileId(item.file, rootFolderId),
        name: item.name,
        extension: item.extension ?? '',
        progress: item.progress ?? 0,
        status: STATUS_MAP[item.status] ?? 'pending',
        isFolder: item.isFolder,
        errorMessage,
    };
}

export function mapToModernizedUploadItems(items: LegacyUploadItem[], rootFolderId: string): ModernizedUploadItem[] {
    return items.map(item => mapToModernizedUploadItem(item, rootFolderId));
}
