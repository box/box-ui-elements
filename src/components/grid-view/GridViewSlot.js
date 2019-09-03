// @flow
import * as React from 'react';
import classNames from 'classnames';
import './GridViewSlot.scss';

type Props = {
    selected: boolean,
    slotIndex: number,
    slotRenderer: (slotIndex: number) => ?React.Element<any>,
    slotWidth: string,
};

const GridViewSlot = ({ selected, slotIndex, slotRenderer, slotWidth }: Props) => {
    return (
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
};

export default GridViewSlot;
