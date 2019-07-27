// @flow
import * as React from 'react';
import GridView from './GridView';

type Props = {
    currentCollection: Collection,
    height: number,
    slotRenderer: (slotIndex: number) => ?React.Element<any>,
    width: number,
};

const MAX_COLUMN_COUNT = 5;

const ONE_COLUMN_BREAKPOINT = 700;
const THREE_COLUMN_BREAKPOINT = 1400;

const GridViewWrapper = ({ width, ...rest }: Props) => {
    let columnCount = MAX_COLUMN_COUNT;
    if (width < ONE_COLUMN_BREAKPOINT) {
        columnCount = 1;
    } else if (width < THREE_COLUMN_BREAKPOINT) {
        columnCount = 3;
    }

    return <GridView columnCount={columnCount} width={width} {...rest} />;
};

export default GridViewWrapper;
