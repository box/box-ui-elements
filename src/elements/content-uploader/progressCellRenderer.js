/**
 * @flow
 * @file Function to render the progress table cell
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Browser from '../../utils/Browser';
import messages from '../common/messages';
import ItemProgress from './ItemProgress';

import {
    ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED,
    ERROR_CODE_ITEM_NAME_IN_USE,
    ERROR_CODE_ITEM_NAME_INVALID,
    ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT,
    ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED,
    ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED,
    ERROR_CODE_UPLOAD_BAD_DIGEST,
    ERROR_CODE_UPLOAD_FAILED_PACKAGE,
    ERROR_CODE_ACCESS_DENIED_ITEM_LOCLED,
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
    STATUS_ERROR,
} from '../../constants';
import type { UploadItem } from '../../common/types/upload';

type Props = {
    rowData: UploadItem,
};

/**
 * Get error message for a specific error code
 *
 * @param {string} [errorCode]
 * @param {string} [itemName]
 * @returns {FormattedMessage}
 */
const getErrorMessage = (errorCode: ?string, itemName: ?string, shouldShowUpgradeCTAMessage?: boolean) => {
    switch (errorCode) {
        case ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED:
            return <FormattedMessage {...messages.uploadsOneOrMoreChildFoldersFailedToUploadMessage} />;
        case ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED:
            if (shouldShowUpgradeCTAMessage) {
                return <FormattedMessage {...messages.uploadsFileSizeLimitExceededErrorMessageForUpgradeCta} />;
            }
            return <FormattedMessage {...messages.uploadsFileSizeLimitExceededErrorMessage} />;
        case ERROR_CODE_ITEM_NAME_IN_USE:
            return <FormattedMessage {...messages.uploadsItemNameInUseErrorMessage} />;
        case ERROR_CODE_ITEM_NAME_INVALID:
            return (
                <FormattedMessage {...messages.uploadsProvidedFolderNameInvalidMessage} values={{ name: itemName }} />
            );
        case ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED:
            return <FormattedMessage {...messages.uploadsStorageLimitErrorMessage} />;
        case ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT:
            return <FormattedMessage {...messages.uploadsPendingFolderSizeLimitErrorMessage} />;
        case ERROR_CODE_UPLOAD_FAILED_PACKAGE:
            return <FormattedMessage {...messages.uploadsPackageUploadErrorMessage} />;
        case ERROR_CODE_ACCESS_DENIED_ITEM_LOCLED:
            return <FormattedMessage {...messages.uploadFailedCausedItemLocked} />;
        default:
            return <FormattedMessage {...messages.uploadsDefaultErrorMessage} />;
    }
};

export default (shouldShowUpgradeCTAMessage?: boolean) => ({ rowData }: Props) => {
    const { status, error = {}, name, isFolder, file } = rowData;
    const { code } = error;

    if (isFolder && status !== STATUS_ERROR) {
        return null;
    }

    switch (status) {
        case STATUS_IN_PROGRESS:
        case STATUS_STAGED:
            return <ItemProgress {...rowData} />;
        case STATUS_ERROR:
            if (Browser.isSafari() && code === ERROR_CODE_UPLOAD_BAD_DIGEST && file.name.indexOf('.zip') !== -1) {
                return getErrorMessage(ERROR_CODE_UPLOAD_FAILED_PACKAGE, file.name);
            }
            return getErrorMessage(code, name, shouldShowUpgradeCTAMessage);
        default:
            return null;
    }
};
