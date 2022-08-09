// @flow
import * as React from 'react';
import classNames from 'classnames';

import noop from 'lodash/noop';
import Bar from './Bar';

import './BarChart.scss';

type BarChartType = {
    className?: string,
    data: Array<Object>,
    direction?: Direction,
    label: string,
    labelAccessor: string,
    onBarMouseEnter?: ({ datum: Object }) => void,
    onBarMouseLeave?: ({ datum: Object }) => void,
    valueAccessor: ValueAccessor,
};

const isFunction = (valueAccessor: ValueAccessor): boolean %checks => {
    return typeof valueAccessor === 'function';
};

const BarChart = ({
    className,
    data = [],
    direction = 'vertical',
    label,
    labelAccessor,
    onBarMouseEnter,
    onBarMouseLeave,
    valueAccessor,
}: BarChartType) => {
    const isHorizontal = direction === 'horizontal';
    const isInteractive = !!onBarMouseEnter || !!onBarMouseLeave;
    const max = data
        .map(datum => (isFunction(valueAccessor) ? valueAccessor(datum) : datum[valueAccessor]))
        .reduce((previousValue, currentValue) => Math.max(previousValue, currentValue), 0);

    const getSize = datum => {
        // If max is 0 then all other values in the data array are 0 so return 0
        // instead of allowing the following calculation to return Infinity
        if (max === 0) {
            return 0;
        }

        return ((isFunction(valueAccessor) ? valueAccessor(datum) : datum[valueAccessor]) / max) * 100;
    };

    const handleBarMouseEnter = onBarMouseEnter || noop;
    const handleBarMouseLeave = onBarMouseLeave || noop;

    return (
        <div
            aria-label={label}
            className={classNames('ca-BarChart', className, {
                'is-horizontal': isHorizontal,
                'is-interactive': isInteractive,
            })}
            role="img"
        >
            {data.map(datum => (
                <Bar
                    key={datum[labelAccessor]}
                    direction={direction}
                    onMouseEnter={() => handleBarMouseEnter({ datum })}
                    onMouseLeave={() => handleBarMouseLeave({ datum })}
                    size={getSize(datum)}
                />
            ))}
        </div>
    );
};

export default BarChart;
