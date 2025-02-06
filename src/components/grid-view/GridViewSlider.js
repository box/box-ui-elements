// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Slider } from '@box/blueprint-web';

import './GridViewSlider.scss';

import messages from '../../elements/common/messages';

type Props = {
    columnCount: number,
    gridMaxColumns: number,
    gridMinColumns: number,
    maxColumnCount: number,
    onChange: (newSliderValue: number) => void,
};

const GridViewSlider = ({ columnCount, gridMaxColumns, gridMinColumns, maxColumnCount, onChange }: Props) => {
    const { formatMessage } = useIntl();
    const RANGE_STEP = 1;

    // This math is necessary since the highest value of the slider should result in
    // the lowest number of columns
    const RANGE_MIN = gridMaxColumns - maxColumnCount + 1;
    const RANGE_MAX = gridMaxColumns - gridMinColumns + 1;
    const sliderValue = RANGE_MAX - columnCount + 1;

    return (
        gridMinColumns < maxColumnCount && (
            <div>
                <Slider
                    className="bdl-GridViewSlider"
                    max={RANGE_MAX}
                    min={RANGE_MIN}
                    minusButtonLabel={formatMessage(messages.gridViewDecreaseColumnSize)}
                    onValueChange={onChange}
                    plusButtonLabel={formatMessage(messages.gridViewIncreaseColumnSize)}
                    step={RANGE_STEP}
                    value={sliderValue}
                />
            </div>
        )
    );
};

export { GridViewSlider as GridViewSliderBase };
export default GridViewSlider;
