/** @flow */
import * as React from 'react';

import type { CellData } from '../flowTypes';

import '../styles/MetadataViewCell.scss';

type Props = {
    cellData: CellData,
};

const FloatCell = ({ cellData }: Props) => {
    const { cellData: cell } = cellData;
    const shouldNumberBeInNotationFormat = cell >= 10000000000;
    return (
        <div className="cell-container">
            <span>{shouldNumberBeInNotationFormat ? Number.parseFloat(cell).toExponential(2) : cell}</span>
        </div>
    );
};

export default FloatCell;
