// @flow
import * as React from 'react';

import '../styles/SkeletonItemList.scss';

const HARDCODED_LEFT_POSITIONS = ['10px', '290px', '570px', '850px', '1130px'];

const DEFAULT_NUMBER_OF_ROWS = 10;

type Props = {
    numberOfRows?: number,
};

const renderColumn = (position: string) => {
    return (
        <div className="skeleton-content" style={{ left: position }}>
            &nbsp;
        </div>
    );
};

const SkeletonItemList = ({ numberOfRows }: Props) => (
    <div className="metadata-view-skeleton-table">
        {Array.from(new Array(numberOfRows || DEFAULT_NUMBER_OF_ROWS).keys()).map(num => (
            <div key={num} className="skeleton-table-row">
                {HARDCODED_LEFT_POSITIONS.map(position => {
                    return renderColumn(position);
                })}
            </div>
        ))}
    </div>
);

export default SkeletonItemList;
