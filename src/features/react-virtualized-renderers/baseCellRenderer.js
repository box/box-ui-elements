// @flow
import type { Node } from 'react';
import type { CellRendererParams } from './flowTypes';

import { EMPTY_VALUE } from '../../constants';

const baseCellRenderer = ({ cellData }: CellRendererParams, renderValue: any => Node = String) => {
    if (typeof cellData === 'undefined' || cellData === null || cellData === '') {
        return EMPTY_VALUE;
    }
    return renderValue(cellData);
};

export default baseCellRenderer;
