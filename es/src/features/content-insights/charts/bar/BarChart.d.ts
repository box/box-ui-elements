import * as React from 'react';
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
    onBarMouseEnter?: (arg1: {
        datum: any;
    }, arg2: OffsetPosition) => void;
    onBarMouseLeave?: (arg1: {
        datum: any;
    }) => void;
    valueAccessor: ValueAccessor;
}
declare function BarChart({ className, data, direction, hasAxisLabel, label, labelAccessor, onBarMouseEnter, onBarMouseLeave, valueAccessor, }: Props): React.JSX.Element;
export default BarChart;
