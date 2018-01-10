/**
 * @flow
 * @file Function to render the progress table cell
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import ItemProgress from './ItemProgress';
import { STATUS_PENDING, STATUS_ERROR, STATUS_IN_PROGRESS } from '../../constants';
import type { UploadItem } from '../../flowTypes';
import messages from '../messages';

type Props = {
    rowData: UploadItem
};

/**
 * Get error message for a specific error code
 *
 * @param {string} [errorCode]
 * @returns {FormattedMessage}
 */
const getErrorMessage = (errorCode: ?string) => {
    switch (errorCode) {
        case 'file_size_limit_exceeded':
            return <FormattedMessage {...messages.uploadsFileSizeLimitExceededErrorMessage} />;
        case 'storage_limit_exceeded':
            return <FormattedMessage {...messages.uploadsStorageLimitErrorMessage} />;
        case 'pending_app_folder_size_limit':
            return <FormattedMessage {...messages.uploadsPendingFolderSizeLimitErrorMessage} />;
        default:
            return <FormattedMessage {...messages.uploadsDefaultErrorMessage} />;
    }
};

export default () => ({ rowData }: Props) => {
    const { status, error = {} } = rowData;
    const { code } = error;

    switch (status) {
        case STATUS_IN_PROGRESS:
        case STATUS_PENDING:
            return <ItemProgress {...rowData} />;
        case STATUS_ERROR:
            return getErrorMessage(code);
        default:
            return null;
    }
};
