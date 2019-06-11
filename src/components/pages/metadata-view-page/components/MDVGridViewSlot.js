// @flow
import * as React from 'react';

type Props = {
    slotIndex: number,
    slotRenderer: ?(slotIndex: number) => React.Element<any>,
};

function MDVGridViewSlot({ slotIndex, slotRenderer, ...rest }: Props) {
    if (!slotRenderer) {
        return <div className="MDVGridViewSlot MDVGridViewSlot-blank" />;
    }

    return (
        <div className="MDVGridViewSlot" {...rest}>
            {slotRenderer(slotIndex)}
        </div>
    );
}

export default MDVGridViewSlot;
