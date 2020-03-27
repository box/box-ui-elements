/**
 * @flow
 * @file Function to render the progress table cell
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../common/messages';
import ItemProgress from './ItemProgress';
import {
    ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED,
    ERROR_CODE_ITEM_NAME_IN_USE,
    ERROR_CODE_ITEM_NAME_INVALID,
    ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT,
    ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED,
    ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED,
    STATUS_ERROR,
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
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
const getErrorMessage = (errorCode: ?string, itemName: ?string) => {
    switch (errorCode) {
        case ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED:
            return <FormattedMessage {...messages.uploadsOneOrMoreChildFoldersFailedToUploadMessage} />;
        case ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED:
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
        default:
            return <FormattedMessage {...messages.uploadsDefaultErrorMessage} />;
    }
};

export default () => ({ rowData }: Props) => {
    const { status, error = {}, name, isFolder } = rowData;
    const { code } = error;

    if (isFolder && status !== STATUS_ERROR) {
        return null;
    }

    switch (status) {
        case STATUS_IN_PROGRESS:
        case STATUS_STAGED:
            return <ItemProgress {...rowData} />;
        case STATUS_ERROR:
            return getErrorMessage(code, name);
        default:
            return null;
    }
};
