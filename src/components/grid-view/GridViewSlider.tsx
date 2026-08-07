import * as React from 'react';
import { useIntl } from 'react-intl';
import { Slider } from '@box/blueprint-web';

import './GridViewSlider.scss';

import messages from '../../elements/common/messages';

export interface GridViewSliderProps {
    /** Current number of columns displayed in the grid */
    columnCount: number;
    /** Maximum number of columns supported by the grid */
    gridMaxColumns: number;
    /** Minimum number of columns supported by the grid */
    gridMinColumns: number;
    /** Maximum number of columns available at the current viewport size */
    maxColumnCount: number;
    /** Called when the selected column count changes */
    onChange: (newSliderValue: number) => void;
}

const GridViewSlider = ({
    columnCount,
    gridMaxColumns,
    gridMinColumns,
    maxColumnCount,
    onChange,
}: GridViewSliderProps) => {
    const { formatMessage } = useIntl();
    const RANGE_STEP = 1;

    // This math is necessary since the highest value of the slider should result in
    // the lowest number of columns
    const RANGE_MIN = gridMaxColumns - maxColumnCount + 1;
    const RANGE_MAX = gridMaxColumns - gridMinColumns + 1;
    const sliderValue = RANGE_MAX - columnCount + 1;

    return (
        gridMinColumns < maxColumnCount && (
            <Slider
                className="bdl-GridViewSlider"
                max={RANGE_MAX}
                min={RANGE_MIN}
                minusButtonLabel={formatMessage(messages.gridViewDecreaseColumnSize)}
                onValueChange={onChange}
                plusButtonLabel={formatMessage(messages.gridViewIncreaseColumnSize)}
                sliderLabel={formatMessage(messages.gridViewSliderLabel)}
                step={RANGE_STEP}
                value={sliderValue}
            />
        )
    );
};

export default GridViewSlider;
