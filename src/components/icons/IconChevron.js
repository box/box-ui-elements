/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../flowTypes';

const DOWN: 'down' = 'down';
const LEFT: 'left' = 'left';
const RIGHT: 'right' = 'right';
const UP: 'up' = 'up';

type Direction = typeof DOWN | typeof LEFT | typeof UP | typeof RIGHT;
type Props = IconType & {
    direction: Direction,
    size?: number,
    thickness?: number
};

const rotations: { [Direction]: number } = {
    [DOWN]: 135,
    [LEFT]: 225,
    [RIGHT]: 45,
    [UP]: 315
};

const tops: { [Direction]: number } = {
    [DOWN]: -2,
    [LEFT]: 0,
    [RIGHT]: 0,
    [UP]: 0
};

const lefts: { [Direction]: number } = {
    [DOWN]: 0,
    [LEFT]: 0,
    [RIGHT]: -2,
    [UP]: 0
};

const IconChevron = ({ className = '', color = '#777', direction = UP, size = 5, thickness = 1 }: Props) =>
    <span
        className={className}
        style={{
            borderColor: color,
            borderStyle: 'solid solid none none',
            borderWidth: `${thickness}px`,
            display: 'inline-block',
            height: `${size}px`,
            transform: `rotate(${rotations[direction]}deg)`,
            width: `${size}px`,
            position: 'relative',
            top: `${tops[direction]}px`,
            left: `${lefts[direction]}px`
        }}
    />;

export default IconChevron;
