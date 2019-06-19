// @flow
import * as React from 'react';

type Props = {
    slotIndex: number,
    slotRenderer: ?(slotIndex: number) => React.Element<any>,
};

function GridViewSlot({ slotIndex, slotRenderer }: Props) {
    if (!slotRenderer) {
        return <div className="GridViewSlot-blank" />;
    }

    return <div className="GridViewSlot">{slotRenderer(slotIndex)}</div>;
}

export default GridViewSlot;
