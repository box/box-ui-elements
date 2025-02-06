// @flow
import type { View, BoxItem } from '../../common/types/core';

export type CommonGridViewFunctions = {
    onItemDelete: (item: BoxItem) => void,
    onItemDownload: (item: BoxItem) => void,
    onItemPreview: (item: BoxItem) => void,
    onItemRename: (item: BoxItem) => void,
    onItemSelect: (item: BoxItem, callback: Function) => void,
    onItemShare: (item: BoxItem) => void,
    onItemEdit: (item: BoxItem) => void,
};
export type ItemGridProps = {
    canDelete: boolean,
    canDownload: boolean,
    canPreview: boolean,
    canRename: boolean,
    canShare: boolean,
    isSmall: boolean,
    isTouch: boolean,
    onItemClick: (item: BoxItem | string) => void,
    rootId: string,
    view: View,
    ...$Exact<CommonGridViewFunctions>,
};
