import * as React from 'react';
import classNames from 'classnames';
import './GridViewSlot.scss';

export interface GridViewSlotProps {
    /** Whether the item rendered in this slot is selected */
    selected: boolean;
    /** Index of the item rendered in this slot */
    slotIndex: number;
    /** Renders the contents of the slot */
    slotRenderer: (slotIndex: number) => React.ReactElement | null | undefined;
    /** Width assigned to the slot */
    slotWidth: string;
}

const GridViewSlot = ({ selected, slotIndex, slotRenderer, slotWidth }: GridViewSlotProps) => (
    <div className="bdl-GridViewSlot" style={{ maxWidth: slotWidth, flexBasis: slotWidth }}>
        <div
            className={classNames('bdl-GridViewSlot-content', {
                'bdl-GridViewSlot-content--selected': selected,
            })}
        >
            {slotRenderer(slotIndex)}
        </div>
    </div>
);

export default GridViewSlot;
