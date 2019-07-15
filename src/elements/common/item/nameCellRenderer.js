/**
 * @flow
 * @file Function to render the name table cell
 * @author Box
 */

import React from 'react';
import Name from './Name';

export default (
    rootId: string,
    view: View,
    onItemClick: Function,
    onItemSelect?: Function,
    canPreview: boolean = false,
    showDetails: boolean = true,
    isTouch: boolean = false,
) => ({ rowData }: { rowData: BoxItem }) => (
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
