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
    onItemAddFavoriteCollection: Function,
    onItemRemoveFromFavoriteCollection: Function,
    onItemSelect: Function,
    onItemDelete: Function,
    onItemDownload: Function,
    onItemRename: Function,
    onItemShare: Function,
    onItemPreview: Function,
    onItemEdit: Function,
    isSmall: boolean,
) => ({ rowData }: { rowData: BoxItem }) => {
    const canAddToFavoriteCollection = rowData?.is_favorite !== undefined ? !rowData.is_favorite : false;
    const canRemoveFromFavoriteCollection = rowData?.is_favorite !== undefined ? rowData.is_favorite : false;
    return (
        <MoreOptions
            canPreview={canPreview}
            canShare={canShare}
            canDownload={canDownload}
            canDelete={canDelete}
            canRename={canRename}
            canAddToFavoriteCollection={canAddToFavoriteCollection}
            canRemoveFromFavoriteCollection={canRemoveFromFavoriteCollection}
            onItemAddFavoriteCollection={onItemAddFavoriteCollection}
            onItemRemoveFromFavoriteCollection={onItemRemoveFromFavoriteCollection}
            onItemSelect={onItemSelect}
            onItemDelete={onItemDelete}
            onItemDownload={onItemDownload}
            onItemRename={onItemRename}
            onItemShare={onItemShare}
            onItemPreview={onItemPreview}
            onItemEdit={onItemEdit}
            isSmall={isSmall}
            item={rowData}
        />
    );
};
