// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import IconPlusThin from '../../icons/general/IconPlusThin';
import IconMinusThin from '../../icons/general/IconMinusThin';
import PlainButton from '../plain-button/PlainButton';
import messages from '../../elements/common/messages';
import { bdlGray50 } from '../../styles/variables';
import './GridViewSlider.scss';

type Props = {
    columnCount: number,
    gridMaxColumns: number,
    gridMinColumns: number,
    maxColumnCount: number,
    onChange: (newSliderValue: number) => void,
} & InjectIntlProvidedProps;

const GridViewSlider = ({ columnCount, gridMaxColumns, gridMinColumns, intl, maxColumnCount, onChange }: Props) => {
    const RANGE_STEP = 1;

    // This math is necessary since the highest value of the slider should result in
    // the lowest number of columns
    const RANGE_MIN = gridMaxColumns - maxColumnCount + 1;
    const RANGE_MAX = gridMaxColumns - gridMinColumns + 1;
    const sliderValue = RANGE_MAX - columnCount + 1;

    return (
        gridMinColumns < maxColumnCount && (
            <div className="bdl-GridViewSlider">
                <PlainButton
                    className="bdl-GridViewSlider-button"
                    onClick={() => {
                        onChange(Math.max(RANGE_MIN, sliderValue - RANGE_STEP));
                    }}
                    type="button"
                    aria-label={intl.formatMessage(messages.gridViewDecreaseColumnSize)}
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
                    aria-label={intl.formatMessage(messages.gridViewIncreaseColumnSize)}
                >
                    <IconPlusThin color={bdlGray50} width={14} height={14} />
                </PlainButton>
            </div>
        )
    );
};

export default injectIntl(GridViewSlider);
