import { ReactElement } from 'react';

export interface Icon {
    /** Class name for the icon */
    className?: string;
    /** A string describing the color for the icon */
    color?: string;
    /** A number specifying the height of the icon */
    height?: number;
    /** A string describing the icon if it's not purely decorative for accessibility */
    title?: string | ReactElement;
    /** A number specifying the width of the icon */
    width?: number;
}

export interface TwoTonedIcon {
    /** Class name for the icon */
    className?: string;
    /** A number specifying the height of the icon */
    height?: number;
    /** A string describing the icon if it's not purely decorative for accessibility */
    title?: string | ReactElement;
    /** A number specifying the width of the icon */
    width?: number;
}
