import * as React from 'react';
import ItemRemove from './ItemRemove';
import { cellRendererProps } from './ItemList';

import type { UploadItem } from '../../common/types/upload';

export default (onClick: (item: UploadItem) => void) =>
    ({ rowData }: cellRendererProps) => {
        if (rowData.isFolder) {
            return null;
        }
        return <ItemRemove status={rowData.status} onClick={() => onClick(rowData)} />;
    };
