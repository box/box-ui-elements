// @flow
import * as React from 'react';
import './GridViewSlot.scss';

type Props = {
    slotIndex: number,
    slotRenderer: ?(slotIndex: number) => React.Element<any>,
};

function GridViewSlot({ slotIndex, slotRenderer }: Props) {
    if (!slotRenderer) {
        return <div className="bdl-GridViewSlot bdl-GridViewSlot--blank" />;
    }

    return <div className="bdl-GridViewSlot">{slotRenderer(slotIndex)}</div>;
}

export default GridViewSlot;
