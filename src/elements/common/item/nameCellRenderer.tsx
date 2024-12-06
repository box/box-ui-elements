import * as React from 'react';
import Name from './Name';
import type { BoxItem, View } from '../../../common/types/core';

export default (
        rootId: string,
        view: View,
        onItemClick: (item: BoxItem) => void,
        onItemSelect?: (item: BoxItem) => void,
        canPreview: boolean = false,
        showDetails: boolean = true,
        isTouch: boolean = false,
    ) =>
    ({ rowData }: { rowData: BoxItem }) => (
        <Name
            canPreview={canPreview}
            isTouch={isTouch}
            item={rowData}
            onItemClick={onItemClick}
            onItemSelect={onItemSelect}
            rootId={rootId}
            showDetails={showDetails}
            view={view}
        />
    );
