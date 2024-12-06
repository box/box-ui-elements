import * as React from 'react';
import MoreOptions from './MoreOptions';
import type { BoxItem } from '../../common/types/core';

export interface MoreOptionsCellRendererProps {
    canPreview: boolean;
    canShare: boolean;
    canDownload: boolean;
    canDelete: boolean;
    canRename: boolean;
    onItemSelect: (item: BoxItem) => void;
    onItemDelete: (item: BoxItem) => void;
    onItemDownload: (item: BoxItem) => void;
    onItemRename: (item: BoxItem) => void;
    onItemShare: (item: BoxItem) => void;
    onItemPreview: (item: BoxItem) => void;
    isSmall: boolean;
}

export default ({
        canPreview,
        canShare,
        canDownload,
        canDelete,
        canRename,
        onItemSelect,
        onItemDelete,
        onItemDownload,
        onItemRename,
        onItemShare,
        onItemPreview,
        isSmall,
    }: MoreOptionsCellRendererProps) =>
    ({ rowData }: { rowData: BoxItem }) => (
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
