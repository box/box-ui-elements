import * as React from 'react';
import { useIntl } from 'react-intl';
import { Slider } from '@box/blueprint-web';
import './GridViewSlider.scss';
import messages from '../../elements/common/messages';
const GridViewSlider = ({
  columnCount,
  gridMaxColumns,
  gridMinColumns,
  maxColumnCount,
  onChange
}) => {
  const {
    formatMessage
  } = useIntl();
  const RANGE_STEP = 1;

  // This math is necessary since the highest value of the slider should result in
  // the lowest number of columns
  const RANGE_MIN = gridMaxColumns - maxColumnCount + 1;
  const RANGE_MAX = gridMaxColumns - gridMinColumns + 1;
  const sliderValue = RANGE_MAX - columnCount + 1;
  return gridMinColumns < maxColumnCount && /*#__PURE__*/React.createElement(Slider, {
    className: "bdl-GridViewSlider",
    max: RANGE_MAX,
    min: RANGE_MIN,
    minusButtonLabel: formatMessage(messages.gridViewDecreaseColumnSize),
    onValueChange: onChange,
    plusButtonLabel: formatMessage(messages.gridViewIncreaseColumnSize),
    sliderLabel: formatMessage(messages.gridViewSliderLabel),
    step: RANGE_STEP,
    value: sliderValue
  });
};
export default GridViewSlider;
//# sourceMappingURL=GridViewSlider.js.map