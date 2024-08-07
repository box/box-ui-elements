import * as React from 'react';
import ItemAction from './ItemAction';
import { cellRendererProps } from './ItemList';

export default (
        isResumableUploadsEnabled: boolean,
        onClick: React.MouseEventHandler<HTMLButtonElement>,
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
