/**
 * @flow
 * @file Function to render the remove table cell
 */

import React from 'react';
import ItemRemove from './ItemRemove';
import { STATUS_IN_PROGRESS } from '../../constants';

type Props = {
    rowData: UploadItem,
};

export default (onClick: Function) => ({ rowData }: Props) => {
    const isUploading = rowData.status === STATUS_IN_PROGRESS;
    if (!rowData.isFolder) {
        return <ItemRemove isUploading={isUploading} onClick={() => onClick(rowData)} />;
    }
    return null;
};
