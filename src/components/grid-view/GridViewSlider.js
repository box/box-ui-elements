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
    const { formatMessage } = intl;
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
                    aria-label={formatMessage(messages.gridViewDecreaseColumnSize)}
                    className="bdl-GridViewSlider-button"
                    onClick={() => {
                        onChange(Math.max(RANGE_MIN, sliderValue - RANGE_STEP));
                    }}
                    type="button"
                >
                    <IconMinusThin color={bdlGray50} height={14} width={14} />
                </PlainButton>
                <input
                    aria-label={formatMessage(messages.gridViewColumnSize)}
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
                    aria-label={formatMessage(messages.gridViewIncreaseColumnSize)}
                    className="bdl-GridViewSlider-button"
                    onClick={() => {
                        onChange(Math.min(RANGE_MAX, sliderValue + RANGE_STEP));
                    }}
                    type="button"
                >
                    <IconPlusThin color={bdlGray50} height={14} width={14} />
                </PlainButton>
            </div>
        )
    );
};

export { GridViewSlider as GridViewSliderBase };
export default injectIntl(GridViewSlider);
