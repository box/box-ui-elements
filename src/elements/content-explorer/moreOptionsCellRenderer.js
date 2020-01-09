/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import MoreOptions from './MoreOptions';
import type { BoxItem } from '../../common/types/core';

export default (
    canPreview: boolean,
    canShare: boolean,
    canDownload: boolean,
    canDelete: boolean,
    canRename: boolean,
    onItemSelect: Function,
    onItemDelete: Function,
    onItemDownload: Function,
    onItemRename: Function,
    onItemShare: Function,
    onItemPreview: Function,
    isSmall: boolean,
) => ({ rowData }: { rowData: BoxItem }) => (
    <MoreOptions
        canPreview={canPreview}
        canShare={canShare}
        canDownload={canDownload}
        canDelete={canDelete}
        canRename={canRename}
        onItemSelect={onItemSelect}
        onItemDelete={onItemDelete}
        onItemDownload={onItemDownload}
        onItemRename={onItemRename}
        onItemShare={onItemShare}
        onItemPreview={onItemPreview}
        isSmall={isSmall}
        item={rowData}
    />
);
