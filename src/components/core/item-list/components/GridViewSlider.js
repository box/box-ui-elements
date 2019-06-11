// @flow
import * as React from 'react';
// import localize from '../../../../../test/support/i18n';
// import messages from '../../../../common/messages';

import IconPlusThin from '../../../../icons/general/IconPlusThin';
import IconMinusThin from '../../../../icons/general/IconMinusThin';
import PlainButton from '../../../plain-button/PlainButton';

type Props = {
    onResize: Function,
    viewSize: number,
};

// const { formatMessage } = intl;
const RANGE_MAX = 5;
const RANGE_MIN = 1;
const RANGE_STEP = 2;

function GridViewSlider({ onResize, viewSize }: Props) {
    return (
        <span className="grid-size-container">
            <PlainButton
                // aria-label={formatMessage(messages.decreaseGridSize)}
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
                // aria-label={formatMessage(messages.increaseGridSize)}
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
