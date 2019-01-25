/** @flow */
import * as React from 'react';

import type { CellData } from '../../metadata-instance-editor/flowTypes';

import '../styles/MetadataViewCell.scss';

type Props = {
    cellData: CellData,
    intl: Object,
};

const DateCell = ({ cellData, intl }: Props) => {
    return (
        <div className="cell-container">
            <span>
                {intl.formatDate(cellData.cellData, {
                    month: 'long',
                    day: '2-digit',
                    year: 'numeric',
                })}
            </span>
        </div>
    );
};
export default DateCell;
