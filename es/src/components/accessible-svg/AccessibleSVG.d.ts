import * as React from 'react';
export interface SVGProps {
    /** Class for the svg */
    className?: string;
    /** Height for the svg */
    height?: number;
    /** Accessibility role for the svg */
    role?: string;
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: React.ReactNode;
    /** View box for the svg */
    viewBox?: string;
    /** Width for the svg */
    width?: number;
}
export interface AccessibleSVGProps {
    /** SVG dom elements for the component */
    children: React.ReactElement | Array<React.ReactElement>;
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: React.ReactNode;
}
declare class AccessibleSVG extends React.Component<AccessibleSVGProps & SVGProps> {
    id: string;
    render(): React.JSX.Element;
}
export default AccessibleSVG;
