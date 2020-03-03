import * as React from 'react';

export enum DirectionType {
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right',
    UP = 'up',
}

const rotations = {
    [DirectionType.DOWN]: 135,
    [DirectionType.LEFT]: 225,
    [DirectionType.RIGHT]: 45,
    [DirectionType.UP]: 315,
};

interface IconChevronProps {
    /** Class name for the icon */
    className?: string;
    /** A string describing the color for the icon */
    color?: string;
    /** A string describing the direction of the icon */
    direction?: DirectionType;
    /** A string describing the size of the icon */
    size?: string;
    /** A string describing the thickness of the icon */
    thickness?: string;
}

const IconChevron = ({
    className = '',
    color = '#000',
    direction = DirectionType.UP,
    size = '9px',
    thickness = '2px',
}: IconChevronProps) => (
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
