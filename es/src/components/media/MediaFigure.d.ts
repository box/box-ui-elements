import * as React from 'react';
import './Media.scss';
export interface MediaFigureProps {
    /** Component to use as outermost element, e.g., 'div' */
    as?: React.ElementType;
    /** Child elements */
    children: React.ReactNode;
    /** Additional class names */
    className?: string;
    /** Additional inline styles */
    style?: React.CSSProperties;
}
declare const MediaFigure: ({ as: Wrapper, className, children, ...rest }: MediaFigureProps) => React.JSX.Element;
export default MediaFigure;
