/**
 * @flow
 * @file Function to render the progress table cell
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import ItemProgress from './ItemProgress';
import { STATUS_ERROR, STATUS_IN_PROGRESS, ERROR_CODE_CHILD_FOLDER_FAILED_UPLOAD } from '../../constants';

import messages from '../messages';

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
        case ERROR_CODE_CHILD_FOLDER_FAILED_UPLOAD:
            return <FormattedMessage {...messages.uploadsOneOrMoreChildFoldersFailedToUploadMessage} />;
        case 'file_size_limit_exceeded':
            return <FormattedMessage {...messages.uploadsFileSizeLimitExceededErrorMessage} />;
        case 'item_name_invalid':
            return (
                <FormattedMessage {...messages.uploadsProvidedFolderNameInvalidMessage} values={{ name: itemName }} />
            );
        case 'storage_limit_exceeded':
            return <FormattedMessage {...messages.uploadsStorageLimitErrorMessage} />;
        case 'pending_app_folder_size_limit':
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
            return <ItemProgress {...rowData} />;
        case STATUS_ERROR:
            return getErrorMessage(code, name);
        default:
            return null;
    }
};
