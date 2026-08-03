import type { MessageDescriptor } from 'react-intl';

import Browser from '../../../utils/Browser';
import messages from '../../common/messages';
import {
    ERROR_CODE_ITEM_NAME_IN_USE,
    ERROR_CODE_ITEM_NAME_INVALID,
    ERROR_CODE_UPLOAD_BAD_DIGEST,
    ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED,
    ERROR_CODE_UPLOAD_FAILED_PACKAGE,
    ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED,
    ERROR_CODE_UPLOAD_INSUFFICIENT_PERMISSIONS,
    ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT,
    ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED,
} from '../../../constants';

export interface UploadErrorMessage {
    descriptor: MessageDescriptor;
    values?: Record<string, string>;
}

export const defaultUploadErrorMessage: UploadErrorMessage = {
    descriptor: messages.uploadsDefaultErrorMessage,
};

/**
 * Safari reports a bad digest for zip archives it silently rewrites, so those uploads get the
 * package-specific message instead of the generic integrity failure.
 */
export const resolveUploadErrorCode = (errorCode?: string | null, fileName?: string | null): string | null => {
    if (Browser.isSafari() && errorCode === ERROR_CODE_UPLOAD_BAD_DIGEST && fileName?.includes('.zip')) {
        return ERROR_CODE_UPLOAD_FAILED_PACKAGE;
    }

    return errorCode ?? null;
};

/**
 * Translate an upload error code into a message descriptor. Returns null for codes with no
 * dedicated copy so callers can decide between a server-provided message and the generic default.
 */
export const getUploadErrorMessage = (
    errorCode?: string | null,
    itemName?: string | null,
    shouldShowUpgradeCTAMessage = false,
): UploadErrorMessage | null => {
    switch (errorCode) {
        case ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED:
            return { descriptor: messages.uploadsOneOrMoreChildFoldersFailedToUploadMessage };
        case ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED:
            return {
                descriptor: shouldShowUpgradeCTAMessage
                    ? messages.uploadsFileSizeLimitExceededErrorMessageForUpgradeCta
                    : messages.uploadsFileSizeLimitExceededErrorMessage,
            };
        case ERROR_CODE_ITEM_NAME_IN_USE:
            return { descriptor: messages.uploadsItemNameInUseErrorMessage };
        case ERROR_CODE_ITEM_NAME_INVALID:
            return {
                descriptor: messages.uploadsProvidedFolderNameInvalidMessage,
                values: { name: itemName ?? '' },
            };
        case ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED:
            return { descriptor: messages.uploadsStorageLimitErrorMessage };
        case ERROR_CODE_UPLOAD_INSUFFICIENT_PERMISSIONS:
            return { descriptor: messages.uploadsInsufficientPermissionsErrorMessage };
        case ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT:
            return { descriptor: messages.uploadsPendingFolderSizeLimitErrorMessage };
        case ERROR_CODE_UPLOAD_FAILED_PACKAGE:
            return { descriptor: messages.uploadsPackageUploadErrorMessage };
        default:
            return null;
    }
};
