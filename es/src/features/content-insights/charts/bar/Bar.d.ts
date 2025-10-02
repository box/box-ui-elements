import * as React from 'react';
import { Direction } from '../types';
import './Bar.scss';
interface Props {
    color?: string;
    direction?: Direction;
    label?: string;
    onMouseEnter?: (arg1: {
        left: number;
        top: number;
    }) => void;
    onMouseLeave?: () => void;
    size: number;
}
declare function Bar({ color, direction, onMouseEnter, onMouseLeave, label, size, }: Props): React.JSX.Element;
export default Bar;
