import * as React from 'react';
export declare enum DirectionType {
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
    UP = "up"
}
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
declare const IconChevron: ({ className, color, direction, size, thickness, }: IconChevronProps) => React.JSX.Element;
export default IconChevron;
