import * as React from 'react';
import { useIntl } from 'react-intl';
import { Slider } from '@box/blueprint-web';

import './GridViewSlider.scss';

import messages from '../../elements/common/messages';

export interface GridViewSliderProps {
    columnCount: number;
    gridMaxColumns: number;
    gridMinColumns: number;
    maxColumnCount: number;
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
                minusButtonLabel={formatMessage({
                    ...messages.gridViewDecreaseColumnSize,
                    id: 'be.gridViewDecreaseColumnSize',
                    description: 'Button tooltip to decrease the size of grid view items',
                    defaultMessage: 'Decrease size',
                })}
                onValueChange={onChange}
                plusButtonLabel={formatMessage({
                    ...messages.gridViewIncreaseColumnSize,
                    id: 'be.gridViewIncreaseColumnSize',
                    description: 'Button tooltip to increase the size of grid view items',
                    defaultMessage: 'Increase size',
                })}
                sliderLabel={formatMessage({
                    ...messages.gridViewSliderLabel,
                    id: 'be.gridViewSliderLabel',
                    description: 'Label for the grid view size slider',
                    defaultMessage: 'Grid view size',
                })}
                step={RANGE_STEP}
                value={sliderValue}
            />
        )
    );
};

export default GridViewSlider;
