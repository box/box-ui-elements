import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import ItemProgress from './ItemProgress';
import {
    defaultUploadErrorMessage,
    getUploadErrorMessage,
    resolveUploadErrorCode,
} from './utils/getUploadErrorMessage';

import { STATUS_IN_PROGRESS, STATUS_STAGED, STATUS_ERROR } from '../../constants';
import { cellRendererProps } from './ItemList';

export default (shouldShowUpgradeCTAMessage?: boolean) =>
    ({ rowData }: cellRendererProps) => {
        const { status, error = {}, name, isFolder, file } = rowData;

        if (isFolder && status !== STATUS_ERROR) {
            return null;
        }

        switch (status) {
            case STATUS_IN_PROGRESS:
            case STATUS_STAGED:
                return <ItemProgress {...rowData} />;
            case STATUS_ERROR: {
                const errorCode = resolveUploadErrorCode(error.code, file?.name);
                const { descriptor, values } =
                    getUploadErrorMessage(errorCode, name, shouldShowUpgradeCTAMessage) ?? defaultUploadErrorMessage;

                return <FormattedMessage {...descriptor} values={values} />;
            }
            default:
                return null;
        }
    };
