import * as React from 'react';
import './Media.scss';
export interface MediaBodyProps {
    /** Child elements */
    children: React.ReactNode;
    /** Additional class names */
    className?: string;
    /** Additional inline styles */
    style?: React.CSSProperties;
}
declare const MediaBody: ({ className, children, ...rest }: MediaBodyProps) => React.JSX.Element;
export default MediaBody;
