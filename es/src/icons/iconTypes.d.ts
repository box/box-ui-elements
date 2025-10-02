import { ReactElement } from 'react';
export interface TwoTonedIcon {
    /** Class name for the icon */
    className?: string;
    /** A number specifying the height of the icon */
    height?: number;
    /** A string describing the icon if it's not purely decorative for accessibility */
    title?: string | ReactElement<string>;
    /** A number specifying the width of the icon */
    width?: number;
}
export interface Icon extends TwoTonedIcon {
    /** A string describing the color for the icon */
    color?: string;
    /** A string describing the fill color for the icon */
    fillColor?: string;
    /** A number specifying the opacity of the icon */
    opacity?: number;
    /** A string describing the color of the icon's stroke */
    strokeColor?: string;
    /** A number specifying the width of the icon's stroke */
    strokeWidth?: number;
}
export interface FileIcon {
    /** Class name for the icon */
    className?: string;
    /** Dimension of the icon */
    dimension?: number;
    /** The icon's file extension */
    extension: string;
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | ReactElement<string>;
}
