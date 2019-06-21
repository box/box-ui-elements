// @flow
import * as React from 'react';
import IconPlusThin from '../../../../icons/general/IconPlusThin';
import IconMinusThin from '../../../../icons/general/IconMinusThin';
import PlainButton from '../../../plain-button/PlainButton';

type Props = {
    columnCount: number,
    onResize: Function,
};

const RANGE_MAX = 7;
const RANGE_MIN = 1;
const RANGE_STEP = 2;

function GridViewSlider({ onResize, columnCount }: Props) {
    const viewSize = RANGE_MAX - columnCount + 1;
    return (
        <span className="grid-size-container">
            <PlainButton
                className="grid-size-btn"
                onClick={() => {
                    onResize(Math.max(RANGE_MIN, viewSize - RANGE_STEP));
                }}
            >
                <IconMinusThin height={9} />
            </PlainButton>
            <input
                className="grid-size-range"
                max={RANGE_MAX}
                min={RANGE_MIN}
                onChange={event => {
                    onResize(event.currentTarget.valueAsNumber);
                }}
                step={RANGE_STEP}
                type="range"
                value={viewSize}
            />
            <PlainButton
                className="grid-size-btn"
                onClick={() => {
                    onResize(Math.min(RANGE_MAX, viewSize + RANGE_STEP));
                }}
            >
                <IconPlusThin />
            </PlainButton>
        </span>
    );
}

export default GridViewSlider;
