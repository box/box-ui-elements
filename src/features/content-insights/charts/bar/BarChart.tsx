/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import Bar from './Bar';
import { AccessorFunction, Direction } from '../types';

import './BarChart.scss';

type ValueAccessor = string | AccessorFunction;

interface OffsetPosition {
    left: number;
    top: number;
}
interface Props {
    className?: string;
    data: Array<any>;
    direction?: Direction;
    hasAxisLabel?: boolean;
    label: string;
    labelAccessor: string;
    onBarMouseEnter?: (arg1: { datum: any }, arg2: OffsetPosition) => void;
    onBarMouseLeave?: (arg1: { datum: any }) => void;
    valueAccessor: ValueAccessor;
}

function isFunction(valueAccessor: ValueAccessor): valueAccessor is AccessorFunction {
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
    valueAccessor,
}: Props) {
    const isHorizontal = direction === 'horizontal';
    const isInteractive = !!onBarMouseEnter || !!onBarMouseLeave;
    const max = data
        .map(datum => (isFunction(valueAccessor) ? valueAccessor(datum) : datum[valueAccessor]))
        .reduce((previousValue, currentValue) => Math.max(previousValue, currentValue), 0);

    const getSize = (datum: any) => {
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
                    label={hasAxisLabel ? datum[labelAccessor] : ''}
                    onMouseEnter={(position: OffsetPosition) => handleBarMouseEnter({ datum }, position)}
                    onMouseLeave={() => handleBarMouseLeave({ datum })}
                    size={getSize(datum)}
                />
            ))}
        </div>
    );
}

export default BarChart;
