// @flow
import * as React from 'react';

const DOWN = 'down';
const LEFT = 'left';
const RIGHT = 'right';
const UP = 'up';

const rotations = {
    [DOWN]: 135,
    [LEFT]: 225,
    [RIGHT]: 45,
    [UP]: 315,
};

type Props = {
    className?: string,
    color?: string,
    direction?: 'down' | 'left' | 'right' | 'up',
    size?: string,
    thickness?: string,
};

const IconChevron = ({ className = '', color = '#000', direction = UP, size = '9px', thickness = '2px' }: Props) => (
    <span
        className={`icon-chevron icon-chevron-${direction} ${className}`}
        style={{
            borderColor: color,
            borderStyle: 'solid solid none none',
            borderWidth: thickness,
            display: 'inline-block',
            height: size,
            transform: `rotate(${rotations[direction]}deg)`,
            width: size,
        }}
    />
);

export default IconChevron;
