/**
 * @flow
 * @file Function to render the remove table cell
 */

import React from 'react';
import ItemRemove from './ItemRemove';
import type { UploadItem } from '../../common/types/upload';

type Props = {
    rowData: UploadItem,
};

export default (onClick: (item: UploadItem) => void) => ({ rowData }: Props) => {
    if (rowData.isFolder) {
        return null;
    }
    return <ItemRemove status={rowData.status} onClick={() => onClick(rowData)} />;
};
