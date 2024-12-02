import * as React from 'react';
import Date from './Date';
import type { BoxItem } from '../../common/types/core';

export interface DateCellRendererProps {
    dataKey: string;
    rowData: BoxItem;
}

export default () =>
    ({ dataKey, rowData }: DateCellRendererProps) => <Date dataKey={dataKey} item={rowData} />;
