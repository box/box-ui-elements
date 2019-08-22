/**
 * @flow
 * @file Function to render the remove table cell
 */

import React from 'react';
import ItemRemove from './ItemRemove';
import { STATUS_ERROR, STATUS_IN_PROGRESS } from '../../constants';

type Props = {
    rowData: UploadItem,
};

export default (onClick: Function) => ({ rowData }: Props) => {
    const isUploading = rowData.status === STATUS_IN_PROGRESS;
    const isFailed = rowData.status === STATUS_ERROR;
    if (!rowData.isFolder) {
        return <ItemRemove isFailed={isFailed} isUploading={isUploading} onClick={() => onClick(rowData)} />;
    }
    return null;
};
