// @flow
import * as React from 'react';
import IconPlusThin from '../../icons/general/IconPlusThin';
import IconMinusThin from '../../icons/general/IconMinusThin';
import PlainButton from '../plain-button/PlainButton';
import messages from '../../elements/common/messages';
import { GRID_VIEW_MAX_COLUMNS, GRID_VIEW_MIN_COLUMNS } from '../../constants';
import { bdlGray50 } from '../../styles/variables';
import './GridViewSlider.scss';

type Props = {
    columnCount: number,
    maxColumnCount: number,
    onChange: (newSliderValue: number) => void,
};

const GridViewSlider = ({ columnCount, maxColumnCount, onChange }: Props) => {
    const RANGE_STEP = 1;

    // This math is necessary since the highest value of the slider should result in
    // the lowest number of columns
    const RANGE_MIN = GRID_VIEW_MAX_COLUMNS - maxColumnCount + 1;
    const RANGE_MAX = GRID_VIEW_MAX_COLUMNS - GRID_VIEW_MIN_COLUMNS + 1;
    const sliderValue = RANGE_MAX - columnCount + 1;

    return (
        GRID_VIEW_MIN_COLUMNS < maxColumnCount && (
            <div className="bdl-GridViewSlider">
                <PlainButton
                    className="bdl-GridViewSlider-button"
                    onClick={() => {
                        onChange(Math.max(RANGE_MIN, sliderValue - RANGE_STEP));
                    }}
                    type="button"
                    aria-label={messages.gridViewIncreaseNumberOfColumns.defaultMessage}
                >
                    <IconMinusThin color={bdlGray50} width={14} height={14} />
                </PlainButton>
                <input
                    className="bdl-GridViewSlider-range"
                    max={RANGE_MAX}
                    min={RANGE_MIN}
                    onChange={event => {
                        onChange(event.currentTarget.valueAsNumber);
                    }}
                    step={RANGE_STEP}
                    type="range"
                    value={sliderValue}
                />
                <PlainButton
                    className="bdl-GridViewSlider-button"
                    onClick={() => {
                        onChange(Math.min(RANGE_MAX, sliderValue + RANGE_STEP));
                    }}
                    type="button"
                    aria-label={messages.gridViewDecreaseNumberOfColumns.defaultMessage}
                >
                    <IconPlusThin color={bdlGray50} width={14} height={14} />
                </PlainButton>
            </div>
        )
    );
};

export default GridViewSlider;
