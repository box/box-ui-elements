import * as React from 'react';
import type { BoxItem } from '../../../common/types/core';
declare const _default: (rootId: string, view: View, onItemClick: (item: BoxItem) => void, onItemSelect?: (item: BoxItem) => void, canPreview?: boolean, showDetails?: boolean, isTouch?: boolean) => ({ rowData }: {
    rowData: BoxItem;
}) => React.JSX.Element;
export default _default;
