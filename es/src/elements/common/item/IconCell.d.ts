import * as React from 'react';
import type { BoxItem } from '../../../common/types/core';
import './IconCell.scss';
export interface IconCellProps {
    dimension: number;
    rowData: BoxItem;
}
declare const IconCell: ({ rowData, dimension }: IconCellProps) => React.JSX.Element;
export default IconCell;
