import type { BoxItem } from '../../../common/types/core';

export interface MoreOptionsFunctionProps {
    onItemDelete: (item: BoxItem) => void;
    onItemDownload: (item: BoxItem) => void;
    onItemPreview: (item: BoxItem) => void;
    onItemRename: (item: BoxItem) => void;
    onItemSelect: (item: BoxItem) => void;
    onItemShare: (item: BoxItem) => void;
}
