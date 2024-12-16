import * as React from 'react';
import getSize from '../../utils/size';

export interface SizeCellRendererProps {
    cellData: number;
}

export default () =>
    ({ cellData }: SizeCellRendererProps) => <span>{getSize(cellData)}</span>;
