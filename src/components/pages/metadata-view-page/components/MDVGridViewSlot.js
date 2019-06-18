// @flow
import * as React from 'react';

type Props = {
    slotIndex: number,
    slotRenderer: ?(slotIndex: number) => React.Element<any>,
};

function MDVGridViewSlot({ slotIndex, slotRenderer }: Props) {
    if (!slotRenderer) {
        return <div className="MDVGridViewSlot-blank" />;
    }

    return <div className="MDVGridViewSlot">{slotRenderer(slotIndex)}</div>;
}

export default MDVGridViewSlot;
