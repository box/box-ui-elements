import * as React from 'react';
import ItemAction from './ItemAction';
import { cellRendererProps } from './ItemList';
import type { UploadItem } from '../../common/types/upload';

export default (
        isResumableUploadsEnabled: boolean,
        onClick: (item: UploadItem) => void,
        onUpgradeCTAClick?: () => void,
    ) =>
    ({ rowData }: cellRendererProps) => (
        <ItemAction
            {...rowData}
            isResumableUploadsEnabled={isResumableUploadsEnabled}
            onClick={() => onClick(rowData)}
            onUpgradeCTAClick={onUpgradeCTAClick}
        />
    );
