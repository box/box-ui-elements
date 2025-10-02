/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import Bar from './Bar';
import './BarChart.scss';
function isFunction(valueAccessor) {
  return typeof valueAccessor === 'function';
}
function BarChart({
  className,
  data = [],
  direction = 'vertical',
  hasAxisLabel = false,
  label,
  labelAccessor,
  onBarMouseEnter,
  onBarMouseLeave,
  valueAccessor
}) {
  const isHorizontal = direction === 'horizontal';
  const isInteractive = !!onBarMouseEnter || !!onBarMouseLeave;
  const max = data.map(datum => isFunction(valueAccessor) ? valueAccessor(datum) : datum[valueAccessor]).reduce((previousValue, currentValue) => Math.max(previousValue, currentValue), 0);
  const getSize = datum => {
    // If max is 0 then all other values in the data array are 0 so return 0
    // instead of allowing the following calculation to return Infinity
    if (max === 0) {
      return 0;
    }
    return (isFunction(valueAccessor) ? valueAccessor(datum) : datum[valueAccessor]) / max * 100;
  };
  const handleBarMouseEnter = onBarMouseEnter || noop;
  const handleBarMouseLeave = onBarMouseLeave || noop;
  return /*#__PURE__*/React.createElement("div", {
    "aria-label": label,
    className: classNames('ca-BarChart', className, {
      'is-horizontal': isHorizontal,
      'is-interactive': isInteractive
    }),
    role: "img"
  }, data.map(datum => /*#__PURE__*/React.createElement(Bar, {
    key: datum[labelAccessor],
    direction: direction,
    label: hasAxisLabel ? datum[labelAccessor] : '',
    onMouseEnter: position => handleBarMouseEnter({
      datum
    }, position),
    onMouseLeave: () => handleBarMouseLeave({
      datum
    }),
    size: getSize(datum)
  })));
}
export default BarChart;
//# sourceMappingURL=BarChart.js.map