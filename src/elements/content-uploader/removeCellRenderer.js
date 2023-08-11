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
    return <ItemRemove onClick={() => onClick(rowData)} status={rowData.status} />;
};
